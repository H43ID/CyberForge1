"""
CyberForge Streamlit Cloud Entry Point
Executes main app.py
"""

import runpy
import sys
from pathlib import Path

# Ensure root directory is in sys.path
root_dir = Path(__file__).resolve().parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

# Execute app.py
runpy.run_path(str(root_dir / "app.py"), run_name="__main__")
