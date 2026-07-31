# Agent 选题形成工作区

普通阅读只打开 `交付包/`：

1. `Agent领域选题汇报.pptx`：导师讨论用的 11 页汇报。
2. `Agent研究选题包.pdf`：完整领域地图、缺口、候选方向和最小实验提案。
3. `研究决策记录.md`：保留 Codex 建议、支持证据、反证/不确定性；“本人选择”和“本人一行理由”只由本人填写。

两个持续维护的证据附件：

- `report/paper_summaries.pdf`：唯一正式累计论文证据卡报告。
- `datasets/数据集总览.md`：唯一人工阅读的实验资源总览，包含数据集、任务环境、模拟器与评测工具的能力、任务形式、中文指标、获取入口、许可和候选方向关联。

## 工作流

`/paper <主题> <数量>` 中的数量指最终保留并生成完整证据卡的论文数，默认 36。每次都同步：

检索池 → 数据集与环境登记 → 论文证据卡 → 方向地图 → 缺口清单 → 3 个候选方向 → 研究决策记录 → 研究包 PDF 与汇报 PPT。

- 接口检索为主，Google Scholar 人工覆盖核验为辅，不自动抓取 Scholar。
- 正式 Full/Regular 论文、综述/基准和预印本严格分层；Findings、Workshop、Short Paper 不冒充 CCF-A 主会正式论文。
- 每篇证据卡固定记录痛点、核心主张、方法子概念、环境/数据、基线、中文指标、结果、局限、失败条件、可继续问题、角色、证据层级、发表状态、置信度与来源链接。
- 没有可确认指标时只写“无”。自然中文表达，不生成中英括号互译或 `Bilingual Notes`。
- PDF/PPT 不显示工作流执行日期或生成时间。
- 所有跨论文判断显式标为“推测”；候选是论证，不是假装确定结论。

## 目录

| 路径 | 用途 | 一般是否直接打开 |
| --- | --- | --- |
| `交付包/` | 三个面向本人和导师的交付物 | 是 |
| `report/paper_summaries.pdf` | 累计论文证据卡 | 是 |
| `datasets/数据集总览.md` | 实验资源总览与下载入口 | 是 |
| `选题形成/` | 研究状态、论文证据卡、方向地图、缺口和候选的结构化源文件 | 审计时 |
| `pdfs/` | 合法开放论文全文 | 按需 |
| `notes/extracted/` | 从全文提取的文本 | 否 |
| `notes/` | 当前批次、历史总结和数据集关系 | 否 |
| `index/` | 宽检索池、每轮候选与缓存 | 复查检索时 |
| `datasets/index/datasets.json` | 保留版本、校验和下载状态的机器账本 | 否 |
| `datasets/raw/` | 合法下载且已校验的原始文件；不自动解压 | 否 |

不要删除 `notes/`、`index/`、`datasets/index/` 或缓存。它们用于去重、证据追溯与低用量重跑；旧版 PDF 也保留，但只有 `report/paper_summaries.pdf` 是当前正式论文报告。

## 服务器边界

- 远端实验文件只放 `$HOME/run`，对应 `/data/run01/scxk701`；禁止使用系统 `/run`。
- 个人主目录仅 1 GiB，不能存模型、数据或实验产物；`$HOME/run` 的可写配额为 300 GiB。
- 用户已持续授权本项目使用计费 GPU；可按实验需要直接提交 `srun`、`sbatch` 或交互式 GPU 作业，无须逐作业再次等待确认。
- 每次提交仍须记录队列、卡型、卡数、硬时限、预计最高费用、提交命令和实验目的。默认优先使用满足任务的最小资源，主动避免空闲占卡、失控重试和无硬时限作业。
- 已确认测试原价：`gpu_4090` 为 3.6 元/卡时，`gpu_5090` 为 4.5 元/卡时；`hp_4090` 可在排队或时效需要时使用。费用本身不构成阻塞，但明显超出当前实验范围或无法估算上限的作业仍需先收窄方案。

## 关键命令

```powershell
$py = "C:\Users\xyn\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
& $py "C:\Users\xyn\.codex\skills\paper\scripts\finalize_paper_run.py" "<candidate-json>" --workspace "C:\Users\xyn\Documents\论文\paper-workspace" --max-bytes 524288000
```

`finalize_paper_run.py` 会重建论文报告、实验资源总览和选题形成结构。`HANDOFF.md` 是跨窗口项目记忆，必须保留。
