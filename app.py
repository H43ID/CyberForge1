"""
CyberForge — Streamlit Community Cloud Application
Analyze. Understand. Defend.
A browser-based cybersecurity, networking, and digital-forensics workspace.
"""

import os
import io
import json
import base64
from pathlib import Path
import streamlit as st

# Safe import of internal modules
from lib_py.tools_registry import TOOLS, CATEGORIES, get_tool, search_tools
import lib_py.network as net_tools
import lib_py.security as sec_tools
import lib_py.forensics as for_tools
import lib_py.developer as dev_tools
import lib_py.osint as osint_tools
import lib_py.reports as report_tools
import lib_py.resources as res_tools

# Page Configuration
st.set_page_config(
    page_title="CyberForge — Analyze. Understand. Defend.",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom CyberForge Dark Theme CSS
st.markdown(
    """
    <style>
    /* Global CyberForge Styling */
    .stApp {
        background-color: #080809;
        color: #E4E4E7;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    
    /* Headers and Titles */
    h1, h2, h3, h4 {
        color: #F4F4F5 !important;
        font-weight: 700;
        letter-spacing: -0.02em;
    }
    .cf-brand-pink {
        color: #E83E83 !important;
    }
    .cf-badge {
        display: inline-block;
        padding: 3px 10px;
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: 9999px;
        background-color: rgba(232, 62, 131, 0.15);
        color: #E83E83;
        border: 1px solid rgba(232, 62, 131, 0.3);
        margin-right: 6px;
    }
    .cf-card {
        background-color: #101012;
        border: 1px solid #27272A;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        transition: border-color 0.2s ease;
    }
    .cf-card:hover {
        border-color: #3F3F46;
    }
    
    /* Buttons */
    .stButton>button {
        background-color: #E83E83;
        color: #FFFFFF;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        padding: 0.5rem 1.25rem;
        transition: all 0.2s;
    }
    .stButton>button:hover {
        background-color: #D93375;
        color: #FFFFFF;
        box-shadow: 0 0 15px rgba(232, 62, 131, 0.4);
    }
    
    /* Inputs */
    .stTextInput input, .stTextArea textarea, .stSelectbox select {
        background-color: #151518 !important;
        color: #F4F4F5 !important;
        border: 1px solid #27272A !important;
        border-radius: 6px !important;
    }
    .stTextInput input:focus, .stTextArea textarea:focus {
        border-color: #E83E83 !important;
        box-shadow: 0 0 0 1px #E83E83 !important;
    }
    
    /* Tabs */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        background-color: transparent;
        border-bottom: 1px solid #27272A;
    }
    .stTabs [data-baseweb="tab"] {
        background-color: transparent;
        color: #A1A1AA;
        border-radius: 6px 6px 0 0;
        padding: 8px 16px;
    }
    .stTabs [aria-selected="true"] {
        color: #E83E83 !important;
        border-bottom: 2px solid #E83E83 !important;
        font-weight: 600;
    }
    
    /* Metrics */
    [data-testid="stMetricValue"] {
        color: #E83E83 !important;
        font-size: 1.6rem !important;
    }
    [data-testid="stMetricLabel"] {
        color: #A1A1AA !important;
    }
    
    /* Sidebar */
    section[data-testid="stSidebar"] {
        background-color: #0c0c0e;
        border-right: 1px solid #1f1f23;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Initialize Session State
if "history" not in st.session_state:
    st.session_state.history = []
if "favorites" not in st.session_state:
    st.session_state.favorites = set()

def track_tool(tool_slug: str):
    if tool_slug not in st.session_state.history:
        st.session_state.history.insert(0, tool_slug)
    st.session_state.history = st.session_state.history[:10]

# --- SIDEBAR NAVIGATION ---
with st.sidebar:
    st.markdown(
        """
        <div style="padding: 10px 0;">
            <h2 style="margin: 0; font-size: 1.5rem;"><span class="cf-brand-pink">⚡</span> CyberForge</h2>
            <p style="margin: 4px 0 0 0; color: #71717A; font-size: 0.8rem; letter-spacing: 0.05em; text-transform: uppercase;">Analyze · Understand · Defend</p>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.divider()
    
    view_mode = st.radio(
        "Navigation",
        ["🛠️ Tools", "📊 Forge Report", "📚 Resources", "📈 Dashboard"],
        label_visibility="collapsed",
    )
    
    selected_category = "all"
    selected_tool_slug = "subnet-calculator"
    
    if view_mode == "🛠️ Tools":
        st.subheader("Categories")
        category_choice = st.selectbox(
            "Category Filter",
            options=["All Categories"] + [c["label"] for c in CATEGORIES.values()],
            label_visibility="collapsed",
        )
        
        if category_choice != "All Categories":
            for k, v in CATEGORIES.items():
                if v["label"] == category_choice:
                    selected_category = k
                    break
        
        search_query = st.text_input("🔍 Search tools...", placeholder="e.g. subnet, jwt, exif")
        filtered_tools = search_tools(search_query, selected_category)
        
        st.subheader("Select Tool")
        if filtered_tools:
            tool_options = {t["slug"]: f"{CATEGORIES[t['category']]['icon']} {t['title']}" for t in filtered_tools}
            selected_tool_slug = st.selectbox(
                "Select Tool",
                options=list(tool_options.keys()),
                format_func=lambda x: tool_options[x],
                label_visibility="collapsed",
            )
        else:
            st.warning("No tools match your query.")
            selected_tool_slug = None

    st.divider()
    st.markdown(
        """
        <div style="font-size: 0.75rem; color: #52525B;">
            <p>🔒 <b>Browser-First Execution</b><br>
            All computations run securely with zero third-party telemetry.</p>
            <p>© 2026 CyberForge</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

# --- MAIN CONTENT ROUTING ---

# 1. FORGE REPORT VIEW
if view_mode == "📊 Forge Report":
    st.markdown(
        """
        <h1><span class="cf-brand-pink">Forge</span> Security Report</h1>
        <p style="color: #A1A1AA; margin-bottom: 25px;">
            Comprehensive multi-vector reconnaissance and compliance audit for any domain. Combines DNS enumeration, security header analysis, and security.txt validation.
        </p>
        """,
        unsafe_allow_html=True,
    )
    
    col1, col2 = st.columns([3, 1])
    with col1:
        target_domain = st.text_input("Target Domain", value="example.com", placeholder="e.g. cloudflare.com or github.com")
    with col2:
        st.write("")
        st.write("")
        run_report_btn = st.button("Generate Report", use_container_width=True)
    
    if run_report_btn or "current_report" in st.session_state:
        if run_report_btn:
            with st.spinner(f"Analyzing {target_domain}..."):
                try:
                    report = report_tools.generate_forge_report(target_domain)
                    st.session_state.current_report = report
                except Exception as e:
                    st.error(f"Analysis failed: {e}")
                    report = None
        else:
            report = st.session_state.get("current_report")

        if report:
            st.success(f"Audit completed for **{report['target']}** ({report['generatedAt']})")
            
            # Export Buttons
            pdf_bytes = report_tools.export_report_pdf(report)
            json_str = json.dumps(report, indent=2)
            
            exp_col1, exp_col2, exp_col3 = st.columns(3)
            with exp_col1:
                st.download_button(
                    label="📄 Download PDF Audit",
                    data=pdf_bytes,
                    file_name=f"CyberForge_Report_{report['target']}.pdf",
                    mime="application/pdf",
                    use_container_width=True,
                )
            with exp_col2:
                st.download_button(
                    label="💾 Download JSON Data",
                    data=json_str,
                    file_name=f"CyberForge_Report_{report['target']}.json",
                    mime="application/json",
                    use_container_width=True,
                )
            with exp_col3:
                txt_summary = f"CyberForge Security Report for {report['target']}\nGenerated: {report['generatedAt']}\n\nKey Observations:\n" + "\n".join(f"- {o}" for o in report.get("observations", []))
                st.download_button(
                    label="📝 Download Text Summary",
                    data=txt_summary,
                    file_name=f"CyberForge_Report_{report['target']}.txt",
                    mime="text/plain",
                    use_container_width=True,
                )

            st.divider()

            # Observations
            st.subheader("🎯 Key Observations & Findings")
            for obs in report.get("observations", []):
                st.info(obs)

            # Tabbed details
            d_tab1, d_tab2, d_tab3 = st.tabs(["🌐 DNS Records", "🛡️ HTTP Security Headers", "📋 security.txt Policy"])
            
            with d_tab1:
                for rtype, answers in report.get("dns", {}).items():
                    with st.expander(f"**{rtype} Records** ({len(answers)} found)", expanded=bool(answers)):
                        if answers:
                            for a in answers:
                                st.code(f"Host: {a.get('name')} | TTL: {a.get('ttl')}s\nData: {a.get('data')}", language="dns")
                        else:
                            st.caption("No records returned.")

            with d_tab2:
                http_info = report.get("http")
                if http_info:
                    st.write(f"**HTTP Status:** `{http_info.get('status')} {http_info.get('statusText')}`")
                    st.write(f"**Final Destination:** `{http_info.get('finalUrl')}`")
                    
                    st.write("### Security Header Evaluation")
                    for sec in http_info.get("securityEvaluation", []):
                        col_a, col_b = st.columns([1, 3])
                        with col_a:
                            if sec["present"]:
                                st.success(f"✅ {sec['header']}")
                            else:
                                st.error(f"❌ {sec['header']}")
                        with col_b:
                            if sec["present"]:
                                st.caption(f"Value: `{sec['value']}`")
                            st.caption(sec["explanation"])
                else:
                    st.warning(f"HTTP Analysis unavailable: {report.get('httpError')}")

            with d_tab3:
                sec_txt = report.get("http", {}).get("securityTxt") if report.get("http") else None
                if sec_txt:
                    st.success("Valid security.txt file located.")
                    st.code(sec_txt, language="text")
                else:
                    st.warning("No security.txt policy found at /.well-known/security.txt.")

# 2. RESOURCES VIEW
elif view_mode == "📚 Resources":
    st.markdown(
        """
        <h1><span class="cf-brand-pink">Security</span> Resource Library</h1>
        <p style="color: #A1A1AA; margin-bottom: 25px;">
            Downloadable reference guides, cheat sheets, and incident response checklists for engineers, analysts, and students.
        </p>
        """,
        unsafe_allow_html=True,
    )
    
    cols = st.columns(2)
    for idx, item in enumerate(res_tools.RESOURCE_ITEMS):
        with cols[idx % 2]:
            st.markdown(
                f"""
                <div class="cf-card">
                    <span class="cf-badge">{item['category']}</span>
                    <h3 style="margin-top: 10px;">{item['title']}</h3>
                    <p style="color: #A1A1AA; font-size: 0.9rem;">{item['description']}</p>
                </div>
                """,
                unsafe_allow_html=True,
            )
            try:
                pdf_data = res_tools.get_resource_pdf_bytes(item["filename"])
                st.download_button(
                    label=f"⬇️ Download {item['title']} (PDF)",
                    data=pdf_data,
                    file_name=item["filename"],
                    mime="application/pdf",
                    key=f"res_dl_{item['id']}",
                    use_container_width=True,
                )
            except Exception:
                st.caption("PDF file ready for export.")
            st.write("")

# 3. DASHBOARD VIEW
elif view_mode == "📈 Dashboard":
    st.markdown(
        """
        <h1><span class="cf-brand-pink">Workspace</span> Dashboard</h1>
        <p style="color: #A1A1AA; margin-bottom: 25px;">
            Overview of your active workspace session, recent tools, and quick shortcuts.
        </p>
        """,
        unsafe_allow_html=True,
    )
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Available Tools", len(TOOLS))
    with col2:
        st.metric("Tool Categories", len(CATEGORIES))
    with col3:
        st.metric("Tools Used", len(st.session_state.history))
    with col4:
        st.metric("Platform Security", "100% Client-Safe")
        
    st.divider()
    
    st.subheader("🕒 Recently Used Tools")
    if st.session_state.history:
        for slug in st.session_state.history:
            t = get_tool(slug)
            if t:
                st.markdown(f"- **{t['title']}** — {t['shortDescription']}")
    else:
        st.info("No tools accessed yet in this session. Select a tool from the sidebar to begin.")

# 4. INDIVIDUAL TOOL VIEW
elif selected_tool_slug:
    tool_meta = get_tool(selected_tool_slug)
    if tool_meta:
        track_tool(selected_tool_slug)
        cat_info = CATEGORIES.get(tool_meta["category"], {})
        
        # Tool Header
        st.markdown(
            f"""
            <div style="margin-bottom: 20px;">
                <span class="cf-badge">{cat_info.get('label', 'Tool')}</span>
                <h1 style="margin: 8px 0 4px 0;">{cat_info.get('icon', '')} {tool_meta['title']}</h1>
                <p style="color: #A1A1AA; font-size: 1.05rem;">{tool_meta['shortDescription']}</p>
            </div>
            """,
            unsafe_allow_html=True,
        )

        tool_tab, edu_tab = st.tabs(["⚡ Interactive Tool", "📖 Educational Explanation"])

        # --- TAB 1: INTERACTIVE TOOL ---
        with tool_tab:
            
            # --- SUBNET CALCULATOR ---
            if selected_tool_slug == "subnet-calculator":
                cidr_input = st.text_input("IPv4 Address & CIDR Prefix", value="192.168.1.0/24")
                if cidr_input:
                    try:
                        res = net_tools.calculate_subnet(cidr_input)
                        m1, m2, m3, m4 = st.columns(4)
                        m1.metric("Network Address", res["networkAddress"])
                        m2.metric("Broadcast Address", res["broadcastAddress"])
                        m3.metric("Usable Host Count", f"{res['usableHostCount']:,}")
                        m4.metric("Subnet Mask", res["subnetMask"])

                        st.write("### Subnet Boundary Breakdown")
                        r_col1, r_col2 = st.columns(2)
                        with r_col1:
                            st.write(f"**First Usable Host:** `{res['firstUsable']}`")
                            st.write(f"**Last Usable Host:** `{res['lastUsable']}`")
                            st.write(f"**Wildcard Mask:** `{res['wildcardMask']}`")
                            st.write(f"**Total IP Addresses:** `{res['totalAddresses']:,}`")
                        with r_col2:
                            st.write(f"**Binary IP:** `{res['binaryIp']}`")
                            st.write(f"**Binary Mask:** `{res['binaryMask']}`")
                    except Exception as e:
                        st.error(str(e))

            # --- CIDR CALCULATOR ---
            elif selected_tool_slug == "cidr-calculator":
                cidr_mode = st.radio("Conversion Mode", ["Prefix (/0 to /32) → Subnet Mask", "Subnet Mask → CIDR Prefix"], horizontal=True)
                if cidr_mode.startswith("Prefix"):
                    prefix_val = st.slider("Select Prefix Length", min_value=0, max_value=32, value=24)
                    res = net_tools.convert_cidr(prefix_val)
                    c1, c2, c3 = st.columns(3)
                    c1.metric("Subnet Mask", res["subnetMask"])
                    c2.metric("Wildcard Mask", res["wildcardMask"])
                    c3.metric("Usable Hosts", f"{res['usableHosts']:,}")
                else:
                    mask_in = st.text_input("Subnet Mask", value="255.255.255.0")
                    if mask_in:
                        try:
                            pref = net_tools.mask_to_prefix(mask_in)
                            st.success(f"CIDR Prefix: **/{pref}**")
                        except Exception as e:
                            st.error(str(e))

            # --- NUMBER BASE CONVERTER ---
            elif selected_tool_slug == "number-base-converter":
                b_col1, b_col2 = st.columns([1, 3])
                with b_col1:
                    base_type = st.selectbox("Input Base", ["decimal", "binary", "hex"])
                with b_col2:
                    val_input = st.text_input("Value", value="192")
                
                if val_input:
                    try:
                        res = net_tools.convert_bases(val_input, base_type)
                        c1, c2, c3 = st.columns(3)
                        c1.metric("Decimal", res["decimal"])
                        c2.metric("Hexadecimal", res["hex_formatted"])
                        c3.metric("Bit Length", res["bit_length"])
                        
                        st.write("### Binary Representation")
                        st.code(res["binary_formatted"], language="text")
                        
                        if res["octets"]:
                            st.write("### 32-bit Octet Breakdown (e.g. IPv4)")
                            st.write(" | ".join([f"Octet {i+1}: `{oct_val}` (0x{oct_val:02X}, {oct_val:08b}b)" for i, oct_val in enumerate(res["octets"])]))
                    except Exception as e:
                        st.error(str(e))

            # --- DNS LOOKUP ---
            elif selected_tool_slug == "dns-lookup":
                d1, d2 = st.columns([3, 1])
                with d1:
                    dns_domain = st.text_input("Domain Name", value="cloudflare.com")
                with d2:
                    dns_type = st.selectbox("Record Type", ["A", "AAAA", "MX", "TXT", "NS", "CNAME", "SOA", "CAA"])
                
                if st.button("Lookup Records", use_container_width=True) or dns_domain:
                    try:
                        res = net_tools.dns_lookup(dns_domain, dns_type)
                        answers = res.get("answers", [])
                        if answers:
                            st.success(f"Found {len(answers)} {dns_type} record(s) for **{res['domain']}**")
                            for a in answers:
                                st.markdown(f"- **{a['name']}** (TTL: {a['ttl']}s) → `{a['data']}`")
                        else:
                            st.warning(f"No {dns_type} records found for {dns_domain}.")
                    except Exception as e:
                        st.error(str(e))

            # --- HASH GENERATOR ---
            elif selected_tool_slug == "hash-generator":
                hash_mode = st.radio("Input Source", ["Plaintext Input", "File Upload"], horizontal=True)
                raw_bytes = b""
                if hash_mode == "Plaintext Input":
                    txt_input = st.text_area("Enter text to hash", value="CyberForge Cybersecurity Workspace")
                    raw_bytes = txt_input.encode("utf-8")
                else:
                    uploaded = st.file_uploader("Upload file for checksum generation")
                    if uploaded:
                        raw_bytes = uploaded.read()
                
                if raw_bytes:
                    hashes = sec_tools.hash_data(raw_bytes)
                    for algo, digest in hashes.items():
                        st.write(f"**{algo}** ({len(digest)*4} bits)")
                        st.code(digest, language="text")
                    
                    st.divider()
                    st.subheader("🔍 Checksum Comparator")
                    compare_input = st.text_input("Paste expected hash to verify match:")
                    if compare_input:
                        cleaned_c = compare_input.strip().lower()
                        match = any(cleaned_c == d.lower() for d in hashes.values())
                        if match:
                            st.success("✅ Checksum Verified: Input matches generated hash!")
                        else:
                            st.error("❌ Checksum Mismatch: Hash does not match.")

            # --- PASSWORD STRENGTH ANALYZER ---
            elif selected_tool_slug == "password-strength":
                pw_input = st.text_input("Enter Password to Test", type="password", placeholder="Type a password...")
                res = sec_tools.analyze_password(pw_input)
                
                sc_col1, sc_col2 = st.columns([1, 2])
                with sc_col1:
                    st.metric("Strength Score", f"{res['score']}/100", res['label'])
                    st.write(f"**Entropy:** `{res['entropyBits']} bits`")
                    st.write(f"**Character Pool Size:** `{res['poolSize']}`")
                
                with sc_col2:
                    st.write("### Character Composition")
                    p1, p2, p3, p4 = st.columns(4)
                    p1.write("Lowercase" if res.get("has_lower") else "❌ No Lower")
                    p2.write("Uppercase" if res.get("has_upper") else "❌ No Upper")
                    p3.write("Numbers" if res.get("has_digit") else "❌ No Digits")
                    p4.write("Symbols" if res.get("has_symbol") else "❌ No Symbols")

                    if res["issues"]:
                        st.write("### ⚠️ Security Flags")
                        for iss in res["issues"]:
                            st.warning(iss)
                    
                    st.write("### 💡 Recommendations")
                    for rec in res["recommendations"]:
                        st.info(rec)

            # --- JWT DECODER ---
            elif selected_tool_slug == "jwt-decoder":
                sample_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggRm9yZ2UiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4zC10k7l1qC05r1-dummy-signature"
                jwt_in = st.text_area("Paste JWT (JSON Web Token)", value=sample_jwt, height=120)
                if jwt_in:
                    try:
                        res = sec_tools.decode_jwt(jwt_in)
                        j1, j2 = st.columns(2)
                        with j1:
                            st.subheader("Header")
                            st.json(res["header"])
                        with j2:
                            st.subheader("Payload Claims")
                            st.json(res["payload"])
                        
                        st.write("### Token Metadata")
                        st.write(f"- **Issued At:** `{res['issuedAt']}`")
                        st.write(f"- **Expires At:** `{res['expiresAt']}`")
                        if res["isExpired"]:
                            st.error("⚠️ Token has EXPIRED.")
                        else:
                            st.success("✅ Token is currently active / not expired.")
                        st.caption("ℹ️ Note: Decoding displays payload claims but does NOT verify signature authenticity.")
                    except Exception as e:
                        st.error(str(e))

            # --- JSON FORMATTER ---
            elif selected_tool_slug == "json-formatter":
                sample_json = '{"project":"CyberForge","active":true,"tools":["subnet","jwt","exif"],"version":1.0}'
                json_in = st.text_area("Raw JSON Input", value=sample_json, height=150)
                indent_opt = st.selectbox("Indentation", [2, 4], index=0)
                if json_in:
                    res = dev_tools.format_json(json_in, indent_opt)
                    if res["valid"]:
                        st.success(f"✅ Valid JSON ({res['type']})")
                        out_tab1, out_tab2 = st.tabs(["Formatted (Prettified)", "Minified"])
                        with out_tab1:
                            st.code(res["formatted"], language="json")
                        with out_tab2:
                            st.code(res["minified"], language="json")
                    else:
                        st.error(f"❌ Syntax Error: {res['error']} (Line {res['line']}, Col {res['col']})")

            # --- ENCODING TOOLKIT ---
            elif selected_tool_slug == "encoding-toolkit":
                enc_scheme = st.selectbox("Encoding Scheme", ["base64", "url", "html", "hex"])
                enc_mode = st.radio("Action", ["Encode", "Decode"], horizontal=True)
                enc_input = st.text_area("Input Text", value="CyberForge Security Toolkit 2026")
                
                if enc_input:
                    try:
                        if enc_mode == "Encode":
                            output_text = dev_tools.encode_data(enc_input, enc_scheme)
                        else:
                            output_text = dev_tools.decode_data(enc_input, enc_scheme)
                        
                        st.write("### Result")
                        st.code(output_text, language="text")
                    except Exception as e:
                        st.error(str(e))

            # --- EXIF VIEWER ---
            elif selected_tool_slug == "exif-viewer":
                uploaded_img = st.file_uploader("Upload Image (JPEG, TIFF, PNG)", type=["jpg", "jpeg", "tiff", "png"])
                if uploaded_img:
                    try:
                        img_bytes = uploaded_img.read()
                        res = for_tools.parse_exif(img_bytes)
                        st.image(uploaded_img, caption=f"Uploaded Image ({res['dimensions']})", width=350)
                        
                        if res["hasData"]:
                            e1, e2 = st.columns(2)
                            with e1:
                                st.subheader("📷 Camera & Lens")
                                if res["camera"]:
                                    for k, v in res["camera"].items():
                                        st.write(f"- **{k.capitalize()}:** {v}")
                                else:
                                    st.caption("No camera make/model found.")
                                
                                st.subheader("⏱️ Timestamps")
                                if res["timestamps"]:
                                    for k, v in res["timestamps"].items():
                                        st.write(f"- **{k}:** {v}")
                            
                            with e2:
                                st.subheader("⚙️ Capture Settings")
                                if res["settings"]:
                                    for k, v in res["settings"].items():
                                        st.write(f"- **{k}:** {v}")
                                
                                if res["gps"]:
                                    st.subheader("📍 GPS Location")
                                    st.write(f"**Latitude:** `{res['gps']['latitude']}`")
                                    st.write(f"**Longitude:** `{res['gps']['longitude']}`")
                                    st.markdown(f"[Open in OpenStreetMap](https://www.openstreetmap.org/?mlat={res['gps']['latitude']}&mlon={res['gps']['longitude']}#map=15/{res['gps']['latitude']}/{res['gps']['longitude']})")
                        else:
                            st.info("No EXIF metadata found in this image (it may have been stripped).")
                    except Exception as e:
                        st.error(str(e))

            # --- FILE SIGNATURE ANALYZER ---
            elif selected_tool_slug == "file-signature-analyzer":
                uploaded_file = st.file_uploader("Upload any file to inspect Magic Bytes")
                if uploaded_file:
                    f_bytes = uploaded_file.read()
                    res = for_tools.analyze_file_signature(f_bytes, uploaded_file.name)
                    
                    st.write(f"**File Name:** `{res['filename']}` ({res['sizeBytes']:,} bytes)")
                    st.write(f"**Header Magic Bytes (Hex):** `{res['firstBytesHex']}`")
                    
                    if res["detected"]:
                        st.success(f"Detected File Type: **{res['detected']['type']}**")
                        if res["mismatch"]:
                            st.error(f"🚨 Extension Mismatch Warning! Stated extension `.{res['declaredExtension']}` does not match detected format `.{'/'.join(res['detected']['extensions'])}`.")
                        else:
                            st.success(f"✅ Extension `.{res['declaredExtension']}` matches detected binary format.")
                    else:
                        st.warning("Unknown file signature. Binary bytes do not match known format catalog.")

            # --- EMAIL HEADER ANALYZER ---
            elif selected_tool_slug == "email-header-analyzer":
                sample_email = """Delivered-To: recipient@example.com
Received: by mail.example.com with SMTP id xyz; Fri, 11 Sep 2026 12:00:00 +0000
Authentication-Results: mail.example.com; spf=pass dkim=pass dmarc=pass
From: security-alert@github.com
To: recipient@example.com
Subject: New login from unrecognized device
Date: Fri, 11 Sep 2026 11:59:50 +0000
Message-ID: <12345678@github.com>"""
                raw_mail = st.text_area("Paste Raw Email Header Block", value=sample_email, height=180)
                if raw_mail:
                    try:
                        res = for_tools.analyze_email_headers(raw_mail)
                        st.write("### Message Overview")
                        st.write(f"- **From:** `{res['from']}`")
                        st.write(f"- **To:** `{res['to']}`")
                        st.write(f"- **Subject:** `{res['subject']}`")
                        st.write(f"- **Date:** `{res['date']}`")
                        
                        st.write("### Authentication Check")
                        a1, a2, a3 = st.columns(3)
                        a1.metric("SPF", res["spf"] or "N/A")
                        a2.metric("DKIM", res["dkim"] or "N/A")
                        a3.metric("DMARC", res["dmarc"] or "N/A")

                        if res["receivedChain"]:
                            with st.expander("📬 Received Hop Routing Chain"):
                                for idx, hop in enumerate(res["receivedChain"]):
                                    st.write(f"**Hop {idx+1}:** {hop}")
                    except Exception as e:
                        st.error(str(e))

            # --- HTTP HEADER ANALYZER ---
            elif selected_tool_slug == "http-header-analyzer":
                target_http = st.text_input("Target URL", value="https://cloudflare.com")
                if st.button("Inspect HTTP Headers", use_container_width=True) or target_http:
                    with st.spinner("Fetching response headers..."):
                        try:
                            res = osint_tools.analyze_http_headers(target_http)
                            st.write(f"**Status:** `{res['status']} {res['statusText']}` | **Destination:** `{res['finalUrl']}`")
                            
                            st.subheader("Security Header Compliance")
                            for sh in res["securityEvaluation"]:
                                col_x, col_y = st.columns([1, 2])
                                with col_x:
                                    if sh["present"]:
                                        st.success(f"✅ {sh['header']}")
                                    else:
                                        st.error(f"❌ {sh['header']}")
                                with col_y:
                                    if sh["present"]:
                                        st.caption(f"Value: `{sh['value']}`")
                                    st.caption(sh["explanation"])
                            
                            with st.expander("All Raw Response Headers"):
                                st.json(res["headers"])
                        except Exception as e:
                            st.error(str(e))

        # --- TAB 2: EDUCATIONAL EXPLANATION ---
        with edu_tab:
            st.markdown(
                f"""
                <div class="cf-card">
                    <h3 style="color: #E83E83;">🔍 What it means</h3>
                    <p style="color: #D4D4D8; line-height: 1.6;">{tool_meta['whatItMeans']}</p>
                </div>
                <div class="cf-card">
                    <h3 style="color: #E83E83;">🎯 Why it matters</h3>
                    <p style="color: #D4D4D8; line-height: 1.6;">{tool_meta['whyItMatters']}</p>
                </div>
                <div class="cf-card">
                    <h3 style="color: #E83E83;">⚙️ How it works</h3>
                    <p style="color: #D4D4D8; line-height: 1.6;">{tool_meta['howItWorks']}</p>
                </div>
                """,
                unsafe_allow_html=True,
            )
