"""
Security Toolkit Modules:
- Hash Generator (MD5, SHA-1, SHA-256, SHA-384, SHA-512)
- Password Strength Analyzer
- JWT Decoder
"""

import hashlib
import json
import base64
import math
import re
from datetime import datetime, timezone
from typing import Dict, Any, List

COMMON_PASSWORDS = {
    "password", "123456", "123456789", "qwerty", "12345678", "111111",
    "1234567", "letmein", "1234567890", "welcome", "monkey", "login",
    "abc123", "starwars", "dragon", "passw0rd", "iloveyou", "admin",
    "sunshine", "princess", "football", "654321", "master", "hello",
    "admin123", "root", "toor", "pass1234", "cybersecurity"
}

def hash_data(data: bytes) -> Dict[str, str]:
    """Generates MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes."""
    return {
        "MD5": hashlib.md5(data).hexdigest(),
        "SHA-1": hashlib.sha1(data).hexdigest(),
        "SHA-256": hashlib.sha256(data).hexdigest(),
        "SHA-384": hashlib.sha384(data).hexdigest(),
        "SHA-512": hashlib.sha512(data).hexdigest(),
    }

def analyze_password(pw: str) -> Dict[str, Any]:
    """
    Evaluates password strength, entropy bits, pattern deductions,
    and returns score (0-100), label, issues, and recommendations.
    """
    if not pw:
        return {
            "score": 0,
            "label": "Very weak",
            "entropyBits": 0,
            "length": 0,
            "poolSize": 0,
            "issues": ["Enter a password to analyze."],
            "recommendations": ["Use a passphrase or password with at least 12 characters."],
        }

    issues: List[str] = []
    recommendations: List[str] = []

    has_lower = bool(re.search(r"[a-z]", pw))
    has_upper = bool(re.search(r"[A-Z]", pw))
    has_digit = bool(re.search(r"\d", pw))
    has_symbol = bool(re.search(r"[^a-zA-Z0-9]", pw))

    pool_size = 0
    if has_lower: pool_size += 26
    if has_upper: pool_size += 26
    if has_digit: pool_size += 10
    if has_symbol: pool_size += 32

    entropy = len(pw) * math.log2(max(pool_size, 1))
    score = min(100, int(round((entropy / 100.0) * 100)))

    if len(pw) < 8:
        issues.append("Shorter than 8 characters.")
        recommendations.append("Use at least 12 characters — length matters more than complexity.")
        score -= 25
    elif len(pw) < 12:
        issues.append("Between 8 and 11 characters.")
        recommendations.append("Increase length to 14+ characters for high security.")
        score -= 10

    if not has_upper or not has_lower:
        issues.append("Missing mixed letter case.")
        recommendations.append("Mix uppercase and lowercase letters.")
        score -= 10

    if not has_digit:
        issues.append("No numeric digits.")
        recommendations.append("Add one or more numbers.")
        score -= 8

    if not has_symbol:
        issues.append("No special symbols.")
        recommendations.append("Add symbols such as ! # $ % or -.")
        score -= 8

    # Sequential patterns (e.g. 1234, abcd)
    lower_pw = pw.lower()
    sequences = ["abcdefghijklmnopqrstuvwxyz", "01234567890"]
    for seq in sequences:
        for i in range(len(seq) - 3):
            sub = seq[i:i+4]
            if sub in lower_pw or sub[::-1] in lower_pw:
                issues.append("Contains a sequential keyboard pattern (e.g. abcd, 1234).")
                recommendations.append("Avoid consecutive sequences or keyboard patterns.")
                score -= 20
                break

    # Repeated runs (e.g. aaa)
    if re.search(r"(.)\1\1", pw):
        issues.append("Contains repeated character runs (e.g. 'aaa').")
        recommendations.append("Avoid repeating the same character three or more times.")
        score -= 15

    # Common passwords
    if lower_pw in COMMON_PASSWORDS:
        issues.append("Found in common password breach dictionary.")
        recommendations.append("Never use common words or leaked passwords.")
        score = 2

    score = max(0, min(100, score))

    if score < 20: label = "Very weak"
    elif score < 40: label = "Weak"
    elif score < 60: label = "Fair"
    elif score < 80: label = "Strong"
    else: label = "Very strong"

    if not recommendations:
        recommendations.append("Excellent password. Store it safely in a password manager.")

    return {
        "score": score,
        "label": label,
        "entropyBits": round(entropy, 1),
        "length": len(pw),
        "poolSize": pool_size,
        "issues": issues,
        "recommendations": recommendations,
        "has_lower": has_lower,
        "has_upper": has_upper,
        "has_digit": has_digit,
        "has_symbol": has_symbol,
    }

def decode_jwt(token: str) -> Dict[str, Any]:
    """
    Decodes JWT header & payload using Base64URL decoding, parses claims,
    and checks expiration timestamps.
    """
    parts = token.strip().split(".")
    if len(parts) < 2:
        raise ValueError("Invalid JWT format — expected header.payload.signature")

    def b64url_decode(s: str) -> str:
        s += "=" * ((4 - len(s) % 4) % 4)
        s = s.replace("-", "+").replace("_", "/")
        return base64.b64decode(s).decode("utf-8", errors="replace")

    try:
        header = json.loads(b64url_decode(parts[0]))
    except Exception as e:
        raise ValueError(f"Failed to parse JWT Header: {e}")

    try:
        payload = json.loads(b64url_decode(parts[1]))
    except Exception as e:
        raise ValueError(f"Failed to parse JWT Payload: {e}")

    exp = payload.get("exp") if isinstance(payload, dict) else None
    iat = payload.get("iat") if isinstance(payload, dict) else None
    nbf = payload.get("nbf") if isinstance(payload, dict) else None

    def fmt_ts(ts: Any) -> str:
        if ts is None or not isinstance(ts, (int, float)):
            return "N/A"
        try:
            dt = datetime.fromtimestamp(ts, tz=timezone.utc)
            return dt.strftime("%Y-%m-%d %H:%M:%S UTC")
        except Exception:
            return str(ts)

    is_expired = False
    if exp and isinstance(exp, (int, float)):
        now_ts = datetime.now(timezone.utc).timestamp()
        is_expired = now_ts > exp

    return {
        "header": header,
        "payload": payload,
        "signaturePresent": len(parts) >= 3 and len(parts[2]) > 0,
        "expiresAt": fmt_ts(exp),
        "issuedAt": fmt_ts(iat),
        "notBefore": fmt_ts(nbf),
        "isExpired": is_expired,
    }
