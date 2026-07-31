#!/usr/bin/env python3
"""只读校验上传包；不联网、不申请 GPU。"""
from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from pathlib import Path


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]).resolve()
    manifest_path = root / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    wheel = root / manifest["wheel"]["path"]
    actual_hash = sha256(wheel)
    if actual_hash != manifest["wheel"]["sha256"]:
        raise SystemExit(f"wheel 哈希不匹配：{actual_hash}")
    source = root / "source"
    if (source / ".git").exists():
        commit = subprocess.check_output(["git", "-C", str(source), "rev-parse", "HEAD"], text=True).strip()
    else:
        commit = (root / "source-commit.txt").read_text(encoding="utf-8").strip()
    if commit != manifest["repository"]["commit"]:
        raise SystemExit(f"源码提交不匹配：{commit}")
    version_line = (source / "alfworld" / "info.py").read_text(encoding="utf-8").splitlines()[0]
    if "0.4.2" not in version_line:
        raise SystemExit(f"源码版本不匹配：{version_line}")
    print("校验通过：ALFWorld 0.4.2 wheel、源码提交与版本一致。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
