# `/paper` 工作流交接文档

本文件是跨 Codex 窗口的项目记忆，必须保留并随流程变化同步更新。
最后核对：2026-07-29。

> **当前 GPU 约束优先级提示（2026-07-29）**：用户已授予本项目计费 GPU
> 持续授权，可直接提交有硬时限、可审计且与实验目的相称的 GPU 作业，无须逐作业
> 再次等待确认。此前段落中的“待审批”“须再次确认”“费用阻塞”和 `hp_4090`
> 单独批准要求均为历史状态，已由第 21 节覆盖。

## 1. 当前唯一规则

- `/paper 主题 数量` 中的数量同时是检索目标数和完整结构化总结目标数。
- 所有最终保留论文使用完全相同的八个字段：
  1. `basic_info`
  2. `what_why`
  3. `method`
  4. `innovation`
  5. `experiments`
  6. `metrics`
  7. `reliability_limits`
  8. `reading_guide`
- 排序只决定阅读顺序，不能让后排论文退化成候选卡片或一句话简介。
- 有合法开放全文时，先下载并提取全文，再总结。
- 无法合法取得全文时，仍写齐八个字段，但必须在证据与局限中注明只依据正式元数据或摘要，降低结论置信度，不得猜测细节。
- `what_why` 和 `method` 先写总体结论，再列出 2–8 个来自正文小标题、图表或方法层次的主要子概念。
- 指标使用中文；论文没有指标或现有证据无法确认时，只写“无”。
- 总结以自然中文为主。禁止机械生成英文后接中文括号解释，或中文后接英文括号解释。不得出现 `Bilingual Notes`。
- 正式 PDF 不显示工作流执行时间、生成时间或追加日期。
- 正式 PDF 不含单独的候选列表或候选摘要页；每篇论文都使用相同标题层级、字段和排版。

## 2. 固定工作流

1. 解析主题和数量。
2. 以 OpenAlex、Crossref、arXiv 等接口检索为主，按持久标识和规范化标题去重。
3. 对每轮结果生成 Google Scholar 人工校验入口；Scholar 用于检查近期遗漏、高被引关联论文和版本信息，不进行自动抓取。
4. 对所有候选运行数据集发现和登记。
5. 排除明显离题项并尽量补足到用户要求数量；为保留论文排序。
6. 尝试下载每篇保留论文的合法开放 PDF，随后提取正文。
7. 为每篇保留论文写齐八个字段。
8. 将本轮总结去重后追加到累计历史，并重建正式 PDF。
9. 验证字段数量、中文字体、分页、链接、日期禁用规则和双语括号禁用规则。

Google Scholar 不能稳定自动化。遇到验证码或登录时由用户人工处理，或把结果链接、PDF 链接、BibTeX 交回 Codex 合并去重。本轮 40 篇是在 Scholar 人工校验规则正式固定前产生的，尚未补做完整 Scholar 人工审计；后续窗口不得把它误记为已完成。

## 3. 当前路径

- 项目根目录：`C:\Users\xyn\Documents\论文`
- 正式技能：`C:\Users\xyn\.codex\skills\paper`
- 主工作区：`C:\Users\xyn\Documents\论文\paper-workspace`
- 正式报告：`C:\Users\xyn\Documents\论文\paper-workspace\report\paper_summaries.pdf`
- 当前候选记录：`C:\Users\xyn\Documents\论文\paper-workspace\index\candidates_llm-agents-recent-research-directions-memory-planning-tool-use-multi-agent-compu.json`
- 当前结构化总结：`C:\Users\xyn\Documents\论文\paper-workspace\notes\summaries.json`
- 累计总结历史：`C:\Users\xyn\Documents\论文\paper-workspace\notes\summary_history.json`
- 论文索引和全文状态：`C:\Users\xyn\Documents\论文\paper-workspace\index\papers.json`
- 数据集人工入口：`C:\Users\xyn\Documents\论文\paper-workspace\datasets\数据集总览.md`
- 数据集机器索引：`C:\Users\xyn\Documents\论文\paper-workspace\datasets\index\datasets.json`

`paper_summaries.pdf` 是唯一当前正式报告。报告目录中的 `paper_summaries_clean.pdf`、`paper_summaries_cumulative.pdf` 和 `paper_summaries_pending_replace.pdf` 是旧版或中间版，本轮没有擅自删除。

## 4. 当前 40 篇批次状态

查询主题：

`LLM agents recent research directions memory planning tool use multi-agent computer use evaluation safety efficiency`

- 候选记录包含 40 篇。
- `summaries.json` 包含 40 篇，全部具有八个固定字段。
- 23 篇取得了合法开放 PDF 并完成正文提取。
- 17 篇只能依据正式元数据或摘要，报告中已明确降低证据置信度。
- 20 篇有可确认的中文指标总结；20 篇指标写“无”。
- 当前累计历史和正式 PDF 含 45 篇唯一论文：此前 5 篇，加上本轮 40 篇中的 39 篇新论文；其中 1 篇与历史重复，沿用已有详细总结，不重复插入。
- 正式 PDF 当前为 53 页，不包含候选卡片。
- 本轮 40 篇中有 14 篇可确认使用、训练或发布了数据集，合计登记 19 个数据集或基准入口；加上历史 SafeAgentBench，数据集总览当前共 20 项。

本轮差距产生的原因已经修正：旧流程把检索数量当作候选池，只给前 3–5 篇完整字段，其他论文进入简略候选列表。现在数量已改为完整总结数量，排序不再改变输出结构。

## 5. 数据集规则

命令：

```powershell
$py = "C:\Users\xyn\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
& $py "C:\Users\xyn\.codex\skills\paper\scripts\finalize_paper_run.py" "<candidate-json>" --workspace "C:\Users\xyn\Documents\论文\paper-workspace" --max-bytes 524288000
```

- 每次 `/paper` 必须同时重建 `report/paper_summaries.pdf` 和 `datasets/数据集总览.md`；只更新其中一个不算完成。
- 对每篇候选执行发现，不等待人工精读选择。
- 优先使用论文中的 DOI、arXiv 标识、元数据、摘要、开放全文、代码仓库和明确数据链接；全文阅读后必须再执行第二遍收集。
- `notes/dataset_mentions.json` 记录论文发布、训练使用或实验使用的数据集，以及用途领域、关键词、下载入口、许可、访问限制和正文证据。仅在相关工作中引用的数据集不得冒充实验使用。
- 数据公开、无需登录或接受条款、许可明确、总大小已知且不超过 500 MiB 时才自动下载。
- 大于 500 MiB、大小未知、许可未知、受限、需登录或需同意条款时只登记。
- 下载到 `datasets/raw/<dataset-id>/`；先写临时文件，成功后计算 SHA-256，再原子移动。不自动解压。
- 按持久标识去重，缓存接口响应，跳过已验证文件。
- 候选论文的最终数据集状态只能是 `downloaded`、`metadata_only`、`needs_review`、`none_found` 或 `error`。
- 人工阅读只打开 `datasets/数据集总览.md`；缓存和 JSON 用于去重、重跑与审计，不要求用户逐项阅读。

当前总览共 20 项，包括 OSWorld、HAJailBench、HealthAdminBench、WikiText-2、MAFBench、MemoryAgentBench、AgentsNet、GSM8K、ALFWorld、WebShop、TravelPlanner、InterCode-SQL、SMAC、SafeRAG、Multi-Agent MuJoCo 等。20 项均为 `metadata_only`：部分需要按仓库说明安装环境，其余因许可、大小或公开性无法同时确认而未自动下载。下载入口和用途见数据集总览。

## 6. 工作区目录用途

| 目录或文件 | 用途 | 用户是否通常需要打开 |
| --- | --- | --- |
| `report/paper_summaries.pdf` | 唯一正式累计总结 | 是 |
| `datasets/数据集总览.md` | 数据集用途、关键词、许可和下载入口 | 是 |
| `pdfs/` | 合法下载的论文原文 | 按需 |
| `notes/extracted/` | 从 PDF 提取的正文文本 | 否，供总结与追溯 |
| `notes/summaries.json` | 当前批次的结构化总结 | 按需审计 |
| `notes/dataset_mentions.json` | 全文确认的数据集、用途和下载入口 | 按需审计 |
| `notes/summary_history.json` | 累计总结和去重历史 | 否 |
| `index/candidates_*.json` | 每轮检索原始记录 | 按需复查检索 |
| `index/papers.json` | PDF 下载和正文提取状态 | 否 |
| `datasets/index/datasets.json` | 数据集去重、校验和下载状态 | 否 |
| `index/.cache/`、`datasets/.cache/` | 降低重复联网和 Codex 用量 | 否 |

这些内部文件支持可追溯、断点续跑和低用量重跑，不应在不理解依赖关系时删除。

## 7. 关键脚本

- `search_papers.py`：接口检索、去重、候选记录和 Scholar 校验入口。
- `collect_datasets.py`：数据集发现、登记、保守下载和校验。
- `build_dataset_catalog.py`：把机器索引重建为唯一的人工数据集总览。
- `finalize_paper_run.py`：`/paper` 的强制收尾入口；同时更新数据集总览和总结 PDF。
- `download_open_pdf.py`：下载合法开放论文 PDF。
- `extract_pdf.py`：提取 PDF 文本并更新论文索引。
- `build_report.py`：只从八字段结构化总结构建累计正式 PDF，不再渲染候选卡片；任一字段缺失时直接停止，禁止自动降级成简略格式。

总结规范：

- `C:\Users\xyn\.codex\skills\paper\SKILL.md`
- `C:\Users\xyn\.codex\skills\paper\references\summary-template.md`

## 8. 清理与保留边界

2026-07-27 已永久删除：

- `C:\Users\xyn\Documents\论文\paper-skill-stage`
- `C:\Users\xyn\Documents\论文\paper-workspace-test`
- `C:\Users\xyn\Documents\论文\paper-workspace-rate-test`

共删除 25 个文件，约 5.34 MB。以下内容必须保留：

- 本 `HANDOFF.md`
- `C:\Users\xyn\Documents\论文\.git`
- 主 `paper-workspace`
- 正式技能 `C:\Users\xyn\.codex\skills\paper`

## 9. 下一窗口执行要求

新窗口先读本文件和正式技能，不要恢复“40 篇候选、只精读 5 篇”的旧逻辑。对新的 `/paper` 请求，用户要求多少篇，就应尽量提供多少篇同字段完整总结；全文证据不足通过 `reliability_limits` 说明，而不是减少字段或改成候选卡片。

本轮仍可补做两项增强：

1. 在用户可操作 Google Scholar 时，对当前 40 篇补做人工 Scholar 审计并替换明显遗漏或误收项。
2. 为 17 篇未取得全文的论文继续寻找合法开放版本；取得正文后更新同一条总结的证据和细节，不新增重复记录。

## 10. 2026-07-29：智能体后训练与自进化 25 篇

本轮请求：`/paper LLM agent post-training agentic reinforcement learning tool use trajectory credit assignment self-improvement reflection experience lifelong learning 25`。

- 已完成 Google Scholar 人工浏览器校验；最终集合按三条主线组织：工具使用的智能体强化学习 10 篇、轨迹信用分配 6 篇、自进化与经验记忆 9 篇。
- 候选定稿：`paper-workspace/index/candidates_llm-agent-post-training-self-evolution-25-final.json`，含 Scholar 审计记录。
- 当前批次 `notes/summaries.json` 已有 25 篇、全部八字段完整；`metrics` 有数值时用中文描述，没有可靠数值时只写 `无`。当前批次没有 `Bilingual Notes`、没有工作流日期文本。
- 已合法下载并提取 16 篇开放 PDF；其余 9 篇因当前网络超时或开放链接不可用，保留官方摘要级总结并在“证据与局限”中标记。不要把它们从 PDF 中删掉。
- 本轮数据集人工记录 17 项，机器索引累计 39 项；正式阅读入口仍是 `datasets/数据集总览.md`。所有记录均为 `metadata_only`，未因许可、大小或访问条件不确定而自动下载。
- 重新构建的正式 `report/paper_summaries.pdf` 为 82 页。已渲染检查开头、当前批次和末页：中文字体、标题、分页、指标段落正常；未在正文加入执行日期。
- 为消除近乎空白的末页，`build_report.py` 正文样式已调整为 9.5pt、14pt 行距、5pt 段后距。
- 验证：`paper` 数据集测试 12/12 通过；新增脚本均通过语法编译。

下次继续这批时，优先重新尝试那 9 篇未下载 PDF 的合法开放地址；下载成功后运行 `extract_pdf.py`、`materialize_agent_learning25.py`、`finalize_paper_run.py`，保持同一 25 篇记录而不重复新增。

## 11. 2026-07-29：导师服务器核验状态

已通过并行超算云网页 SSH 完成只读核验，未提交任何计算作业，当前消费仍为 0。

- 门户登录正常，超算账号为 `scxk701@BSCC-N56R5`。
- 实际分区是“北京超级云计算中心山东分中心 N56R5 分区”，不是导师提供的 N32-H 手册对应分区。N32-H 手册中的 ARM、A100、300 GB 主目录等配置不得直接套用。
- 登录节点为 `ln01`，架构 `x86_64`，系统 Python 为 3.10.12；未发现 Conda。
- 可见 GPU 队列为 `gpu_4090`、`gpu_5090` 和 `hp_4090`。登录提示明确写明 `hp_4090` 为优先队列，价格为 3.6 元/卡时；普通队列价格尚未从门户核实。
- 当前无排队或运行作业。登录节点只允许编辑、编译和提交作业，不得直接运行计算程序。
- 账户页面显示可用金额 200 元，页面折算显示为 2,000 核时；这是 200 元赠送额度，不是 200 小时 GPU 使用时间。GPU 作业按“卡数 × 实际运行时间”形成卡时，SSH 或网页是否登录不决定计费。
- 用户主目录为 `/data/home/scxk701`，主目录本身配额只有 1 GiB；但客服所说的“run 文件夹”实际是 `$HOME/run`，它是指向 `/data/run01/scxk701` 的符号链接。2026-07-29 已实测该目录为独立 300 GiB JuiceFS、可写且当前几乎为空，临时写入与删除测试通过。注意必须使用 `$HOME/run` 或 `/data/run01/scxk701`，不要误用系统的 `/run`；系统 `/run` 是 51 GiB、root 所有且普通用户不可写。
- 登录节点访问 GitHub 和 Hugging Face 的 443 端口均超时，不能假设服务器可直接克隆代码或下载模型与数据。后续应在本机下载并通过“快传”上传，或请平台支持开通代理或镜像。
- 本机已有 Windows OpenSSH、SCP、Git、Python 和约 166 GiB 可用磁盘空间，无需为基本登录额外安装 Conda；但正式基线环境应在服务器上建立，不能用本机实验代替。

服务器存储阻塞已经解除，可以继续升级 `/paper`、检索论文、生成证据包，并在 `$HOME/run` 准备基线代码、环境和数据。当前核验时排队或运行作业数为 0。

普通 GPU 队列的实际单价、赠送额度抵扣规则和有效期仍需由客户经理确认，但这不阻塞前期文献与环境准备。它只阻塞“正式提交计费 GPU 作业”这一步。先上传一个小型官方基线与固定样例，准备 1 张普通 GPU、1–2 分钟的冒烟测试；提交前必须再次向用户列出队列、卡数、时限、已知或待确认的最高费用，并取得明确确认。不得使用已知价格较高的 `hp_4090`，除非用户专门批准。

## 12. Agent 选题形成工作流升级状态

已将正式 `C:\Users\xyn\.codex\skills\paper` 从单纯论文汇总扩展为“选题形成工作流”。新增或更新的关键脚本：

- `build_scan_pool.py`：把多轮接口结果合并为可审计的宽检索池。
- `curate_agent_evidence.py`：严格保留正式会议锚点和近期前沿信号，不用弱材料补齐数量。
- `build_topic_package.py`：生成论文证据卡、七条方向地图、四状态缺口清单、三个候选方向与研究决策记录。
- `build_topic_report.py`：生成导师阅读用的 `Agent研究选题包.pdf`。
- `build_dataset_catalog.py`：把机器账本合并为唯一人工阅读入口；GitHub Release 多版本在 Markdown 中合并显示，原始 JSON 仍保留版本化记录。

当前已完成：

- 宽检索池：`paper-workspace/index/agent_field_scan_pool.json`，170 条去重元数据。
- 保留证据集：`paper-workspace/选题形成/保留证据集.json`，12 篇正式会议锚点、12 篇近期前沿信号。正式锚点包含零样本规划、ReAct、Toolformer、WebShop、AgentBench、ToolLLM、GAIA、SWE-bench、WebArena、AppWorld、OSWorld、τ-bench；每项有官方论文或项目入口。CCF-A 会议口径仍以最新版 CCF 目录和 Full/Regular 版本逐篇复核，绝不把预印本当作 CCF-A。
- 选题形成结构：`paper-workspace/选题形成/研究状态.json`、`论文证据卡.json`、`方向地图.md`、`缺口清单.md`、`候选方向.md`。
- 交付包：
  - `paper-workspace/交付包/Agent领域选题汇报.pptx`，11 页，逐页渲染检查通过；每页讲者备注包含 `[Sources]` 与讲解提示。
  - `paper-workspace/交付包/Agent研究选题包.pdf`，13 页，渲染检查通过。
  - `paper-workspace/交付包/研究决策记录.md`，本人选择与一行理由均保持“待本人确认”。
- 累计论文报告 `paper-workspace/report/paper_summaries.pdf` 已纳入 12 篇正式锚点的同字段总结，当前为 107 页；旧的“82 页”说明仅是升级前状态，不应再用作当前页数。
- 实验资源总览：机器账本有 39 条版本化记录，人工入口合并为 37 个资源。阅读 `paper-workspace/datasets/数据集总览.md`；不要直接逐项阅读 `datasets/index/datasets.json`。
- `paper-workspace/README.md` 已改为交付包优先的说明。

本轮没有提交 `sbatch`、交互 GPU 或任何计费作业，也没有声称基线已运行。下一步可先在 `$HOME/run` 准备小型官方基线和固定样例；但在任何 GPU 提交之前，必须向用户展示：队列、卡数、时限、预计最大费用、提交命令，并等待明确批准。普通 `gpu_4090` / `gpu_5090` 的价格仍未知，不能自行估计成确定费用；`hp_4090` 未获专门批准不得使用。

提醒：为了让 artifact-tool 在 Windows 下定位其运行时，工作区根目录有一个仅指向 `C:\Users\xyn\.cache` 的 `.cache` junction；它不是论文数据，不应作为清理对象。`HANDOFF.md`、`.git`、主工作区和正式 paper 技能继续保留。

## 13. 服务器计费规则已确认

客服书面回复确认：

- `gpu_4090`：3.6 元/卡时；`gpu_5090`：4.5 元/卡时。
- 账户 200 元赠送额度可抵扣这两类 GPU 消费；合作后的折扣价尚未确认，因此预算按上述测试原价上限估计。
- 测试阶段单个作业最多可申请 8 张卡；正常合作后取消卡数限制。这个上限不是建议用卡数。
- 仅按作业实际运行时间计费；排队等待和作业结束后均不计费。

当前最省钱的路径：先完成不占 GPU 的代码/数据准备与上传；再提交 1 张 `gpu_4090`、最多 15 分钟的冒烟作业，最大费用 0.9 元；冒烟成功后，单独向用户申请 1 张 `gpu_4090`、最多 90 分钟的小规模基线作业，最大费用 5.4 元。每一次提交仍必须取得用户明确批准。`gpu_5090` 仅在 4090 显存或兼容性不足时作为备选，同样 90 分钟的上限为 6.75 元。

## 14. 2026-07-29：交接时的精确续跑位置

用户已授权继续执行**不占 GPU 的准备工作**，但尚未授权提交任何 GPU 作业。此前一次上下文中断发生在读取本交接文档与正式 `/paper` 技能之后；因此不要把下面任一准备项误记为已完成：尚未下载 ALFWorld 官方代码或数据、尚未创建上传包、尚未上传到服务器、尚未在服务器创建 Python 环境、尚未执行 CPU 或 GPU 基线，也尚未提交 `sbatch`。

下一窗口应按以下顺序继续：

1. 只在本机创建隔离的 ALFWorld 准备目录，获取官方仓库与已登记的 `0.4.2` 小型数据包；生成可审计的版本、哈希、许可证和来源清单。
2. 准备服务器端脚本、环境说明、固定小样例配置和 Slurm 脚本；脚本、环境、数据均只能放在 `$HOME/run`（实际为 `/data/run01/scxk701`），绝对禁止使用系统 `/run`。
3. 通过可用的安全上传方式把准备包上传到 `$HOME/run`；服务器对 GitHub 与 Hugging Face 的 HTTPS 访问已超时，不能把远端克隆或下载当作默认方案。
4. 可进行不申请 GPU 的目录、文件完整性与 Python/依赖诊断；若需要登录凭据，必须由用户自行输入，Codex 不索取、记录或展示密码。
5. 在任何 `srun`、`sbatch`、交互式 GPU 分配或其他计费 GPU 操作前停止，并向用户逐项列出：队列、卡型、卡数、时限、最大费用、提交命令和实验目的，等待本轮明确确认。首个建议仅为 `gpu_4090`、1 卡、15 分钟、上限 0.9 元的环境冒烟；它成功后再单独申请 1 卡、90 分钟、上限 5.4 元的最小基线。

当前正式产物无须重建，除非后续新增了实验证据或用户要求更新：

- `paper-workspace/交付包/Agent领域选题汇报.pptx`：11 页，已逐页渲染检查；每页备注含来源与讲解提示。
- `paper-workspace/交付包/Agent研究选题包.pdf`：13 页，已渲染检查。
- `paper-workspace/交付包/研究决策记录.md`：所有“你的选择／一行理由”均保持“待本人确认”。
- `paper-workspace/report/paper_summaries.pdf`：107 页，包含 12 篇正式锚点的完整证据卡。
- `paper-workspace/datasets/数据集总览.md`：37 项合并后的实验资源；其中 ALFWorld 已明确关联候选方向 `direction-credit-state`，适合做最小可行性环境验证，不能据此宣称已复现研究结论。

交接时的判断边界：ALFWorld 可以验证环境、任务分层和基线失败案例的采集通路；它本身不能在约 90 分钟内完整复现“状态条件化步骤级信用分配”的 LLM 后训练方法。任何小规模运行只能写作“可行性与失败分析”，不得写作统计充分的研究结论。所有新事实必须尽量附原论文、官方项目页或官方会议链接；无证据内容显式标为“推测”。候选与论证不等同于确定选题。
## 15. 2026-07-29：ALFWorld 本机准备已完成，待安全上传

已在 `paper-workspace/experiments/alfworld-prep/` 创建隔离准备包，未提交 CPU/GPU 作业，也未在服务器创建环境：

- 官方仓库已固定为 tag `0.4.2`、提交 `1558ba46d078279ecb4c5d33a6cdffc96714a2d2`，仓库工作区无改动。
- 已取得官方 PyPI `alfworld-0.4.2-py3-none-any.whl`；SHA-256 为 `29affbea28f6041d1e8516ed3efd6b55becd52cfca4fb9dd5c75b9d6b8a56c2f`，与 PyPI 公布值一致。仓库与该包均声明 MIT 许可。
- 已生成 `paper-workspace/experiments/alfworld-baseline-0.4.2-prep.tar.gz`；大小 4,102,066 字节，SHA-256 为 `0fcba5b62c423c51d79539ecb178162eb71bc882504567333d0737c2652fc44a`。已解压测试，且在不携带 `.git` 的情况下通过版本、源码提交和 wheel 哈希校验。
- 包内含 `manifest.json`、文本环境固定小样例 `configs/smoke_textworld.yaml`、不占 GPU 的 `setup_environment.sh` 和 `run_cpu_diagnostics.sh`、以及明确标为“待审批”的 `gpu_smoke.sbatch`。GPU 模板仅建议 `gpu_4090`、1 卡、15 分钟、上限 0.9 元，尚未获提交批准。
- 本包刻意不含运行数据、预训练模型、Mask R-CNN 检测器或完整依赖 wheelhouse。服务器已知无法访问 GitHub/Hugging Face，因此远端禁止默认执行 `alfworld-download`；后续如需要运行数据，须在本机逐项下载、复核许可与哈希后再上传。
- 当前 Windows 用户目录没有 SSH 配置或私钥（仅有 `known_hosts`），本交接文档也未记录可用的服务器主机别名/地址；因此尚未上传包，且没有猜测目标或索取、记录密码。

后续顺序：用户提供可用的 SSH 主机别名/地址或安全上传入口后，将压缩包上传至 `$HOME/run`，解压为 `$HOME/run/alfworld-baseline`，先运行不占 GPU 的环境安装与诊断。只有在完整依赖及数据资产均已准备、并且用户再次明确批准后，才可提交 GPU 冒烟模板。

## 16. 2026-07-29：服务器入口与快传通路已核验

- 服务器门户入口：<https://cloud.paratera.com/>。
- 已在门户的“快传”中进入账号 `scxk701` 对应的“北京超级云计算中心山东分中心 N56R5 分区”，并实测可浏览 `$HOME/run`（门户路径显示为 `/data/home/scxk701/run`）。交接时目录为空。
- 后续上传 ALFWorld 准备包应使用该门户快传，目标目录严格为 `$HOME/run`；不可上传至主目录、`ssd`、`vast` 或系统 `/run`。
- 门户登录态和上传路径已可用，但截至本条写入时尚未发送任何文件。上传 `alfworld-baseline-0.4.2-prep.tar.gz` 前仍须在操作时向用户确认这一次外部文件传输；上传后先做不占 GPU 的完整性和依赖诊断。

追加状态：用户已于本轮明确确认上传；Codex 已在 `$HOME/run` 的快传界面选择 `alfworld-baseline-0.4.2-prep.tar.gz`，但 Chrome 扩展尚未启用本地文件访问权限，快传拒绝读取该本地路径，文件没有离开本机。用户需在 Chrome 打开 `chrome://extensions`，进入 ChatGPT Chrome Extension 的“详情”，启用“允许访问文件网址”，然后回到本任务继续上传。该阻断与服务器空间、登录态、GPU 队列或费用无关。

## 17. 2026-07-29：ALFWorld 已上传并进入远端依赖／数据准备

- 用户已明确表示“可以执行 GPU 操作”。这表示可继续准备并在条件满足时提出 GPU 提交，但不改变逐次提交前的披露规则：仍须列明队列、卡型、卡数、时限、最大费用、`sbatch` 命令和实验目的；当前尚未提交任何 GPU 作业。
- 门户快传产生的两个同名任务均停在 0%／暂停状态，不是有效上传。随后通过门户 Web SSH 以分行 Base64 方式上传并验证成功；有效归档为 `/data/run01/scxk701/alfworld-baseline-0.4.2-prep-verified.tar.gz`，大小 4,102,066 字节，SHA-256 为 `0fcba5b62c423c51d79539ecb178162eb71bc882504567333d0737c2652fc44a`。服务器上其他同名或 `.manual.part` 文件均为不完整残留，不得使用。
- JuiceFS 解压大量小文件极慢；完整解压在约 5 分钟内仅产生 46 个文件。已终止该次由 Codex 启动的 `tar`，改为只解出运行所需的 manifest、README、固定配置、服务器脚本、官方 wheel、提交号和 `source/alfworld/info.py`。`verify_bundle.py` 在 `/data/run01/scxk701/alfworld-baseline` 返回 0，并输出“校验通过：ALFWorld 0.4.2 wheel、源码提交与版本一致。”
- 系统 Python 为 3.10.12，`pip` 可用，但缺少 `python3.10-venv`，因此标准 `venv` 创建失败；没有申请管理员权限。官方 ALFWorld wheel 可直接加入 `PYTHONPATH` 做 zipimport，远端已成功导入。系统环境中 `yaml` 可用，`textworld` 和 `torch` 缺失。
- 平台模块 `deepmdkit/v3.2.0b0_pytorch` 可提供 Python 3.12.13 与 PyTorch `2.11.0+cu130`；登录节点测试时 `torch.cuda.is_available()` 为 `False`，这是登录节点无 GPU 的预期结果，不代表计算节点不可用。模块首次导入约需 1–2 分钟，主要等待 `/data/apps` 文件系统。
- ALFWorld 官方三个文本环境数据资产的 Content-Length 分别为 72,018,818、34,881,784 和 36,493,542 字节，均来自官方 GitHub Release，项目声明 MIT 许可，未发现单独数据许可文件。服务器和本机经 GitHub CDN 完整下载均极慢，已停止完整下载；CDN 支持 HTTP Range，后续改为读取 ZIP 中央目录并只取两个固定训练样例及对应 PDDL／TW-PDDL 文件。
- 服务器能够访问 PyPI、`api.github.com` 和 `release-assets.githubusercontent.com`；先前 GitHub/Hugging Face 全部不可用的结论应收窄为“访问不稳定且吞吐可能很低”，不能据此假设大文件可及时完整下载。
- 用户说明当前需通过 VPS 才能使用 Codex，这会增加侧边浏览器与 Web SSH 的交互延迟。后台服务器进程不依赖门户持续前台连接；后续应减少终端往返、优先后台执行和短日志轮询。

## 18. 2026-07-29：固定冒烟数据已生成，TextWorld 运行时正在封装

- 已新增本地可复现脚本 `paper-workspace/experiments/alfworld-prep/server/build_smoke_data.py`，并通过语法编译检查；远端副本为 `/data/run01/scxk701/alfworld-baseline/server/build_smoke_data_range.py`。该脚本通过 GitHub Release 的显式 HTTP Range 只获取两个固定训练轨迹所需的 ZIP 成员，不把未完成的整包下载冒充数据资产。
- 远端固定数据已生成在 `/data/run01/scxk701/alfworld-baseline/data/`，共 9 个文件：两个 `traj_data.json`、两个 `initial_state.pddl`、两个 `game.tw-pddl`、两个逻辑文件和一个 `smoke_data_manifest.json`。清单是有效 JSON，其 SHA-256 为 `1bb7f52c8a5b946df5fc7532b33d2a03dbfffc19aacaf1a844ad6fe84071d558`；清单逐文件记录来源与哈希，并注明未获取完整归档哈希。
- 两个固定样例分别是 `look_at_obj_in_light-AlarmClock-None-DeskLamp-301` 下的 `trial_T20190907_174127_043461` 与 `trial_T20190907_174142_375532`。它们只用于验证最小文本环境和失败日志采集链路，不代表完整 ALFWorld 分布，也不能支持研究结论。
- ALFWorld 0.4.2 要求 `textworld>=1.6.1`。TextWorld 1.6.1 源码构建会继续下载 Inform7，在当前网络和共享文件系统上不适合作为冒烟路径；已改用满足版本约束且提供 Linux 预编译轮子的 TextWorld 1.7.0。官方 PyPI 公布的 wheel SHA-256 为 `ca7486cff540c4d90865c54a3465e948c2790357aa78ad64de4406387854cbc8`，服务器下载副本与该值一致。
- 服务器上的有效原始文件名应为 `/data/run01/scxk701/alfworld-baseline/assets/textworld-1.7.0-py3-none-manylinux_2_5_x86_64.manylinux1_x86_64.manylinux_2_17_x86_64.manylinux2014_x86_64.whl`。旁边的 `textworld-1.7.0-manylinux.whl` 内容哈希相同，但文件名不符合 wheel 命名规则，不能直接交给 `pip`，不得误用。
- 已用平台模块 `deepmdkit/v3.2.0b0_pytorch` 的 Python 将有效 wheel 安装到 `/tmp` 并确认 TextWorld 包本体可展开；首次导入发现轻量依赖 `tatsu` 等尚缺，当前正在一次性下载并封装这组依赖。临时使用清华 TUNA PyPI 镜像仅作为传输通道；正式封包前必须按 PyPI 官方元数据逐文件核对哈希。尚未把依赖导入成功写成事实。
- 第一轮带 `--only-binary=:all:` 的轻量依赖批处理已通过主页状态文件确认为失败；这与部分纯 Python 依赖只发布源码包的情况一致，但由于 Web SSH 输出读取受 VPS 延迟影响，具体失败包尚未从日志复核，不能把该推断写成最终原因。
- 已新增本地 `paper-workspace/experiments/alfworld-prep/server/build_runtime_wheelhouse.sh`，改为逐包执行 `pip wheel --no-deps`、逐包写成功/失败标记、在 `/tmp` 试装并验证 `import textworld`，最后才生成 wheelhouse 压缩包和 SHA-256 清单；本地 `bash -n` 通过。曾尝试通过 Web SSH 分块上传并后台启动，但门户交互延迟与快传目录 API 连续失败，当前不能确认远端脚本是否完整写入或是否启动，后续必须先核对远端 SHA-256 `b0fee29c573e389fa7df72d404beb96f65f37341118d277168eeced61ec1a27c`，不得直接重复构建或声称成功。
- 本地 `gpu_smoke.sbatch` 已从不存在的 `venv` 改为实际平台模块方案：加载 `deepmdkit/v3.2.0b0_pytorch`，在作业临时盘安装 TextWorld 与已校验 wheelhouse，验证 bundle、`nvidia-smi` 和 `torch.cuda.is_available()` 后才运行两样例 DAgger 冒烟；本地 `bash -n` 通过。该更新尚未上传到服务器，也没有提交作业。
- 截至本条更新，没有执行 `srun`、`sbatch` 或任何计费 GPU 操作。只有在依赖封装、固定数据和 Slurm 脚本均验证完成后，才能列出精确提交参数并再次请求用户确认。

## 19. 2026-07-29：Jericho 运行时封装已启动，等待导入核验

- 已通过门站 Web SSH 把修订后的运行时构建脚本写入 `/data/run01/scxk701/alfworld-baseline/server/build_runtime_wheelhouse.20260729-jericho.sh`；本地文件 SHA-256 为 `5687811bb815ed70b379c86af448267048d4bfd84484191a10a75af3088176b1`，远端在启动前以相同 SHA-256 和 `bash -n` 核验。旧脚本与旧 `/tmp` 构建目录均未覆盖。
- 新脚本在登录节点后台构建 wheelhouse，不申请 GPU：先封装七个轻量 TextWorld 依赖，再由 `pip wheel jericho==3.3.1` 解析 Jericho 及其传递依赖，最后以隔离的 `/tmp` 目标目录安装 TextWorld 并执行 `import textworld`。截至当前，日志已证实 Jericho 3.3.1 的源码包、构建依赖与元数据准备完成，并在下载其 `numpy` 传递依赖；构建进程仍在运行，尚无本轮成功或失败标记。
- `/data/home/scxk701/codex_status_textworld_import_FAIL_ModuleNotFoundError_No_module_named_jericho_` 是此前未安装 Jericho 的旧标记，不能用来判定本轮。必须等待本轮创建 `codex_dep_ok_jericho_3_3_1`，并以新的 `codex_status_textworld_import_OK_*` 或新的失败标记作为依据。
- 本轮只进行登录节点依赖构建与日志读取；没有执行 `srun`、`sbatch`、GPU 分配或训练，未产生 GPU 卡时。

## 20. 2026-07-29：`import textworld` 已在服务器登录节点核验成功

- 已接回门户 Web SSH 中的 `scxk701@ln01` 会话，并等待
  `/data/run01/scxk701/alfworld-baseline/server/build_runtime_wheelhouse.20260729-jericho.sh`
  结束。该轮 Jericho 3.3.1 wheel 构建成功，生成
  `/data/home/scxk701/codex_dep_ok_jericho_3_3_1`；原脚本随后因 wheelhouse
  缺少 `networkx>=2` 而在隔离安装阶段退出。
- 已把 `networkx>=2` 加入本地
  `paper-workspace/experiments/alfworld-prep/server/build_runtime_wheelhouse.sh`
  的逐包构建清单，并通过 Git for Windows Bash 的 `bash -n` 语法检查。
- 远端在保留的临时构建目录
  `/tmp/alfworld-runtime-wheelhouse-20260729-jericho/` 中增量生成
  `networkx-3.6.1-py3-none-any.whl`，随后安装到新的隔离目标
  `test-target-networkx-1836`。实际导入命令返回 `IMPORT_RC=0`，输出为
  `TEXTWORLD_IMPORT_OK 1.7.0`、`JERICHO 3.3.1`、`NETWORKX 3.6.1` 和
  `NUMPY 2.5.1`；成功标记为
  `/data/home/scxk701/codex_status_textworld_import_OK_incremental_networkx`。
- 当前只证明 TextWorld 包及其导入链在平台 Python 3.12 环境中可加载。隔离安装仍报告两项版本警告：
  TextWorld 1.7.0 声明 `numpy>=1.26,<2.1`，而当前 Jericho 传递依赖解析得到
  NumPy 2.5.1；平台 Torch 2.11.0+cu130 声明 `setuptools<82`，而 wheelhouse
  中为 83.0。正式封装与 GPU 冒烟前应增加约束、重建干净隔离目标并同时验证
  `import textworld`、`import torch` 与最小文本环境；不得把当前导入成功误写成
  完整运行时兼容性已经验证。
- 本轮没有执行 `srun`、`sbatch`、GPU 分配、训练或计费操作，GPU 卡时仍为 0。

## 21. 2026-07-29：用户授予计费 GPU 持续授权

本节是当前有效约束，覆盖本文件此前所有“GPU 作业须逐次再次确认”“`hp_4090`
未经专门批准不得使用”和“费用阻塞提交”的旧要求；较早段落只作为当时状态记录，
不得继续当作当前禁令。

- 用户明确表示“可以用 GPU，大胆用，收费就收费吧”。在本项目范围内，Codex
  可按实验需要直接提交 `srun`、`sbatch`、交互式 GPU 或其他合理的计费 GPU
  作业，无须在每个作业前再次停下等待确认。
- 每次提交前仍须在日志或交接记录中写明队列、卡型、卡数、硬时限、预计最高费用、
  提交命令和实验目的；提交后记录作业 ID、状态、实际运行时间、退出码和可取得的
  实际费用。披露与审计是执行要求，不再是等待用户回复的审批门槛。
- 默认从满足任务的最小资源开始：冒烟优先 1 张 `gpu_4090` 和短硬时限；成功后可
  直接扩大时限、改用 `gpu_5090`、`hp_4090` 或增加卡数，只要与当前实验目的相称。
  已知测试原价仍按 `gpu_4090` 3.6 元/卡时、`gpu_5090` 4.5 元/卡时估算。
- 费用本身不再构成阻塞，也不设置旧的 0.9 元或 5.4 元逐次审批上限；但不得提交
  无硬时限作业、无界自动重试、明显空闲占卡或与当前项目无关的计算。若资源需求
  无法给出合理上限，先收窄实验方案再提交。
- 当前仍须先解决 TextWorld 运行时的 NumPy／Setuptools 约束并验证干净隔离环境；
  GPU 授权不会把未验证依赖、缺失数据或不完整脚本自动变成可运行状态。
