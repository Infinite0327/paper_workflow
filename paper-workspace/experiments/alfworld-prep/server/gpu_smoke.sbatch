#!/usr/bin/env bash
# 用户已持续授权本项目使用计费 GPU；依赖、数据和脚本核验完成后可直接提交。
# 默认请求：gpu_4090，1 张卡，15 分钟；按 3.6 元/卡时计，最高费用 0.9 元。
# 目的：只验证文本环境的最小训练链路与失败日志采集，不产生研究结论。
#SBATCH --job-name=alfworld-smoke
#SBATCH --partition=gpu_4090
#SBATCH --gres=gpu:1
#SBATCH --time=00:15:00
#SBATCH --output=/data/run01/scxk701/alfworld-baseline/logs/%x-%j.out
#SBATCH --error=/data/run01/scxk701/alfworld-baseline/logs/%x-%j.err

set -euo pipefail
export RUN_ROOT="$HOME/run"
export PROJECT_ROOT="$RUN_ROOT/alfworld-baseline"
export ALFWORLD_RUN="$PROJECT_ROOT"
export ALFWORLD_DATA="$PROJECT_ROOT/data"
mkdir -p "$PROJECT_ROOT/logs" "$PROJECT_ROOT/outputs"

module purge
module load deepmdkit/v3.2.0b0_pytorch

PYTHON_BIN="/data/apps/miniforge3/25.11.0-1/envs/deepmd_v3.2.0b0_pytorch/bin/python"
ALFWORLD_WHEEL="$PROJECT_ROOT/assets/alfworld-0.4.2-py3-none-any.whl"
TEXTWORLD_WHEEL="$PROJECT_ROOT/assets/textworld-1.7.0-py3-none-manylinux_2_5_x86_64.manylinux1_x86_64.manylinux_2_17_x86_64.manylinux2014_x86_64.whl"
RUNTIME_WHEELHOUSE="$PROJECT_ROOT/assets/textworld-runtime-wheelhouse.tar.gz"
JOB_TMP_ROOT="${TMPDIR:-/tmp}/alfworld-smoke-${SLURM_JOB_ID:-manual}"
JOB_DEPS="$JOB_TMP_ROOT/pydeps"
JOB_WHEELS="$JOB_TMP_ROOT/wheels"

for required in \
  "$PYTHON_BIN" \
  "$ALFWORLD_WHEEL" \
  "$TEXTWORLD_WHEEL" \
  "$RUNTIME_WHEELHOUSE" \
  "$PROJECT_ROOT/data/smoke_data_manifest.json"; do
  if [[ ! -e "$required" ]]; then
    echo "缺少运行资产：$required" >&2
    exit 2
  fi
done

mkdir -p "$JOB_DEPS" "$JOB_WHEELS"
tar -xzf "$RUNTIME_WHEELHOUSE" -C "$JOB_WHEELS"
mapfile -t dependency_wheels < <(find "$JOB_WHEELS" -maxdepth 1 -type f -name '*.whl' -print | sort)
if [[ "${#dependency_wheels[@]}" -eq 0 ]]; then
  echo "依赖 wheelhouse 为空：$RUNTIME_WHEELHOUSE" >&2
  exit 3
fi

"$PYTHON_BIN" -m pip install \
  --disable-pip-version-check \
  --no-deps \
  --no-index \
  --target "$JOB_DEPS" \
  "$TEXTWORLD_WHEEL" \
  "${dependency_wheels[@]}"

export PYTHONPATH="$JOB_DEPS:$ALFWORLD_WHEEL${PYTHONPATH:+:$PYTHONPATH}"
"$PYTHON_BIN" "$PROJECT_ROOT/server/verify_bundle.py" "$PROJECT_ROOT"
nvidia-smi
"$PYTHON_BIN" - <<'PY'
import alfworld
import textworld
import torch
import yaml

print("ALFWorld:", alfworld.__version__)
print("TextWorld:", textworld.__version__)
print("PyTorch:", torch.__version__)
print("CUDA available:", torch.cuda.is_available())
if not torch.cuda.is_available():
    raise SystemExit("计算节点未向作业暴露 CUDA GPU")
print("GPU:", torch.cuda.get_device_name(0))
PY

"$PYTHON_BIN" \
  "$PROJECT_ROOT/source/scripts/train_dagger.py" \
  "$PROJECT_ROOT/configs/smoke_textworld.yaml"
