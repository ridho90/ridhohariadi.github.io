"""Reconcile the supplied synthetic package; never execute its build.py.

Usage: document-python/bin/python scripts/audit_customer_data.py SOURCE --public-dir projects/customer-data-cleaning/downloads
The date parser reproduces this generator's conventions, not a general locale detector.
"""
import argparse
import collections
import csv
import hashlib
import json
from datetime import datetime
from pathlib import Path
import re

CITIES = 'Malang Surabaya Jakarta Bandung Yogyakarta Denpasar Semarang Medan Makassar Bogor'.split()


def read_csv(path):
    with path.open(encoding='utf-8-sig', newline='') as stream:
        return list(csv.DictReader(stream))


def normalize_date(value):
    value = value.strip()
    if value == '03/04/2026':
        return ''
    for pattern in ('%Y-%m-%d', '%d-%m-%Y', '%m/%d/%Y'):
        try:
            return datetime.strptime(value, pattern).date().isoformat()
        except ValueError:
            pass
    raise ValueError('Unknown or invalid date format')


def transform(raw):
    clean, queue, seen = [], [], set()
    city_map = {x.lower(): x for x in CITIES} | {'surabya': 'Surabaya'}
    for line, original in enumerate(raw, 2):
        row = {k: v.strip() for k, v in original.items()}
        cid = row['Customer_ID']

        def issue(label, treatment, action):
            queue.append(dict(Raw_Row=str(line), Customer_ID=cid, Issue=label,
                              Treatment=treatment, Next_Action=action))

        if cid in seen:
            issue('Duplicate Customer_ID', 'Excluded from unique customer export',
                  'Review source record if financial values conflict')
            continue
        seen.add(cid)
        row['Full_Name'] = ' '.join(row['Full_Name'].split()).title()
        row['Email'] = row['Email'].lower()
        if not row['Email']:
            issue('Missing email', 'Left blank', 'Request verified contact detail')
        digits = re.sub(r'\D', '', row['Phone_Number'])
        if digits.startswith('62'):
            digits = '0' + digits[2:]
        row['Phone_Number'] = '+62' + digits[1:] if digits.startswith('08') and len(digits) >= 10 else ''
        row['City'] = city_map.get(row['City'].lower(), row['City'].title())
        for key in ('Registration_Date', 'Last_Purchase_Date'):
            row[key] = normalize_date(row[key])
            if not row[key]:
                issue('ambiguous MM/DD vs DD/MM date', 'Date left blank in clean export',
                      'Confirm original date convention')
        if not row['Address']:
            issue('Missing address', 'Left blank', 'Request from source owner')
        row['Total_Spent'] = str(int(row['Total_Spent']))
        clean.append(row)
    return sorted(clean, key=lambda r: r['Customer_ID']), queue


def audit(source):
    raw = read_csv(source / 'raw_customer_data.csv')
    clean = read_csv(source / 'cleaned_customer_data.csv')
    queue = read_csv(source / 'review_queue.csv')
    reproduced, reproduced_queue = transform(raw)
    assert reproduced == clean, 'Clean CSV differs from reproduced transformation'
    assert reproduced_queue == queue, 'Review queue differs from reproduced transformation'
    assert len({r['Customer_ID'] for r in clean}) == len(clean)
    assert all(not r['Registration_Date'] or r['Registration_Date'] <= r['Last_Purchase_Date'] for r in clean)
    metrics = json.loads((source / 'quality_metrics.json').read_text())
    observed = dict(raw_rows=len(raw), unique_customers=len(clean),
                    duplicates_excluded=len(raw) - len(clean), review_queue_items=len(queue),
                    missing_email_unique=sum(not r['Email'] for r in clean),
                    ambiguous_registration_dates=sum(not r['Registration_Date'] for r in clean),
                    cities=dict(collections.Counter(r['City'] for r in clean)),
                    spend_total=sum(int(r['Total_Spent']) for r in clean))
    for key, value in observed.items():
        assert metrics[key] == value, f'Metrics mismatch: {key}'
    counts = collections.Counter(r['Customer_ID'] for r in raw)
    conflicts = sum(len({r['Total_Spent'].strip() for r in raw if r['Customer_ID'] == cid}) > 1
                    for cid, count in counts.items() if count > 1)
    from openpyxl import load_workbook
    for data_only in (False, True):
        workbook = load_workbook(source / 'customer_data_cleaning_workbook.xlsx', data_only=data_only)
        assert not any(c.data_type == 'e' for s in workbook for row in s for c in row)
        assert not any(c.data_type == 'f' for s in workbook for row in s for c in row), 'Expected original snapshot workbook'
        for name, rows in [('Clean Customers', clean), ('Review Queue', queue), ('Raw Sample', raw[:60])]:
            sheet = workbook[name]
            actual = [[str(v) if v is not None else '' for v in row] for row in sheet.values]
            assert actual[0] == list(rows[0]), f'Workbook header mismatch: {name}'
            assert actual[1:] == [list(r.values()) for r in rows], f'Workbook rows mismatch: {name}'
        assert [workbook['Dashboard'].cell(i, 2).value for i in range(3, 8)] == [len(raw), len(clean), len(raw)-len(clean), len(queue), observed['missing_email_unique']]
        assert dict((workbook['Dashboard'].cell(i, 4).value, workbook['Dashboard'].cell(i, 5).value) for i in range(4, 14)) == observed['cities']
        assert [workbook['README'].cell(i, 2).value for i in range(5, 9)] == [len(raw),len(clean),len(raw)-len(clean),len(queue)]
    return raw, clean, queue, observed | dict(
        synthetic=True, generated='2026-11-02',
        unique_customers_definition='Distinct Customer_ID values, not verified real people',
        missing_address_unique=sum(not r['Address'] for r in clean),
        review_issue_counts=dict(collections.Counter(r['Issue'] for r in queue)),
        affected_ids=len({r['Customer_ID'] for r in queue}),
        unresolved_ids=len({r['Customer_ID'] for r in queue if r['Issue'] != 'Duplicate Customer_ID'}),
        duplicate_spend_conflicts=conflicts,
        date_policy='Generator-specific: YYYY-MM-DD, DD-MM-YYYY, MM/DD/YYYY; literal 03/04/2026 quarantined. Not a general ambiguity detector.',
        source_sha256={p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(source.iterdir()) if p.is_file()})


def export_public(destination, clean, queue, metrics):
    destination.mkdir(parents=True, exist_ok=True)
    fields = ['Customer_ID','City','Registration_Date','Last_Purchase_Date','Total_Spent','Missing_Email','Missing_Address']
    with (destination / 'customer-data-redacted.csv').open('w', newline='', encoding='utf-8') as stream:
        writer = csv.DictWriter(stream, fieldnames=fields, lineterminator='\n')
        writer.writeheader()
        for row in clean:
            writer.writerow({k: row[k] for k in fields[:5]} | dict(Missing_Email=str(not row['Email']).lower(), Missing_Address=str(not row['Address']).lower()))
    with (destination / 'review-queue.csv').open('w', newline='', encoding='utf-8') as stream:
        writer = csv.DictWriter(stream, fieldnames=list(queue[0]), lineterminator='\n')
        writer.writeheader()
        writer.writerows(queue)
    (destination / 'quality-metrics.json').write_text(json.dumps(metrics, indent=2) + '\n')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('--public-dir', type=Path)
    args = parser.parse_args()
    raw, clean, queue, metrics = audit(args.source)
    if args.public_dir:
        export_public(args.public_dir, clean, queue, metrics)
    print(json.dumps(metrics, indent=2))
