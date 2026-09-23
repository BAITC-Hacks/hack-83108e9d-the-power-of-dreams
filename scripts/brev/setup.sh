#!/usr/bin/env bash
set -euo pipefail
# Run explicitly on the existing Ubuntu GPU VM; creates no cloud resources.
test -d /data || { echo 'Expected the provisioned disk at /data.' >&2; exit 1; }
if ! python3 -m pip --version >/dev/null 2>&1 || ! dpkg-query -W -f='${Status}' python3-venv 2>/dev/null | grep -q 'install ok installed'; then
  sudo -n apt-get update -qq
  sudo -n env DEBIAN_FRONTEND=noninteractive apt-get install -y python3-pip python3-venv
fi
mkdir -p /data/dreams-gpu
if [ ! -x /data/dreams-gpu/.venv/bin/python ]; then
  python3 -m venv /data/dreams-gpu/.venv
fi
/data/dreams-gpu/.venv/bin/python -m pip install --disable-pip-version-check torch==2.13.0 --index-url https://download.pytorch.org/whl/cu126
/data/dreams-gpu/.venv/bin/python -m pip install --disable-pip-version-check numpy==2.2.6
/data/dreams-gpu/.venv/bin/python -m pip freeze > /data/dreams-gpu/installed-requirements.txt
