"""
Developer Toolkit Modules:
- JSON Formatter & Validator
- Encoding Toolkit (Base64, URL, HTML, Hex)
"""

import json
import base64
import html
import urllib.parse
from typing import Dict, Any

def format_json(raw: str, indent: int = 2) -> Dict[str, Any]:
    """Validates and formats or minifies JSON string with exact syntax error reporting."""
    if not raw.strip():
        raise ValueError("Input JSON is empty.")
    try:
        parsed = json.loads(raw)
        formatted = json.dumps(parsed, indent=indent)
        minified = json.dumps(parsed, separators=(',', ':'))
        return {
            "valid": True,
            "formatted": formatted,
            "minified": minified,
            "type": type(parsed).__name__,
            "keys_or_items": len(parsed) if isinstance(parsed, (dict, list)) else 1,
        }
    except json.JSONDecodeError as e:
        return {
            "valid": False,
            "error": str(e),
            "line": e.lineno,
            "col": e.colno,
            "pos": e.pos,
        }

def encode_data(val: str, scheme: str) -> str:
    """Encodes string to chosen scheme (base64, url, html, hex)."""
    if scheme == "base64":
        return base64.b64encode(val.encode("utf-8")).decode("utf-8")
    elif scheme == "url":
        return urllib.parse.quote(val, safe="")
    elif scheme == "html":
        return html.escape(val, quote=True)
    elif scheme == "hex":
        return " ".join(f"{b:02x}" for b in val.encode("utf-8"))
    else:
        raise ValueError(f"Unknown encoding scheme: {scheme}")

def decode_data(val: str, scheme: str) -> str:
    """Decodes string from chosen scheme (base64, url, html, hex)."""
    if scheme == "base64":
        try:
            return base64.b64decode(val.strip()).decode("utf-8", errors="replace")
        except Exception as e:
            raise ValueError(f"Invalid Base64 string: {e}")
    elif scheme == "url":
        return urllib.parse.unquote(val)
    elif scheme == "html":
        return html.unescape(val)
    elif scheme == "hex":
        try:
            clean = val.strip().replace("0x", "").replace(" ", "").replace(":", "")
            return bytes.fromhex(clean).decode("utf-8", errors="replace")
        except Exception as e:
            raise ValueError(f"Invalid Hex string: {e}")
    else:
        raise ValueError(f"Unknown encoding scheme: {scheme}")
