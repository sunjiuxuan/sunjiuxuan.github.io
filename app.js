/**
 * AI Frontiers Learning Hub & NotebookLM 30-Day Dashboard
 * Fully Interactive with LocalStorage Persistence
 */

// 1. 数据集定义：30 天每日学习任务清单
const STUDY_PLAN_DATA = [
  // ================= Week 1: 基础筑基与前沿大图景 =================
  {
    day: 1,
    week: "week1",
    weekName: "Week 1: 基础筑基与前沿大图景",
    title: "大模型 2026 演进趋势与推理算力格局",
    desc: "学习强化学习推理（Reasoning LLMs）、开源权重模型与端侧算力变迁。",
    notebook: {
      title: "3. 提示词工程与模型微调对齐",
      url: "https://notebook.google.com/notebook/e9f2a6e2-1adf-4e12-b5dd-0789cfcca77f"
    },
    video: {
      title: "State of AI in 2026: LLMs, Agents, GPUs",
      channel: "Lex Fridman Podcast #490",
      views: "200,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Lex+Fridman+State+of+AI+2026"
    }
  },
  {
    day: 2,
    week: "week1",
    weekName: "Week 1: 基础筑基与前沿大图景",
    title: "提示词工程（Prompting）与结构化约束",
    desc: "掌握结构化 JSON 输出、Few-Shot 提示与复杂意图引导。",
    notebook: {
      title: "3. 提示词工程与模型微调对齐",
      url: "https://notebook.google.com/notebook/e9f2a6e2-1adf-4e12-b5dd-0789cfcca77f"
    },
    video: {
      title: "Modern Prompt Engineering & Structured Outputs",
      channel: "AI Jason",
      views: "65,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Prompt+Engineering+Structured+Outputs+2026"
    }
  },
  {
    day: 3,
    week: "week1",
    weekName: "Week 1: 基础筑基与前沿大图景",
    title: "多模态大模型（Vision-Language-Audio）",
    desc: "理解视觉特征提取、OCR 与跨模态注意力融合机制。",
    notebook: {
      title: "4. 多模态理解与原生应用开发",
      url: "https://notebook.google.com/notebook/dbd07108-645a-450b-91f1-55ec65b4f4f3"
    },
    video: {
      title: "The Future of Multimodal AI & Real-Time Voice Models",
      channel: "ColdFusion",
      views: "85,000+ 播放",
      url: "https://www.youtube.com/results?search_query=ColdFusion+Multimodal+AI+2026"
    }
  },
  {
    day: 4,
    week: "week1",
    weekName: "Week 1: 基础筑基与前沿大图景",
    title: "实时全双工语音交互（Full-Duplex Audio）",
    desc: "探索超低延迟语音对话如何赋能下一代智能硬件与车载/居家设备。",
    notebook: {
      title: "4. 多模态理解与原生应用开发",
      url: "https://notebook.google.com/notebook/dbd07108-645a-450b-91f1-55ec65b4f4f3"
    },
    video: {
      title: "Real-Time Audio Voice AI: Architecture & Latency Breakthroughs",
      channel: "Two Minute Papers",
      views: "110,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Real-Time+Voice+AI+Models+2026"
    }
  },
  {
    day: 5,
    week: "week1",
    weekName: "Week 1: 基础筑基与前沿大图景",
    title: "AI 智能体（Agent）系统架构与工具调用",
    desc: "掌握 Agent 核心组件：规划器、短期/长期记忆与 Function Calling。",
    notebook: {
      title: "1. 智能体工程与工作流编排",
      url: "https://notebook.google.com/notebook/74b513d8-fb94-4b10-9692-2b976bcd9a09"
    },
    video: {
      title: "AI Agent Architecture: Memory, Tools & Planning Explained",
      channel: "Matthew Berman",
      views: "95,000+ 播放",
      url: "https://www.youtube.com/results?search_query=AI+Agent+Architecture+Matthew+Berman+2026"
    }
  },
  {
    day: 6,
    week: "week1",
    weekName: "Week 1: 基础筑基与前沿大图景",
    title: "MCP 模型上下文协议（Model Context Protocol）",
    desc: "深入学习 Anthropic 发起的 MCP 开放标准，打通数据与工具孤岛。",
    notebook: {
      title: "1. 智能体工程与工作流编排",
      url: "https://notebook.google.com/notebook/74b513d8-fb94-4b10-9692-2b976bcd9a09"
    },
    video: {
      title: "Model Context Protocol (MCP): The Universal Bridge for AI",
      channel: "Cole Medin",
      views: "42,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Model+Context+Protocol+MCP+Tutorial"
    }
  },
  {
    day: 7,
    week: "week1",
    weekName: "Week 1: 基础筑基与前沿大图景",
    title: "Week 1 阶段复盘与 NotebookLM 播客生成",
    desc: "在 NotebookLM 中生成第一周的双人深度对话 Audio Overview，总结底层技术逻辑。",
    notebook: {
      title: "1. 智能体工程与工作流编排",
      url: "https://notebook.google.com/notebook/74b513d8-fb94-4b10-9692-2b976bcd9a09"
    },
    video: {
      title: "How to Supercharge Learning with Google NotebookLM Studio",
      channel: "Matt Wolfe",
      views: "180,000+ 播放",
      url: "https://www.youtube.com/results?search_query=NotebookLM+Studio+Audio+Overview"
    }
  },

  // ================= Week 2: AI 医疗 (Medical AI) 深度沉浸 =================
  {
    day: 8,
    week: "week2",
    weekName: "Week 2: AI 医疗深度沉浸",
    title: "企业级医疗 AI 落地与临床痛点分析",
    desc: "学习医疗行业严苛的合规要求、HIPAA 隐私保护与医生在环决策支持。",
    notebook: {
      title: "2. 检索增强与知识工程（RAG）",
      url: "https://notebook.google.com/notebook/bcaa84cd-2d4d-423c-84d0-cb1d33ef0c01"
    },
    video: {
      title: "Diving into Enterprise Healthcare AI for 2026",
      channel: "Scale AI",
      views: "45,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Enterprise+Healthcare+AI+Scale+AI"
    }
  },
  {
    day: 9,
    week: "week2",
    weekName: "Week 2: AI 医疗深度沉浸",
    title: "GraphRAG 与医疗临床知识检索（零幻觉）",
    desc: "掌握知识图谱与向量检索结合，如何消除医学问答中的事实性幻觉。",
    notebook: {
      title: "2. 检索增强与知识工程（RAG）",
      url: "https://notebook.google.com/notebook/bcaa84cd-2d4d-423c-84d0-cb1d33ef0c01"
    },
    video: {
      title: "GraphRAG: Knowledge Graphs for Precision AI in Healthcare",
      channel: "Microsoft Developer",
      views: "72,000+ 播放",
      url: "https://www.youtube.com/results?search_query=GraphRAG+Knowledge+Graph+Healthcare"
    }
  },
  {
    day: 10,
    week: "week2",
    weekName: "Week 2: AI 医疗深度沉浸",
    title: "医学专业大模型（Med-PaLM / BioMistral）",
    desc: "研读专业医学大模型的预训练语料配比与医学问诊对齐技术。",
    notebook: {
      title: "3. 提示词工程与模型微调对齐",
      url: "https://notebook.google.com/notebook/e9f2a6e2-1adf-4e12-b5dd-0789cfcca77f"
    },
    video: {
      title: "How Medical AI Models Are Trained: From Bench to Bedside",
      channel: "Stanford Online",
      views: "38,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Stanford+Medical+AI+Series+2026"
    }
  },
  {
    day: 11,
    week: "week2",
    weekName: "Week 2: AI 医疗深度沉浸",
    title: "斯坦福 RAISE Health 2026 研讨会精读",
    desc: "探讨可信赖医学 AI 评测基准、临床偏见消除与患者隐私安全。",
    notebook: {
      title: "2. 检索增强与知识工程（RAG）",
      url: "https://notebook.google.com/notebook/bcaa84cd-2d4d-423c-84d0-cb1d33ef0c01"
    },
    video: {
      title: "RAISE Health Symposium: Trustworthy AI in Clinical Practice",
      channel: "Stanford Medicine",
      views: "35,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Stanford+Medicine+RAISE+Health+2026"
    }
  },
  {
    day: 12,
    week: "week2",
    weekName: "Week 2: AI 医疗深度沉浸",
    title: "多模态 AI 医学影像（CT/MRI/病理切片分析）",
    desc: "学习多模态视觉模型在病灶识别、早期筛查与报告自动化中的应用。",
    notebook: {
      title: "4. 多模态理解与原生应用开发",
      url: "https://notebook.google.com/notebook/dbd07108-645a-450b-91f1-55ec65b4f4f3"
    },
    video: {
      title: "AI in Medical Imaging: From CNNs to Vision Foundation Models",
      channel: "The Health AI Brief",
      views: "28,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Medical+Imaging+AI+Vision+Foundation+Models"
    }
  },
  {
    day: 13,
    week: "week2",
    weekName: "Week 2: AI 医疗深度沉浸",
    title: "AI 制药（Drug Discovery）与蛋白质设计",
    desc: "了解 AlphaFold、生成式小分子设计与靶点发现的最新进展。",
    notebook: {
      title: "4. 多模态理解与原生应用开发",
      url: "https://notebook.google.com/notebook/dbd07108-645a-450b-91f1-55ec65b4f4f3"
    },
    video: {
      title: "How AI Is Quietly Revolutionizing Drug Discovery & Medicine",
      channel: "AI at Work",
      views: "48,000+ 播放",
      url: "https://www.youtube.com/results?search_query=AI+Drug+Discovery+Revolution+2026"
    }
  },
  {
    day: 14,
    week: "week2",
    weekName: "Week 2: AI 医疗深度沉浸",
    title: "Week 2 实战：设计你的医疗问诊知识库",
    desc: "在 NotebookLM 中整理临床指南，构建一个慢病管理或专科问答助手原型。",
    notebook: {
      title: "2. 检索增强与知识工程（RAG）",
      url: "https://notebook.google.com/notebook/bcaa84cd-2d4d-423c-84d0-cb1d33ef0c01"
    },
    video: {
      title: "Building Clinical Decision Support with Modern RAG",
      channel: "FreeCodeCamp",
      views: "140,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Building+RAG+Clinical+Healthcare"
    }
  },

  // ================= Week 3: AI 硬件与潮玩/陪伴机器人 =================
  {
    day: 15,
    week: "week3",
    weekName: "Week 3: AI 硬件与潮玩机器人",
    title: "2026 AI 独立硬件成败复盘与行业反思",
    desc: "深度剖析 Plaud Note 录音笔、Humane AI Pin 与 Rabbit R1 的产品逻辑与分水岭。",
    notebook: {
      title: "5. 具身智能与端侧物理交互",
      url: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560"
    },
    video: {
      title: "The Reality of AI Hardware in 2026: What Actually Sells",
      channel: "Marques Brownlee (MKBHD)",
      views: "350,000+ 播放",
      url: "https://www.youtube.com/results?search_query=MKBHD+AI+Hardware+Review"
    }
  },
  {
    day: 16,
    week: "week3",
    weekName: "Week 3: AI 硬件与潮玩机器人",
    title: "AI 智能眼镜与微型穿戴交互（AR/Audio Glasses）",
    desc: "拆解 Rokid、Ray-Ban Meta 等智能眼镜的第一人称视觉与语音交互设计。",
    notebook: {
      title: "4. 多模态理解与原生应用开发",
      url: "https://notebook.google.com/notebook/dbd07108-645a-450b-91f1-55ec65b4f4f3"
    },
    video: {
      title: "Smart AI Glasses 2026: Hands-On & Teardown",
      channel: "The Verge",
      views: "220,000+ 播放",
      url: "https://www.youtube.com/results?search_query=The+Verge+Smart+AI+Glasses"
    }
  },
  {
    day: 17,
    week: "week3",
    weekName: "Week 3: AI 硬件与潮玩机器人",
    title: "AI 潮玩与情感陪伴机器人（Loona / Miko）",
    desc: "分析情绪价值、性格模型与多模态情感计算在玩具硬件中的集成。",
    notebook: {
      title: "5. 具身智能与端侧物理交互",
      url: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560"
    },
    video: {
      title: "Smart AI Toys & Companion Robots — Teardown & Tech Analysis",
      channel: "CNET",
      views: "120,000+ 播放",
      url: "https://www.youtube.com/results?search_query=CNET+AI+Companion+Robots+Teardown"
    }
  },
  {
    day: 18,
    week: "week3",
    weekName: "Week 3: AI 硬件与潮玩机器人",
    title: "开源机器人玩具与硬件生态（Microduck / Pollen）",
    desc: "探索 Hugging Face 与开源社区驱动的低成本具身智能硬件新浪潮。",
    notebook: {
      title: "5. 具身智能与端侧物理交互",
      url: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560"
    },
    video: {
      title: "Building Affordable Physical AI: The Microduck Phenomenon",
      channel: "Hugging Face / LeRobot",
      views: "45,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Hugging+Face+LeRobot+Microduck"
    }
  },
  {
    day: 19,
    week: "week3",
    weekName: "Week 3: AI 硬件与潮玩机器人",
    title: "四足机器狗与运动控制（Unitree Go2 Pro）",
    desc: "学习强化学习（RL）步态控制、激光雷达 SLAM 与跟随避障算法。",
    notebook: {
      title: "5. 具身智能与端侧物理交互",
      url: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560"
    },
    video: {
      title: "Unitree Go2 Pro Quadruped Robot: Inside the Tech",
      channel: "RobotLAB",
      views: "85,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Unitree+Go2+Pro+RobotLAB"
    }
  },
  {
    day: 20,
    week: "week3",
    weekName: "Week 3: AI 硬件与潮玩机器人",
    title: "VLA（视觉-语言-动作）具身大模型原理",
    desc: "研读 $\pi_0$、OpenVLA 如何让大模型从“生成文字”跨越到“驱动机械动作”。",
    notebook: {
      title: "5. 具身智能与端侧物理交互",
      url: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560"
    },
    video: {
      title: "Vision-Language-Action (VLA) Models Explained in Depth",
      channel: "Yannic Kilcher",
      views: "52,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Vision+Language+Action+Models+Explained"
    }
  },
  {
    day: 21,
    week: "week3",
    weekName: "Week 3: AI 硬件与潮玩机器人",
    title: "Week 3 阶段复盘：AI 潮玩产品架构拆解",
    desc: "绘制一张包含传感器层、端云协同推理层与执行机构的智能玩具系统架构图。",
    notebook: {
      title: "5. 具身智能与端侧物理交互",
      url: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560"
    },
    video: {
      title: "How to Build an AI Hardware Product in 2026",
      channel: "Hardware Pioneers",
      views: "32,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Build+AI+Hardware+Product+2026"
    }
  },

  // ================= Week 4: 前沿融合与端到端产品实战 =================
  {
    day: 22,
    week: "week4",
    weekName: "Week 4: 前沿融合与产品实战",
    title: "端侧算力芯片（NVIDIA Jetson Thor / 高通 Dragonwing）",
    desc: "学习端侧 NPU 加速、模型量化（INT4/FP8）与无网络离线运行策略。",
    notebook: {
      title: "5. 具身智能与端侧物理交互",
      url: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560"
    },
    video: {
      title: "NVIDIA Jetson Thor: The Brain Behind Next-Gen Robotics",
      channel: "NVIDIA Developer",
      views: "95,000+ 播放",
      url: "https://www.youtube.com/results?search_query=NVIDIA+Jetson+Thor+Robotics"
    }
  },
  {
    day: 23,
    week: "week4",
    weekName: "Week 4: 前沿融合与产品实战",
    title: "AI 医疗 + AI 玩具跨界：疗愈陪伴硬件（Tombot）",
    desc: "剖析阿尔茨海默症伴侣机器狗、儿童孤独症康复玩具等医疗级硬件新蓝海。",
    notebook: {
      title: "5. 具身智能与端侧物理交互",
      url: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560"
    },
    video: {
      title: "Tombot & Therapeutic AI Pets: How Robotics Heals at CES 2026",
      channel: "AgeTech Tech",
      views: "40,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Tombot+Therapeutic+AI+Pet+CES+2026"
    }
  },
  {
    day: 24,
    week: "week4",
    weekName: "Week 4: 前沿融合与产品实战",
    title: "智能穿戴医疗监测（无感 ECG/PPG 与 AI 慢病预警）",
    desc: "了解连续生物信号采集与端侧轻量级时序模型预测的结合范式。",
    notebook: {
      title: "4. 多模态理解与原生应用开发",
      url: "https://notebook.google.com/notebook/dbd07108-645a-450b-91f1-55ec65b4f4f3"
    },
    video: {
      title: "Wearable Health Tech: The AI Revolution in Preventative Medicine",
      channel: "Engadget",
      views: "68,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Wearable+Health+Tech+AI+Revolution"
    }
  },
  {
    day: 25,
    week: "week4",
    weekName: "Week 4: 前沿融合与产品实战",
    title: "智能体安全、红队测试与医疗合规治理",
    desc: "学习 Prompt Injection 防御、幻觉护栏（Guardrails）与输出安全性校验。",
    notebook: {
      title: "1. 智能体工程与工作流编排",
      url: "https://notebook.google.com/notebook/74b513d8-fb94-4b10-9692-2b976bcd9a09"
    },
    video: {
      title: "AI Safety & Guardrails: Securing Production LLM Applications",
      channel: "DeepLearning.AI",
      views: "88,000+ 播放",
      url: "https://www.youtube.com/results?search_query=DeepLearning.AI+LLM+Safety+Guardrails"
    }
  },
  {
    day: 26,
    week: "week4",
    weekName: "Week 4: 前沿融合与产品实战",
    title: "端到端原型构想：AI 医疗/硬件方案立项",
    desc: "选定一个具体场景（如：儿童语音陪伴玩偶 / 社区智能慢病随访盒），编写产品需求文档 PRD。",
    notebook: {
      title: "1. 智能体工程与工作流编排",
      url: "https://notebook.google.com/notebook/74b513d8-fb94-4b10-9692-2b976bcd9a09"
    },
    video: {
      title: "From Idea to Prototype: Developing AI Products in 2026",
      channel: "Y Combinator",
      views: "190,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Y+Combinator+AI+Product+Development"
    }
  },
  {
    day: 27,
    week: "week4",
    weekName: "Week 4: 前沿融合与产品实战",
    title: "技术选型与物料清单（BOM）与成本核算",
    desc: "评估主控芯片、麦克风阵列、扬声器、电池续航与云端 API 调用的月度成本。",
    notebook: {
      title: "5. 具身智能与端侧物理交互",
      url: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560"
    },
    video: {
      title: "Hardware BOM & Unit Economics for Smart Connected Devices",
      channel: "Adafruit / SparkFun",
      views: "36,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Hardware+BOM+Smart+Devices+Tutorial"
    }
  },
  {
    day: 28,
    week: "week4",
    weekName: "Week 4: 前沿融合与产品实战",
    title: "使用 NotebookLM 一键生成项目总结报告",
    desc: "将 4 周学习的笔记和方案导入 NotebookLM，调用 report_create 生成专业企划报告。",
    notebook: {
      title: "1. 智能体工程与工作流编排",
      url: "https://notebook.google.com/notebook/74b513d8-fb94-4b10-9692-2b976bcd9a09"
    },
    video: {
      title: "NotebookLM Studio: Generate Reports, Slides & Mind Maps",
      channel: "David Ondrej",
      views: "115,000+ 播放",
      url: "https://www.youtube.com/results?search_query=NotebookLM+Studio+Reports+SlideDeck"
    }
  },
  {
    day: 29,
    week: "week4",
    weekName: "Week 4: 前沿融合与产品实战",
    title: "生成终期结业 Audio Overview 播客与信息图",
    desc: "在 Studio 中收听 AI 播客主持人对你 30 天掌握知识体系的总结与互动。",
    notebook: {
      title: "5. 具身智能与端侧物理交互",
      url: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560"
    },
    video: {
      title: "The Ultimate Guide to Google NotebookLM in 2026",
      channel: "Wes Roth",
      views: "160,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Wes+Roth+NotebookLM+Guide"
    }
  },
  {
    day: 30,
    week: "week4",
    weekName: "Week 4: 前沿融合与产品实战",
    title: "🏆 结业答辩：成为懂前沿、懂工程的实战派",
    desc: "回顾 30 天打卡记录，导出学习成果日志，踏上你的 AI 从业与创新创业新征程！",
    notebook: {
      title: "5. 具身智能与端侧物理交互",
      url: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560"
    },
    video: {
      title: "How to Build a Career in AI: Engineering, Research & Products",
      channel: "Andrew Ng / DeepLearning.AI",
      views: "280,000+ 播放",
      url: "https://www.youtube.com/results?search_query=Andrew+Ng+Career+in+AI+2026"
    }
  }
];

// 2. 数据集定义：5 大核心知识库与 2K 信息图
const GALLERY_DATA = [
  {
    id: "74b513d8-fb94-4b10-9692-2b976bcd9a09",
    title: "1. 智能体工程与工作流编排全景指南",
    domain: "AI Agent & Workflow",
    sourcesCount: 67,
    desc: "涵盖 2026 年最新的 MCP 标准协议、多 Agent 协作编排、记忆管理与企业级数字员工落地体系。",
    notebookUrl: "https://notebook.google.com/notebook/74b513d8-fb94-4b10-9692-2b976bcd9a09",
    imageUrl: "https://lh3.googleusercontent.com/notebooklm/AKYWMX9quDEH5fOOL9zCDeXP6ZqjAcEY8yeC4wpjeIcRpQJlqQZ49R6joZPKud8sRsn-gSM1Qfi57ZtiRgVhoFEp5ZiYHlP-OxyCz9pGkKcT06PGHg9LqKyns7bQQVgUssBdh6qo8JVmdGmztDaIGlg2hVBDMd7Q3A=w2752-d-h1536-mp2"
  },
  {
    id: "bcaa84cd-2d4d-423c-84d0-cb1d33ef0c01",
    title: "2. 高级 RAG 与企业知识工程架构图",
    domain: "Advanced RAG & GraphRAG",
    sourcesCount: 56,
    desc: "系统拆解文档智能切分、混合检索重排、GraphRAG 知识图谱与医疗级零幻觉长上下文优化方案。",
    notebookUrl: "https://notebook.google.com/notebook/bcaa84cd-2d4d-423c-84d0-cb1d33ef0c01",
    imageUrl: "https://lh3.googleusercontent.com/notebooklm/AKYWMX_d04uk-xaY3Jd6B2bigbRv9cXLVEwEYfEwS8u52Xl74aZ2lBqjimRiMs9T8ADrJ8aPsOB4BIFXqiiwZyxDQNPhRBZ1UG32I3mym5SVPrrG8wg2OvGOuKSdN3czeROMNUFguOEjHwJ1OtQru2g2rZoBWsbBRec=w2752-d-h1536-mp2"
  },
  {
    id: "e9f2a6e2-1adf-4e12-b5dd-0789cfcca77f",
    title: "3. 提示词工程与模型微调对齐指南",
    domain: "Prompting & Fine-Tuning",
    sourcesCount: 59,
    desc: "覆盖结构化 JSON 输出控制、思维链 CoT、LoRA/QLoRA 高效参数微调以及自动化对齐评测技术。",
    notebookUrl: "https://notebook.google.com/notebook/e9f2a6e2-1adf-4e12-b5dd-0789cfcca77f",
    imageUrl: "https://lh3.googleusercontent.com/notebooklm/AKYWMX_bsmId8KV9snjO70ff-5o7OBQ0UXNAiIS9tU1GF1ZCH9PS2Lzt8Lo94ojNHuWjgvvtfHXHy3y5MpH8lX3EDheOj02Xz9UjVQ8uFoxoTPDLQyqu_kayB0dDhPiOijeRNQTviM8qlfqUmQkOXu5bkz2t669Lpbs=w2752-d-h1536-mp2"
  },
  {
    id: "dbd07108-645a-450b-91f1-55ec65b4f4f3",
    title: "4. 多模态大模型与原生应用开发全景",
    domain: "Multimodal AI & Omni Models",
    sourcesCount: 83,
    desc: "深入原生统一多模态大模型（Omni）、实时全双工语音交互、医学影像识别及多模态 Agent 开发。",
    notebookUrl: "https://notebook.google.com/notebook/dbd07108-645a-450b-91f1-55ec65b4f4f3",
    imageUrl: "https://lh3.googleusercontent.com/notebooklm/AKYWMX-2NaLl2SI3-F9QIRtXiDcW0EA8l_c0AmpKF2HVIRUUZHrntqTxw5xMNAAgHic_V8aH3x0v0ln_Im3K7Hzy_uQ15nuSncWF_-pfvsHt539Gyq1Alcav2zQ1OG-BixV1nrERWESAbLvrFOCURMipJOKeWEEAig=w2752-d-h1536-mp2"
  },
  {
    id: "8df8800a-0bb3-4b00-82ec-c54420869560",
    title: "5. 具身智能与端侧 AI 落地全景图",
    domain: "Embodied AI & Edge Hardware",
    sourcesCount: 161,
    desc: "涵盖 VLA 视觉语言动作模型、物理常识推理仿真、人形机器人与四足潮玩玩具及 Jetson Thor 端侧部署。",
    notebookUrl: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560",
    imageUrl: "https://lh3.googleusercontent.com/notebooklm/AKYWMX_mT5dLDX7_vGU6ALStjh_B5jFzPdPz7vuf8I4jICpgnTCRWMEos7nXxtQ_ufWtJcW2TbJ93pITh-cAZ1IHBmtVBcs8iRha1408nVX-LWb1LqiB4NJymDvN1Fyxn7nGZKIXM3SAl34emCPJt2CRqhcXSaHWFQ=w2752-d-h1536-mp2"
  }
];

// 3. 数据集定义：全部 14 个笔记本元数据
const ALL_NOTEBOOKS_DATA = [
  { id: "74b513d8-fb94-4b10-9692-2b976bcd9a09", title: "1. 智能体工程与工作流编排（AI Agent & Workflow Engineering）", type: "ai", count: 67, url: "https://notebook.google.com/notebook/74b513d8-fb94-4b10-9692-2b976bcd9a09" },
  { id: "bcaa84cd-2d4d-423c-84d0-cb1d33ef0c01", title: "2. 检索增强与知识工程（RAG & Context Management）", type: "ai", count: 56, url: "https://notebook.google.com/notebook/bcaa84cd-2d4d-423c-84d0-cb1d33ef0c01" },
  { id: "e9f2a6e2-1adf-4e12-b5dd-0789cfcca77f", title: "3. 提示词工程与模型微调对齐（Prompt Engineering & Fine-Tuning）", type: "ai", count: 59, url: "https://notebook.google.com/notebook/e9f2a6e2-1adf-4e12-b5dd-0789cfcca77f" },
  { id: "dbd07108-645a-450b-91f1-55ec65b4f4f3", title: "4. 多模态理解与原生应用开发（Multimodal AI Application）", type: "ai", count: 83, url: "https://notebook.google.com/notebook/dbd07108-645a-450b-91f1-55ec65b4f4f3" },
  { id: "8df8800a-0bb3-4b00-82ec-c54420869560", title: "5. 具身智能与端侧物理交互（Embodied AI & Edge AI）", type: "ai", count: 161, url: "https://notebook.google.com/notebook/8df8800a-0bb3-4b00-82ec-c54420869560" },
  { id: "db333869-8c22-402f-87df-c8107019c69e", title: "华彩泥玩：AI赋能非遗传承与乡村振兴方案", type: "personal", count: 4, url: "https://notebook.google.com/notebook/db333869-8c22-402f-87df-c8107019c69e" },
  { id: "764fec9c-cf78-4064-a28f-14ee41c04d35", title: "水利英语考试", type: "personal", count: 3, url: "https://notebook.google.com/notebook/764fec9c-cf78-4064-a28f-14ee41c04d35" },
  { id: "85c7fb7d-2f89-431e-8f97-d20faf4739ab", title: "高数（重点主库）", type: "personal", count: 6, url: "https://notebook.google.com/notebook/85c7fb7d-2f89-431e-8f97-d20faf4739ab" },
  { id: "55157669-45f6-4587-84c6-100b0a896d7b", title: "26机器人比赛", type: "personal", count: 12, url: "https://notebook.google.com/notebook/55157669-45f6-4587-84c6-100b0a896d7b" },
  { id: "926620db-6aee-4485-8eb3-116feb5ed374", title: "英语（综合真题与词汇）", type: "personal", count: 19, url: "https://notebook.google.com/notebook/926620db-6aee-4485-8eb3-116feb5ed374" },
  { id: "0da57fdc-f54f-4d90-b0f7-d663d73f9d32", title: "水力学", type: "personal", count: 1, url: "https://notebook.google.com/notebook/0da57fdc-f54f-4d90-b0f7-d663d73f9d32" },
  { id: "6ae86d2d-8e0f-4994-8d9b-ea92bdbe8320", title: "高数（补充复习）", type: "personal", count: 4, url: "https://notebook.google.com/notebook/6ae86d2d-8e0f-4994-8d9b-ea92bdbe8320" },
  { id: "ae9696c2-4d91-4499-9289-f4a2f3ea70c8", title: "个人日常资料库 1", type: "personal", count: 9, url: "https://notebook.google.com/notebook/ae9696c2-4d91-4499-9289-f4a2f3ea70c8" },
  { id: "b7faad4e-65a2-48a8-81d3-9d892e6111d1", title: "阶段性参考库 2", type: "personal", count: 5, url: "https://notebook.google.com/notebook/b7faad4e-65a2-48a8-81d3-9d892e6111d1" }
];

// 本地存储键名
const STORAGE_KEY_PROGRESS = "ai_hub_study_progress_v1";
const STORAGE_KEY_NOTES = "ai_hub_study_notes_v1";

// 状态管理
let userProgress = JSON.parse(localStorage.getItem(STORAGE_KEY_PROGRESS) || "{}");
let userNotes = JSON.parse(localStorage.getItem(STORAGE_KEY_NOTES) || "{}");

// 初始化页面
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  renderTracker();
  renderGallery();
  renderNotebooks();
  updateGlobalStats();
  initModal();
  initExport();
});

// 1. 导航 Tab 切换
function initNavigation() {
  const navBtns = document.querySelectorAll(".nav-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      
      navBtns.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(targetTab).classList.add("active");
    });
  });
}

// 2. 渲染 30 天学习打卡看板
function renderTracker() {
  const container = document.getElementById("weeks-container");
  container.innerHTML = "";

  // 分周组合
  const weeks = [
    { key: "week1", name: "Week 1: 基础筑基与前沿大图景（LLM / 多模态 / Agent）", days: STUDY_PLAN_DATA.filter(d => d.week === "week1") },
    { key: "week2", name: "Week 2: AI 医疗 (Medical AI) 深度沉浸（临床 RAG / 影像）", days: STUDY_PLAN_DATA.filter(d => d.week === "week2") },
    { key: "week3", name: "Week 3: AI 硬件与潮玩/陪伴机器人（AI Pin / 眼镜 / 机器狗）", days: STUDY_PLAN_DATA.filter(d => d.week === "week3") },
    { key: "week4", name: "Week 4: 前沿融合与端到端产品实战（芯片 / 原型设计）", days: STUDY_PLAN_DATA.filter(d => d.week === "week4") }
  ];

  weeks.forEach(w => {
    const weekEl = document.createElement("div");
    weekEl.className = `week-block week-${w.key}`;
    
    // 计算本周完成度
    const completedInWeek = w.days.filter(d => userProgress[d.day]).length;
    
    weekEl.innerHTML = `
      <div class="week-header">
        <div class="week-title-wrap">
          <span class="week-tag">${w.key.toUpperCase()}</span>
          <h4>${w.name}</h4>
        </div>
        <span class="week-progress-pill" id="pill-${w.key}">
          已完成 ${completedInWeek} / ${w.days.length} 天
        </span>
      </div>
      <div class="days-grid">
        ${w.days.map(d => renderDayCard(d)).join("")}
      </div>
    `;

    container.appendChild(weekEl);
  });

  // 绑定 Checkbox & Note 事件
  attachTrackerEvents();
  initWeekFilter();
}

function renderDayCard(d) {
  const isChecked = !!userProgress[d.day];
  const noteText = userNotes[d.day] || "";

  return `
    <div class="day-card ${isChecked ? 'completed' : ''}" id="card-day-${d.day}">
      <div>
        <div class="day-card-header">
          <span class="day-number">DAY ${String(d.day).padStart(2, '0')}</span>
          <label class="day-checkbox-label">
            <input type="checkbox" class="day-checkbox" data-day="${d.day}" ${isChecked ? 'checked' : ''}>
            <span style="font-size:0.8rem; color:${isChecked ? 'var(--success)' : 'var(--text-muted)'}">
              ${isChecked ? '已打卡' : '标记完成'}
            </span>
          </label>
        </div>
        <h5 class="day-title">${d.title}</h5>
        <p class="day-desc">${d.desc}</p>
        
        <div class="resource-box">
          <div class="resource-row">
            <span class="resource-tag tag-notebook">📓 研读库</span>
            <a href="${d.notebook.url}" target="_blank" class="resource-link">
              ${d.notebook.title} ↗
            </a>
          </div>
          <div class="resource-row">
            <span class="resource-tag tag-video">🎬 精选视频</span>
            <a href="${d.video.url}" target="_blank" class="resource-link" title="${d.video.title}">
              ${d.video.title} (${d.video.views}) ↗
            </a>
          </div>
        </div>
      </div>

      <div class="day-card-footer">
        <textarea 
          class="note-textarea" 
          data-day="${d.day}" 
          placeholder="✍️ 记录今日学习心得、疑问或打卡笔记...">${noteText}</textarea>
      </div>
    </div>
  `;
}

// 绑定打卡事件
function attachTrackerEvents() {
  document.querySelectorAll(".day-checkbox").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const day = e.target.getAttribute("data-day");
      const card = document.getElementById(`card-day-${day}`);
      const label = e.target.nextElementSibling;

      if (e.target.checked) {
        userProgress[day] = true;
        card.classList.add("completed");
        label.textContent = "已打卡";
        label.style.color = "var(--success)";
      } else {
        delete userProgress[day];
        card.classList.remove("completed");
        label.textContent = "标记完成";
        label.style.color = "var(--text-muted)";
      }

      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(userProgress));
      updateGlobalStats();
      updateWeekPills();
    });
  });

  document.querySelectorAll(".note-textarea").forEach(ta => {
    ta.addEventListener("input", (e) => {
      const day = e.target.getAttribute("data-day");
      userNotes[day] = e.target.value;
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(userNotes));
    });
  });
}

// 周次过滤
function initWeekFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      const weekBlocks = document.querySelectorAll(".week-block");

      weekBlocks.forEach(wb => {
        if (filter === "all" || wb.classList.contains(`week-${filter}`)) {
          wb.style.display = "block";
        } else {
          wb.style.display = "none";
        }
      });
    });
  });
}

// 3. 更新全局打卡进度统计
function updateGlobalStats() {
  const completedCount = Object.keys(userProgress).length;
  const totalDays = 30;
  const percentage = Math.round((completedCount / totalDays) * 100);
  const remainingHours = (totalDays - completedCount) * 2;

  // 连续打卡计算
  let streak = 0;
  for (let i = 1; i <= totalDays; i++) {
    if (userProgress[i]) streak++;
    else if (i <= completedCount) streak = 0;
  }

  document.getElementById("completed-days").textContent = `${completedCount} / ${totalDays}`;
  document.getElementById("remaining-hours").textContent = `${remainingHours}`;
  document.getElementById("streak-days").textContent = `${streak}`;
  document.getElementById("ring-percent").textContent = `${percentage}%`;

  // 更新环形进度条
  const circle = document.querySelector(".progress-ring__circle");
  if (circle) {
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }

  // 进度条宽度
  document.getElementById("main-progress-bar").style.width = `${percentage}%`;

  // 称号勋章更新
  const badgeEl = document.getElementById("current-badge-name");
  if (percentage === 0) badgeEl.textContent = "🎖️ 称号：AI 启航新生";
  else if (percentage < 30) badgeEl.textContent = "🥉 称号：基础筑基先锋";
  else if (percentage < 60) badgeEl.textContent = "🥈 称号：AI 医疗研习学者";
  else if (percentage < 90) badgeEl.textContent = "🥇 称号：AI 硬件具身极客";
  else badgeEl.textContent = "👑 称号：AI 医疗与硬件大师";
}

function updateWeekPills() {
  const weeks = ["week1", "week2", "week3", "week4"];
  weeks.forEach(w => {
    const daysInWeek = STUDY_PLAN_DATA.filter(d => d.week === w);
    const completed = daysInWeek.filter(d => userProgress[d.day]).length;
    const pill = document.getElementById(`pill-${w}`);
    if (pill) {
      pill.textContent = `已完成 ${completed} / ${daysInWeek.length} 天`;
    }
  });
}

// 4. 渲染 2K 信息图展厅
function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  grid.innerHTML = GALLERY_DATA.map(item => `
    <div class="gallery-card">
      <div class="gallery-image-wrapper" onclick="openModal('${item.title}', '${item.imageUrl}', '${item.notebookUrl}')">
        <img src="${item.imageUrl}" alt="${item.title}" class="gallery-thumb" loading="lazy">
        <div class="image-overlay">
          <span class="overlay-btn">🔍 全屏高清查看</span>
        </div>
      </div>
      <div class="gallery-body">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <span class="badge-tag">${item.domain}</span>
            <span style="font-size:0.8rem; color:var(--primary-accent); font-weight:600;">${item.sourcesCount} 篇权威资料</span>
          </div>
          <h4 class="gallery-title">${item.title}</h4>
          <p class="gallery-desc">${item.desc}</p>
        </div>
        <div class="gallery-footer">
          <button class="btn-outline" onclick="openModal('${item.title}', '${item.imageUrl}', '${item.notebookUrl}')">
            🖼️ 预览高清原图
          </button>
          <a href="${item.notebookUrl}" target="_blank" class="btn-primary">
            📓 直达笔记本 ↗
          </a>
        </div>
      </div>
    </div>
  `).join("");
}

// 5. 渲染全部 14 个笔记本索引
function renderNotebooks(filterText = "") {
  const grid = document.getElementById("notebooks-grid");
  const filtered = ALL_NOTEBOOKS_DATA.filter(nb => 
    nb.title.toLowerCase().includes(filterText.toLowerCase())
  );

  grid.innerHTML = filtered.map(nb => `
    <div class="notebook-card">
      <div>
        <div class="nb-header">
          <span class="nb-badge ${nb.type}">${nb.type === 'ai' ? '🤖 2026 AI 深度研究' : '📚 个人学习库'}</span>
        </div>
        <h5 class="nb-title">${nb.title}</h5>
        <p class="nb-count">共收录 <strong>${nb.count}</strong> 篇参考资料及报告</p>
      </div>
      <a href="${nb.url}" target="_blank" class="btn-outline" style="text-align:center; justify-content:center;">
        进入 NotebookLM ↗
      </a>
    </div>
  `).join("");

  const searchInput = document.getElementById("notebook-search-input");
  if (searchInput && !searchInput.oninput) {
    searchInput.oninput = (e) => {
      renderNotebooks(e.target.value);
    };
  }
}

// 6. 全屏 Modal 逻辑
function initModal() {
  const modal = document.getElementById("image-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const backdrop = document.querySelector(".modal-backdrop");

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function openModal(title, imageUrl, notebookUrl) {
  const modal = document.getElementById("image-modal");
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-image").src = imageUrl;
  document.getElementById("modal-download-btn").href = imageUrl;
  document.getElementById("modal-open-nb-btn").href = notebookUrl;
  modal.classList.add("active");
}

function closeModal() {
  document.getElementById("image-modal").classList.remove("active");
}

// 7. 导出打卡记录
function initExport() {
  document.getElementById("btn-export-log").addEventListener("click", () => {
    const completedCount = Object.keys(userProgress).length;
    let md = `# 🎓 AI 医疗与 AI 硬件 30 天学习打卡记录\n\n`;
    md += `- **打卡统计**：已完成 ${completedCount} / 30 天\n`;
    md += `- **生成时间**：${new Date().toLocaleString()}\n\n---\n\n`;

    STUDY_PLAN_DATA.forEach(d => {
      const isDone = userProgress[d.day] ? "✅ 已完成" : "⬜ 未完成";
      const note = userNotes[d.day] || "（暂无个人笔记）";
      md += `### DAY ${d.day}: ${d.title} [${isDone}]\n`;
      md += `- **周次**：${d.weekName}\n`;
      md += `- **学习笔记**：${note}\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AI_30天学习打卡日志_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
