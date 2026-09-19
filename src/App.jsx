import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  ClipboardList,
  Cpu,
  Database,
  FileCheck,
  FileText,
  Gauge,
  GitCompare,
  Globe,
  Layers,
  Network,
  Maximize2,
  Pause,
  PenTool,
  PlayCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  UploadCloud,
  Volume2,
  Zap,
} from "lucide-react";

import PixelBlast from "./components/reactbits/PixelBlast/PixelBlast";
import GlareHover from "./components/reactbits/GlareHover/GlareHover";
import SpotlightCard from "./components/reactbits/SpotlightCard/SpotlightCard";
import StarBorder from "./components/reactbits/StarBorder/StarBorder";
import demo1Video from "../demo/demo1.mov";
import demoAllVideo from "../demo/demoall.mov";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const stages = [
  {
    id: "upload",
    number: "01",
    title: "智能体 CAD 图纸生成",
    short: "DWG",
    segmentStart: 0,
    segmentEnd: 20,
    icon: UploadCloud,
    accent: "#8f5cff",
    summary: "通过智能体流程生成 CAD 图纸，并为后续工艺规划准备输入。",
    result: "part_shaft.dwg / 2.45 MB / V1.2",
    metrics: [
      ["零件类型", "轴类"],
      ["图纸版本", "V1.2"],
      ["文件大小", "2.45 MB"],
    ],
    code: ['input: "part_shaft.dwg"', 'partType: "shaft"', 'revision: "V1.2"'],
  },
  {
    id: "extract",
    number: "02",
    title: "实体提取",
    short: "JSON",
    segmentStart: 12,
    segmentEnd: 48,
    icon: FileText,
    accent: "#2ce6c8",
    summary: "从 CAD 图纸中提取几何实体、标注和特征分组，形成结构化数据。",
    result: "126 entities / 34 annotations / 18 groups",
    metrics: [
      ["几何实体", "126"],
      ["识别标注", "34"],
      ["特征分组", "18"],
    ],
    code: ['entities: 126', 'annotations: 34', 'groups: 18', 'output: "config.json"'],
  },
  {
    id: "gnn",
    number: "03",
    title: "相似工艺检索",
    short: "Top-K",
    segmentStart: 48,
    segmentEnd: 57,
    icon: Network,
    accent: "#55a7ff",
    summary: "基于图纸结构和工艺特征相似度，检索历史相似工艺。",
    result: "Top 1 template score 0.94",
    metrics: [
      ["Top 1", "0.94"],
      ["Top 2", "0.89"],
      ["Top 3", "0.83"],
    ],
    code: ['retriever: "GNN"', 'topK: 3', 'bestMatch: "模板工艺 A"', 'score: 0.94'],
  },
  {
    id: "rag",
    number: "04",
    title: "工序序列生成",
    short: "RAG",
    segmentStart: 58,
    segmentEnd: 63,
    icon: Brain,
    accent: "#ffd166",
    summary: "结合相似工艺和工艺知识，生成目标零件的工序序列。",
    result: "5-step process generated",
    metrics: [
      ["知识源", "4"],
      ["工序数", "5"],
      ["置信度", "92%"],
    ],
    code: ['knowledge: ["轴类", "孔加工", "倒角", "质检"]', 'steps: 5', 'matcher: "LLM/RAG"'],
  },
  {
    id: "diff",
    number: "05",
    title: "LLM-RAG 参数与几何生成",
    short: "Param",
    segmentStart: 63,
    segmentEnd: 112,
    icon: GitCompare,
    accent: "#ff5c8a",
    summary: "通过 LLM-RAG 推理生成工艺参数和几何更新结果。",
    result: "4 diffs / 1 added / 3 modified",
    metrics: [
      ["差异项", "4"],
      ["新增项", "1"],
      ["修改项", "3"],
    ],
    code: ['孔径: "φ1.5 -> φ2.0"', '槽宽: "12mm -> 15mm"', '倒角: "45° -> 60°"'],
  },
  {
    id: "modify",
    number: "06",
    title: "上传至管理系统",
    short: "Upload",
    segmentStart: 112,
    segmentEnd: 125,
    icon: PenTool,
    accent: "#72ff8a",
    summary: "将生成的工艺数据和 CAD 结果上传到管理系统。",
    result: "modified_drawing.dwg ready",
    metrics: [
      ["联动特征", "4"],
      ["自动修正", "100%"],
      ["输出图纸", "DWG"],
    ],
    code: ['driver: "diff_ops.json"', 'update: ["holes", "slots", "chamfer", "fillet"]', 'export: "modified_drawing.dwg"'],
  },
  {
    id: "card",
    number: "07",
    title: "智能体工艺卡绘制",
    short: "Card",
    segmentStart: 125,
    segmentEnd: 188,
    icon: ClipboardList,
    accent: "#f7a84b",
    summary: "由智能体绘制工艺卡片，并组织形成完整工艺文档。",
    result: "工艺卡片.pdf / process_plan.json",
    metrics: [
      ["输出文件", "5"],
      ["工序表", "PDF"],
      ["结构化", "JSON"],
    ],
    code: ['files: ["process_plan.json", "diff_ops.json"]', 'card: "工艺卡片.pdf"', 'drawing: "modified_drawing.dwg"'],
  },
  {
    id: "compare",
    number: "08",
    title: "标准化输出",
    short: "Output",
    segmentStart: 188,
    segmentEnd: 238,
    icon: BarChart3,
    accent: "#b497cf",
    summary: "导出可审核、可归档、可交付的标准化工艺成果。",
    result: "90%+ time reduction",
    metrics: [
      ["时间降低", "90%+"],
      ["步骤减少", "80%+"],
      ["错误率降低", "95%+"],
    ],
    code: ['manualSteps: "-80%"', 'cycleTime: "-90%"', 'errorRate: "-95%"'],
  },
];

const processRows = [
  ["10", "粗车右端面", "车床", "5 min", "done"],
  ["20", "钻中心孔", "钻床", "4 min", "done"],
  ["30", "精车外圆", "车床", "8 min", "active"],
  ["40", "倒角与圆角修整", "机床", "6 min", "queued"],
  ["50", "检测", "检测设备", "3 min", "queued"],
];

const diffRows = [
  ["孔径", "φ1.5", "φ2.0", "modified"],
  ["槽宽", "12mm", "15mm", "modified"],
  ["倒角角度", "45°", "60°", "modified"],
  ["圆角半径", "R3", "R5", "added"],
];

const comparisonRows = [
  ["相似工艺查找", "人工经验", "关键词匹配", "GNN Top-K 检索"],
  ["工序匹配", "人工编写", "模板套用", "LLM/RAG 自动匹配"],
  ["图纸差异分析", "人工比对", "简单比对", "结构化 diff_ops"],
  ["CAD 修改", "手动修改", "手动调整", "差异驱动自动修改"],
  ["工艺卡片", "手动整理", "手动制作", "自动生成 PDF"],
  ["批量处理", "否", "部分支持", "支持批量处理"],
];

const uploadFileInfo = [
  ["文件名", "part_shaft.dwg"],
  ["零件类型", "轴类零件"],
  ["图纸版本", "V1.2"],
  ["创建时间", "2026-05-03"],
  ["文件大小", "2.45 MB"],
];

const knowledgeItems = ["轴类零件工艺知识", "孔加工工艺知识", "倒角与圆角工艺知识", "检测与质检知识"];

const capabilityItems = ["自然语言修改", "差异驱动修改", "孔 / 槽 / 倒角 / 圆角联动更新", "关联特征自动跟随"];

const outputFiles = ["modified_config.json", "process_plan.json", "diff_ops.json", "modified_drawing.dwg", "工艺卡片.pdf"];

const deliverables = {
  upload: ["目标 DWG 图纸", "上传界面截图", "基础文件信息"],
  extract: ["几何实体识别", "标注识别结果", "Groups 分组结果", "config.json"],
  gnn: ["目标图纸", "GNN 检索过程", "Top-K 结果截图"],
  rag: ["工艺知识库 RAG", "LLM/RAG 匹配过程", "生成工序流程"],
  diff: ["目标图纸 Target", "模板图纸 Template", "diff_ops.json", "差异报告"],
  modify: ["CAD 修改演示", "修改前 / 修改后对比图", "能力亮点"],
  card: ["最终 CAD 图纸", "工艺卡片 PDF", "工序流程表", "输出文件列表"],
  compare: ["人工方法 vs ProcessCAD 对比视频", "能力对比表", "效率指标"],
};

const fadeIn = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

function App() {
  const [activeStage, setActiveStage] = useState(0);
  const active = stages[activeStage];

  return (
    <div className="app-shell">
      <div className="pixel-background" aria-hidden="true">
        <PixelBlast
          variant="diamond"
          pixelSize={3}
          color="#de6bff"
          patternScale={1.35}
          patternDensity={1.42}
          pixelSizeJitter={0.62}
          enableRipples
          rippleSpeed={0.38}
          rippleThickness={0.14}
          rippleIntensityScale={1.65}
          liquid
          liquidStrength={0.09}
          liquidRadius={1.2}
          speed={0.58}
          transparent
          edgeFade={0.08}
          noiseAmount={0.045}
        />
        <PixelBlast
          className="pixel-accent-layer"
          variant="circle"
          pixelSize={5}
          color="#2ce6c8"
          patternScale={3.3}
          patternDensity={0.82}
          pixelSizeJitter={0.45}
          enableRipples={false}
          speed={0.34}
          transparent
          edgeFade={0.18}
        />
      </div>
      <div className="background-shade" aria-hidden="true" />

      <Header />

      <main>
        <section className="hero-section" id="overview">
          <motion.div className="hero-copy" variants={fadeIn} initial="hidden" animate="visible">
            <div className="inline-system">
              <Sparkles size={16} />
              AI + CAD + 工艺知识库
            </div>
            <h1>
              ProcessCAD
              <span> 智能工艺生成系统</span>
            </h1>
            <p>
              从目标 DWG 图纸出发，自动完成相似工艺检索、工序匹配、差异检查、CAD 修改与工艺卡片生成。
            </p>
            <div className="hero-actions">
              <StarBorder as="a" href="#workflow" color="#d45cff" speed="5s" thickness={1} className="primary-star">
                <PlayCircle size={18} />
                浏览工艺流程
              </StarBorder>
              <a className="ghost-link" href="#workspace">
                打开工作台
                <ArrowRight size={17} />
              </a>
            </div>

            <div className="signal-grid" aria-label="ProcessCAD 关键指标">
              <Metric label="实体识别" value="126" suffix="objects" tone="#2ce6c8" />
              <Metric label="Top-K 命中" value="0.94" suffix="score" tone="#55a7ff" />
              <Metric label="时间降低" value="90%+" suffix="cycle" tone="#ffd166" />
            </div>
          </motion.div>

          <motion.div
            className="hero-player-shell"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.12 }}
          >
            <ProcessCADVideoPlayer active={active} activeStage={activeStage} setActiveStage={setActiveStage} />
          </motion.div>
        </section>

        <section className="workflow-section" id="workflow">
          <SectionHeading
            icon={Activity}
            title="端到端工艺链路"
            text="旧 UI 的功能内容被保留为 8 个稳定阶段，新的界面把它们合并成一条可扫描、可操作的生成流水线。"
          />
          <div className="pipeline-rail">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <button
                  key={stage.id}
                  className={`pipeline-node ${index === activeStage ? "is-active" : ""}`}
                  style={{ "--stage-color": stage.accent }}
                  onClick={() => {
                setActiveStage(index);
                  const chapterTimes = stages.map((item) => item.segmentStart);
                const video = videoRef.current;
                if (video && chapterTimes[index] !== undefined) {
                  video.currentTime = chapterTimes[index];
                }
              }}
                >
                  <span className="node-index">{stage.number}</span>
                  <span className="node-icon">
                    <Icon size={19} />
                  </span>
                  <span>{stage.short}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="workspace-section" id="workspace">
          <div className="workspace-grid">
            <motion.aside className="stage-menu" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="panel-title">
                <Terminal size={18} />
                Stage Stack
              </div>
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                return (
                  <SpotlightCard
                    key={stage.id}
                    role="button"
                    tabIndex={0}
                    className={`stage-card ${index === activeStage ? "is-selected" : ""}`}
                    spotlightColor={`${stage.accent}44`}
                    style={{ "--stage-color": stage.accent }}
                    onClick={() => {
                setActiveStage(index);
                    const chapterTimes = stages.map((item) => item.segmentStart);
                const video = videoRef.current;
                if (video && chapterTimes[index] !== undefined) {
                  video.currentTime = chapterTimes[index];
                }
              }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") setActiveStage(index);
                    }}
                  >
                    <span className="stage-number">{stage.number}</span>
                    <span className="stage-icon">
                      <Icon size={18} />
                    </span>
                    <span className="stage-title">{stage.title}</span>
                  </SpotlightCard>
                );
              })}
            </motion.aside>

            <motion.div
              className="command-panel"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="panel-topbar">
                <div>
                  <span className="small-label">{active.number}</span>
                  <h2>{active.title}</h2>
                </div>
                <div className="live-chip">
                  <span />
                  Running
                </div>
              </div>

              <p className="stage-summary">{active.summary}</p>

              <StageDetail active={active} />
            </motion.div>

            <motion.aside
              className="result-panel"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="panel-title">
                <CheckCircle2 size={18} />
                Output
              </div>
              <div className="result-glow" style={{ "--stage-color": active.accent }}>
                <span>{active.number}</span>
                <strong>{active.result}</strong>
              </div>
              <DeliverableSummary active={active} />
            </motion.aside>
          </div>
        </section>

        <section className="analysis-section" id="analysis">
          <SectionHeading
            icon={GitCompare}
            title="差异驱动修改"
            text="差异项直接进入 CAD 修改驱动层，避免人工在图纸、模板和工艺文件之间来回转录。"
          />
          <div className="analysis-grid">
            <div className="diff-panel">
              <div className="panel-title">
                <Search size={18} />
                Target vs Template
              </div>
              <div className="diff-table">
                {diffRows.map(([name, before, after, type]) => (
                  <div key={name} className={`diff-row ${type}`}>
                    <span>{name}</span>
                    <code>{before}</code>
                    <ArrowRight size={15} />
                    <code>{after}</code>
                  </div>
                ))}
              </div>
            </div>

            <div className="process-panel">
              <div className="panel-title">
                <ClipboardList size={18} />
                Process Plan
              </div>
              <table>
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>工序</th>
                    <th>设备</th>
                    <th>时间</th>
                  </tr>
                </thead>
                <tbody>
                  {processRows.map(([step, name, machine, time, status]) => (
                    <tr key={step} className={status}>
                      <td>{step}</td>
                      <td>{name}</td>
                      <td>{machine}</td>
                      <td>{time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="comparison-section" id="compare">
          <SectionHeading
            icon={BarChart3}
            title="现有方法对比"
            text="同一组旧 UI 内容在新界面里以深色数据面板展示，更适合演示自动化收益和交付物状态。"
          />
          <div className="comparison-table">
            <div className="comparison-head">
              <span>能力</span>
              <span>人工工艺设计</span>
              <span>传统模板复制</span>
              <span>ProcessCAD 自动生成</span>
            </div>
            {comparisonRows.map((row) => (
              <div className="comparison-row" key={row[0]}>
                {row.map((cell, index) => (
                  <span key={`${row[0]}-${cell}`} className={index === 3 ? "smart-cell" : ""}>
                    {cell}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div className="roi-strip">
            <GlareHover width="100%" height="138px" borderRadius="18px" borderColor="rgba(255,255,255,0.14)" background="rgba(13,10,23,0.74)" glareColor="#2ce6c8" glareOpacity={0.24}>
              <Kpi icon={Gauge} label="处理时间降低" value="90%+" />
            </GlareHover>
            <GlareHover width="100%" height="138px" borderRadius="18px" borderColor="rgba(255,255,255,0.14)" background="rgba(13,10,23,0.74)" glareColor="#ffd166" glareOpacity={0.24}>
              <Kpi icon={Zap} label="操作步骤减少" value="80%+" />
            </GlareHover>
            <GlareHover width="100%" height="138px" borderRadius="18px" borderColor="rgba(255,255,255,0.14)" background="rgba(13,10,23,0.74)" glareColor="#72ff8a" glareOpacity={0.24}>
              <Kpi icon={ShieldCheck} label="错误率降低" value="95%+" />
            </GlareHover>
          </div>
        </section>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="top-nav">
      <a className="brand" href="#overview" aria-label="ProcessCAD 首页">
        <span className="brand-mark">
          <Cpu size={22} />
        </span>
        <span>ProcessCAD</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#workflow">流程</a>
        <a href="#workspace">工作台</a>
        <a href="#analysis">差异检查</a>
        <a href="#compare">对比分析</a>
      </nav>
      <a className="lang-switch" href="index.html" title="切换到英文页面">
        <Globe size={16} />
        English Page
      </a>
      <a className="nav-cta" href="#workspace">
        <Database size={16} />
        Demo
      </a>
    </header>
  );
}

function SectionHeading({ icon: Icon, title, text }) {
  return (
    <motion.div className="section-heading" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <span>
        <Icon size={18} />
      </span>
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </motion.div>
  );
}

function Metric({ label, value, suffix, tone }) {
  return (
    <GlareHover
      width="100%"
      height="112px"
      background="rgba(13,10,23,0.72)"
      borderRadius="18px"
      borderColor="rgba(255,255,255,0.14)"
      glareColor={tone}
      glareOpacity={0.22}
    >
      <div className="metric" style={{ "--metric-tone": tone }}>
        <span>{label}</span>
        <strong>{value}</strong>
        <em>{suffix}</em>
      </div>
    </GlareHover>
  );
}

function Kpi({ icon: Icon, label, value }) {
  return (
    <div className="kpi">
      <Icon size={22} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function ProcessCADVideoPlayer({ active, activeStage, setActiveStage }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => setDuration(video.duration);
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen().catch(() => {});
    }
  };

  const handleTimelineClick = (e) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    video.currentTime = ratio * video.duration;
  };

  const ActiveIcon = active.icon;

  return (
    <div className="smart-video">
      <div className="video-topbar">
        <div className="window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <strong>ProcessCAD @XJTU</strong>
          <span>{active.title}</span>
        </div>
        <button className="video-mode" type="button" onClick={() => setActiveStage(0)}>
          DWG 演示
        </button>
      </div>

      <div className="video-stage" style={{ "--stage-color": active.accent }}>
        <video
          ref={videoRef}
          className="video-element"
          src={demo1Video}
          autoPlay
          loop
          playsInline
          muted
          preload="metadata"
          onClick={togglePlay}
        />
        <div className="video-hud top-left">
          <ActiveIcon size={18} />
          <span>{active.number}</span>
          <strong>{active.short}</strong>
        </div>
        <div className="video-hud top-right">
          <span className="record-dot" />
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <div className="video-caption">
          <strong>{active.title}</strong>
          <span>{active.summary}</span>
        </div>
        <button className="video-play-float" type="button" onClick={togglePlay}>
          {isPlaying ? <Pause size={30} /> : <PlayCircle size={34} />}
        </button>
      </div>

      <div className="video-controls">
        <button type="button" className="control-button" onClick={togglePlay} aria-label={isPlaying ? "暂停演示视频" : "播放演示视频"}>
          {isPlaying ? <Pause size={18} /> : <PlayCircle size={19} />}
        </button>
        <div className="timeline" aria-label="ProcessCAD 演示播放进度" onClick={handleTimelineClick}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <button type="button" className="control-button" onClick={toggleMute} aria-label={isMuted ? "取消静音" : "静音"}>
          {isMuted ? <Volume2 size={18} /> : <Volume2 size={18} />}
        </button>
        <button type="button" className="control-button" onClick={toggleFullscreen} aria-label="全屏">
          <Maximize2 size={18} />
        </button>
      </div>

      <div className="video-chapters">
        {stages.slice(0, 4).map((stage, index) => {
          const Icon = stage.icon;
          return (
            <button
              key={stage.id}
              type="button"
              className={index === activeStage ? "chapter active" : "chapter"}
              style={{ "--stage-color": stage.accent }}
              onClick={() => {
                setActiveStage(index);
                const chapterTimes = stages.map((item) => item.segmentStart);
                const video = videoRef.current;
                if (video && chapterTimes[index] !== undefined) {
                  video.currentTime = chapterTimes[index];
                }
              }}
            >
              <Icon size={15} />
              <span>{stage.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StageDetail({ active }) {
  const props = { active };
  switch (active.id) {
    case "upload":
      return <UploadStage {...props} />;
    case "extract":
      return <ExtractStage {...props} />;
    case "gnn":
      return <GnnStage {...props} />;
    case "rag":
      return <RagStage {...props} />;
    case "diff":
      return <DiffStage {...props} />;
    case "modify":
      return <ModifyStage {...props} />;
    case "card":
      return <CardStage {...props} />;
    case "compare":
      return <CompareStage {...props} />;
    default:
      return null;
  }
}

function UploadStage({ active }) {
  return (
    <div className="stage-detail stage-upload">
      <DemoVideoCard title={active.title} active={active} size="wide" src={demoAllVideo} segmentStart={active.segmentStart} segmentEnd={active.segmentEnd} />
      <div className="detail-grid upload-grid">
        <MediaTile tone="dark" title="原始 DWG 图纸缩略图" path={assetPath("/assets/smartcad/target_dwg.png")} />
        <MediaTile title="DWG 上传界面截图" path={assetPath("/assets/smartcad/02_upload.png")} />
        <InfoBox title="文件信息" rows={uploadFileInfo} accent={active.accent} />
      </div>
    </div>
  );
}

function ExtractStage({ active }) {
  return (
    <div className="stage-detail">
      <DemoVideoCard title={active.title} active={active} size="wide" src={demoAllVideo} segmentStart={active.segmentStart} segmentEnd={active.segmentEnd} />
      <div className="detail-grid three-media">
        <MediaTile tone="dark" title="几何实体识别" path={assetPath("/assets/smartcad/geometry_entity.png")} />
        <MediaTile tone="dark" title="标注识别结果" path={assetPath("/assets/smartcad/annotation_result.png")} />
        <MediaTile tone="dark" title="Groups 分组结果" path={assetPath("/assets/smartcad/groups_result.png")} />
      </div>
      <InfoBox
        title="提取结果"
        accent={active.accent}
        rows={[
          ["提取实体", "126 个"],
          ["识别标注", "34 个"],
          ["特征分组", "18 组"],
          ["输出文件", "config.json"],
        ]}
      />
    </div>
  );
}

function GnnStage({ active }) {
  return (
    <div className="stage-detail">
      <div className="detail-grid split-media">
        <MediaTile tone="dark" title="目标图纸" path={assetPath("/assets/smartcad/target_dwg.png")} />
        <DemoVideoCard title={active.title} active={active} src={demoAllVideo} segmentStart={active.segmentStart} segmentEnd={active.segmentEnd} />
      </div>
      <div className="topk-layout">
        <div className="topk-list">
          <h3>Top-K 相似工艺</h3>
          {[
            ["Top 1", "模板工艺 A", "0.94"],
            ["Top 2", "模板工艺 B", "0.89"],
            ["Top 3", "模板工艺 C", "0.83"],
          ].map(([rank, name, score]) => (
            <div className="topk-row" key={rank}>
              <strong>{rank}</strong>
              <span>{name}</span>
              <em>{score}</em>
            </div>
          ))}
        </div>
        <MediaTile title="Top-K 结果截图" path={assetPath("/assets/smartcad/topk.png")} />
      </div>
    </div>
  );
}

function RagStage({ active }) {
  return (
    <div className="stage-detail">
      <InfoBox title="工艺知识库 RAG" accent={active.accent} rows={knowledgeItems.map((item) => ["知识条目", item])} />
      <DemoVideoCard title={active.title} active={active} size="wide" src={demoAllVideo} segmentStart={active.segmentStart} segmentEnd={active.segmentEnd} />
      <div className="process-list">
        <h3>生成工序流程</h3>
        {processRows.map(([step, name]) => (
          <div className="process-step" key={step}>
            <strong>{step}</strong>
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiffStage({ active }) {
  return (
    <div className="stage-detail">
      <div className="detail-grid diff-top">
        <MediaTile tone="dark" title="目标图纸 Target" path={assetPath("/assets/smartcad/target_dwg.png")} />
        <DiffMatrix />
        <MediaTile tone="dark" title="模板图纸 Template" path={assetPath("/assets/smartcad/template_dwg.png")} />
      </div>
      <div className="detail-grid diff-mid">
        <InfoBox
          title="差异统计"
          accent={active.accent}
          rows={[
            ["差异项", "4 项"],
            ["新增项", "1 项"],
            ["缺失项", "0 项"],
            ["修改项", "3 项"],
          ]}
        />
        <TextPanel title="检查说明">
          系统根据目标图纸与模板图纸的结构化特征进行对齐，自动输出孔径、槽宽、倒角、圆角等差异项，并作为后续 CAD 智能修改的驱动依据。
        </TextPanel>
      </div>
      <div className="detail-grid split-media">
        <DemoVideoCard title={active.title} active={active} src={demoAllVideo} segmentStart={active.segmentStart} segmentEnd={active.segmentEnd} />
        <MediaTile title="差异报告截图 diff_ops.json / report" path={assetPath("/assets/smartcad/10_diff_report.png")} />
      </div>
    </div>
  );
}

function ModifyStage({ active }) {
  return (
    <div className="stage-detail">
      <DemoVideoCard title={active.title} active={active} size="wide" src={demoAllVideo} segmentStart={active.segmentStart} segmentEnd={active.segmentEnd} />
      <MediaTile title="修改前 / 修改后对比图" path={assetPath("/assets/smartcad/12_before_after.png")} tall />
      <FeaturePanel title="能力亮点" items={capabilityItems} accent={active.accent} />
    </div>
  );
}

function CardStage({ active }) {
  return (
    <div className="stage-detail">
      <DemoVideoCard title={active.title} active={active} size="wide" src={demoAllVideo} segmentStart={active.segmentStart} segmentEnd={active.segmentEnd} />
      <div className="detail-grid split-media">
        <MediaTile tone="dark" title="最终 CAD 图纸" path={assetPath("/assets/smartcad/final_cad.png")} />
        <MediaTile title="工艺卡片 PDF 预览" path={assetPath("/assets/smartcad/13_process_card_preview.png")} />
      </div>
      <div className="detail-grid card-bottom">
        <ProcessTable />
        <FeaturePanel title="输出文件列表" items={outputFiles} accent={active.accent} dangerLast />
      </div>
    </div>
  );
}

function CompareStage({ active }) {
  return (
    <div className="stage-detail">
      <DemoVideoCard title={active.title} active={active} size="wide" src={demoAllVideo} segmentStart={active.segmentStart} segmentEnd={active.segmentEnd} />
      <ComparisonMatrix compact />
      <div className="detail-grid compare-stats">
        <StatPill label="处理时间降低" value="90%+" />
        <StatPill label="人工操作步骤减少" value="80%+" />
        <StatPill label="批量处理能力提升" value="100%+" />
        <StatPill label="错误率降低" value="95%+" />
      </div>
    </div>
  );
}

function DemoVideoCard({ title, active, size = "normal", src, segmentStart = 0, segmentEnd }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [vidCurrent, setVidCurrent] = useState(0);
  const [vidDuration, setVidDuration] = useState(0);
  const vidProgress = vidDuration > 0 ? (vidCurrent / vidDuration) * 100 : 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const segmentDuration = segmentEnd ? Math.max(segmentEnd - segmentStart, 0) : 0;
    const getDisplayedTime = () => Math.max(0, Math.min((video.currentTime || 0) - segmentStart, segmentDuration || video.duration || 0));
    const onMeta = () => {
      setVidDuration(segmentDuration || video.duration);
      video.currentTime = segmentStart;
      setVidCurrent(0);
      video.play().catch(() => {});
    };
    const onTime = () => {
      if (segmentEnd && video.currentTime >= segmentEnd) {
        video.pause();
        video.currentTime = segmentStart;
        setVidCurrent(0);
        return;
      }
      setVidCurrent(getDisplayedTime());
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      if (videoRef.current) {
        const dur = segmentDuration || videoRef.current.duration;
        setVidDuration(dur);
        setVidCurrent(dur);
      }
      setPlaying(false);
    };
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, [src, segmentStart, segmentEnd]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      if (segmentEnd && (v.currentTime < segmentStart || v.currentTime >= segmentEnd)) {
        v.currentTime = segmentStart;
      }
      v.play().catch(() => {});
    } else { v.pause(); }
  };

  const Icon = active.icon;

  if (!src) {
    return (
      <div className={`demo-video ${size}`} style={{ "--stage-color": active.accent }}>
        <div className="video-label">{title}</div>
        <div className="demo-video-grid" />
        <Icon className="demo-video-icon" size={56} />
        <button className="demo-video-play" type="button" aria-label={`播放${title}`}>
          <PlayCircle size={28} />
        </button>
        <div className="demo-video-controls">
          <span>0:00</span>
          <div className="demo-timeline"><span /></div>
          <Volume2 size={15} />
          <Maximize2 size={15} />
        </div>
      </div>
    );
  }

  return (
    <div className={`demo-video ${size}`} style={{ "--stage-color": active.accent }}>
      <div className="video-label">{title}</div>
      <video ref={videoRef} className="demo-video-real" src={src} autoPlay muted playsInline preload="metadata" onClick={toggle} />
      {!playing && (
        <button className="demo-video-play" type="button" onClick={toggle} aria-label={`播放${title}`}>
          <PlayCircle size={28} />
        </button>
      )}
      <div className="demo-video-controls">
        <span>{formatTime(vidCurrent)}</span>
        <div className="demo-timeline" onClick={(e) => {
          const v = videoRef.current;
          if (!v || !v.duration) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const duration = segmentEnd ? segmentEnd - segmentStart : v.duration;
          v.currentTime = segmentStart + ((e.clientX - rect.left) / rect.width) * duration;
        }}>
          <span style={{ width: `${vidProgress}%` }} />
        </div>
        <Volume2 size={15} />
        <Maximize2 size={15} />
      </div>
    </div>
  );
}

function MediaTile({ title, path, tone = "light", tall = false }) {
  return (
    <div className={`media-tile ${tone} ${tall ? "tall" : ""}`}>
      <img src={path} alt={title} />
      <strong>{title}</strong>
    </div>
  );
}

function InfoBox({ title, rows, accent }) {
  return (
    <div className="info-box" style={{ "--stage-color": accent }}>
      <h3>{title}</h3>
      <div>
        {rows.map(([label, value], index) => (
          <p key={`${label}-${value}-${index}`}>
            <span>{label}</span>
            <strong>{value}</strong>
          </p>
        ))}
      </div>
    </div>
  );
}

function TextPanel({ title, children }) {
  return (
    <div className="text-panel">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function DiffMatrix() {
  return (
    <div className="diff-matrix">
      <h3>差异识别结果</h3>
      {diffRows.map(([name, before, after]) => (
        <div key={name}>
          <span>{name}</span>
          <code>{before}</code>
          <ArrowRight size={14} />
          <strong>{after}</strong>
        </div>
      ))}
    </div>
  );
}

function FeaturePanel({ title, items, accent, dangerLast = false }) {
  return (
    <div className="feature-panel" style={{ "--stage-color": accent }}>
      <h3>{title}</h3>
      {items.map((item, index) => (
        <p key={item} className={dangerLast && index === items.length - 1 ? "danger" : ""}>
          <CheckCircle2 size={15} />
          <span>{item}</span>
        </p>
      ))}
    </div>
  );
}

function ProcessTable() {
  return (
    <div className="process-table-card">
      <h3>工序流程表</h3>
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>工序</th>
            <th>设备</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          {processRows.map(([step, name, machine, time]) => (
            <tr key={step}>
              <td>{step}</td>
              <td>{name}</td>
              <td>{machine}</td>
              <td>{time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComparisonMatrix({ compact = false }) {
  return (
    <div className={`workspace-comparison ${compact ? "compact" : ""}`}>
      <div>
        <span>能力</span>
        <span>人工工艺设计</span>
        <span>传统模板复制</span>
        <span>ProcessCAD 自动生成</span>
      </div>
      {comparisonRows.map((row) => (
        <div key={row[0]}>
          {row.map((cell, index) => (
            <span key={`${row[0]}-${cell}`} className={index === 3 ? "smart" : ""}>
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="stat-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DeliverableSummary({ active }) {
  return (
    <div className="delivery-card">
      <div className="delivery-head">
        <FileCheck size={18} />
        当前组件内容
      </div>
      <div className="delivery-list">
        {(deliverables[active.id] || []).map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}

function CADPreview({ active }) {
  return (
    <div className="cad-preview" style={{ "--stage-color": active.accent }}>
      <div className="cad-grid" />
      <svg viewBox="0 0 620 390" role="img" aria-label={`${active.title} CAD 预览`}>
        <defs>
          <linearGradient id="cadStroke" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="52%" stopColor={active.accent} />
            <stop offset="100%" stopColor="#2ce6c8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path className="cad-faint" d="M58 118H548M58 268H548M118 70V318M492 70V318" />
        <path
          className="cad-main"
          filter="url(#glow)"
          d="M96 236h88l22-54h73l19-46h88l31 68h88v78H96z"
        />
        <path className="cad-main cad-secondary" d="M168 236v-52h74v52M360 204h66v78M244 182l38 54M318 136l52 100" />
        <circle className="cad-main" cx="188" cy="258" r="18" />
        <circle className="cad-main" cx="450" cy="258" r="18" />
        <path className="cad-dim" d="M96 324h409M96 313v22M505 313v22M144 88h326M144 77v22M470 77v22" />
        <text x="273" y="354">modified_drawing.dwg</text>
        <text x="278" y="66">{active.short} / {active.number}</text>
      </svg>
      <div className="cad-badge">
        <Layers size={15} />
        {active.title}
      </div>
    </div>
  );
}

function ProcessCard() {
  return (
    <div className="delivery-card">
      <div className="delivery-head">
        <FileCheck size={18} />
        工艺卡片.pdf
      </div>
      <div className="delivery-lines">
        <span />
        <span />
        <span />
      </div>
      <div className="delivery-list">
        <p>modified_config.json</p>
        <p>process_plan.json</p>
        <p>diff_ops.json</p>
        <p>modified_drawing.dwg</p>
      </div>
    </div>
  );
}

export default App;
