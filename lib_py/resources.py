"""
Resources and Cheat Sheets Module
"""

import os
from pathlib import Path
from typing import List, Dict, Any

# Resolve path relative to repository root
BASE_DIR = Path(__file__).resolve().parent.parent
RESOURCES_DIR = BASE_DIR / "public" / "resources"

RESOURCE_ITEMS = [
    {
        "id": "subnetting",
        "title": "Subnetting Cheat Sheet",
        "filename": "subnetting-cheat-sheet.pdf",
        "description": "IPv4 CIDR prefixes, subnet masks, wildcard masks, and usable host counts at a glance.",
        "category": "Network",
    },
    {
        "id": "common-ports",
        "title": "Common Ports Reference",
        "filename": "common-ports-reference.pdf",
        "description": "Essential TCP/UDP ports, standard service mappings, and common vulnerability vectors.",
        "category": "Network",
    },
    {
        "id": "http-status",
        "title": "HTTP Status Codes Reference",
        "filename": "http-status-codes-reference.pdf",
        "description": "Comprehensive reference guide covering 1xx through 5xx HTTP response codes and semantics.",
        "category": "Web / Security",
    },
    {
        "id": "incident-response",
        "title": "Incident Response Checklist",
        "filename": "incident-response-checklist.pdf",
        "description": "Step-by-step triage, containment, eradication, and evidence preservation guidelines.",
        "category": "Forensics / SecOps",
    },
]

def get_resource_pdf_bytes(filename: str) -> bytes:
    """Reads PDF binary data from the resources directory."""
    pdf_path = RESOURCES_DIR / filename
    if pdf_path.exists():
        with open(pdf_path, "rb") as f:
            return f.read()
    raise FileNotFoundError(f"Resource file {filename} not found.")
