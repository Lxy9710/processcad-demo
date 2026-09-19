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

const stages = [
  {
    id: "upload",
    number: "01",
    title: "agentic CAD drawing generation",
    short: "DWG",
    segmentStart: 0,
    segmentEnd: 20,
    icon: UploadCloud,
    accent: "#8f5cff",
    summary: "Generate a CAD drawing from an agentic workflow and prepare it for downstream process planning.",
    result: "part_shaft.dwg / 2.45 MB / V1.2",
    metrics: [
      ["Part Type", "Shaft"],
      ["Drawing Rev", "V1.2"],
      ["File Size", "2.45 MB"],
    ],
    code: ['input: "part_shaft.dwg"', 'partType: "shaft"', 'revision: "V1.2"'],
  },
  {
    id: "extract",
    number: "02",
    title: "Entity Extract",
    short: "JSON",
    segmentStart: 12,
    segmentEnd: 48,
    icon: FileText,
    accent: "#2ce6c8",
    summary: "Extract entities, annotations, and feature groups from the CAD drawing into structured data.",
    result: "126 entities / 34 annotations / 18 groups",
    metrics: [
      ["Geometric Entities", "126"],
      ["Annotations", "34"],
      ["Feature Groups", "18"],
    ],
    code: ['entities: 126', 'annotations: 34', 'groups: 18', 'output: "config.json"'],
  },
  {
    id: "gnn",
    number: "03",
    title: "Simularity Retrieval",
    short: "Top-K",
    segmentStart: 48,
    segmentEnd: 57,
    icon: Network,
    accent: "#55a7ff",
    summary: "Retrieve similar historical processes by comparing drawing structure and process features.",
    result: "Top 1 template score 0.94",
    metrics: [
      ["Top 1", "0.94"],
      ["Top 2", "0.89"],
      ["Top 3", "0.83"],
    ],
    code: ['retriever: "GNN"', 'topK: 3', 'bestMatch: "Template Process A"', 'score: 0.94'],
  },
  {
    id: "rag",
    number: "04",
    title: "Operation Sequence Generation",
    short: "RAG",
    segmentStart: 58,
    segmentEnd: 63,
    icon: Brain,
    accent: "#ffd166",
    summary: "Generate the operation sequence from retrieved references and process knowledge.",
    result: "5-step process generated",
    metrics: [
      ["Knowledge Sources", "4"],
      ["Process Steps", "5"],
      ["Confidence", "92%"],
    ],
    code: ['knowledge: ["Shaft", "Hole Drilling", "Chamfer", "Inspection"]', 'steps: 5', 'matcher: "LLM/RAG"'],
  },
  {
    id: "diff",
    number: "05",
    title: "LLM-RAG Parameters and Geometry Generation",
    short: "Param",
    segmentStart: 63,
    segmentEnd: 112,
    icon: GitCompare,
    accent: "#ff5c8a",
    summary: "Generate process parameters and geometry updates with LLM-RAG reasoning.",
    result: "4 diffs / 1 added / 3 modified",
    metrics: [
      ["Diff Items", "4"],
      ["Added", "1"],
      ["Modified", "3"],
    ],
    code: ['Hole Dia: "φ1.5 -> φ2.0"', 'Slot Width: "12mm -> 15mm"', 'Chamfer: "45° -> 60°"'],
  },
  {
    id: "modify",
    number: "06",
    title: "Upload to Management System",
    short: "Upload",
    segmentStart: 112,
    segmentEnd: 125,
    icon: PenTool,
    accent: "#72ff8a",
    summary: "Upload generated process data and CAD artifacts to the management system.",
    result: "modified_drawing.dwg ready",
    metrics: [
      ["Linked Features", "4"],
      ["Auto-Fix Rate", "100%"],
      ["Output Format", "DWG"],
    ],
    code: ['driver: "diff_ops.json"', 'update: ["holes", "slots", "chamfer", "fillet"]', 'export: "modified_drawing.dwg"'],
  },
  {
    id: "card",
    number: "07",
    title: "Agentic Process Cards Drawing",
    short: "Card",
    segmentStart: 125,
    segmentEnd: 188,
    icon: ClipboardList,
    accent: "#f7a84b",
    summary: "Draw process cards through an agentic workflow and assemble the final documentation.",
    result: "process_card.pdf / process_plan.json",
    metrics: [
      ["Output Files", "5"],
      ["Workflow Table", "PDF"],
      ["Structured Data", "JSON"],
    ],
    code: ['files: ["process_plan.json", "diff_ops.json"]', 'card: "process_card.pdf"', 'drawing: "modified_drawing.dwg"'],
  },
  {
    id: "compare",
    number: "08",
    title: "Standard Output",
    short: "Output",
    segmentStart: 188,
    segmentEnd: 238,
    icon: BarChart3,
    accent: "#b497cf",
    summary: "Export standardized deliverables for review, archiving, and downstream use.",
    result: "90%+ time reduction",
    metrics: [
      ["Time Reduction", "90%+"],
      ["Steps Reduction", "80%+"],
      ["Error Reduction", "95%+"],
    ],
    code: ['manualSteps: "-80%"', 'cycleTime: "-90%"', 'errorRate: "-95%"'],
  },
];

const processRows = [
  ["10", "Rough Turn Right Face", "Lathe", "5 min", "done"],
  ["20", "Drill Center Hole", "Drill Press", "4 min", "done"],
  ["30", "Finish Turn OD", "Lathe", "8 min", "active"],
  ["40", "Chamfer & Fillet Trim", "Machine Tool", "6 min", "queued"],
  ["50", "Inspection", "CMM", "3 min", "queued"],
];

const diffRows = [
  ["Hole Diameter", "φ1.5", "φ2.0", "modified"],
  ["Slot Width", "12mm", "15mm", "modified"],
  ["Chamfer Angle", "45°", "60°", "modified"],
  ["Fillet Radius", "R3", "R5", "added"],
];

const comparisonRows = [
  ["Similar Process Lookup", "Manual Experience", "Keyword Match", "GNN Top-K Retrieval"],
  ["Process Matching", "Manual Authoring", "Template Copy", "LLM/RAG Auto-Match"],
  ["Drawing Diff Analysis", "Manual Comparison", "Simple Diff", "Structured diff_ops"],
  ["CAD Modification", "Manual Editing", "Manual Adjust", "Diff-Driven Auto-Update"],
  ["Process Card", "Manual Compilation", "Manual Creation", "Auto-Generated PDF"],
  ["Batch Processing", "No", "Partial", "Full Batch Support"],
];

const uploadFileInfo = [
  ["File Name", "part_shaft.dwg"],
  ["Part Type", "Shaft"],
  ["Drawing Rev", "V1.2"],
  ["Created", "2026-05-03"],
  ["File Size", "2.45 MB"],
];

const knowledgeItems = [
  "Shaft Part Process Knowledge",
  "Hole Drilling Process Knowledge",
  "Chamfer & Fillet Process Knowledge",
  "Inspection & QA Knowledge",
];

const capabilityItems = [
  "Natural Language Modification",
  "Diff-Driven Modification",
  "Hole / Slot / Chamfer / Fillet Linked Update",
  "Associated Feature Auto-Follow",
];

const outputFiles = [
  "modified_config.json",
  "process_plan.json",
  "diff_ops.json",
  "modified_drawing.dwg",
  "process_card.pdf",
];

const deliverables = {
  upload: ["Target DWG Drawing", "Upload UI Screenshot", "Basic File Information"],
  extract: ["Geometric Entity Recognition", "Annotation Results", "Grouping Results", "config.json"],
  gnn: ["Target Drawing", "GNN Retrieval Process", "Top-K Results Screenshot"],
  rag: ["Process Knowledge Base RAG", "LLM/RAG Matching Process", "Generated Process Flow"],
  diff: ["Target Drawing", "Template Drawing", "diff_ops.json", "Diff Report"],
  modify: ["CAD Modification Demo", "Before / After Comparison", "Capability Highlights"],
  card: ["Final CAD Drawing", "Process Card PDF", "Workflow Table", "Output File List"],
  compare: ["Manual vs ProcessCAD Comparison Video", "Capability Comparison Table", "Efficiency Metrics"],
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
              AI + CAD + Process Knowledge Base
            </div>
            <h1>
              ProcessCAD
              <span> Intelligent Process Generation System</span>
            </h1>
            <p>
              Starting from a target DWG drawing, automatically complete similar process retrieval, process matching, difference detection, CAD modification, and process card generation.
            </p>
            <div className="hero-actions">
              <StarBorder as="a" href="#workflow" color="#d45cff" speed="5s" thickness={1} className="primary-star">
                <PlayCircle size={18} />
                Explore the Pipeline
              </StarBorder>
              <a className="ghost-link" href="#workspace">
                Open Workspace
                <ArrowRight size={17} />
              </a>
            </div>

            <div className="signal-grid" aria-label="ProcessCAD Key Metrics">
              <Metric label="Entity Recognition" value="126" suffix="objects" tone="#2ce6c8" />
              <Metric label="Top-K Match" value="0.94" suffix="score" tone="#55a7ff" />
              <Metric label="Time Reduction" value="90%+" suffix="cycle" tone="#ffd166" />
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
            title="End-to-End Process Pipeline"
            text="The legacy UI's functional content is preserved as 8 stable stages, while the new interface consolidates them into a scannable, actionable generation pipeline."
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
            title="Diff-Driven Modification"
            text="Diff items directly feed into the CAD modification driver, eliminating manual back-and-forth between drawings, templates, and process documents."
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
                    <th>Step</th>
                    <th>Operation</th>
                    <th>Machine</th>
                    <th>Time</th>
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
            title="Method Comparison"
            text="The same legacy UI content is displayed in dark data panels in the new interface, better suited for demonstrating automation gains and deliverable status."
          />
          <div className="comparison-table">
            <div className="comparison-head">
              <span>Capability</span>
              <span>Manual Process Design</span>
              <span>Traditional Template Copy</span>
              <span>ProcessCAD Auto-Generation</span>
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
              <Kpi icon={Gauge} label="Processing Time Reduced" value="90%+" />
            </GlareHover>
            <GlareHover width="100%" height="138px" borderRadius="18px" borderColor="rgba(255,255,255,0.14)" background="rgba(13,10,23,0.74)" glareColor="#ffd166" glareOpacity={0.24}>
              <Kpi icon={Zap} label="Operation Steps Reduced" value="80%+" />
            </GlareHover>
            <GlareHover width="100%" height="138px" borderRadius="18px" borderColor="rgba(255,255,255,0.14)" background="rgba(13,10,23,0.74)" glareColor="#72ff8a" glareOpacity={0.24}>
              <Kpi icon={ShieldCheck} label="Error Rate Reduced" value="95%+" />
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
      <a className="brand" href="#overview" aria-label="ProcessCAD Home">
        <span className="brand-mark">
          <Cpu size={22} />
        </span>
        <span>ProcessCAD</span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#workflow">Pipeline</a>
        <a href="#workspace">Workspace</a>
        <a href="#analysis">Diff Check</a>
        <a href="#compare">Comparison</a>
      </nav>
      <a className="lang-switch" href="index.zh.html" title="Switch to Chinese page">
        <Globe size={16} />
        中文页面
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
          DWG Demo
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
        <button type="button" className="control-button" onClick={togglePlay} aria-label={isPlaying ? "Pause Demo Video" : "Play Demo Video"}>
          {isPlaying ? <Pause size={18} /> : <PlayCircle size={19} />}
        </button>
        <div className="timeline" aria-label="ProcessCAD Demo Playback Progress" onClick={handleTimelineClick}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <button type="button" className="control-button" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
          <Volume2 size={18} />
        </button>
        <button type="button" className="control-button" onClick={toggleFullscreen} aria-label="Fullscreen">
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
        <MediaTile tone="dark" title="Original DWG Thumbnail" path="/assets/smartcad/target_dwg.png" />
        <MediaTile title="agentic CAD drawing generation UI Screenshot" path="/assets/smartcad/02_upload.png" />
        <InfoBox title="File Information" rows={uploadFileInfo} accent={active.accent} />
      </div>
    </div>
  );
}

function ExtractStage({ active }) {
  return (
    <div className="stage-detail">
      <DemoVideoCard title={active.title} active={active} size="wide" src={demoAllVideo} segmentStart={active.segmentStart} segmentEnd={active.segmentEnd} />
      <div className="detail-grid three-media">
        <MediaTile tone="dark" title="Geometric Entity Recognition" path="/assets/smartcad/geometry_entity.png" />
        <MediaTile tone="dark" title="Annotation Results" path="/assets/smartcad/annotation_result.png" />
        <MediaTile tone="dark" title="Grouping Results" path="/assets/smartcad/groups_result.png" />
      </div>
      <InfoBox
        title="Extraction Results"
        accent={active.accent}
        rows={[
          ["Extracted Entities", "126"],
          ["Annotations Recognized", "34"],
          ["Feature Groups", "18"],
          ["Output File", "config.json"],
        ]}
      />
    </div>
  );
}

function GnnStage({ active }) {
  return (
    <div className="stage-detail">
      <div className="detail-grid split-media">
        <MediaTile tone="dark" title="Target Drawing" path="/assets/smartcad/target_dwg.png" />
        <DemoVideoCard title={active.title} active={active} src={demoAllVideo} segmentStart={active.segmentStart} segmentEnd={active.segmentEnd} />
      </div>
      <div className="topk-layout">
        <div className="topk-list">
          <h3>Top-K Similar Processes</h3>
          {[
            ["Top 1", "Template Process A", "0.94"],
            ["Top 2", "Template Process B", "0.89"],
            ["Top 3", "Template Process C", "0.83"],
          ].map(([rank, name, score]) => (
            <div className="topk-row" key={rank}>
              <strong>{rank}</strong>
              <span>{name}</span>
              <em>{score}</em>
            </div>
          ))}
        </div>
        <MediaTile title="Top-K Results Screenshot" path="/assets/smartcad/topk.png" />
      </div>
    </div>
  );
}

function RagStage({ active }) {
  return (
    <div className="stage-detail">
      <InfoBox
        title="Process Knowledge Base RAG"
        accent={active.accent}
        rows={knowledgeItems.map((item) => ["Knowledge Entry", item])}
      />
      <DemoVideoCard title={active.title} active={active} size="wide" src={demoAllVideo} segmentStart={active.segmentStart} segmentEnd={active.segmentEnd} />
      <div className="process-list">
        <h3>Generated Process Flow</h3>
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
        <MediaTile tone="dark" title="Target Drawing" path="/assets/smartcad/target_dwg.png" />
        <DiffMatrix />
        <MediaTile tone="dark" title="Template Drawing" path="/assets/smartcad/template_dwg.png" />
      </div>
      <div className="detail-grid diff-mid">
        <InfoBox
          title="Diff Statistics"
          accent={active.accent}
          rows={[
            ["Diff Items", "4"],
            ["Added", "1"],
            ["Missing", "0"],
            ["Modified", "3"],
          ]}
        />
        <TextPanel title="Inspection Notes">
          The system aligns structural features between the target and template drawings, automatically outputting diffs for hole diameters, slot widths, chamfers, fillets, etc., which serve as the driving input for subsequent CAD smart modification.
        </TextPanel>
      </div>
      <div className="detail-grid split-media">
        <DemoVideoCard title={active.title} active={active} src={demoAllVideo} segmentStart={active.segmentStart} segmentEnd={active.segmentEnd} />
        <MediaTile title="Diff Report Screenshot" path="/assets/smartcad/10_diff_report.png" />
      </div>
    </div>
  );
}

function ModifyStage({ active }) {
  return (
    <div className="stage-detail">
      <DemoVideoCard title={active.title} active={active} size="wide" src={demoAllVideo} segmentStart={active.segmentStart} segmentEnd={active.segmentEnd} />
      <MediaTile title="Before / After Comparison" path="/assets/smartcad/12_before_after.png" tall />
      <FeaturePanel title="Capability Highlights" items={capabilityItems} accent={active.accent} />
    </div>
  );
}

function CardStage({ active }) {
  return (
    <div className="stage-detail">
      <DemoVideoCard title={active.title} active={active} size="wide" src={demoAllVideo} segmentStart={active.segmentStart} segmentEnd={active.segmentEnd} />
      <div className="detail-grid split-media">
        <MediaTile tone="dark" title="Final CAD Drawing" path="/assets/smartcad/final_cad.png" />
        <MediaTile title="Process Card PDF Preview" path="/assets/smartcad/13_process_card_preview.png" />
      </div>
      <div className="detail-grid card-bottom">
        <ProcessTable />
        <FeaturePanel title="Output File List" items={outputFiles} accent={active.accent} dangerLast />
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
        <StatPill label="Processing Time Reduced" value="90%+" />
        <StatPill label="Manual Steps Reduced" value="80%+" />
        <StatPill label="Batch Capability Gain" value="100%+" />
        <StatPill label="Error Rate Reduced" value="95%+" />
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
        <button className="demo-video-play" type="button" aria-label={`Play ${title}`}>
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
        <button className="demo-video-play" type="button" onClick={toggle} aria-label={`Play ${title}`}>
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
      <h3>Diff Detection Results</h3>
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
      <h3>Process Workflow Table</h3>
      <table>
        <thead>
          <tr>
            <th>Step</th>
            <th>Operation</th>
            <th>Machine</th>
            <th>Time</th>
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
        <span>Capability</span>
        <span>Manual Process Design</span>
        <span>Traditional Template Copy</span>
        <span>ProcessCAD Auto-Generation</span>
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
        Current Component Content
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
      <svg viewBox="0 0 620 390" role="img" aria-label={`${active.title} CAD Preview`}>
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
        process_card.pdf
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
