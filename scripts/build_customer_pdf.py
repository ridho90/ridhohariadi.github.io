"""Build the audited, contact-free PDF from the published metrics snapshot.
Run with the document Python toolchain (ReportLab required).
"""
import json
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'projects/customer-data-cleaning/downloads'
M = json.loads((DEST / 'quality-metrics.json').read_text())
FOREST = colors.HexColor('#183d35')
MUTED = colors.HexColor('#5a655f')
PAPER = colors.HexColor('#edf0e7')
styles = {
    'eyebrow': ParagraphStyle('eyebrow', fontName='Helvetica-Bold', fontSize=8, leading=12, textColor=FOREST, spaceAfter=12),
    'title': ParagraphStyle('title', fontName='Times-Roman', fontSize=32, leading=35, textColor=FOREST, spaceAfter=15),
    'h2': ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=12, leading=15, textColor=FOREST, spaceBefore=12, spaceAfter=6, keepWithNext=True),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=9.5, leading=13.5, textColor=MUTED, spaceAfter=7),
    'cell': ParagraphStyle('cell', fontName='Helvetica', fontSize=9, leading=13, textColor=FOREST),
}
story = []


def para(text, style='body'):
    story.append(Paragraph(text, styles[style]))


def section(title, text):
    para(title, 'h2')
    para(text)


def table(rows, widths):
    content = [[Paragraph(str(value), styles['cell']) for value in row] for row in rows]
    item = Table(content, colWidths=widths, hAlign='LEFT')
    item.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PAPER),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 10), ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 9), ('BOTTOMPADDING', (0,0), (-1,-1), 9),
        ('LINEBELOW', (0,0), (-1,-1), .4, colors.HexColor('#dbe0d6')),
    ]))
    story.append(item)


para('RIDHO KUSUMO HARIADI / OPERATIONS PORTFOLIO / NOVEMBER 2026', 'eyebrow')
para('Customer Data Cleaning', 'title')
para('<b>SYNTHETIC / SIMULATED PRACTICE PROJECT</b><br/>Python, CSV and Excel-compatible spreadsheet outputs. AI-assisted dataset design with deterministic cleaning and independent reconciliation.')
table([
    ['Source rows', 'Unique customer IDs', 'Duplicates excluded', 'Review entries'],
    [M['raw_rows'], M['unique_customers'], M['duplicates_excluded'], M['review_queue_items']],
], [125,125,125,124])
section('The brief', 'Prepare a customer-level export for a fictional online store. The generated source includes inconsistent casing, phone layouts, dates, city spelling, repeated IDs and missing contact fields. Preserve source rows and document uncertainty.')
section('Cleaning decisions', '<b>Normalize:</b> trim whitespace, standardize name/email casing, format phones with +62, and map known city variants. Formatting does not verify contact ownership or deliverability.<br/><b>Deduplicate:</b> retain the first observed row per Customer_ID. Exclude later rows without adding their Total_Spent values. No duplicate spend conflicts were found in this dataset.<br/><b>Defer:</b> leave missing email/address values and the six quarantined registration dates blank; record source row, issue, treatment and next action in the review queue.')
section('Date convention and limitation', 'The generator uses YYYY-MM-DD, DD-MM-YYYY and MM/DD/YYYY. The pipeline quarantines the literal 03/04/2026 marker. Other slash dates follow the known MM/DD convention, including dates that would be ambiguous without that context. This is not a general ambiguity detector. A production import must confirm the source locale.')
section('What I validated', 'Reproduced all 470 cleaned CSV rows and all 77 review queue entries from the original 500 rows. Matched the original workbook clean table, review queue, 60-row raw sample, dashboard KPIs, city counts and README totals against the CSVs. Checked retained date chronology. The original workbook is a static snapshot with no formulas.')
section('Integrity', 'Self-directed practice, not a client engagement or measured business improvement. “Unique customer” means distinct synthetic Customer_ID, not a verified person. Generated contact values stay out of the public evidence package.')
story.append(PageBreak())
para('VERIFIED RESULTS / DEFINITIONS / HANDOFF', 'eyebrow')
para('Count the right thing.', 'title')
table([
    ['Review category', 'Entries', 'Handling'],
    ['Duplicate Customer_ID', 30, 'Exclude later source rows; retain audit event.'],
    ['Missing email', 25, 'Keep blank; request a verified detail.'],
    ['Missing address', 16, 'Keep blank; request from the source owner.'],
    ['Ambiguous marker date', 6, 'Keep date blank; confirm date convention.'],
    ['Total queue entries', 77, '30 + 25 + 16 + 6'],
], [167,55,277])
para('The 77 entries touch 72 distinct IDs. Excluding duplicate events leaves 47 unresolved field issues across 46 retained IDs. An ID can have multiple issues. Six missing registration dates leave 464 populated dates out of 470.')
section('Customer ID distribution', ' / '.join(f'{name}: {count}' for name,count in sorted(M['cities'].items(),key=lambda x:-x[1])) + '. Total: 470 IDs. These generated city counts are not real market data.')
section('Spend definition', f'Total_Spent is an invented customer-level lifetime-spend field in unspecified synthetic units. The retained sum is {M["spend_total"]:,}. It is not revenue or growth. Duplicate copies are not summed.')
section('Evidence and privacy', 'Public downloads contain a redacted 470-row CSV, the 77-entry review queue, verified metric JSON and this revised PDF. The redacted CSV retains IDs, city, dates, synthetic spend and missing-email/address indicators. It omits names, email addresses, phone numbers and street addresses. Generated phone numbers could resemble real contacts. The original workbook and unredacted inputs remain local audit files.')
section('Skills demonstrated', '<b>Remote Data Entry:</b> record consistency and missing-field checks.<br/><b>Customer Operations:</b> data hygiene and documented escalation.<br/><b>Sales Support:</b> customer-level reporting and duplicate control.<br/><b>Virtual Assistant:</b> spreadsheet organization and reviewable handoffs.')
section('Lessons and production limits', 'Define the counting unit, state the date convention, and keep formatting separate from verification. First-observed-row retention suits this generated source; production survivorship needs source priority or a verified timestamp. Names repeat across IDs and should not be used as a sole identity key.')
para('Case study destination (deployment pending):<br/>https://ridhohariadi.com/projects/customer-data-cleaning/')


def footer(canvas, doc):
    canvas.setStrokeColor(colors.HexColor('#dbe0d6'))
    canvas.line(48, 38, A4[0]-48, 38)
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(48, 25, 'Ridho Kusumo Hariadi | Synthetic / simulated practice project')
    canvas.drawRightString(A4[0]-48, 25, str(doc.page))


doc = SimpleDocTemplate(str(DEST / 'portfolio_case_study.pdf'), pagesize=A4,
                        leftMargin=48,rightMargin=48,topMargin=44,bottomMargin=52,
                        title='Customer Data Cleaning | Synthetic Case Study', author='Ridho Kusumo Hariadi')
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(DEST / 'portfolio_case_study.pdf')
