"""
Forge Report Generation & PDF Export Module
"""

import io
import re
from datetime import datetime, timezone
from typing import Dict, Any, List

from lib_py.network import dns_lookup
from lib_py.osint import analyze_http_headers

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

def generate_forge_report(target: str) -> Dict[str, Any]:
    """
    Aggregates DNS, HTTP Headers, and security.txt checks,
    producing actionable findings and observations.
    """
    cleaned = target.strip().lower()
    cleaned = re.sub(r"^https?://", "", cleaned)
    cleaned = re.sub(r"/.*$", "", cleaned)
    
    if not re.match(r"^[a-z0-9.-]+\.[a-z]{2,}$", cleaned):
        raise ValueError("Enter a valid domain name, e.g. example.com")

    # 1. DNS Queries
    dns_records = {}
    for rtype in ["A", "AAAA", "MX", "TXT", "NS"]:
        try:
            res = dns_lookup(cleaned, rtype)
            dns_records[rtype] = res.get("answers", [])
        except Exception as e:
            dns_records[rtype] = []

    # 2. HTTP Analysis
    http_data = None
    http_error = None
    try:
        http_data = analyze_http_headers(cleaned)
    except Exception as e:
        http_error = str(e)

    # 3. Observations & Findings
    observations: List[str] = []

    a_recs = dns_records.get("A", [])
    if not a_recs:
        observations.append("No IPv4 (A) records found — domain might be unrouted or IPv6-only.")

    mx_recs = dns_records.get("MX", [])
    txt_recs = dns_records.get("TXT", [])
    has_spf = any("v=spf1" in r.get("data", "").lower() for r in txt_recs)

    if mx_recs and not has_spf:
        observations.append("Domain accepts mail (has MX records) but lacks an SPF record — vulnerable to email spoofing.")
    elif mx_recs and has_spf:
        observations.append("SPF email validation record detected in DNS TXT records.")

    if http_data:
        sec_eval = http_data.get("securityEvaluation", [])
        missing_sec = [h["header"] for h in sec_eval if not h["present"]]
        if missing_sec:
            observations.append(f"{len(missing_sec)} of {len(sec_eval)} recommended security headers missing: {', '.join(missing_sec)}.")
        else:
            observations.append("All recommended security headers are present.")

        if not http_data.get("securityTxt"):
            observations.append("No security.txt found — vulnerability reporters have no standardized contact method.")
        else:
            observations.append("Valid security.txt policy file detected.")
    elif http_error:
        observations.append(f"HTTP header inspection could not be completed: {http_error}")

    if not observations:
        observations.append("No significant anomalies detected for this domain.")

    return {
        "id": f"{cleaned}-{int(datetime.now().timestamp())}",
        "target": cleaned,
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "dns": dns_records,
        "http": http_data,
        "httpError": http_error,
        "observations": observations,
    }

def export_report_pdf(report: Dict[str, Any]) -> bytes:
    """Generates a professional CyberForge PDF audit summary using ReportLab."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CyberForgeTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=colors.HexColor('#E83E83'),
        spaceAfter=6,
    )
    subtitle_style = ParagraphStyle(
        'CyberForgeSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#666666'),
        spaceAfter=14,
    )
    h2_style = ParagraphStyle(
        'CyberForgeH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        textColor=colors.HexColor('#222222'),
        spaceBefore=10,
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        'CyberForgeBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#333333'),
    )

    story = []

    # Header
    story.append(Paragraph("CYBERFORGE — SECURITY AUDIT REPORT", title_style))
    story.append(Paragraph(f"Target: <b>{report['target']}</b> &nbsp;|&nbsp; Generated: {report['generatedAt']}", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E83E83'), spaceAfter=14))

    # Findings
    story.append(Paragraph("Key Observations & Findings", h2_style))
    for obs in report.get("observations", []):
        story.append(Paragraph(f"• {obs}", body_style))
        story.append(Spacer(1, 3))
    story.append(Spacer(1, 10))

    # DNS Table
    story.append(Paragraph("DNS Records Summary", h2_style))
    dns_table_data = [["Type", "Host / Name", "TTL", "Record Data"]]
    for rtype, records in report.get("dns", {}).items():
        if not records:
            dns_table_data.append([rtype, "-", "-", "No records"])
        else:
            for rec in records:
                dns_table_data.append([
                    rtype,
                    rec.get("name", "")[:30],
                    str(rec.get("ttl", "")),
                    rec.get("data", "")[:45]
                ])

    t = Table(dns_table_data, colWidths=[50, 140, 45, 295])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F4F4F5')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#18181B')),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E4E4E7')),
    ]))
    story.append(t)
    story.append(Spacer(1, 14))

    # HTTP Security Headers
    http_info = report.get("http")
    if http_info:
        story.append(Paragraph(f"HTTP Response & Security Headers (Status: {http_info.get('status')})", h2_style))
        sec_table = [["Security Header", "Status", "Value"]]
        for sec in http_info.get("securityEvaluation", []):
            sec_table.append([
                sec["header"],
                "PRESENT" if sec["present"] else "MISSING",
                (sec["value"] or "Not Set")[:50]
            ])
        st_table = Table(sec_table, colWidths=[180, 70, 280])
        st_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F4F4F5')),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E4E4E7')),
        ]))
        story.append(st_table)

    story.append(Spacer(1, 16))
    story.append(Paragraph("Generated automatically by CyberForge — Built for defenders, not attackers.", subtitle_style))

    doc.build(story)
    return buffer.getvalue()
