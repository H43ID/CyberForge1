"""
Network Toolkit Modules:
- Subnet Calculator
- CIDR Calculator
- Number Base Converter
- DNS Lookup (via DoH)
"""

import ipaddress
import re
import requests
from typing import Dict, Any, List

def calculate_subnet(cidr_str: str) -> Dict[str, Any]:
    """
    Computes IPv4 subnet breakdown with binary representations,
    usable host range, and edge cases (/31 RFC 3021, /32).
    """
    cidr_str = cidr_str.strip()
    match = re.match(r"^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/(\d{1,2})$", cidr_str)
    if not match:
        raise ValueError('Enter an address in CIDR form, e.g. "192.168.1.0/24".')
    
    ip_str, prefix_str = match.groups()
    prefix = int(prefix_str)
    if prefix < 0 or prefix > 32:
        raise ValueError("Prefix length must be between /0 and /32.")
    
    try:
        # Validate octets
        network = ipaddress.IPv4Network(f"{ip_str}/{prefix}", strict=False)
    except Exception as e:
        raise ValueError(f"Invalid IPv4 Network: {e}")

    net_int = int(network.network_address)
    mask_int = int(network.netmask)
    bcast_int = int(network.broadcast_address)
    wildcard_int = ~mask_int & 0xFFFFFFFF
    wildcard_mask = str(ipaddress.IPv4Address(wildcard_int))

    total_addresses = 2 ** (32 - prefix)
    
    if prefix <= 30:
        first_usable = str(network.network_address + 1)
        last_usable = str(network.broadcast_address - 1)
        usable_hosts = total_addresses - 2
    elif prefix == 31:
        # RFC 3021 point-to-point link
        first_usable = str(network.network_address)
        last_usable = str(network.broadcast_address)
        usable_hosts = 2
    else: # /32
        first_usable = str(network.network_address)
        last_usable = str(network.network_address)
        usable_hosts = 1

    def to_bin_dots(val: int) -> str:
        b = f"{val:032b}"
        return f"{b[0:8]}.{b[8:16]}.{b[16:24]}.{b[24:32]}"

    return {
        "cidr": f"{ip_str}/{prefix}",
        "ip": ip_str,
        "prefix": prefix,
        "networkAddress": str(network.network_address),
        "broadcastAddress": str(network.broadcast_address),
        "firstUsable": first_usable,
        "lastUsable": last_usable,
        "usableHostCount": usable_hosts,
        "totalAddresses": total_addresses,
        "subnetMask": str(network.netmask),
        "wildcardMask": wildcard_mask,
        "binaryIp": to_bin_dots(int(ipaddress.IPv4Address(ip_str))),
        "binaryMask": to_bin_dots(mask_int),
    }

def convert_cidr(prefix: int) -> Dict[str, Any]:
    """Calculates subnet properties for a given prefix length 0-32."""
    if prefix < 0 or prefix > 32:
        raise ValueError("Prefix must be between 0 and 32.")
    mask_int = 0 if prefix == 0 else (0xFFFFFFFF << (32 - prefix)) & 0xFFFFFFFF
    mask = str(ipaddress.IPv4Address(mask_int))
    wildcard = str(ipaddress.IPv4Address(~mask_int & 0xFFFFFFFF))
    total = 2 ** (32 - prefix)
    usable = total - 2 if prefix <= 30 else (2 if prefix == 31 else 1)
    
    return {
        "prefix": f"/{prefix}",
        "subnetMask": mask,
        "wildcardMask": wildcard,
        "totalAddresses": total,
        "usableHosts": usable,
    }

def mask_to_prefix(mask_str: str) -> int:
    """Converts a subnet mask like 255.255.255.0 to prefix length."""
    mask_str = mask_str.strip()
    try:
        addr = ipaddress.IPv4Address(mask_str)
        val = int(addr)
        # Check if contiguous ones followed by zeros
        b = f"{val:032b}"
        if "01" in b:
            raise ValueError(f"'{mask_str}' is not a valid contiguous subnet mask.")
        return b.count("1")
    except Exception as e:
        raise ValueError(f"Invalid subnet mask: {e}")

def convert_bases(val_str: str, from_base: str = "decimal") -> Dict[str, Any]:
    """Converts between binary, decimal, and hex with octet breakdown."""
    val_str = val_str.strip()
    if not val_str:
        raise ValueError("Enter a value to convert.")
    
    try:
        if from_base == "decimal":
            num = int(val_str, 10)
        elif from_base == "binary":
            num = int(val_str.replace(" ", "").replace(".", ""), 2)
        elif from_base == "hex":
            clean_hex = val_str.replace("0x", "").replace(" ", "").replace(":", "")
            num = int(clean_hex, 16)
        else:
            raise ValueError("Unknown base.")
    except Exception:
        raise ValueError(f"Cannot parse '{val_str}' as {from_base}.")

    if num < 0:
        raise ValueError("Only non-negative integers supported.")

    bin_str = bin(num)[2:]
    hex_str = hex(num)[2:].upper()

    # Per-octet if 32-bit or less
    octets = []
    if num <= 0xFFFFFFFF:
        val32 = num
        octets = [(val32 >> shift) & 0xFF for shift in (24, 16, 8, 0)]

    return {
        "decimal": str(num),
        "binary": bin_str,
        "binary_formatted": " ".join([bin_str[max(i-4, 0):i] for i in range(len(bin_str), 0, -4)][::-1]),
        "hex": hex_str,
        "hex_formatted": "0x" + hex_str,
        "bit_length": num.bit_length(),
        "octets": octets,
    }

def dns_lookup(domain: str, record_type: str = "A") -> Dict[str, Any]:
    """
    Performs DNS query via Cloudflare / Google DNS-over-HTTPS (DoH).
    """
    cleaned = domain.strip().lower()
    cleaned = re.sub(r"^https?://", "", cleaned)
    cleaned = re.sub(r"/.*$", "", cleaned)
    
    if not re.match(r"^[a-z0-9.-]+\.[a-z]{2,}$", cleaned):
        raise ValueError("Enter a valid domain name, e.g. example.com")

    url = f"https://cloudflare-dns.com/dns-query?name={cleaned}&type={record_type}"
    headers = {"Accept": "application/dns-json"}
    
    try:
        res = requests.get(url, headers=headers, timeout=5)
        res.raise_for_status()
        data = res.json()
        
        status = data.get("Status", 0)
        answers = data.get("Answer", [])
        authorities = data.get("Authority", [])
        
        parsed_answers = []
        for ans in answers:
            parsed_answers.append({
                "name": ans.get("name", ""),
                "type": ans.get("type", 0),
                "ttl": ans.get("TTL", 0),
                "data": ans.get("data", "").strip('"'),
            })
            
        return {
            "domain": cleaned,
            "record_type": record_type,
            "status": status,
            "answers": parsed_answers,
            "authority": authorities,
            "raw": data,
        }
    except Exception as e:
        raise RuntimeError(f"DNS lookup error: {e}")
