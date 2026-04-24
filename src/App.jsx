import { useState, useEffect, useCallback } from "react";

/* ── Design Tokens ── */
const BG = "#E0E5EC";
const FG = "#3D4852";
const MU = "#6B7280";
const AC = "#6C63FF";
const OK = "#38B2AC";
const SH = {
  ext: "9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)",
  extH: "12px 12px 20px rgb(163,177,198,0.7), -12px -12px 20px rgba(255,255,255,0.6)",
  extS: "5px 5px 10px rgb(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)",
  ins: "inset 6px 6px 10px rgb(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)",
  insD: "inset 10px 10px 20px rgb(163,177,198,0.7), inset -10px -10px 20px rgba(255,255,255,0.6)",
  insS: "inset 3px 3px 6px rgb(163,177,198,0.6), inset -3px -3px 6px rgba(255,255,255,0.5)",
};
const WC = ["#D4A843", "#5BA3C9", "#4DB88A", "#D4628A"];
const FD = "'Plus Jakarta Sans',sans-serif";
const FB = "'DM Sans',sans-serif";

const sCard = { background: BG, borderRadius: 32, boxShadow: SH.ext };
const sCardS = { background: BG, borderRadius: 16, boxShadow: SH.extS };
const sIns = { background: BG, borderRadius: 16, boxShadow: SH.ins };
const sInsD = { background: BG, borderRadius: 16, boxShadow: SH.insD };
const sBtn = { background: BG, border: "none", borderRadius: 16, boxShadow: SH.extS, cursor: "pointer", fontFamily: FB, color: FG, transition: "all .3s" };
const sBtnA = { ...sBtn, background: AC, color: "#fff" };
const sInp = { background: BG, border: "none", borderRadius: 16, boxShadow: SH.insD, padding: "12px 16px", fontSize: 14, color: FG, outline: "none", fontFamily: FB, width: "100%", boxSizing: "border-box" };
const sTag = (c) => ({ display: "inline-block", padding: "4px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 600, color: c, background: BG, boxShadow: SH.insS, fontFamily: FB });
const sH1 = { fontFamily: FD, fontWeight: 800, color: FG, margin: 0, letterSpacing: "-.02em" };
const sH2 = { fontFamily: FD, fontWeight: 700, color: FG, margin: 0 };
const sB = { fontFamily: FB, color: FG, lineHeight: 1.6 };
const sM = { fontFamily: FB, color: MU, fontSize: 13 };

/* ── 30 Days Data ── */
const DAYS = [
  { day:1,w:1,th:"面试基本功",t:"1-Minute Self Introduction",desc:"用英文做一段1分钟自我介绍，涵盖教育背景、核心经历、求职方向。录音后回听。",kw:["background in...","specialize in...","I'm passionate about...","transition into...","hands-on experience with..."],pr:"You are an interviewer at an AI company. Ask me to introduce myself, then give feedback on clarity, structure, and professional vocabulary.\n\nWhen I say 'let's wrap up' or after 5 exchanges, provide a structured debrief:\n- List 3-5 expressions where I struggled (❌ My expression → ✅ Better alternative)\n- Highlight 1-2 expressions I used well\n- Fluency score (1-10)\nMix English and Chinese in the debrief."},
  { day:2,w:1,th:"面试基本功",t:"Why This Role?",desc:"练习回答 'Why are you interested in this position?'",kw:["align with my career goal","leverage my experience in...","bridge between business and technology","drive product strategy","industry insight"],pr:"You are hiring for an AI PM role. Ask me why I want this job. Follow up with 2 probing questions.\n\nDebrief with ❌→✅ corrections and fluency score (1-10)."},
  { day:3,w:1,th:"面试基本功",t:"Walk Me Through Your Resume",desc:"用英文完整过一遍简历，每段经历控制在30秒内。",kw:["spearheaded","conducted competitive analysis","delivered actionable insights","collaborated cross-functionally","drove strategic initiatives"],pr:"You are a recruiter. Ask me to walk through my resume. Push back if I spend too long on any section.\n\nDebrief with corrections and score."},
  { day:4,w:1,th:"面试基本功",t:"Explain Your Career Gap",desc:"练习解释GAP期：自媒体探索、行业研究、技能提升。",kw:["took a deliberate pause","upskill in...","build a portfolio","deepen my understanding of...","proactive learning"],pr:"You notice a gap on my resume from March 2026. Ask me about it. Be slightly skeptical but fair.\n\nDebrief with corrections and score."},
  { day:5,w:1,th:"面试基本功",t:"Strengths & Weaknesses",desc:"准备3个优势和1个改进点，用STAR框架举例。",kw:["analytical mindset","synthesize complex information","stakeholder management","area for growth","actively working on..."],pr:"Ask me about my greatest strength and a weakness. Follow up for specific examples.\n\nDebrief with corrections and score."},
  { day:6,w:1,th:"面试基本功",t:"Tell Me About a Challenge",desc:"用STAR法则讲述一个工作中的挑战故事。",kw:["navigated ambiguity","pivoted the approach","under tight deadlines","the key takeaway was...","quantifiable impact"],pr:"Ask me to describe a challenging situation at work. Probe for specifics.\n\nDebrief with corrections and score."},
  { day:7,w:1,th:"周复盘",t:"Week 1 Review",desc:"回顾本周练习，不看提示做完整模拟自我介绍。",kw:["recap","consolidate","muscle memory","fluency over accuracy"],pr:"Conduct a 10-minute mock interview: self-intro, why this role, one behavioral question. Score me out of 10 with detailed debrief."},
  { day:8,w:2,th:"AI行业讨论",t:"AI Agent Landscape",desc:"用英文讨论AI Agent的发展趋势和商业化路径。",kw:["autonomous agent","multi-agent system","tool use","workflow automation","human-in-the-loop"],pr:"You are a VC partner. Ask: How do you see the AI Agent market evolving?\n\nDebrief with corrections and score."},
  { day:9,w:2,th:"AI行业讨论",t:"LLM Commercialization",desc:"讨论大模型商业模式：MaaS、API定价、开源vs闭源。",kw:["model-as-a-service","API pricing","open-source vs proprietary","inference cost","enterprise adoption"],pr:"Debate: Is the MaaS model sustainable long-term?\n\nDebrief with corrections and score."},
  { day:10,w:2,th:"AI行业讨论",t:"AI + Industry Verticals",desc:"讨论AI在金融、医疗、制造等行业的落地。",kw:["vertical AI solution","domain-specific model","regulatory compliance","proof of concept","low-altitude economy"],pr:"Explain how AI transforms specific industry verticals. Use concrete examples.\n\nDebrief with corrections."},
  { day:11,w:2,th:"AI行业讨论",t:"RAG & Enterprise AI",desc:"向非技术人员解释RAG架构的价值。",kw:["retrieval-augmented generation","knowledge base","hallucination reduction","vector database","grounding"],pr:"You are a non-technical CEO. Explain RAG to me and convince me it's worth investing in.\n\nDebrief with corrections."},
  { day:12,w:2,th:"AI行业讨论",t:"AI Product Strategy",desc:"讨论AI产品规划方法论。",kw:["product-market fit","user pain point","technical feasibility","go-to-market strategy","MVP"],pr:"You are a VP of Product. Ask me how I would build an AI product from 0 to 1.\n\nDebrief with corrections."},
  { day:13,w:2,th:"AI行业讨论",t:"Competitive Intelligence",desc:"练习用英文做竞争分析汇报。",kw:["competitive landscape","market positioning","differentiation","benchmark against","strategic recommendation"],pr:"Present a competitive analysis of the Chinese AI cloud market.\n\nDebrief with corrections."},
  { day:14,w:2,th:"周复盘",t:"Week 2 Review",desc:"选一个AI话题做5分钟即兴演讲。录音回听。",kw:["impromptu speaking","structured thinking","transition phrases"],pr:"Give me a random AI question. I answer in 3 minutes. Score content, vocabulary, fluency."},
  { day:15,w:3,th:"商务沟通",t:"Meeting Participation",desc:"练习会议常用表达：提出观点、同意/反对、总结。",kw:["I'd like to add that...","building on that point...","I see it differently...","let me push back...","to summarize..."],pr:"Simulate a team meeting about launching an AI feature. I participate actively.\n\nDebrief with corrections."},
  { day:16,w:3,th:"商务沟通",t:"Presentation & Pitch",desc:"练习英文presentation开场、过渡和总结。",kw:["let me walk you through...","as you can see...","the key insight is...","moving on to...","in conclusion..."],pr:"I present a 5-min market analysis. Act as audience and ask questions.\n\nDebrief with corrections."},
  { day:17,w:3,th:"商务沟通",t:"Email Communication",desc:"练习写+朗读商务邮件。",kw:["per our discussion","please find attached","I wanted to follow up...","looking forward to your feedback","action items"],pr:"Help me draft and read aloud a follow-up email after a client meeting.\n\nFeedback on tone."},
  { day:18,w:3,th:"商务沟通",t:"Client Communication",desc:"模拟客户沟通：需求收集、方案讲解。",kw:["current pain points?","based on your requirements...","I understand your concern","let me address that","the ROI would be..."],pr:"You are a demanding client interested in AI solutions. I propose a solution.\n\nDebrief after."},
  { day:19,w:3,th:"商务沟通",t:"Negotiation Basics",desc:"练习商务谈判表达。",kw:["our proposed pricing...","flexibility on...","would you be open to...","meet in the middle","mutually beneficial"],pr:"Negotiate an AI consulting contract with me. Push for a better deal.\n\nDebrief after."},
  { day:20,w:3,th:"商务沟通",t:"Cross-cultural Communication",desc:"练习跨文化沟通技巧。",kw:["I appreciate your perspective","elaborate on that?","make sure we're aligned","culturally speaking","localize the approach"],pr:"Simulate a call with a Singapore team about project timelines.\n\nDebrief after."},
  { day:21,w:3,th:"周复盘",t:"Week 3 Review",desc:"完整商务场景：presentation → 提问 → follow-up邮件。",kw:["end-to-end communication","professional presence","confident delivery"],pr:"Full simulation: 3-min pitch, tough questions, follow-up email. Score each part."},
  { day:22,w:4,th:"综合模拟",t:"Full Mock Interview (R1)",desc:"完整模拟面试全流程。全英文。",kw:["structured response","concise yet thorough","demonstrate expertise","insightful questions"],pr:"Full 20-minute interview for AI PM at Alibaba Cloud. Be rigorous.\n\nComprehensive debrief."},
  { day:23,w:4,th:"综合模拟",t:"Case Study: AI Product",desc:"英文做AI产品案例分析。",kw:["market sizing","user segmentation","competitive moat","product roadmap","monetization"],pr:"Give me an AI product case study. Challenge my conclusions.\n\nDebrief."},
  { day:24,w:4,th:"综合模拟",t:"Industry Deep Dive",desc:"做10分钟英文行业研究汇报。",kw:["market overview","value chain","key players","growth drivers","investment thesis"],pr:"Listen to my 5-min industry analysis and grill me.\n\nDebrief."},
  { day:25,w:4,th:"综合模拟",t:"Behavioral Deep Dive",desc:"准备5个STAR故事。",kw:["leadership","conflict resolution","lesson learned","collaboration","innovation"],pr:"Ask 3 behavioral questions back to back. 2 minutes each, STAR format.\n\nDebrief."},
  { day:26,w:4,th:"综合模拟",t:"Full Mock Interview (R2)",desc:"第二次完整模拟面试。",kw:["improvement","sharper delivery","natural flow","confident pauses"],pr:"Full mock for Strategy Analyst at an AI company. Compare to first mock.\n\nDebrief."},
  { day:27,w:4,th:"综合模拟",t:"Rapid Fire",desc:"快速问答，每问限时1分钟。",kw:["think on your feet","concise answer","pivot gracefully","handle curveballs"],pr:"10 rapid-fire questions: behavioral + technical + industry. 60 seconds each.\n\nDebrief."},
  { day:28,w:4,th:"综合模拟",t:"Salary Negotiation",desc:"练习薪资谈判和面试收尾。",kw:["compensation","total package","growth opportunity","excited about this role","next steps"],pr:"Offer stage. Walk me through salary negotiation. Close professionally.\n\nDebrief."},
  { day:29,w:4,th:"总复盘",t:"Final Review",desc:"回顾30天积累，集中突破不熟练的表达。",kw:["final polish","confidence","authentic expression"],pr:"Test my weakest expressions. Then 5-min free conversation on AI.\n\nDebrief."},
  { day:30,w:4,th:"总复盘",t:"Graduation Interview",desc:"最终模拟面试。全流程、全英文、高压。",kw:["peak performance","natural confidence","ready to impress"],pr:"Final mock interview. Make it tough. Comprehensive final assessment with 30-day evaluation."},
];

/* ── Shadow Materials ── */
const MATS = [
  { id:"m1",w:1,t:"Mock PM Interview: Google",s:"Exponent",yt:"BNuRsv_42jc",d:"~30min",r:"真实 PM Mock Interview",sg:"2:00-6:00" },
  { id:"m2",w:1,t:"How to Introduce Yourself (2026)",s:"CareerVidz",yt:"gVNXNsDdwlw",d:"~20min",r:"语速适中，完整自我介绍模板",sg:"3:00-8:00" },
  { id:"m3",w:1,t:"AI for Your Next Job Interview",s:"Lenny's Podcast",yt:"",d:"~60min",r:"用 AI 准备面试",sg:"选5分钟嘉宾回答" },
  { id:"m4",w:1,t:"Product Job Market 2026",s:"Lenny's Podcast",yt:"",d:"~60min",r:"2026 PM 求职市场",sg:"interviewers look for 段落" },
  { id:"m5",w:2,t:"Big Ideas 2026: Agentic Interface",s:"a16z",yt:"ULszsXDyjMY",d:"~15min",r:"信息密度极高的行业洞察",sg:"1:00-5:00" },
  { id:"m6",w:2,t:"What Is an AI Agent?",s:"a16z",yt:"",d:"~40min",r:"经典，辩论 Agent 定义",sg:"5:00-12:00" },
  { id:"m7",w:2,t:"Sam Altman at AI Ascent 2025",s:"Sequoia",yt:"",d:"~30min",r:"英文表达标杆",sg:"AI 路线图预测" },
  { id:"m8",w:2,t:"Marc Andreessen 2026 Outlook",s:"a16z",yt:"xRh2sVcNXQ8",d:"~60min",r:"AI 产业格局宏观分析",sg:"选5分钟趋势讨论" },
  { id:"m9",w:2,t:"Boris Cherny: Claude Code",s:"Lenny's Podcast",yt:"",d:"~70min",r:"产品 0 到 1 叙事",sg:"早期开发段落" },
  { id:"m10",w:3,t:"How Great Leaders Inspire Action",s:"TED · Sinek",yt:"qp0HIF3SfI4",d:"18min",r:"Presentation 节奏标杆",sg:"0:00-5:00 Golden Circle" },
  { id:"m11",w:3,t:"3 Steps to Negotiate",s:"TED",yt:"Z3HJCQJ2Lmo",d:"~7min",r:"简短实用，可完整跟读",sg:"全程跟读" },
  { id:"m12",w:3,t:"Doug Leone: Enduring Companies",s:"Sequoia 2026",yt:"afSmwxT0Y3o",d:"~30min",r:"传奇 VC 演讲范本",sg:"开场5分钟" },
  { id:"m13",w:3,t:"The Art of Influence",s:"Lenny's · Fain",yt:"",d:"~60min",r:"跨部门影响力",sg:"Slack 案例段落" },
  { id:"m14",w:3,t:"Dorsey & Botha: Mini-AGI",s:"Sequoia",yt:"YTVSwOY19Qs",d:"~30min",r:"CEO 商务对话风格",sg:"组织变革讨论" },
  { id:"m15",w:4,t:"Mock PM Interview Playlist",s:"Exponent",yt:"lX3cxmmQ56U",d:"多个",r:"同步回答后对比",sg:"选2-3个视频" },
  { id:"m16",w:4,t:"AI Ascent 2025 Playlist",s:"Sequoia",yt:"",d:"多个",r:"即兴 presentation 素材",sg:"应用层分析" },
  { id:"m17",w:4,t:"Elena Verna: AI Growth 2026",s:"Lenny's Podcast",yt:"",d:"~90min",r:"$200M ARR 增长故事",sg:"innovation over optimization" },
  { id:"m18",w:4,t:"AI State of the Union",s:"Lenny's · Willison",yt:"",d:"~90min",r:"AI 全景分析",sg:"agentic patterns" },
];

const WKS = [
  { n: 1, l: "面试基本功" },
  { n: 2, l: "AI行业讨论" },
  { n: 3, l: "商务沟通" },
  { n: 4, l: "综合模拟" },
];

/* ── Storage Hook ── */
function useStore(key, defaultVal) {
  var [val, setVal] = useState(function () {
    try {
      var saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  });
  var [ready] = useState(true);

  var update = useCallback(function (fn) {
    var next = typeof fn === "function" ? fn(val) : fn;
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch (e) {}
    return next;
  }, [key, val]);

  return [val, update, ready];
}

/* ── Prompt Template ── */
function makePrompt(topic) {
  return 'IMPORTANT: We are practicing via voice conversation. Please speak in clear, natural English at a moderate pace. Keep your responses concise (2-3 sentences each turn) so I have enough time to respond. Correct my pronunciation and expression naturally during the conversation.\n\nYou are a senior professional in AI/tech. I want to practice discussing "' + topic + '" in English.\nStart with an open-ended question.\nAfter I respond:\n1. Point out awkward expressions with better alternatives\n2. Ask a follow-up\n3. Keep going 5+ exchanges\n\nBe encouraging but honest.\n\nWhen I say "let\'s wrap up":\n- ❌ My expression → ✅ Better (3-5)\n- 1-2 good expressions\n- Fluency score (1-10)\nMix English and Chinese.';
}

/* ── Tab Bar ── */
function TabBar(props) {
  var tabs = [
    { id: "today", label: "今日", icon: "◎" },
    { id: "plan", label: "计划", icon: "☰" },
    { id: "shadow", label: "跟读", icon: "🎧" },
    { id: "topics", label: "话题", icon: "💡" },
    { id: "vocab", label: "积累", icon: "✦" },
    { id: "stats", label: "进度", icon: "◐" },
  ];

  return (
    <div style={{ display: "flex", padding: "8px 12px", gap: 4, position: "sticky", top: 0, zIndex: 20, background: BG }}>
      {tabs.map(function (tb) {
        var active = props.active === tb.id;
        return (
          <button key={tb.id} onClick={function () { props.onChange(tb.id); }} style={{ ...sBtn, flex: 1, padding: "10px 0 8px", fontSize: 11, textAlign: "center", color: active ? AC : MU, boxShadow: active ? SH.insS : "none", fontWeight: active ? 600 : 400 }}>
            <span style={{ fontSize: 16, display: "block", marginBottom: 2 }}>{tb.icon}</span>
            {tb.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Today View ── */
function TodayView(props) {
  var d = DAYS[props.day - 1];
  var wc = WC[d.w - 1];
  var isChecked = props.checked.includes(props.day);
  var highTopics = props.topics.filter(function (x) { return x.p === "high" && !x.done; });

  var [showPrompt, setShowPrompt] = useState(false);
  var [copied, setCopied] = useState(false);
  var [showAdd, setShowAdd] = useState(false);
  var [newEn, setNewEn] = useState("");
  var [newZh, setNewZh] = useState("");

  var VOICE_PREFIX = "IMPORTANT: We are practicing via voice conversation. Please speak in clear, natural English at a moderate pace. Keep your responses concise (2-3 sentences each turn) so I have enough time to respond. Correct my pronunciation and expression naturally during the conversation.\n\n";
  var fullPrompt = VOICE_PREFIX + d.pr;

  function copyPrompt() {
    if (navigator.clipboard) { navigator.clipboard.writeText(fullPrompt); }
    setCopied(true);
    setTimeout(function () { setCopied(false); }, 2000);
  }

  return (
    <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={sTag(wc)}>DAY {d.day}</span>
          <span style={sM}>Week {d.w} · {d.th}</span>
        </div>
        <h1 style={{ ...sH1, fontSize: 22, lineHeight: 1.3 }}>{d.t}</h1>
      </div>

      {/* Three Segments */}
      <div style={{ ...sCard, padding: 16, marginBottom: 16 }}>
        <p style={{ ...sM, fontSize: 11, letterSpacing: 1, marginBottom: 10, marginTop: 0 }}>每日三段式 · 1 HOUR</p>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ time: "20min", label: "影子跟读", emoji: "🎧" }, { time: "30min", label: "场景模拟", emoji: "🎤" }, { time: "10min", label: "复盘积累", emoji: "📝" }].map(function (seg, i) {
            return (
              <div key={i} style={{ ...sIns, flex: 1, padding: "10px 6px", textAlign: "center" }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{seg.emoji}</div>
                <div style={{ ...sB, fontSize: 11, fontWeight: 500 }}>{seg.label}</div>
                <div style={{ ...sM, fontSize: 10 }}>{seg.time}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task */}
      <div style={{ ...sCard, padding: 16, marginBottom: 16, borderLeft: "3px solid " + wc }}>
        <p style={{ ...sM, fontSize: 12, marginTop: 0, marginBottom: 6 }}>今日任务</p>
        <p style={{ ...sB, fontSize: 14, margin: 0 }}>{d.desc}</p>
      </div>

      {/* Keywords */}
      <div style={{ ...sCard, padding: 16, marginBottom: 16 }}>
        <p style={{ ...sM, fontSize: 12, marginTop: 0, marginBottom: 10 }}>高频表达模板</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {d.kw.map(function (k, i) {
            return (<span key={i} style={{ ...sIns, padding: "6px 12px", fontSize: 13, color: FG, fontFamily: FB, fontWeight: 500 }}>{k}</span>);
          })}
        </div>
      </div>

      {/* AI Prompt */}
      <div style={{ ...sCard, padding: 16, marginBottom: 16 }}>
        <button onClick={function () { setShowPrompt(!showPrompt); }} style={{ ...sBtn, boxShadow: "none", padding: 0, width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: MU }}>
          <span style={{ color: AC }}>⬡</span> AI 对话 Prompt
          <span style={{ marginLeft: "auto", fontSize: 10 }}>{showPrompt ? "▲" : "▼"}</span>
        </button>
        {showPrompt && (
          <div style={{ marginTop: 12 }}>
            <div style={{ ...sInsD, padding: 12, fontSize: 12, lineHeight: 1.6, color: FG, whiteSpace: "pre-wrap", marginBottom: 10, maxHeight: 200, overflow: "auto" }}>{fullPrompt}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              <button onClick={copyPrompt} style={{ ...sBtnA, padding: "10px 16px", fontSize: 13, fontWeight: 600 }}>{copied ? "✓ 已复制" : "复制 Prompt"}</button>
              <a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" style={{ ...sBtn, padding: "10px 14px", fontSize: 12, textDecoration: "none", background: AC, color: "#fff" }}>Gemini Live ↗</a>
              <a href="claude://new-conversation" target="_blank" rel="noopener noreferrer" style={{ ...sBtn, padding: "10px 14px", fontSize: 12, textDecoration: "none", color: MU }}>Claude 备用 ↗</a>
            </div>
            <div style={{ ...sIns, padding: 10, borderRadius: 12 }}>
              <p style={{ ...sM, fontSize: 11, margin: 0, lineHeight: 1.5 }}>📱 复制 Prompt → 打开 Gemini App → 粘贴发送 → 开启 Live 语音对话</p>
            </div>
          </div>
        )}
      </div>

      {/* Bonus */}
      {highTopics.length > 0 && (
        <div style={{ ...sCard, padding: 16, marginBottom: 16, borderLeft: "3px solid " + AC }}>
          <p style={{ ...sM, fontSize: 12, marginTop: 0, marginBottom: 8 }}>💡 今日加练</p>
          {highTopics.slice(0, 2).map(function (tp, i) {
            return (
              <div key={i} style={{ marginBottom: 8 }}>
                <p style={{ ...sB, fontSize: 14, fontWeight: 600, margin: "0 0 2px" }}>{tp.title}</p>
                {tp.note && <p style={{ ...sM, fontSize: 12, margin: 0 }}>{tp.note}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Add */}
      <div style={{ ...sCard, padding: 16, marginBottom: 16 }}>
        <p style={{ ...sM, fontSize: 12, marginTop: 0, marginBottom: 8 }}>📝 记录卡壳表达</p>
        {!showAdd ? (
          <button onClick={function () { setShowAdd(true); }} style={{ ...sBtn, width: "100%", padding: 12, fontSize: 13, color: MU }}>+ 添加表达</button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input value={newEn} onChange={function (e) { setNewEn(e.target.value); }} placeholder="英文表达" style={sInp} />
            <input value={newZh} onChange={function (e) { setNewZh(e.target.value); }} placeholder="中文含义 / 使用场景" style={sInp} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={function () { if (newEn.trim()) { props.onAddExpr({ en: newEn.trim(), zh: newZh.trim(), source: "Day " + props.day, date: new Date().toLocaleDateString() }); setNewEn(""); setNewZh(""); setShowAdd(false); } }} style={{ ...sBtnA, flex: 1, padding: 12, fontSize: 13, fontWeight: 600 }}>保存</button>
              <button onClick={function () { setShowAdd(false); setNewEn(""); setNewZh(""); }} style={{ ...sBtn, padding: "12px 16px", fontSize: 13 }}>取消</button>
            </div>
          </div>
        )}
      </div>

      {/* Check In */}
      <button onClick={function () { if (!isChecked) props.onCheck(props.day); }} style={{ ...(isChecked ? sIns : sBtnA), width: "100%", padding: 16, fontSize: 15, fontWeight: 700, color: isChecked ? OK : "#fff", background: isChecked ? BG : AC }}>
        {isChecked ? "✓ 今日已打卡" : "完成打卡"}
      </button>
    </div>
  );
}

/* ── Plan View ── */
function PlanView(props) {
  return (
    <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
      <h2 style={{ ...sH2, fontSize: 20, marginBottom: 20 }}>30-Day Plan</h2>
      {WKS.map(function (wk) {
        return (
          <div key={wk.n} style={{ marginBottom: 24 }}>
            <p style={{ ...sM, fontSize: 12, fontWeight: 600, color: WC[wk.n - 1], marginBottom: 8, marginTop: 0 }}>WEEK {wk.n} · {wk.l}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {DAYS.filter(function (dd) { return dd.w === wk.n; }).map(function (dd) {
                var done = props.checked.includes(dd.day);
                var cur = dd.day === props.curDay;
                return (
                  <button key={dd.day} onClick={function () { props.onSelect(dd.day); }} style={{ ...sBtn, display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", width: "100%", textAlign: "left", boxShadow: cur ? SH.ext : SH.extS }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: FD, ...(done ? { background: WC[wk.n - 1], color: "#fff", boxShadow: SH.extS } : { ...sIns, color: MU }) }}>{done ? "✓" : dd.day}</span>
                    <span style={{ flex: 1, fontSize: 13, color: done ? MU : FG, textDecoration: done ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dd.t}</span>
                    {cur && <span style={{ ...sTag(WC[wk.n - 1]), fontSize: 10, padding: "2px 8px" }}>TODAY</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Shadow Reading View ── */
function ShadowView(props) {
  var [selWeek, setSelWeek] = useState(1);
  var [viewing, setViewing] = useState(null);
  var [note, setNote] = useState("");
  var [showAdd, setShowAdd] = useState(false);
  var [newUrl, setNewUrl] = useState("");
  var [newTitle, setNewTitle] = useState("");
  var [newTag, setNewTag] = useState("");

  var weekMats = MATS.filter(function (m) { return m.w === selWeek; });
  var userWeekMats = props.userMats.filter(function (m) { return m.w === selWeek; });

  if (viewing) {
    var ytId = viewing.yt || (viewing.url ? (viewing.url.match(/(?:v=|youtu\.be\/)([^&]+)/) || [])[1] : "") || "";
    return (
      <div style={{ padding: "16px", maxWidth: 480, margin: "0 auto" }}>
        <button onClick={function () { if (viewing.isUser) props.onUpdateNote(viewing.id, note); setViewing(null); }} style={{ ...sBtn, padding: "8px 14px", fontSize: 13, marginBottom: 12 }}>← 返回</button>
        <h2 style={{ ...sH2, fontSize: 16, marginBottom: 4 }}>{viewing.t || viewing.title}</h2>
        <p style={{ ...sM, fontSize: 12, marginBottom: 12, marginTop: 4 }}>{viewing.s || ""} · {viewing.d || ""}</p>

        {ytId ? (
          <div style={{ marginBottom: 16 }}>
            {/* Embedded YouTube Player */}
            <div style={{ ...sInsD, borderRadius: 16, overflow: "hidden" }}>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, background: "#000" }}>
                <iframe
                  src={"https://www.youtube.com/embed/" + ytId + "?rel=0"}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={viewing.t || viewing.title || "YouTube"}
                />
              </div>
            </div>
            {/* Fallback link in case iframe is blocked */}
            <a href={"https://www.youtube.com/watch?v=" + ytId} target="_blank" rel="noopener noreferrer" style={{ ...sM, fontSize: 11, display: "block", textAlign: "center", marginTop: 6, textDecoration: "none", color: AC }}>
              无法播放？点击在 YouTube 中打开 ↗
            </a>
          </div>
        ) : (
          <div style={{ ...sIns, padding: 20, textAlign: "center", marginBottom: 16 }}>
            <p style={{ ...sM, margin: 0 }}>请在 YouTube 搜索此素材标题</p>
            <a href={"https://www.youtube.com/results?search_query=" + encodeURIComponent(viewing.t || viewing.title || "")} target="_blank" rel="noopener noreferrer" style={{ ...sBtnA, display: "inline-block", marginTop: 10, padding: "8px 16px", fontSize: 13, textDecoration: "none" }}>搜索 YouTube ↗</a>
          </div>
        )}

        {viewing.r && (
          <div style={{ ...sCardS, padding: 12, marginBottom: 12 }}>
            <p style={{ ...sM, fontSize: 11, margin: "0 0 4px" }}>推荐理由</p>
            <p style={{ ...sB, fontSize: 13, margin: 0 }}>{viewing.r}</p>
          </div>
        )}
        {viewing.sg && (
          <div style={{ ...sCardS, padding: 12, marginBottom: 12 }}>
            <p style={{ ...sM, fontSize: 11, margin: "0 0 4px" }}>建议跟读片段</p>
            <p style={{ ...sB, fontSize: 13, margin: 0, color: WC[selWeek - 1], fontWeight: 600 }}>{viewing.sg}</p>
          </div>
        )}

        <div style={{ ...sCard, padding: 16 }}>
          <p style={{ ...sM, fontSize: 12, margin: "0 0 8px" }}>📝 跟读笔记</p>
          <textarea value={note} onChange={function (e) { setNote(e.target.value); }} placeholder="记录好表达、词汇、发音要点..." rows={5} style={{ ...sInp, resize: "vertical", lineHeight: 1.6 }} />
          {viewing.isUser && (
            <button onClick={function () { props.onUpdateNote(viewing.id, note); }} style={{ ...sBtnA, marginTop: 8, padding: "10px 16px", fontSize: 13 }}>保存笔记</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
      <h2 style={{ ...sH2, fontSize: 20, marginBottom: 16 }}>影子跟读</h2>

      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {WKS.map(function (wk) {
          return (
            <button key={wk.n} onClick={function () { setSelWeek(wk.n); }} style={{ ...sBtn, flex: 1, padding: "8px 4px", fontSize: 11, fontWeight: 600, color: selWeek === wk.n ? WC[wk.n - 1] : MU, boxShadow: selWeek === wk.n ? SH.insS : SH.extS }}>W{wk.n}</button>
          );
        })}
      </div>

      <p style={{ ...sM, fontSize: 12, marginBottom: 8, fontWeight: 600, color: WC[selWeek - 1] }}>推荐素材</p>
      {weekMats.map(function (m) {
        return (
          <button key={m.id} onClick={function () { setViewing(m); setNote(""); }} style={{ ...sCardS, padding: 14, marginBottom: 8, width: "100%", textAlign: "left", cursor: "pointer", display: "block", border: "none" }}>
            <p style={{ ...sB, fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>{m.t}</p>
            <p style={{ ...sM, fontSize: 12, margin: 0 }}>{m.s} · {m.d}</p>
          </button>
        );
      })}

      {userWeekMats.length > 0 && (
        <div>
          <p style={{ ...sM, fontSize: 12, marginTop: 16, marginBottom: 8, fontWeight: 600 }}>我的素材</p>
          {userWeekMats.map(function (m) {
            return (
              <button key={m.id} onClick={function () { setViewing({ ...m, t: m.title, isUser: true }); setNote(m.notes || ""); }} style={{ ...sCardS, padding: 14, marginBottom: 8, width: "100%", textAlign: "left", cursor: "pointer", display: "block", border: "none" }}>
                <p style={{ ...sB, fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>{m.title}</p>
              </button>
            );
          })}
        </div>
      )}

      {!showAdd ? (
        <button onClick={function () { setShowAdd(true); }} style={{ ...sBtn, width: "100%", padding: 14, fontSize: 13, color: MU, marginTop: 12 }}>+ 添加素材</button>
      ) : (
        <div style={{ ...sCard, padding: 16, marginTop: 12 }}>
          <input value={newUrl} onChange={function (e) { setNewUrl(e.target.value); }} placeholder="YouTube 链接" style={{ ...sInp, marginBottom: 8 }} />
          <input value={newTitle} onChange={function (e) { setNewTitle(e.target.value); }} placeholder="标题" style={{ ...sInp, marginBottom: 8 }} />
          <input value={newTag} onChange={function (e) { setNewTag(e.target.value); }} placeholder="标签（逗号分隔）" style={{ ...sInp, marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={function () { if (newTitle.trim()) { props.onAddMat({ id: String(Date.now()), title: newTitle.trim(), url: newUrl.trim(), tags: newTag.split(",").map(function (x) { return x.trim(); }).filter(Boolean), notes: "", w: selWeek }); setNewUrl(""); setNewTitle(""); setNewTag(""); setShowAdd(false); } }} style={{ ...sBtnA, flex: 1, padding: 12, fontSize: 13, fontWeight: 600 }}>保存</button>
            <button onClick={function () { setShowAdd(false); }} style={{ ...sBtn, padding: "12px 16px", fontSize: 13 }}>取消</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Topics View ── */
function TopicsView(props) {
  var [showAdd, setShowAdd] = useState(false);
  var [title, setTitle] = useState("");
  var [note, setNote] = useState("");
  var [prio, setPrio] = useState("medium");
  var [copiedId, setCopiedId] = useState(null);

  return (
    <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
      <h2 style={{ ...sH2, fontSize: 20, marginBottom: 4 }}>Topic 收集箱</h2>
      <p style={{ ...sM, marginBottom: 16, marginTop: 4 }}>共 {props.topics.length} 个话题</p>

      {props.topics.length === 0 && !showAdd && (
        <div style={{ ...sIns, padding: 40, textAlign: "center" }}>
          <p style={{ ...sM, fontSize: 14 }}>还没有收集话题</p>
          <p style={{ ...sM, fontSize: 12 }}>看到 JD 上的新概念？随时记录</p>
        </div>
      )}

      {props.topics.map(function (tp, i) {
        return (
          <div key={i} style={{ ...sCard, padding: 16, marginBottom: 10, borderLeft: tp.p === "high" ? "3px solid " + AC : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <p style={{ ...sB, fontSize: 14, fontWeight: 600, margin: 0, flex: 1 }}>{tp.title}</p>
              <span style={sTag(tp.p === "high" ? AC : MU)}>{tp.p === "high" ? "高" : tp.p === "medium" ? "中" : "低"}</span>
            </div>
            {tp.note && <p style={{ ...sM, fontSize: 12, margin: "4px 0 8px" }}>{tp.note}</p>}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button onClick={function () { if (navigator.clipboard) navigator.clipboard.writeText(tp.prompt); setCopiedId(tp.id); setTimeout(function () { setCopiedId(null); }, 2000); }} style={{ ...sBtn, padding: "6px 12px", fontSize: 12 }}>{copiedId === tp.id ? "✓ 已复制" : "复制 Prompt"}</button>
              <button onClick={function () { props.onToggle(tp.id); }} style={{ ...sBtn, padding: "6px 12px", fontSize: 12, color: tp.done ? OK : MU }}>{tp.done ? "✓ 已练习" : "标记已练习"}</button>
              <button onClick={function () { props.onDelete(tp.id); }} style={{ ...sBtn, padding: "6px 12px", fontSize: 12, color: MU }}>删除</button>
            </div>
          </div>
        );
      })}

      {!showAdd ? (
        <button onClick={function () { setShowAdd(true); }} style={{ ...sBtn, width: "100%", padding: 14, fontSize: 13, color: MU, marginTop: 8 }}>+ 添加话题</button>
      ) : (
        <div style={{ ...sCard, padding: 16, marginTop: 8 }}>
          <input value={title} onChange={function (e) { setTitle(e.target.value); }} placeholder="话题名称" style={{ ...sInp, marginBottom: 8 }} />
          <input value={note} onChange={function (e) { setNote(e.target.value); }} placeholder="来源/备注" style={{ ...sInp, marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {["high", "medium", "low"].map(function (p) {
              return (
                <button key={p} onClick={function () { setPrio(p); }} style={{ ...sBtn, flex: 1, padding: "8px 0", fontSize: 12, fontWeight: 600, color: prio === p ? AC : MU, boxShadow: prio === p ? SH.insS : SH.extS }}>{p === "high" ? "高" : p === "medium" ? "中" : "低"}</button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={function () { if (title.trim()) { props.onAdd({ id: String(Date.now()), title: title.trim(), note: note.trim(), p: prio, prompt: makePrompt(title.trim()), done: false }); setTitle(""); setNote(""); setPrio("medium"); setShowAdd(false); } }} style={{ ...sBtnA, flex: 1, padding: 12, fontSize: 13, fontWeight: 600 }}>保存</button>
            <button onClick={function () { setShowAdd(false); }} style={{ ...sBtn, padding: "12px 16px", fontSize: 13 }}>取消</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Vocab View ── */
function VocabView(props) {
  var [query, setQuery] = useState("");
  var [showAdd, setShowAdd] = useState(false);
  var [newEn, setNewEn] = useState("");
  var [newZh, setNewZh] = useState("");
  var [newSrc, setNewSrc] = useState("");
  var filtered = props.exprs.filter(function (e) {
    if (!query) return true;
    return e.en.toLowerCase().includes(query.toLowerCase()) || (e.zh && e.zh.includes(query));
  });

  return (
    <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h2 style={{ ...sH2, fontSize: 20 }}>表达积累本</h2>
        <button onClick={function () { setShowAdd(!showAdd); }} style={{ ...sBtnA, padding: "8px 14px", fontSize: 12, fontWeight: 600 }}>+ 添加</button>
      </div>
      <p style={{ ...sM, marginBottom: 12, marginTop: 4 }}>共 {props.exprs.length} 条</p>

      {showAdd && (
        <div style={{ ...sCard, padding: 16, marginBottom: 16 }}>
          <input value={newEn} onChange={function (e) { setNewEn(e.target.value); }} placeholder="英文表达" style={{ ...sInp, marginBottom: 8 }} />
          <input value={newZh} onChange={function (e) { setNewZh(e.target.value); }} placeholder="中文含义 / 使用场景" style={{ ...sInp, marginBottom: 8 }} />
          <input value={newSrc} onChange={function (e) { setNewSrc(e.target.value); }} placeholder="来源（选填，如：播客/文章/JD）" style={{ ...sInp, marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={function () { if (newEn.trim()) { props.onAdd({ en: newEn.trim(), zh: newZh.trim(), source: newSrc.trim() || "手动添加", date: new Date().toLocaleDateString() }); setNewEn(""); setNewZh(""); setNewSrc(""); setShowAdd(false); } }} style={{ ...sBtnA, flex: 1, padding: 12, fontSize: 13, fontWeight: 600 }}>保存</button>
            <button onClick={function () { setShowAdd(false); setNewEn(""); setNewZh(""); setNewSrc(""); }} style={{ ...sBtn, padding: "12px 16px", fontSize: 13 }}>取消</button>
          </div>
        </div>
      )}

      <input value={query} onChange={function (e) { setQuery(e.target.value); }} placeholder="搜索..." style={{ ...sInp, marginBottom: 16 }} />
      {filtered.length === 0 ? (
        <div style={{ ...sIns, padding: 40, textAlign: "center" }}>
          <p style={sM}>{props.exprs.length === 0 ? "开始练习后，把卡壳的表达记在这里" : "没有匹配的表达"}</p>
        </div>
      ) : filtered.map(function (e, i) {
        return (
          <div key={i} style={{ ...sCardS, padding: 14, marginBottom: 8 }}>
            <p style={{ ...sB, fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>{e.en}</p>
            {e.zh && <p style={{ ...sM, fontSize: 12, margin: "0 0 4px" }}>{e.zh}</p>}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ ...sM, fontSize: 11 }}>{e.source} · {e.date}</span>
              <button onClick={function () { props.onDelete(i); }} style={{ ...sBtn, boxShadow: "none", padding: "2px 8px", fontSize: 11, color: MU }}>删除</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Stats View ── */
function StatsView(props) {
  var streak = 0;
  for (var dd = props.curDay; dd >= 1; dd--) {
    if (props.checked.includes(dd)) streak++;
    else break;
  }
  var pct = Math.round((props.checked.length / 30) * 100);

  return (
    <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
      <h2 style={{ ...sH2, fontSize: 20, marginBottom: 20 }}>练习进度</h2>

      <div style={{ ...sCard, padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={sM}>总进度</span>
          <span style={{ ...sB, fontSize: 13, fontWeight: 700, color: AC }}>{props.checked.length}/30</span>
        </div>
        <div style={{ ...sIns, borderRadius: 9999, height: 10, overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(90deg," + AC + "," + OK + ")", height: "100%", width: pct + "%", borderRadius: 9999, transition: "width .5s" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { l: "连续打卡", v: streak + "天", c: WC[0] },
          { l: "当前进度", v: "Day " + props.curDay, c: WC[1] },
          { l: "积累表达", v: props.exprs.length + "条", c: WC[2] },
          { l: "完成率", v: pct + "%", c: WC[3] },
        ].map(function (s, i) {
          return (
            <div key={i} style={{ ...sCard, padding: 16, textAlign: "center" }}>
              <p style={{ ...sH1, fontSize: 22, color: s.c, marginBottom: 4 }}>{s.v}</p>
              <p style={{ ...sM, fontSize: 12, margin: 0 }}>{s.l}</p>
            </div>
          );
        })}
      </div>

      <div style={{ ...sCard, padding: 16 }}>
        <p style={{ ...sM, fontSize: 12, marginTop: 0, marginBottom: 12 }}>各周完成情况</p>
        {WKS.map(function (wk) {
          var rng = wk.n < 4 ? [wk.n * 7 - 6, wk.n * 7] : [22, 30];
          var total = rng[1] - rng[0] + 1;
          var done = props.checked.filter(function (d) { return d >= rng[0] && d <= rng[1]; }).length;
          return (
            <div key={wk.n} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ ...sM, fontSize: 12 }}>{wk.l}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: WC[wk.n - 1] }}>{done}/{total}</span>
              </div>
              <div style={{ boxShadow: SH.insS, borderRadius: 9999, height: 6, overflow: "hidden", background: BG }}>
                <div style={{ background: WC[wk.n - 1], height: "100%", width: (done / total) * 100 + "%", borderRadius: 9999, transition: "width .5s" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main App ── */
export default function App() {
  var [tab, setTab] = useState("today");
  var [checked, setChecked, c1] = useStore("oet-ckd", []);
  var [exprs, setExprs, c2] = useStore("oet-ex", []);
  var [curDay, setCurDay, c3] = useStore("oet-cur", 1);
  var [topics, setTopics, c4] = useStore("oet-tps", []);
  var [userMats, setUserMats, c5] = useStore("oet-um", []);
  var [viewDay, setViewDay] = useState(null);

  var loaded = c1 && c2 && c3 && c4 && c5;

  function handleCheck(day) {
    setChecked(function (prev) { return prev.concat([day]); });
    if (day === curDay && curDay < 30) {
      setCurDay(function (prev) { return prev + 1; });
    }
  }

  if (!loaded) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FB, color: MU }}>加载中...</div>
    );
  }

  var displayDay = viewDay || curDay;

  return (
    <div style={{ minHeight: "100vh", background: BG, paddingBottom: 20 }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />

      <div style={{ padding: "24px 16px 8px", textAlign: "center" }}>
        <h1 style={{ ...sH1, fontSize: 20, letterSpacing: "0.08em" }}>ORAL ENGLISH</h1>
        <p style={{ ...sM, fontSize: 10, letterSpacing: "0.2em", marginTop: 2 }}>30-DAY CHALLENGE</p>
      </div>

      <TabBar active={tab} onChange={function (t) { setTab(t); setViewDay(null); }} />

      {tab === "today" && (
        <TodayView day={displayDay} checked={checked} onCheck={handleCheck} onAddExpr={function (e) { setExprs(function (p) { return p.concat([e]); }); }} topics={topics} />
      )}
      {tab === "plan" && (
        <PlanView curDay={curDay} checked={checked} onSelect={function (d) { setViewDay(d); setTab("today"); }} />
      )}
      {tab === "shadow" && (
        <ShadowView userMats={userMats} onAddMat={function (m) { setUserMats(function (p) { return p.concat([m]); }); }} onUpdateNote={function (id, n) { setUserMats(function (p) { return p.map(function (m) { return m.id === id ? { ...m, notes: n } : m; }); }); }} />
      )}
      {tab === "topics" && (
        <TopicsView topics={topics} onAdd={function (t) { setTopics(function (p) { return p.concat([t]); }); }} onToggle={function (id) { setTopics(function (p) { return p.map(function (t) { return t.id === id ? { ...t, done: !t.done } : t; }); }); }} onDelete={function (id) { setTopics(function (p) { return p.filter(function (t) { return t.id !== id; }); }); }} />
      )}
      {tab === "vocab" && (
        <VocabView exprs={exprs} onAdd={function (e) { setExprs(function (p) { return p.concat([e]); }); }} onDelete={function (i) { setExprs(function (p) { return p.filter(function (_, idx) { return idx !== i; }); }); }} />
      )}
      {tab === "stats" && (
        <StatsView checked={checked} curDay={curDay} exprs={exprs} />
      )}

      {viewDay && viewDay !== curDay && tab === "today" && (
        <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", ...sCardS, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: FG, zIndex: 20 }}>
          正在查看 Day {viewDay}
          <button onClick={function () { setViewDay(null); }} style={{ ...sBtnA, padding: "4px 10px", fontSize: 11, borderRadius: 9999 }}>回到今天</button>
        </div>
      )}
    </div>
  );
}
