/**
 * NotebookLM 30-Day AI Learning Dashboard (Super Enhanced Interaction)
 */

const STUDY_PLAN = [
  // ================= WEEK 1 (Day 1 - 7) =================
  {
    day: 1, week: 1,
    title: "大模型 2026 演进趋势与推理算力格局",
    desc: "强化学习推理（Reasoning LLMs）、开源权重模型与端侧算力变迁。",
    nbTitle: "3. 提示词工程与模型微调对齐",
    nbUrl: "https://notebook.google.com/notebook/e9f2a6e2-1adf-4e12-b5dd-0789cfcca77f",
    ytTitle: "State of AI in 2026: LLMs, Agents, GPUs (Lex Fridman #490)",
    ytUrl: "https://www.youtube.com/results?search_query=Lex+Fridman+State+of+AI+2026"
  },
  {
    day: 2, week: 1,
    title: "提示词工程（Prompting）与结构化输出控制",
    desc: "结构化 JSON 输出、Few-Shot 提示与复杂意图引导实践。",
    nbTitle: "3. 提示词工程与模型微调对齐",
    nbUrl: "https://notebook.google.com/notebook/e9f2a6e2-1adf-4e12-b5dd-0789cfcca77f",
    ytTitle: "Modern Prompt Engineering & Structured Outputs (AI Jason)",
    ytUrl: "https://www.youtube.com/results?search_query=Prompt+Engineering+Structured+Outputs+2026"
  },
  {
    day: 3, week: 1,
    title: "多模态大模型（Vision-Language-Audio）",
    desc: "视觉特征提取、OCR 与跨模态注意力融合机制详解。",
    nbTitle: "4. 多模态理解与原生应用开发",
    nbUrl: "https://notebook.google.com/notebook/dbd07108-645a-450b-91f1-55ec65b4f4f3",
    ytTitle: "The Future of Multimodal AI & Real-Time Voice Models (ColdFusion)",
    ytUrl: "https://www.youtube.com/results?search_query=ColdFusion+Multimodal+AI+2026"
  },
  {
    day: 4, week: 1,
    title: "实时全双工语音交互（Full-Duplex Audio）",
    desc: "超低延迟语音对话如何赋能下一代智能硬件与车载/居家设备。",
    nbTitle: "4. 多模态理解与原生应用开发",
    nbUrl: "https://notebook.google.com/notebook/dbd07108-645a-450b-91f1-55ec65b4f4f3",
    ytTitle: "Real-Time Audio Voice AI: Latency Breakthroughs (Two Minute Papers)",
    ytUrl: "https://www.youtube.com/results?search_query=Real-Time+Voice+AI+Models+2026"
  },
  {
    day: 5, week: 1,
    title: "AI 智能体（Agent）系统架构与工具调用",
    desc: "规划器、短期/长期记忆与 Function Calling 核心组件拆解。",
    nbTitle: "1. 智能体工程与工作流编排",
    nbUrl: "https://notebook.google.com/notebook/74b513d8-fb94-4b10-9692-2b976bcd9a09",
    ytTitle: "AI Agent Architecture: Memory & Tools Explained (Matthew Berman)",
    ytUrl: "https://www.youtube.com/results?search_query=AI+Agent+Architecture+Matthew+Berman+2026"
  },
  {
    day: 6, week: 1,
    title: "MCP 模型上下文协议（Model Context Protocol）",
    desc: "深入学习 MCP 开放标准，打通本地与云端数据孤岛。",
    nbTitle: "1. 智能体工程与工作流编排",
    nbUrl: "https://notebook.google.com/notebook/74b513d8-fb94-4b10-9692-2b976bcd9a09",
    ytTitle: "Model Context Protocol (MCP): The Universal Bridge for AI (Cole Medin)",
    ytUrl: "https://www.youtube.com/results?search_query=Model+Context+Protocol+MCP+Tutorial"
  },
  {
    day: 7, week: 1,
    title: "Week 1 阶段复盘与 NotebookLM 播客生成",
    desc: "在 Studio 中生成第一周的双人深度对话 Audio Overview。",
    nbTitle: "1. 智能体工程与工作流编排",
    nbUrl: "https://notebook.google.com/notebook/74b513d8-fb94-4b10-9692-2b976bcd9a09",
    ytTitle: "Supercharge Learning with Google NotebookLM Studio (Matt Wolfe)",
    ytUrl: "https://www.youtube.com/results?search_query=NotebookLM+Studio+Audio+Overview"
  },

  // ================= WEEK 2 (Day 8 - 14) =================
  {
    day: 8, week: 2,
    title: "企业级医疗 AI 落地与临床痛点分析",
    desc: "医疗行业合规要求、HIPAA 隐私保护与医生在环决策系统。",
    nbTitle: "2. 检索增强与知识工程（RAG）",
    nbUrl: "https://notebook.google.com/notebook/bcaa84cd-2d4d-423c-84d0-cb1d33ef0c01",
    ytTitle: "Diving into Enterprise Healthcare AI for 2026 (Scale AI)",
    ytUrl: "https://www.youtube.com/results?search_query=Enterprise+Healthcare+AI+Scale+AI"
  },
  {
    day: 9, week: 2,
    title: "GraphRAG 与医疗临床知识检索（零事实性幻觉）",
    desc: "知识图谱与向量检索结合，消除复杂病历问答中的事实性幻觉。",
    nbTitle: "2. 检索增强与知识工程（RAG）",
    nbUrl: "https://notebook.google.com/notebook/bcaa84cd-2d4d-423c-84d0-cb1d33ef0c01",
    ytTitle: "GraphRAG: Knowledge Graphs for Precision Healthcare (Microsoft Developer)",
    ytUrl: "https://www.youtube.com/results?search_query=GraphRAG+Knowledge+Graph+Healthcare"
  },
  {
    day: 10, week: 2,
    title: "医学专业大模型（Med-PaLM / BioMistral）",
    desc: "专业医学大模型预训练语料配比与医学问诊对齐技术精读。",
    nbTitle: "3. 提示词工程与模型微调对齐",
    nbUrl: "https://notebook.google.com/notebook/e9f2a6e2-1adf-4e12-b5dd-0789cfcca77f",
    ytTitle: "How Medical AI Models Are Trained: From Bench to Bedside (Stanford Online)",
    ytUrl: "https://www.youtube.com/results?search_query=Stanford+Medical+AI+Series+2026"
  },
  {
    day: 11, week: 2,
    title: "斯坦福 RAISE Health 2026 研讨会精读",
    desc: "可信赖医学 AI 评测基准、临床偏见消除与患者隐私安全。",
    nbTitle: "2. 检索增强与知识工程（RAG）",
    nbUrl: "https://notebook.google.com/notebook/bcaa84cd-2d4d-423c-84d0-cb1d33ef0c01",
    ytTitle: "RAISE Health: Trustworthy AI in Clinical Practice (Stanford Medicine)",
    ytUrl: "https://www.youtube.com/results?search_query=Stanford+Medicine+RAISE+Health+2026"
  },
  {
    day: 12, week: 2,
    title: "多模态 AI 医学影像（CT/MRI/病理切片分析）",
    desc: "多模态视觉模型在病灶识别、早期筛查与报告自动化中的应用。",
    nbTitle: "4. 多模态理解与原生应用开发",
    nbUrl: "https://notebook.google.com/notebook/dbd07108-645a-450b-91f1-55ec65b4f4f3",
    ytTitle: "AI in Medical Imaging: Vision Foundation Models (The Health AI Brief)",
    ytUrl: "https://www.youtube.com/results?search_query=Medical+Imaging+AI+Vision+Foundation+Models"
  },
  {
    day: 13, week: 2,
    title: "AI 制药（Drug Discovery）与蛋白质设计",
    desc: "AlphaFold、生成式小分子设计与靶点发现的最新进展解析。",
    nbTitle: "4. 多模态理解与原生应用开发",
    nbUrl: "https://notebook.google.com/notebook/dbd07108-645a-450b-91f1-55ec65b4f4f3",
    ytTitle: "How AI Is Revolutionizing Drug Discovery & Medicine (AI at Work)",
    ytUrl: "https://www.youtube.com/results?search_query=AI+Drug+Discovery+Revolution+2026"
  },
  {
    day: 14, week: 2,
    title: "Week 2 实战：设计你的医疗问诊知识库",
    desc: "在 NotebookLM 中整理临床指南，构建一个慢病管理问答助手原型。",
    nbTitle: "2. 检索增强与知识工程（RAG）",
    nbUrl: "https://notebook.google.com/notebook/bcaa84cd-2d4d-423c-84d0-cb1d33ef0c01",
    ytTitle: "Building Clinical Decision Support with Modern RAG (FreeCodeCamp)",
    ytUrl: "https://www.youtube.com/results?search_query=Building+RAG+Clinical+Healthcare"
  },

  // ================= WEEK 3 (Day 15 - 21) =================
  {
    day: 15, week: 3,
    title: "2026 AI 独立硬件成败复盘与行业反思",
    desc: "Plaud Note 录音笔、Humane AI Pin 与 Rabbit R1 的产品逻辑分水岭。",
    nbTitle: "5. 具身智能与端侧物理交互",
    nbUrl: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560",
    ytTitle: "The Reality of AI Hardware in 2026: What Sells (MKBHD)",
    ytUrl: "https://www.youtube.com/results?search_query=MKBHD+AI+Hardware+Review"
  },
  {
    day: 16, week: 3,
    title: "AI 智能眼镜与微型穿戴交互（AR/Audio Glasses）",
    desc: "Rokid、Ray-Ban Meta 等智能眼镜的第一人称视觉与语音交互设计。",
    nbTitle: "4. 多模态理解与原生应用开发",
    nbUrl: "https://notebook.google.com/notebook/dbd07108-645a-450b-91f1-55ec65b4f4f3",
    ytTitle: "Smart AI Glasses 2026: Hands-On & Teardown (The Verge)",
    ytUrl: "https://www.youtube.com/results?search_query=The+Verge+Smart+AI+Glasses"
  },
  {
    day: 17, week: 3,
    title: "AI 潮玩与情感陪伴机器人（Loona / Miko）",
    desc: "情绪价值、性格模型与多模态情感计算在玩具硬件中的集成。",
    nbTitle: "5. 具身智能与端侧物理交互",
    nbUrl: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560",
    ytTitle: "Smart AI Toys & Companion Robots Teardown (CNET)",
    ytUrl: "https://www.youtube.com/results?search_query=CNET+AI+Companion+Robots+Teardown"
  },
  {
    day: 18, week: 3,
    title: "开源机器人玩具与硬件生态（Microduck / Pollen）",
    desc: "Hugging Face 与开源社区驱动的低成本具身智能硬件新浪潮。",
    nbTitle: "5. 具身智能与端侧物理交互",
    nbUrl: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560",
    ytTitle: "Building Affordable Physical AI: LeRobot (Hugging Face)",
    ytUrl: "https://www.youtube.com/results?search_query=Hugging+Face+LeRobot+Microduck"
  },
  {
    day: 19, week: 3,
    title: "四足机器狗与运动控制（Unitree Go2 Pro）",
    desc: "强化学习（RL）步态控制、激光雷达 SLAM 与跟随避障算法剖析。",
    nbTitle: "5. 具身智能与端侧物理交互",
    nbUrl: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560",
    ytTitle: "Unitree Go2 Pro Quadruped Robot: Inside the Tech (RobotLAB)",
    ytUrl: "https://www.youtube.com/results?search_query=Unitree+Go2+Pro+RobotLAB"
  },
  {
    day: 20, week: 3,
    title: "VLA（视觉-语言-动作）具身大模型原理",
    desc: "π₀、OpenVLA 如何让大模型从生成文字跨越到驱动机械动作。",
    nbTitle: "5. 具身智能与端侧物理交互",
    nbUrl: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560",
    ytTitle: "Vision-Language-Action (VLA) Models Explained (Yannic Kilcher)",
    ytUrl: "https://www.youtube.com/results?search_query=Vision+Language+Action+Models+Explained"
  },
  {
    day: 21, week: 3,
    title: "Week 3 阶段复盘：AI 潮玩产品架构拆解",
    desc: "绘制一张传感器层、端云协同推理层与执行机构的智能系统架构图。",
    nbTitle: "5. 具身智能与端侧物理交互",
    nbUrl: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560",
    ytTitle: "How to Build an AI Hardware Product in 2026 (Hardware Pioneers)",
    ytUrl: "https://www.youtube.com/results?search_query=Build+AI+Hardware+Product+2026"
  },

  // ================= WEEK 4 (Day 22 - 30) =================
  {
    day: 22, week: 4,
    title: "端侧算力芯片（NVIDIA Jetson Thor / 高通）",
    desc: "端侧 NPU 加速、模型量化（INT4/FP8）与无网络离线运行策略。",
    nbTitle: "5. 具身智能与端侧物理交互",
    nbUrl: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560",
    ytTitle: "NVIDIA Jetson Thor: Brain Behind Next-Gen Robotics (NVIDIA)",
    ytUrl: "https://www.youtube.com/results?search_query=NVIDIA+Jetson+Thor+Robotics"
  },
  {
    day: 23, week: 4,
    title: "AI 医疗 + AI 玩具跨界：疗愈陪伴硬件（Tombot）",
    desc: "阿尔茨海默症伴侣机器狗、儿童孤独症康复玩具等医疗级硬件蓝海。",
    nbTitle: "5. 具身智能与端侧物理交互",
    nbUrl: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560",
    ytTitle: "Tombot & Therapeutic AI Pets: How Robotics Heals (AgeTech Tech)",
    ytUrl: "https://www.youtube.com/results?search_query=Tombot+Therapeutic+AI+Pet+CES+2026"
  },
  {
    day: 24, week: 4,
    title: "智能穿戴医疗监测（无感 ECG/PPG 与 AI 预警）",
    desc: "连续生物信号采集与端侧轻量级时序模型预测结合范式。",
    nbTitle: "4. 多模态理解与原生应用开发",
    nbUrl: "https://notebook.google.com/notebook/dbd07108-645a-450b-91f1-55ec65b4f4f3",
    ytTitle: "Wearable Health Tech: The AI Revolution (Engadget)",
    ytUrl: "https://www.youtube.com/results?search_query=Wearable+Health+Tech+AI+Revolution"
  },
  {
    day: 25, week: 4,
    title: "智能体安全、红队测试与医疗合规治理",
    desc: "Prompt Injection 防御、幻觉护栏（Guardrails）与输出安全性校验。",
    nbTitle: "1. 智能体工程与工作流编排",
    nbUrl: "https://notebook.google.com/notebook/74b513d8-fb94-4b10-9692-2b976bcd9a09",
    ytTitle: "AI Safety & Guardrails: Securing Production LLMs (DeepLearning.AI)",
    ytUrl: "https://www.youtube.com/results?search_query=DeepLearning.AI+LLM+Safety+Guardrails"
  },
  {
    day: 26, week: 4,
    title: "端到端原型构想：AI 医疗/硬件方案立项",
    desc: "选定儿童语音玩偶或社区慢病随访盒场景，编写产品需求文档 PRD。",
    nbTitle: "1. 智能体工程与工作流编排",
    nbUrl: "https://notebook.google.com/notebook/74b513d8-fb94-4b10-9692-2b976bcd9a09",
    ytTitle: "From Idea to Prototype: Developing AI Products (Y Combinator)",
    ytUrl: "https://www.youtube.com/results?search_query=Y+Combinator+AI+Product+Development"
  },
  {
    day: 27, week: 4,
    title: "技术选型与物料清单（BOM）与成本核算",
    desc: "主控芯片、麦克风阵列、扬声器、电池续航与云端 API 成本评估。",
    nbTitle: "5. 具身智能与端侧物理交互",
    nbUrl: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560",
    ytTitle: "Hardware BOM & Unit Economics for Smart Devices (Adafruit)",
    ytUrl: "https://www.youtube.com/results?search_query=Hardware+BOM+Smart+Devices+Tutorial"
  },
  {
    day: 28, week: 4,
    title: "使用 NotebookLM 一键生成项目总结报告",
    desc: "将 4 周学习笔记导入 NotebookLM，调用 report_create 生成企划报告。",
    nbTitle: "1. 智能体工程与工作流编排",
    nbUrl: "https://notebook.google.com/notebook/74b513d8-fb94-4b10-9692-2b976bcd9a09",
    ytTitle: "NotebookLM Studio: Generate Reports & Slides (David Ondrej)",
    ytUrl: "https://www.youtube.com/results?search_query=NotebookLM+Studio+Reports+SlideDeck"
  },
  {
    day: 29, week: 4,
    title: "生成终期结业 Audio Overview 播客与信息图",
    desc: "在 Studio 中收听 AI 播客主持人对你 30 天知识体系的总结与互动。",
    nbTitle: "5. 具身智能与端侧物理交互",
    nbUrl: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560",
    ytTitle: "The Ultimate Guide to Google NotebookLM in 2026 (Wes Roth)",
    ytUrl: "https://www.youtube.com/results?search_query=Wes+Roth+NotebookLM+Guide"
  },
  {
    day: 30, week: 4,
    title: "🏆 结业答辩：成为懂前沿、懂工程的实战派",
    desc: "回顾 30 天打卡记录，导出成果日志，踏上 AI 从业与创新创业新征程！",
    nbTitle: "5. 具身智能与端侧物理交互",
    nbUrl: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560",
    ytTitle: "How to Build a Career in AI: Engineering & Products (Andrew Ng)",
    ytUrl: "https://www.youtube.com/results?search_query=Andrew+Ng+Career+in+AI+2026"
  }
];

const INFOGRAPHICS = [
  {
    title: "1. 智能体工程与工作流编排全景图",
    img: "https://lh3.googleusercontent.com/notebooklm/AKYWMX9quDEH5fOOL9zCDeXP6ZqjAcEY8yeC4wpjeIcRpQJlqQZ49R6joZPKud8sRsn-gSM1Qfi57ZtiRgVhoFEp5ZiYHlP-OxyCz9pGkKcT06PGHg9LqKyns7bQQVgUssBdh6qo8JVmdGmztDaIGlg2hVBDMd7Q3A=w2752-d-h1536-mp2",
    url: "https://notebook.google.com/notebook/74b513d8-fb94-4b10-9692-2b976bcd9a09"
  },
  {
    title: "2. 高级 RAG 检索增强架构图",
    img: "https://lh3.googleusercontent.com/notebooklm/AKYWMX_d04uk-xaY3Jd6B2bigbRv9cXLVEwEYfEwS8u52Xl74aZ2lBqjimRiMs9T8ADrJ8aPsOB4BIFXqiiwZyxDQNPhRBZ1UG32I3mym5SVPrrG8wg2OvGOuKSdN3czeROMNUFguOEjHwJ1OtQru2g2rZoBWsbBRec=w2752-d-h1536-mp2",
    url: "https://notebook.google.com/notebook/bcaa84cd-2d4d-423c-84d0-cb1d33ef0c01"
  },
  {
    title: "3. 提示词工程与模型微调对齐图",
    img: "https://lh3.googleusercontent.com/notebooklm/AKYWMX_bsmId8KV9snjO70ff-5o7OBQ0UXNAiIS9tU1GF1ZCH9PS2Lzt8Lo94ojNHuWjgvvtfHXHy3y5MpH8lX3EDheOj02Xz9UjVQ8uFoxoTPDLQyqu_kayB0dDhPiOijeRNQTviM8qlfqUmQkOXu5bkz2t669Lpbs=w2752-d-h1536-mp2",
    url: "https://notebook.google.com/notebook/e9f2a6e2-1adf-4e12-b5dd-0789cfcca77f"
  },
  {
    title: "4. 多模态大模型应用开发全景图",
    img: "https://lh3.googleusercontent.com/notebooklm/AKYWMX-2NaLl2SI3-F9QIRtXiDcW0EA8l_c0AmpKF2HVIRUUZHrntqTxw5xMNAAgHic_V8aH3x0v0ln_Im3K7Hzy_uQ15nuSncWF_-pfvsHt539Gyq1Alcav2zQ1OG-BixV1nrERWESAbLvrFOCURMipJOKeWEEAig=w2752-d-h1536-mp2",
    url: "https://notebook.google.com/notebook/dbd07108-645a-450b-91f1-55ec65b4f4f3"
  },
  {
    title: "5. 具身智能与端侧物理交互全景图",
    img: "https://lh3.googleusercontent.com/notebooklm/AKYWMX_mT5dLDX7_vGU6ALStjh_B5jFzPdPz7vuf8I4jICpgnTCRWMEos7nXxtQ_ufWtJcW2TbJ93pITh-cAZ1IHBmtVBcs8iRha1408nVX-LWb1LqiB4NJymDvN1Fyxn7nGZKIXM3SAl34emCPJt2CRqhcXSaHWFQ=w2752-d-h1536-mp2",
    url: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560"
  }
];

const STORAGE_KEY = "ai_tang_study_progress_v2";
let progressState = {};

try {
  progressState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
} catch(e) {
  progressState = {};
}

function initDashboard() {
  renderTimeline();
  renderInfographics();
  updateGlobalStats();
  initActions();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  initDashboard();
}

// 渲染周列表 (默认全部展开，一目了然)
function renderTimeline() {
  const container = document.getElementById("timeline-container");
  if (!container) return;
  container.innerHTML = "";

  const weeksConfig = [
    { num: 1, title: "Week 1: 基础筑基与前沿大图景 (Day 1 - 7)", days: STUDY_PLAN.filter(d => d.week === 1) },
    { num: 2, title: "Week 2: AI 医疗 (Medical AI) 深度沉浸 (Day 8 - 14)", days: STUDY_PLAN.filter(d => d.week === 2) },
    { num: 3, title: "Week 3: AI 硬件与潮玩/陪伴机器人 (Day 15 - 21)", days: STUDY_PLAN.filter(d => d.week === 3) },
    { num: 4, title: "Week 4: 前沿融合与端到端产品实战 (Day 22 - 30)", days: STUDY_PLAN.filter(d => d.week === 4) }
  ];

  weeksConfig.forEach(w => {
    const acc = document.createElement("div");
    acc.className = "week-accordion open"; // 默认直接展开
    
    acc.innerHTML = `
      <div class="week-accordion-header">
        <div class="week-title-left">
          <span class="week-badge-pill">WEEK ${w.num}</span>
          <span class="week-accordion-title">${w.title}</span>
        </div>
        <i class="fa-solid fa-chevron-down week-toggle-icon"></i>
      </div>
      <div class="week-accordion-content">
        ${w.days.map(d => renderDayRow(d)).join("")}
      </div>
    `;

    // 点击周标题折叠/展开
    acc.querySelector(".week-accordion-header").addEventListener("click", () => {
      acc.classList.toggle("open");
    });

    container.appendChild(acc);
  });

  attachDayEvents();
}

function renderDayRow(d) {
  const isDone = !!progressState[d.day];

  return `
    <div class="day-row-card ${isDone ? 'completed' : ''}" id="day-row-${d.day}">
      <div class="day-row-main" onclick="toggleDayDetails(${d.day})">
        <input type="checkbox" class="day-checkbox-custom" data-day="${d.day}" ${isDone ? 'checked' : ''} onclick="event.stopPropagation();">
        <div class="day-info-wrap">
          <div class="day-tag-title">
            <span class="day-tag">DAY ${String(d.day).padStart(2, '0')}</span>
            <span class="day-heading">${d.title}</span>
          </div>
          <p class="day-summary-text">${d.desc}</p>
        </div>
        <div class="expand-btn-badge" id="expand-badge-${d.day}">
          <span>展开详情 ▾</span>
        </div>
      </div>
      <div class="day-details-expand" id="details-${d.day}">
        <div class="links-grid-box">
          <div class="link-item-row">
            <span class="link-type-badge badge-nb">📓 研读库</span>
            <a href="${d.nbUrl}" target="_blank" rel="noopener noreferrer" class="link-anchor" onclick="event.stopPropagation();">
              ${d.nbTitle} ↗
            </a>
          </div>
          <div class="link-item-row">
            <span class="link-type-badge badge-yt">🎬 必看视频</span>
            <a href="${d.ytUrl}" target="_blank" rel="noopener noreferrer" class="link-anchor" onclick="event.stopPropagation();">
              ${d.ytTitle} ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 点击展开/折叠单天详情
window.toggleDayDetails = function(day) {
  const card = document.getElementById(`day-row-${day}`);
  const badge = document.getElementById(`expand-badge-${day}`);
  if (!card) return;
  card.classList.toggle("expanded");
  if (badge) {
    badge.innerHTML = card.classList.contains("expanded") ? "<span>收起详情 ▴</span>" : "<span>展开详情 ▾</span>";
  }
};

function attachDayEvents() {
  document.querySelectorAll(".day-checkbox-custom").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const day = e.target.getAttribute("data-day");
      const card = document.getElementById(`day-row-${day}`);

      if (e.target.checked) {
        progressState[day] = true;
        if (card) card.classList.add("completed");
      } else {
        delete progressState[day];
        if (card) card.classList.remove("completed");
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progressState));
      } catch(err){}
      updateGlobalStats();
    });
  });
}

function updateGlobalStats() {
  const completed = Object.keys(progressState).length;
  const total = 30;
  const percent = Math.round((completed / total) * 100);
  const remaining = (total - completed) * 2;

  const w1Count = STUDY_PLAN.filter(d => d.week === 1 && progressState[d.day]).length;
  const w2Count = STUDY_PLAN.filter(d => d.week === 2 && progressState[d.day]).length;
  const w3Count = STUDY_PLAN.filter(d => d.week === 3 && progressState[d.day]).length;
  const w4Count = STUDY_PLAN.filter(d => d.week === 4 && progressState[d.day]).length;

  const elW1 = document.getElementById("stat-w1");
  const elW2 = document.getElementById("stat-w2");
  const elW3 = document.getElementById("stat-w3");
  const elW4 = document.getElementById("stat-w4");
  const elPercent = document.getElementById("global-percent");
  const elFill = document.getElementById("main-fill-bar");
  const elRemain = document.getElementById("remaining-hours");
  const elStreak = document.getElementById("streak-num");

  if (elW1) elW1.textContent = `${w1Count} / 7`;
  if (elW2) elW2.textContent = `${w2Count} / 7`;
  if (elW3) elW3.textContent = `${w3Count} / 7`;
  if (elW4) elW4.textContent = `${w4Count} / 9`;

  if (elPercent) elPercent.textContent = `${percent}%`;
  if (elFill) elFill.style.width = `${percent}%`;
  if (elRemain) elRemain.textContent = `${remaining}`;

  let streak = 0;
  for (let i = 1; i <= total; i++) {
    if (progressState[i]) streak++;
    else if (i <= completed) streak = 0;
  }
  if (elStreak) elStreak.textContent = `${streak}`;
}

function renderInfographics() {
  const grid = document.getElementById("infographics-grid");
  if (!grid) return;
  grid.innerHTML = INFOGRAPHICS.map(item => `
    <div class="info-card">
      <div class="info-img-box">
        <img src="${item.img}" alt="${item.title}" class="info-thumb" loading="lazy">
      </div>
      <div class="info-card-body">
        <h4 class="info-card-title">${item.title}</h4>
        <div style="display:flex; gap:0.5rem;">
          <a href="${item.img}" target="_blank" rel="noopener noreferrer" class="info-card-btn" style="flex:1;">查看 2K 原图</a>
          <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="info-card-btn" style="flex:1;">研读库 ↗</a>
        </div>
      </div>
    </div>
  `).join("");
}

function initActions() {
  const btnReset = document.getElementById("btn-reset");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (confirm("确定要重置全部 30 天学习打卡进度吗？")) {
        progressState = {};
        localStorage.removeItem(STORAGE_KEY);
        renderTimeline();
        updateGlobalStats();
      }
    });
  }

  const btnExport = document.getElementById("btn-export");
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      const completed = Object.keys(progressState).length;
      let md = `# 🎓 AI 零基础 30 天学习计划打卡日志\n\n`;
      md += `- **完成进度**：${completed} / 30 天 (${Math.round((completed/30)*100)}%)\n`;
      md += `- **生成时间**：${new Date().toLocaleString()}\n\n---\n\n`;

      STUDY_PLAN.forEach(d => {
        const isDone = progressState[d.day] ? "✅ 已完成" : "⬜ 未完成";
        md += `### DAY ${String(d.day).padStart(2, '0')}: ${d.title} [${isDone}]\n`;
        md += `- **简介**：${d.desc}\n`;
        md += `- **NotebookLM**：[${d.nbTitle}](${d.nbUrl})\n`;
        md += `- **精选视频**：[${d.ytTitle}](${d.ytUrl})\n\n`;
      });

      const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AI_30天打卡日志_${new Date().toISOString().slice(0, 10)}.md`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
