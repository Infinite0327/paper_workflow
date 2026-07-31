import { Presentation, PresentationFile } from "@oai/artifact-tool";

const OUT = "C:/Users/xyn/Documents/论文/paper-workspace/交付包/Agent领域选题汇报.pptx";
const W = 1280, H = 720;
const INK = "#102A43", MUTED = "#52606D", LIGHT = "#F3F6F8", RULE = "#C7D2DA", BLUE = "#1F5F8B", PALE = "#D9EAF7", ACCENT = "#3D8DFF";
const FONT = "Microsoft YaHei";

function shape(slide, name, left, top, width, height, fill="none", lineFill="none", radius="rounded-none") {
  return slide.shapes.add({ geometry: "rect", name, position: { left, top, width, height }, fill, line: { style: "solid", fill: lineFill, width: lineFill === "none" ? 0 : 1 }, borderRadius: radius });
}
function tx(slide, name, text, left, top, width, height, size=22, color=INK, bold=false, align="left") {
  const s = slide.shapes.add({ geometry: "textbox", name, position: { left, top, width, height }, fill: "none", line: { style: "solid", fill: "none", width: 0 } });
  s.text = text;
  s.text.style = { fontFace: FONT, fontSize: size, color, bold, alignment: align, verticalAlignment: "top", autoFit: "shrinkText", marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0 };
  return s;
}
function line(slide, name, x1, y1, x2, y2, color=RULE, width=1) {
  return slide.shapes.add({ geometry: "line", name, position: { left: x1, top: y1, width: x2-x1, height: y2-y1 }, fill: "none", line: { style: "solid", fill: color, width } });
}
function base(pres, title, kicker, page) {
  const slide = pres.slides.add();
  slide.background.fill = "#FFFFFF";
  tx(slide, "kicker", kicker, 56, 28, 300, 22, 13, BLUE, true);
  tx(slide, "title", title, 56, 60, 1168, 62, 36, INK, true);
  line(slide, "top-rule", 56, 138, 1224, 138, RULE, 1);
  tx(slide, "page", String(page), 1190, 675, 34, 18, 12, MUTED, false, "right");
  return slide;
}
function note(slide, sources, talk) {
  slide.speakerNotes.textFrame.setText(`[Sources]\n${sources.join("\n")}\n\n[讲解提示]\n${talk}`);
  slide.speakerNotes.setVisible(true);
}
function bullet(slide, text, y, x=78, width=1110, size=21) {
  tx(slide, `bullet-${y}`, "•", x, y, 22, 28, size, ACCENT, true);
  tx(slide, `bullet-text-${y}`, text, x+30, y, width, 44, size, INK, false);
}
function cell(slide, text, x, y, w, h, header=false, size=16) {
  shape(slide, `cell-${x}-${y}`, x, y, w, h, header ? PALE : "#FFFFFF", RULE);
  tx(slide, `cell-t-${x}-${y}`, text, x+10, y+8, w-20, h-14, size, header ? INK : MUTED, header);
}

const p = Presentation.create({ slideSize: { width: W, height: H } });

// 1 cover
{
  const s = p.slides.add(); s.background.fill = "#FFFFFF";
  tx(s, "cover-kicker", "导师讨论用证据包", 64, 54, 260, 22, 14, BLUE, true);
  tx(s, "cover-title", "Agent 领域选题形成", 64, 166, 840, 86, 55, INK, true);
  tx(s, "cover-sub", "从领域地图到可证伪的最小实验", 68, 274, 720, 42, 25, MUTED);
  line(s, "cover-rule", 64, 342, 720, 342, BLUE, 3);
  shape(s, "cover-callout", 64, 412, 1010, 98, BLUE, BLUE, "rounded-md");
  tx(s, "cover-callout-text", "目的：形成可追溯的候选与论证，供导师讨论、质疑和进一步收敛；\n不声称已经确定可投稿选题。", 88, 434, 950, 55, 21, "#FFFFFF", false);
  tx(s, "cover-foot", "正式论文、预印本和跨论文推测分开标记；本人选择保留待本人填写。", 68, 570, 860, 29, 17, MUTED);
  note(s, ["https://www.ccf.org.cn/Academic_Evaluation/By_category/"], "用一句话界定汇报边界：这是选题形成，而非对 CCF-A 投稿的承诺。");
}

// 2 objective
{
  const s = base(p, "交付不再以“读了多少篇”为终点", "研究目标", 2);
  shape(s, "message", 56, 175, 1168, 74, LIGHT, "none", "rounded-md");
  tx(s, "message-text", "中心判断：Agent 研究正在从“能否完成任务”转向“如何训练、评测、复用经验并保持安全”。", 80, 197, 1100, 34, 25, INK, true);
  bullet(s, "170 条去重元数据构成宽检索池，覆盖后训练、记忆、工具/计算机操作、评测与安全。", 296);
  bullet(s, "核心证据集保留 12 篇正式会议锚点与 12 篇近期前沿信号；二者不等权。", 360);
  bullet(s, "输出：方向地图、缺口清单、3 个候选问题、实验资源入口和研究决策记录。", 424);
  bullet(s, "尚未提交任何计费 GPU 作业，因此没有把“计划中的实验”写成结果。", 488);
  note(s, ["https://www.ccf.org.cn/Academic_Evaluation/By_category/", "本地：paper-workspace/选题形成/保留证据集.json"], "强调证据纪律：不足的层级宁可留空，不用弱论文凑数。");
}

// 3 map
{
  const s = base(p, "七条问题线：能力、环境与评价共同定义 Agent", "领域地图", 3);
  const rows = [
    ["能力获取与后训练", "把多轮交互转为稳定训练信号", "任务成功率、调用正确率、训练稳定性"],
    ["长程决策与信用分配", "识别真正造成成败的关键步骤", "成功率、步骤正确率、样本效率"],
    ["记忆与经验复用", "保存可迁移经验而不积累错误", "复用率、错误复用率、令牌消耗"],
    ["工具与计算机操作", "在动态网页、界面和 API 中可靠执行", "端到端成功率、时间、调用成本"],
    ["多智能体协作与治理", "协调角色、状态与冲突", "协作成功率、延迟、通信成本"],
    ["评测、泛化与可复现", "比较过程能力而非只看终局分数", "泛化差距、复现成功率、成本"],
    ["安全、可靠性与失效控制", "在恶意内容与权限边界下可控执行", "攻击成功率、误拒绝率、安全完成率"],
  ];
  const x=56, y=178, widths=[250,480,438], h=58;
  ["问题线","科学问题","常用中文指标"].forEach((t,i)=>cell(s,t,x+widths.slice(0,i).reduce((a,b)=>a+b,0),y,widths[i],42,true,16));
  rows.forEach((r,ri)=>r.forEach((t,ci)=>cell(s,t,x+widths.slice(0,ci).reduce((a,b)=>a+b,0),y+42+ri*h,widths[ci],h,false,14)));
  tx(s,"cross","跨方向维度：效率和资源成本 - 训练吞吐、端到端延迟、令牌消耗、工具调用成本、显存和卡时。",56,648,1090,24,15,MUTED,true);
  note(s,["本地：paper-workspace/选题形成/方向地图.md","https://www.ccf.org.cn/Academic_Evaluation/By_category/"],"领域地图按研究问题组织，而非只列 memory、planning、tool use 等模块名。");
}

// 4 formal anchors
{
  const s = base(p, "正式锚点把问题线落到可复现环境", "证据锚点", 4);
  const rows=[
    ["工具学习", "Toolformer；ToolLLM", "何时调用、怎样填参数与整合结果；ToolLLM 覆盖 16,464 个 API、49 类。"],
    ["网页与桌面", "WebArena；OSWorld", "跨站网页与真实计算机任务；WebArena 官方页：GPT-4 智能体 14.41%，人类 78.24%。"],
    ["评测", "AgentBench；GAIA；SWE-bench；τ-bench", "跨环境、真实软件修复与多轮服务交互；SWE-bench 初始最佳 Claude 2 为 1.96%。"],
    ["规划", "零样本规划；ReAct；WebShop", "文本知识无法自动变成稳定执行；ReAct 在 ALFWorld、WebShop 报告成功率绝对提升。"],
  ];
  const x=56,y=190,w=[175,330,663],h=92;["主线","代表论文","可观察失败 / 关键指标"].forEach((t,i)=>cell(s,t,x+w.slice(0,i).reduce((a,b)=>a+b,0),y,w[i],46,true,17));
  rows.forEach((r,ri)=>r.forEach((t,ci)=>cell(s,t,x+w.slice(0,ci).reduce((a,b)=>a+b,0),y+46+ri*h,w[ci],h,false,15)));
  tx(s,"anchor-foot","每篇的官方论文页、PDF 与用途均保存在“论文证据卡”。",56,627,700,24,15,MUTED);
  note(s,["https://proceedings.iclr.cc/paper_files/paper/2024/hash/4410c0711e9154a7a2d26f9b3816d1ef-Abstract-Conference.html","https://proceedings.iclr.cc/paper_files/paper/2024/hash/edac78c3e300629acfe6cbe9ca88fb84-Abstract-Conference.html","https://proceedings.iclr.cc/paper_files/paper/2024/hash/28e50ee5b72e90b50e7196fde8ea260e-Abstract-Conference.html","https://proceedings.neurips.cc/paper/2023/hash/d842425e4bf79ba039352da0f658a906-Abstract-Conference.html","https://openreview.net/forum?id=roNSXZpUDN"],"说明这些数字只用于界定研究难度与环境，不用来跨系统宣称谁更好。");
}

// 5 evidence boundary
{
  const s = base(p, "证据层级决定能说什么，不能说什么", "研究纪律", 5);
  const cols=[64,438,812], cw=320;
  const data=[
    ["正式会议锚点","用于：定义问题、环境、公开指标和基线。\n不能：跨模型、跨环境直接排序。"],
    ["近期前沿信号","用于：发现信用分配、记忆与安全的新命题。\n不能：当作已验证结论或正式 CCF-A 论文。"],
    ["跨论文综合","用于：形成可证伪候选。\n不能：隐去推测性质，必须用同环境对照验证。"],
  ];
  data.forEach((d,i)=>{shape(s,`e-card-${i}`,cols[i],194,cw,282,LIGHT,"none","rounded-md"); tx(s,`e-title-${i}`,d[0],cols[i]+20,222,cw-40,42,24,INK,true); line(s,`e-line-${i}`,cols[i]+20,280,cols[i]+cw-20,280,BLUE,2);tx(s,`e-text-${i}`,d[1],cols[i]+20,310,cw-40,130,18,MUTED);});
  shape(s,"strict",64,528,1110,62,BLUE,BLUE,"rounded-md");tx(s,"strict-t","当前严格保留 12 个正式锚点，而不是用质量较弱材料凑成 18 个“CCF-A”。",88,546,1050,26,22,"#FFFFFF",true);
  note(s,["https://www.ccf.org.cn/Academic_Evaluation/By_category/","本地：paper-workspace/选题形成/保留证据集.json"],"点明：正式版本与 CCF 目录仍在继续逐篇核验，预印本只承担前沿信号角色。");
}

// 6 gaps
{
  const s = base(p, "三项缺口：每一项都要能被反驳", "缺口清单", 6);
  const gaps=[
    ["动态工具环境的步骤级信用分配", "局部解决", "不同方法多在各自环境报告提升，缺少工具变化、用户澄清与成本约束同时存在时的可比证据。"],
    ["记忆正确性与真实执行成功的落差", "局部解决", "正确知识不必然转成正确界面操作；需要分开测记忆质量、命中、计划与执行。"],
    ["用户转递内容、权限与任务完成的联合权衡", "证据不足", "现有记录不足以证明同一方案能同时降低攻击并保持正常多步工具任务完成。"],
  ];
  gaps.forEach((g,i)=>{const y=184+i*142; tx(s,`gap-num-${i}`,String(i+1).padStart(2,"0"),70,y,52,30,20,ACCENT,true);tx(s,`gap-title-${i}`,g[0],142,y,760,33,25,INK,true);shape(s,`gap-status-${i}`,990,y,174,30,g[1]==="证据不足"?"#FBE3E8":PALE,"none","rounded-md");tx(s,`gap-status-t-${i}`,g[1],1002,y+6,150,18,14,INK,true,"center");tx(s,`gap-body-${i}`,g[2],142,y+48,980,52,17,MUTED);line(s,`gap-rule-${i}`,142,y+112,1164,y+112,RULE,1);});
  tx(s,"gap-foot","这些都是“当前证据集合中的推测”，不是论文已证明的结论。",70,635,800,24,16,MUTED);
  note(s,["本地：paper-workspace/选题形成/缺口清单.md","本地：paper-workspace/选题形成/论文证据卡.json"],"逐项强调支持证据、反证或限制、适用边界与最低成本验证均已保留。");
}

// 7 candidates
{
  const s = base(p, "候选方向要同时看价值、证据、可证伪性与资源", "方向比较", 7);
  const rows=[
    ["1", "状态条件化步骤级信用分配", "5 / 4 / 4 / 5", "奖励构造泄漏答案；状态等价关系难定义"],
    ["2", "经执行验证的程序记忆", "4 / 3 / 4 / 4", "GUI 环境重，可能被简单长上下文基线击败"],
    ["3", "用户转递内容的最小权限工具控制", "5 / 2 / 4 / 5", "安全数据与边界要求高，攻击集合会过时"],
  ];
  const x=56,y=200,w=[75,442,210,441],h=100;["排序","候选问题","重要性 / 证据 / 创新 / 可证伪","主要风险"].forEach((t,i)=>cell(s,t,x+w.slice(0,i).reduce((a,b)=>a+b,0),y,w[i],48,true,16));
  rows.forEach((r,ri)=>r.forEach((t,ci)=>cell(s,t,x+w.slice(0,ci).reduce((a,b)=>a+b,0),y+48+ri*h,w[ci],h,false,16)));
  tx(s,"cand-note","排序是 Codex 的暂定建议，不替代本人和导师判断。",56,600,700,24,16,MUTED);
  note(s,["本地：paper-workspace/选题形成/候选方向.json","本地：paper-workspace/交付包/研究决策记录.md"],"说明评分别用于比较优先级；不能把评分等同于论文质量或可投稿性。");
}

// 8 proposal
{
  const s = base(p, "首选：在动态工具任务中定位真正关键的失败步骤", "首选方向提案", 8);
  shape(s,"proposal",56,180,1168,98,BLUE,BLUE,"rounded-md");tx(s,"proposal-t","面向动态工具任务的状态条件化步骤级信用分配",82,205,1080,38,28,"#FFFFFF",true);
  const text=[
    ["研究问题", "长程工具强化学习难以区分有效中间步骤与真正造成失败的步骤。"],
    ["可证伪假设", "在相同可观察状态比较候选工具动作，并结合关键状态变化与最终验证信号，可提高成功率且减少无效调用。"],
    ["替代解释", "收益也可能来自更强模型、更多采样或任务特定奖励工程，而不是信用分配本身。"],
    ["为何暂排第一", "干预变量较清晰、终局验证信号相对易获得，适合先做小规模可审计基线。"],
  ];
  text.forEach((r,i)=>{const y=320+i*70;tx(s,`p-l-${i}`,r[0],76,y,155,28,18,BLUE,true);tx(s,`p-r-${i}`,r[1],250,y,910,42,18,INK);});
  note(s,["https://arxiv.org/abs/2602.12268","https://arxiv.org/abs/2604.02869","https://arxiv.org/abs/2605.26684","https://arxiv.org/abs/2603.08754","https://arxiv.org/abs/2602.16165","https://arxiv.org/abs/2605.21768"],"这是候选与论证。明确告知导师替代解释，避免把先验偏好包装成结论。");
}

// 9 experiment
{
  const s = base(p, "最小实验：同模型、同预算、同环境，只改变信用分配", "实验设计", 9);
  const rows=[
    ["环境", "优先 ALFWorld 或公开且可记录逐步状态的工具环境；30-100 个分层样例，至少三类任务。"],
    ["比较组", "轨迹级奖励、清单式步骤奖励、状态条件化奖励。"],
    ["中文指标", "任务成功率、步骤级正确率、工具调用次数、平均轮次、调用成本、训练稳定性。"],
    ["记录", "总体指标、逐样例结果、5 个代表性失败案例、固定代码提交/环境/随机种子。"],
    ["证伪边界", "若无成功率提升且不能减少无效调用，或收益完全由更大采样量解释，则假设不成立。"],
  ];
  const x=56,y=180,w=[182,986],h=74;["要素","最小设计"].forEach((t,i)=>cell(s,t,x+w.slice(0,i).reduce((a,b)=>a+b,0),y,w[i],42,true,17));
  rows.forEach((r,ri)=>r.forEach((t,ci)=>cell(s,t,x+w.slice(0,ci).reduce((a,b)=>a+b,0),y+42+ri*h,w[ci],h,false,16)));
  note(s,["https://github.com/alfworld/alfworld","本地：paper-workspace/datasets/数据集总览.md","本地：paper-workspace/选题形成/候选方向.json"],"强调单次小规模实验只用于可行性与失败分析，不宣称统计充分。");
}

// 10 resource/server
{
  const s = base(p, "服务器可用，但计费 GPU 作业仍处于“未提交”状态", "资源与边界", 10);
  const left=["实验目录统一使用 $HOME/run，对应 /data/run01/scxk701；禁止使用系统 /run。","个人主目录仅 1 GiB；$HOME/run 已验证可写，配额为 300 GiB。","可见队列：gpu_4090、gpu_5090、hp_4090。"], right=["普通队列单价、最长时限及赠送额度抵扣规则尚未收到书面确认。","尚未提交 sbatch、交互 GPU 或任何可能产生费用的作业。","下一步先列队列、卡数、时限、预计费用与命令，等待本人确认。"];
  shape(s,"left",56,186,530,340,LIGHT,"none","rounded-md");shape(s,"right",640,186,584,340,"#FFF4E5","none","rounded-md");tx(s,"left-t","已确认",80,214,200,32,24,INK,true);tx(s,"right-t","必须暂停",666,214,220,32,24,"#9C4C00",true);left.forEach((t,i)=>bullet(s,t,278+i*72,82,470,17));right.forEach((t,i)=>bullet(s,t,278+i*72,668,500,17));
  shape(s,"pause",56,570,1168,64,BLUE,BLUE,"rounded-md");tx(s,"pause-t","提交前的强制检查：队列 | 卡数 | 时限 | 预计最大费用 | 实验命令 → 等待明确确认",80,590,1100,28,21,"#FFFFFF",true,"center");
  note(s,["本地：HANDOFF.md","北京超级云计算中心 N32-H 分区用户手册（用户提供）"],"说明本地资料处理与服务器实验隔离；不要把登录状态或空闲会话与卡时混为一谈，最终以平台计费规则为准。");
}

// 11 mentor questions
{
  const s = base(p, "下一步需要导师共同收敛的四个判断", "导师讨论", 11);
  const q=[
    ["研究价值", "“状态条件化步骤级信用分配”是否足够重要，还是应收窄到某类特定工具/用户交互任务？"],
    ["实验定位", "先用 ALFWorld/工具环境验证机制，还是直接投入更真实但更重的 WebArena、OSWorld？"],
    ["基线选择", "哪些公开强基线、模型规模与计算预算符合课题组资源和公平比较要求？"],
    ["安全边界", "安全候选应并行探索，还是在主线机制验证后作为扩展？"],
  ];
  q.forEach((r,i)=>{const y=176+i*103; tx(s,`qnum-${i}`,String(i+1),68,y,38,28,21,ACCENT,true);tx(s,`ql-${i}`,r[0],122,y,160,28,20,INK,true);tx(s,`qr-${i}`,r[1],312,y,830,44,18,MUTED);line(s,`qline-${i}`,122,y+68,1162,y+68,RULE,1);});
  shape(s,"end",56,605,1106,50,BLUE,BLUE,"rounded-md");tx(s,"end-t","建议动作：先跑通一个可审计的小基线，确认失败模式，再决定是否正式立项。",74,619,1070,24,19,"#FFFFFF",true,"center");
  note(s,["本地：paper-workspace/交付包/研究决策记录.md","本地：paper-workspace/交付包/Agent研究选题包.pdf"],"最后不要求导师立刻拍板，而是请导师帮助把候选收敛为可执行的第一个实验。\n\n[可能追问]\n为什么不是直接训练大模型？答：先用小规模机制验证识别失败边界，避免在不确定问题上消耗卡时。\n为什么不做安全方向？答：重要，但当前证据和实验边界不如首选方向清晰，先保留为备选。" );
}

const pptx = await PresentationFile.exportPptx(p);
await pptx.save(OUT);
const manifest = await p.inspect({ kind: "slide,textbox,shape,notes", maxChars: 10000 });
await (await import("node:fs/promises")).writeFile("C:/Users/xyn/Documents/论文/tmp/ppt_topic/inspect.ndjson", manifest.ndjson);
