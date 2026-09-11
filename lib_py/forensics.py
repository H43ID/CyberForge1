"""
Forensics Toolkit Modules:
- EXIF Viewer (Pillow)
- File Signature Analyzer (Magic Bytes)
- Email Header Analyzer (RFC 5322)
"""

import io
import re
from typing import Dict, Any, List, Optional
from PIL import Image, ExifTags

SIGNATURES = [
    {"type": "PNG image", "extensions": ["png"], "bytes": [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], "offset": 0},
    {"type": "JPEG image", "extensions": ["jpg", "jpeg"], "bytes": [0xFF, 0xD8, 0xFF], "offset": 0},
    {"type": "GIF image", "extensions": ["gif"], "bytes": [0x47, 0x49, 0x46, 0x38], "offset": 0},
    {"type": "PDF document", "extensions": ["pdf"], "bytes": [0x25, 0x50, 0x44, 0x46], "offset": 0},
    {"type": "ZIP / Office archive (DOCX, XLSX, PPTX, JAR)", "extensions": ["zip", "docx", "xlsx", "pptx", "jar"], "bytes": [0x50, 0x4B, 0x03, 0x04], "offset": 0},
    {"type": "GZIP archive", "extensions": ["gz", "gzip"], "bytes": [0x1F, 0x8B], "offset": 0},
    {"type": "RAR archive", "extensions": ["rar"], "bytes": [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07], "offset": 0},
    {"type": "7-Zip archive", "extensions": ["7z"], "bytes": [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C], "offset": 0},
    {"type": "ELF executable", "extensions": ["elf", "so", "bin"], "bytes": [0x7F, 0x45, 0x4C, 0x46], "offset": 0},
    {"type": "Windows PE executable", "extensions": ["exe", "dll", "sys"], "bytes": [0x4D, 0x5A], "offset": 0},
    {"type": "WAV audio", "extensions": ["wav"], "bytes": [0x52, 0x49, 0x46, 0x46], "offset": 0},
    {"type": "MP3 audio", "extensions": ["mp3"], "bytes": [0x49, 0x44, 0x33], "offset": 0},
    {"type": "BMP image", "extensions": ["bmp"], "bytes": [0x42, 0x4D], "offset": 0},
    {"type": "SQLite database", "extensions": ["sqlite", "db", "sqlite3"], "bytes": [0x53, 0x51, 0x4C, 0x69, 0x74, 0x65], "offset": 0},
    {"type": "MP4 video", "extensions": ["mp4", "m4a", "mov"], "bytes": [None, None, None, None, 0x66, 0x74, 0x79, 0x70], "offset": 0},
]

def analyze_file_signature(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Examines file header magic bytes to detect authentic file type and flags extension mismatches.
    """
    declared_ext = filename.split(".")[-1].lower() if "." in filename else ""
    first_32 = file_bytes[:32]
    first_bytes_hex = " ".join(f"{b:02x}" for b in first_32[:16])

    detected = None
    for sig in SIGNATURES:
        offset = sig.get("offset", 0)
        expected = sig["bytes"]
        if len(first_32) < offset + len(expected):
            continue
        
        match = True
        for idx, exp_byte in enumerate(expected):
            if exp_byte is not None and first_32[offset + idx] != exp_byte:
                match = False
                break
        if match:
            detected = sig
            break

    mismatch = False
    if detected and declared_ext:
        mismatch = declared_ext not in detected["extensions"]

    return {
        "filename": filename,
        "declaredExtension": declared_ext,
        "detected": detected,
        "mismatch": mismatch,
        "firstBytesHex": first_bytes_hex,
        "sizeBytes": len(file_bytes),
    }

def parse_exif(image_bytes: bytes) -> Dict[str, Any]:
    """
    Extracts EXIF metadata including camera, settings, timestamps, and GPS coordinates.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
    except Exception as e:
        raise ValueError(f"Could not open image: {e}")

    exif_raw = img.getexif()
    if not exif_raw:
        return {
            "hasData": False,
            "dimensions": f"{img.width}x{img.height}",
            "format": img.format,
            "camera": {},
            "settings": {},
            "timestamps": {},
            "gps": None,
            "raw": {},
        }

    tag_map = {ExifTags.TAGS[k]: v for k, v in exif_raw.items() if k in ExifTags.TAGS}

    camera = {
        "make": str(tag_map.get("Make", "")),
        "model": str(tag_map.get("Model", "")),
        "software": str(tag_map.get("Software", "")),
    }
    settings = {
        "fNumber": str(tag_map.get("FNumber", "")),
        "exposureTime": str(tag_map.get("ExposureTime", "")),
        "iso": str(tag_map.get("ISOSpeedRatings", tag_map.get("ISO", ""))),
        "focalLength": str(tag_map.get("FocalLength", "")),
    }
    timestamps = {
        "dateTime": str(tag_map.get("DateTime", "")),
        "dateTimeOriginal": str(tag_map.get("DateTimeOriginal", "")),
    }

    # Clean out empty values
    camera = {k: v for k, v in camera.items() if v}
    settings = {k: v for k, v in settings.items() if v}
    timestamps = {k: v for k, v in timestamps.items() if v}

    # Extract GPS if available
    gps_info = None
    if ExifTags.IFD.GPSInfo in exif_raw:
        try:
            gps_ifd = exif_raw.get_ifd(ExifTags.IFD.GPSInfo)
            gps_tags = {ExifTags.GPSTAGS.get(k, k): v for k, v in gps_ifd.items()}
            
            def dms_to_deg(dms, ref):
                deg = float(dms[0]) + float(dms[1])/60.0 + float(dms[2])/3600.0
                if ref in ['S', 'W']:
                    deg = -deg
                return deg

            if "GPSLatitude" in gps_tags and "GPSLongitude" in gps_tags:
                lat = dms_to_deg(gps_tags["GPSLatitude"], gps_tags.get("GPSLatitudeRef", "N"))
                lon = dms_to_deg(gps_tags["GPSLongitude"], gps_tags.get("GPSLongitudeRef", "E"))
                gps_info = {"latitude": round(lat, 6), "longitude": round(lon, 6)}
        except Exception:
            pass

    return {
        "hasData": True,
        "dimensions": f"{img.width}x{img.height}",
        "format": img.format,
        "camera": camera,
        "settings": settings,
        "timestamps": timestamps,
        "gps": gps_info,
        "raw": {str(k): str(v) for k, v in tag_map.items()},
    }

def analyze_email_headers(raw_headers: str) -> Dict[str, Any]:
    """
    Parses and unfolds raw RFC 5322 email headers, extracts routing hops and authentication results.
    """
    lines = raw_headers.replace("\r\n", "\n").split("\n")
    unfolded: List[str] = []
    for line in lines:
        if line.startswith((" ", "\t")) and unfolded:
            unfolded[-1] += " " + line.strip()
        elif line.strip():
            unfolded.append(line)
        else:
            break  # blank line terminates header block

    parsed_headers: List[Dict[str, str]] = []
    for line in unfolded:
        if ":" in line:
            name, val = line.split(":", 1)
            parsed_headers.append({"name": name.strip(), "value": val.strip()})

    if not parsed_headers:
        raise ValueError("Could not find any email headers. Paste the full raw header block.")

    def get_first(name: str) -> Optional[str]:
        for h in parsed_headers:
            if h["name"].lower() == name.lower():
                return h["value"]
        return None

    def get_all(name: str) -> List[str]:
        return [h["value"] for h in parsed_headers if h["name"].lower() == name.lower()]

    auth_results = get_first("Authentication-Results") or ""

    def extract_auth(mech: str) -> Optional[str]:
        m = re.search(rf"{mech}=(\w+)", auth_results, re.IGNORECASE)
        return m.group(1).lower() if m else None

    return {
        "from": get_first("From"),
        "to": get_first("To"),
        "subject": get_first("Subject"),
        "date": get_first("Date"),
        "messageId": get_first("Message-ID"),
        "receivedChain": get_all("Received"),
        "spf": extract_auth("spf") or get_first("Received-SPF"),
        "dkim": extract_auth("dkim"),
        "dmarc": extract_auth("dmarc"),
        "allHeaders": parsed_headers,
    }
