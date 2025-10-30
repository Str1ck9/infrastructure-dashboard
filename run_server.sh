#!/usr/bin/env bash
set -euo pipefail
cd "$HOME/dashboard"
echo "Serving ~/dashboard at http://localhost:8088"
python3 -m http.server 8088
