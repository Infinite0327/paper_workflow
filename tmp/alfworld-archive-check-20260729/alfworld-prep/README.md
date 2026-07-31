# ALFWorld 0.4.2：最小可行性准备包

本目录为“状态条件化步骤级信用分配”候选方向准备的 ALFWorld 文本环境基线包。它只用于验证环境、任务分层和失败案例采集链路；不能据此宣称复现了论文方法或获得了有统计效力的研究结论。

## 已固定的来源

- 官方仓库：<https://github.com/alfworld/alfworld>，固定 tag `0.4.2`、提交 `1558ba46d078279ecb4c5d33a6cdffc96714a2d2`。
- 官方 PyPI wheel：`alfworld-0.4.2-py3-none-any.whl`，SHA-256 为 `29affbea28f6041d1e8516ed3efd6b55becd52cfca4fb9dd5c75b9d6b8a56c2f`。
- 软件许可：仓库和 PyPI 包均声明为 MIT。ALFWorld 的下载器还会取得 TextWorld、Fast Downward 和 ALFRED 相关资源；这些资源的许可与访问条件必须在实际取得时逐项确认，不能仅凭本目录中的代码推定。

## 目录与边界

- `source/`：官方仓库的精确源码快照；不修改其中内容。
- `assets/`：官方 PyPI 的小型 wheel，不含模型、训练数据或检测器。
- `configs/smoke_textworld.yaml`：只含两个训练任务、十个 episode 的固定文本环境冒烟配置。
- `server/`：待上传至服务器的环境检查、CPU 诊断和待审批 GPU 作业模板。
- `manifest.json`：版本、来源、哈希及已知限制。

远端所有文件必须置于 `$HOME/run/alfworld-baseline`（即 `/data/run01/scxk701/alfworld-baseline`），不得使用系统 `/run` 或容量仅 1 GiB 的主目录。服务器已知无法访问 GitHub 与 Hugging Face 的 HTTPS，因此不要在远端运行 `alfworld-download`；如需完整环境资产，先在本机逐项取得、核验许可与哈希后再上传。

## 仅允许的下一步

1. 在本机运行 `server/verify_bundle.py`，然后用 `build_upload_bundle.ps1` 生成压缩包。
2. 使用用户可用的安全上传方式传到 `$HOME/run`；上传后可运行 `server/setup_environment.sh` 和 `server/run_cpu_diagnostics.sh`。两者不会申请 GPU。
3. `server/gpu_smoke.sbatch` 仅是审批模板。任何 `sbatch`、`srun` 或交互式 GPU 分配前，都必须先向用户确认队列、卡型、卡数、时限、最高费用、命令和实验目的。

当前包不含完整 ALFWorld 运行数据，故 CPU 诊断预期会报告“数据资产未准备”而不是伪造成功。该阻断是可追溯的，不是环境已复现的证据。
