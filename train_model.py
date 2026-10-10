#!/usr/bin/env python3
"""Root wrapper for train_model.py."""
import sys
from pathlib import Path

# Add server directory to path
server_dir = Path(__file__).resolve().parent / "server"
if str(server_dir) not in sys.path:
    sys.path.insert(0, str(server_dir))

from train_model import main

if __name__ == "__main__":
    main()
