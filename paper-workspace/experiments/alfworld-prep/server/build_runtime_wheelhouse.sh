#!/usr/bin/env bash
set -euo pipefail

module purge >/dev/null 2>&1
module load deepmdkit/v3.2.0b0_pytorch

PYTHON_BIN="/data/apps/miniforge3/25.11.0-1/envs/deepmd_v3.2.0b0_pytorch/bin/python"
PROJECT_ROOT="/data/run01/scxk701/alfworld-baseline"
TEXTWORLD_WHEEL="$PROJECT_ROOT/assets/textworld-1.7.0-py3-none-manylinux_2_5_x86_64.manylinux1_x86_64.manylinux_2_17_x86_64.manylinux2014_x86_64.whl"
BUILD_ROOT="/tmp/alfworld-runtime-wheelhouse-20260729-jericho"
WHEEL_DIR="$BUILD_ROOT/wheels"
TEST_TARGET="$BUILD_ROOT/test-target"
LOG_FILE="$BUILD_ROOT/build.log"
STATUS_ROOT="/data/home/scxk701"

if [[ -e "$BUILD_ROOT" ]]; then
  echo "构建目录已存在，拒绝覆盖：$BUILD_ROOT" >&2
  exit 98
fi

mkdir -p "$WHEEL_DIR" "$TEST_TARGET"
exec >"$LOG_FILE" 2>&1

specs=(
  "tatsu==5.8.3"
  "more-itertools"
  "hashids"
  "mementos"
  "prompt-toolkit"
  "pybars3"
  "wcwidth"
  "networkx>=2"
)

all_ok=1
for spec in "${specs[@]}"; do
  safe_name="$(printf '%s' "$spec" | tr '=><.' '____' | tr -cd '[:alnum:]_-')"
  if "$PYTHON_BIN" -m pip wheel \
    --disable-pip-version-check \
    --no-deps \
    --wheel-dir "$WHEEL_DIR" \
    --index-url https://pypi.tuna.tsinghua.edu.cn/simple \
    "$spec"; then
    : >"$STATUS_ROOT/codex_dep_ok_$safe_name"
  else
    : >"$STATUS_ROOT/codex_dep_fail_$safe_name"
    all_ok=0
  fi
done

# TextWorld 在导入阶段还会加载 Jericho；该包及其 NLP 传递依赖由 pip
# 在服务器上按当前 Python 3.12 解析为 wheel，避免把依赖猜写死。
if "$PYTHON_BIN" -m pip wheel \
  --disable-pip-version-check \
  --wheel-dir "$WHEEL_DIR" \
  --index-url https://pypi.tuna.tsinghua.edu.cn/simple \
  "jericho==3.3.1"; then
  : >"$STATUS_ROOT/codex_dep_ok_jericho_3_3_1"
else
  : >"$STATUS_ROOT/codex_dep_fail_jericho_3_3_1"
  all_ok=0
fi

wheel_count="$(find "$WHEEL_DIR" -maxdepth 1 -type f -name '*.whl' | wc -l | tr -d ' ')"
if [[ "$all_ok" != 1 ]]; then
  : >"$STATUS_ROOT/codex_status_depwheel_FAILED_$wheel_count"
  exit 4
fi

"$PYTHON_BIN" -m pip install \
  --disable-pip-version-check \
  --no-index \
  --find-links "$WHEEL_DIR" \
  --target "$TEST_TARGET" \
  "$TEXTWORLD_WHEEL"

if import_output="$(
  PYTHONPATH="$TEST_TARGET" "$PYTHON_BIN" -c \
    'import textworld; print("TEXTWORLD_IMPORT_OK", textworld.__version__)' 2>&1
)"; then
  printf '%s\n' "$import_output"
  : >"$STATUS_ROOT/codex_status_textworld_import_OK_$wheel_count"
else
  printf '%s\n' "$import_output"
  reason="$(
    printf '%s\n' "$import_output" |
      tail -n 1 |
      tr -cs '[:alnum:]_-' '_' |
      cut -c 1-100
  )"
  : >"$STATUS_ROOT/codex_status_textworld_import_FAIL_$reason"
  exit 5
fi

tar -czf "$BUILD_ROOT/textworld-runtime-wheelhouse.tar.gz" -C "$WHEEL_DIR" .
sha256sum "$WHEEL_DIR"/*.whl "$BUILD_ROOT/textworld-runtime-wheelhouse.tar.gz" \
  >"$BUILD_ROOT/SHA256SUMS"
: >"$STATUS_ROOT/codex_status_depwheel_OK_$wheel_count"
