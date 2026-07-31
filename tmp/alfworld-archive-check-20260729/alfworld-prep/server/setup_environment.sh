#!/usr/bin/env bash
# 不申请 GPU；仅在上传包已经解压到 $HOME/run/alfworld-baseline 后执行。
set -euo pipefail

RUN_ROOT="${RUN_ROOT:-$HOME/run}"
PROJECT_ROOT="${PROJECT_ROOT:-$RUN_ROOT/alfworld-baseline}"
PYTHON_BIN="${PYTHON_BIN:-python3}"

case "$PROJECT_ROOT" in
  "$HOME/run"/*) ;;
  *) echo "拒绝：PROJECT_ROOT 必须位于 \$HOME/run，当前为 $PROJECT_ROOT" >&2; exit 2 ;;
esac

test -f "$PROJECT_ROOT/manifest.json"
test -f "$PROJECT_ROOT/assets/alfworld-0.4.2-py3-none-any.whl"
"$PYTHON_BIN" - <<'PY'
import sys
if sys.version_info < (3, 9):
    raise SystemExit("ALFWorld 0.4.2 需要 Python 3.9 或更高版本")
print("Python:", sys.version)
PY

"$PYTHON_BIN" -m venv "$PROJECT_ROOT/venv"
source "$PROJECT_ROOT/venv/bin/activate"
python -m pip install --no-deps --no-index --find-links "$PROJECT_ROOT/assets" 'alfworld==0.4.2'

cat <<'EOF'
已安装离线 ALFWorld wheel；尚未安装第三方依赖，也没有下载运行数据。
如已准备经过审计的本地 wheelhouse，请显式使用：
  python -m pip install --no-index --find-links <wheelhouse> -r source/requirements-full.txt
不要在本机已知无法访问 GitHub 的服务器上运行 alfworld-download。
EOF
