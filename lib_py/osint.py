"""
OSINT Toolkit Modules:
- HTTP Header Analyzer
- Security.txt Checker
- Security Header Compliance Evaluation
"""

import ipaddress
import socket
import urllib.parse
import requests
from typing import Dict, Any, List

SECURITY_HEADERS = [
    {
        "header": "strict-transport-security",
        "name": "Strict-Transport-Security (HSTS)",
        "explanation": "Forces browsers to exclusively connect over HTTPS, preventing SSL stripping attacks.",
    },
    {
        "header": "content-security-policy",
        "name": "Content-Security-Policy (CSP)",
        "explanation": "Restricts allowed sources for scripts, styles, and assets, preventing Cross-Site Scripting (XSS).",
    },
    {
        "header": "x-frame-options",
        "name": "X-Frame-Options",
        "explanation": "Controls whether the site can be embedded inside iframes, preventing clickjacking.",
    },
    {
        "header": "x-content-type-options",
        "name": "X-Content-Type-Options",
        "explanation": "Forces browsers to stick to declared MIME types ('nosniff') rather than MIME-sniffing.",
    },
    {
        "header": "referrer-policy",
        "name": "Referrer-Policy",
        "explanation": "Controls how much URL information is sent in the Referer header during cross-origin navigation.",
    },
    {
        "header": "permissions-policy",
        "name": "Permissions-Policy",
        "explanation": "Explicitly restricts access to browser APIs like geolocation, camera, and microphone.",
    },
]

def is_private_or_loopback_host(hostname: str) -> bool:
    """SSRF guard: checks if hostname resolves to loopback, link-local, or private IP space."""
    try:
        ip_str = socket.gethostbyname(hostname)
        ip = ipaddress.ip_address(ip_str)
        return ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_multicast
    except Exception:
        return False

def analyze_http_headers(target_url: str) -> Dict[str, Any]:
    """
    Fetches headers for the target URL safely and evaluates standard security headers.
    """
    target = target_url.strip()
    if not target.startswith(("http://", "https://")):
        target = f"https://{target}"

    parsed = urllib.parse.urlparse(target)
    hostname = parsed.hostname or ""

    if not hostname:
        raise ValueError("Invalid URL format.")

    if is_private_or_loopback_host(hostname):
        raise ValueError(f"Access to private/loopback address '{hostname}' is blocked for security.")

    headers = {
        "User-Agent": "CyberForge-OSINT-Inspector/1.0 (+https://github.com/H43ID/CyberForge1)"
    }

    try:
        resp = requests.get(target, headers=headers, timeout=8, allow_redirects=True)
    except requests.exceptions.SSLError:
        # Fallback to HTTP if HTTPS fails
        if target.startswith("https://"):
            target = "http://" + target[8:]
            resp = requests.get(target, headers=headers, timeout=8, allow_redirects=True)
        else:
            raise

    resp_headers_lower = {k.lower(): v for k, v in resp.headers.items()}

    security_evaluation: List[Dict[str, Any]] = []
    for sh in SECURITY_HEADERS:
        hdr_key = sh["header"]
        is_present = hdr_key in resp_headers_lower
        security_evaluation.append({
            "header": sh["name"],
            "key": hdr_key,
            "present": is_present,
            "value": resp_headers_lower.get(hdr_key),
            "explanation": sh["explanation"],
        })

    # Check security.txt
    security_txt_content = None
    sec_url = f"{parsed.scheme}://{parsed.netloc}/.well-known/security.txt"
    try:
        sec_resp = requests.get(sec_url, headers=headers, timeout=4)
        if sec_resp.status_code == 200 and "contact:" in sec_resp.text.lower():
            security_txt_content = sec_resp.text[:2000]
    except Exception:
        pass

    return {
        "requestedUrl": target_url,
        "finalUrl": resp.url,
        "status": resp.status_code,
        "statusText": resp.reason,
        "headers": dict(resp.headers),
        "securityEvaluation": security_evaluation,
        "securityTxt": security_txt_content,
    }
