#!/usr/bin/env bash
# 此文件是“待审批模板”：严禁在未获得本轮明确批准前提交。
# 建议请求：gpu_4090，1 张卡，15 分钟；最高费用 0.9 元。
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
source "$PROJECT_ROOT/venv/bin/activate"
python "$PROJECT_ROOT/server/verify_bundle.py" "$PROJECT_ROOT"
python "$PROJECT_ROOT/source/scripts/train_dagger.py" "$PROJECT_ROOT/configs/smoke_textworld.yaml"
