#!/usr/bin/env bash
# 不申请 GPU、不训练、不下载；只诊断包完整性、Python 依赖和数据路径。
set -euo pipefail

RUN_ROOT="${RUN_ROOT:-$HOME/run}"
PROJECT_ROOT="${PROJECT_ROOT:-$RUN_ROOT/alfworld-baseline}"
case "$PROJECT_ROOT" in
  "$HOME/run"/*) ;;
  *) echo "拒绝：PROJECT_ROOT 必须位于 \$HOME/run" >&2; exit 2 ;;
esac

source "$PROJECT_ROOT/venv/bin/activate"
python "$PROJECT_ROOT/server/verify_bundle.py" "$PROJECT_ROOT"
python - <<'PY'
import importlib.util
for name in ("alfworld", "yaml", "textworld", "torch"):
    print(f"{name}: {'可用' if importlib.util.find_spec(name) else '缺失'}")
PY

DATA_DIR="${ALFWORLD_DATA:-$PROJECT_ROOT/data}"
required=(
  "$DATA_DIR/json_2.1.1/train"
  "$DATA_DIR/logic/alfred.pddl"
  "$DATA_DIR/logic/alfred.twl2"
)
missing=0
for path in "${required[@]}"; do
  if [[ -e "$path" ]]; then
    echo "数据项存在：$path"
  else
    echo "数据项缺失：$path" >&2
    missing=1
  fi
done
if [[ "$missing" -ne 0 ]]; then
  echo "诊断完成：运行数据尚未准备；未启动环境或训练。" >&2
  exit 3
fi
echo "诊断完成：数据路径存在。此脚本没有启动任务环境或训练。"
