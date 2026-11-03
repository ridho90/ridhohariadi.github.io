"""Check published evidence, numeric labels, assets and internal navigation.
Stdlib only. Optional --base-url verifies real HTTP responses for local targets.
"""
import argparse
import collections
import csv
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import urlsplit, unquote
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT / 'projects/customer-data-cleaning'


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.ids, self.targets, self.metrics = set(), [], {}
        self.active_metric = None
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, 'Duplicate HTML id'
            self.ids.add(attrs['id'])
        for key in ('src', 'href'):
            if key in attrs:
                self.targets.append(attrs[key])
        if 'data-metric' in attrs:
            self.active_metric = attrs['data-metric']

    def handle_data(self, data):
        if self.active_metric and data.strip():
            self.metrics[self.active_metric] = int(data.strip())

    def handle_endtag(self, tag):
        if tag == 'dd':
            self.active_metric = None


def check(base_url=None):
    downloads = CASE / 'downloads'
    m = json.loads((downloads / 'quality-metrics.json').read_text())
    with (downloads / 'customer-data-redacted.csv').open() as stream:
        clean = list(csv.DictReader(stream))
    with (downloads / 'review-queue.csv').open() as stream:
        queue = list(csv.DictReader(stream))
    assert m['synthetic'] is True
    assert len(clean) == m['unique_customers'] == len({r['Customer_ID'] for r in clean})
    assert len(queue) == m['review_queue_items']
    assert collections.Counter(r['City'] for r in clean) == m['cities']
    assert collections.Counter(r['Issue'] for r in queue) == m['review_issue_counts']
    assert sum(m['cities'].values()) == m['unique_customers']
    assert sum(m['review_issue_counts'].values()) == m['review_queue_items']
    assert sum(int(r['Total_Spent']) for r in clean) == m['spend_total']
    assert sum(r['Missing_Email'] == 'true' for r in clean) == m['missing_email_unique']
    assert sum(r['Missing_Address'] == 'true' for r in clean) == m['missing_address_unique']
    assert sum(not r['Registration_Date'] for r in clean) == m['ambiguous_registration_dates']
    assert len({r['Customer_ID'] for r in queue}) == m['affected_ids']
    assert len({r['Customer_ID'] for r in queue if r['Issue'] != 'Duplicate Customer_ID'}) == m['unresolved_ids']
    assert set(clean[0]) == {'Customer_ID','City','Registration_Date','Last_Purchase_Date','Total_Spent','Missing_Email','Missing_Address'}
    assert set(queue[0]) == {'Raw_Row','Customer_ID','Issue','Treatment','Next_Action'}
    for path in [CASE / 'index.html', ROOT / 'index.html', ROOT / 'work.html']:
        page = Page(path)
        if path == CASE / 'index.html':
            assert page.metrics == {k:m[k] for k in ['raw_rows','unique_customers','duplicates_excluded','review_queue_items']}
        else:
            assert 'projects/customer-data-cleaning/' in page.targets
        for target in page.targets:
            parts = urlsplit(target)
            if parts.scheme or parts.netloc:
                continue
            dest = (ROOT / unquote(parts.path).lstrip('/')) if parts.path.startswith('/') else path.parent / unquote(parts.path)
            dest = dest.resolve()
            assert dest.is_relative_to(ROOT), 'Internal link escapes site'
            if dest.is_dir():
                dest /= 'index.html'
            assert dest.is_file(), f'Missing target: {target}'
            if parts.fragment:
                assert parts.fragment in Page(dest).ids, f'Broken fragment: {target}'
            if base_url:
                url = base_url.rstrip('/') + '/' + str(dest.relative_to(ROOT))
                with urlopen(url) as response:
                    assert response.status == 200, f'HTTP failure: {target}'
                    assert response.read() == dest.read_bytes(), f'HTTP content mismatch: {target}'
    print('PASS: metrics, public CSV/queue, contact omission, internal links, fragments and assets' + ('; all HTTP 200' if base_url else ''))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url')
    check(parser.parse_args().base_url)
