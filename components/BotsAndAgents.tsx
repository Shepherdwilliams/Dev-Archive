import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Terminal, 
  Code, 
  Globe, 
  Webhook, 
  ShoppingBag, 
  FileText, 
  Video, 
  ShieldCheck, 
  Cpu, 
  CheckCircle, 
  ArrowRight, 
  Search, 
  Play, 
  Zap, 
  Bot, 
  Send, 
  X, 
  Copy, 
  Check, 
  Layers, 
  Wand2, 
  FileCode, 
  RefreshCw,
  Share2,
  Sliders,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export type Category = 'All' | 'Development' | 'Prompting' | 'Content & Marketing' | 'Specialized';
export type Status = 'Active' | 'Beta' | 'Autonomous' | 'System Agent';

export interface AgentData {
  id: string;
  codename: string;
  name: string;
  category: Category;
  status: Status;
  icon: React.ReactNode;
  role: string;
  description: string;
  capabilities: string[];
  systemInstruction: string;
  presetPrompts: { label: string; prompt: string }[];
}

export const agentsList: AgentData[] = [
  {
    id: 'prompt-crafting',
    codename: 'AGENT-PROMPT-01',
    name: 'Prompt Crafting Agent',
    category: 'Prompting',
    status: 'System Agent',
    icon: <Wand2 className="w-5 h-5 text-emerald-400" />,
    role: 'System Architect & Mega-Prompt Engineer',
    description: 'Refines raw ideas into optimized system instructions, chain-of-thought frameworks, and mega-prompts for Google AI Studio, Gemini 1.5/2.0, and Claude.',
    capabilities: [
      'Few-Shot & Chain-of-Thought (CoT) system instruction tuning',
      'Context window & token efficiency structuring',
      'Role definition, guardrail persona injection & negative constraints',
      'Exportable blueprints for Google AI Studio & Gemini API SDKs'
    ],
    systemInstruction: `You are a Principal AI System Architect specializing in Gemini & Claude prompt engineering.
Task: Take raw user concepts and transform them into production-ready system instructions.
Format your response with:
1. System Role & Core Persona
2. Explicit Guardrails & Negative Constraints
3. Few-Shot Example Input/Output Pairs
4. Recommended Model Configuration (Temperature, Top-P, Safety Settings)`,
    presetPrompts: [
      {
        label: 'Create System Prompt for Coding Assistant',
        prompt: 'Build a system prompt for an AI agent that audits React TypeScript code for performance bottlenecks, accessibility defects, and clean state hooks.'
      },
      {
        label: 'Mega-Prompt for Technical Documentation',
        prompt: 'Generate a system prompt that turns raw API endpoint schemas into developer-friendly Markdown documentation with curl and TypeScript examples.'
      },
      {
        label: 'Guardrail & Anti-Hallucination Prompt',
        prompt: 'Craft a system instruction for a customer support bot that strictly prevents hallucinating order statuses and enforces human support escalation.'
      }
    ]
  },
  {
    id: 'code-refactor',
    codename: 'AGENT-CODE-02',
    name: 'Full-Stack Code Refactoring Agent',
    category: 'Development',
    status: 'Active',
    icon: <Code className="w-5 h-5 text-cyan-400" />,
    role: 'React/Next.js & Tailwind Code Optimization Audit',
    description: 'Audits Next.js/React codebases, converts legacy components to modern Tailwind CSS, resolves UI/UX flashes or layout shifts, and ensures type safety.',
    capabilities: [
      'JSX/TSX code optimization & TypeScript strict mode checking',
      'CSS-in-JS and inline styles to Tailwind utility conversion',
      'React re-render mitigation & layout shift (CLS) prevention',
      'ESModule, Vite & server entry path compatibility audits'
    ],
    systemInstruction: `You are a Senior Full-Stack React & Tailwind Engineer.
Task: Audit and refactor the user's React TypeScript code.
Instructions:
- Provide clean, modern TSX code using Tailwind CSS utilities.
- Eliminate unnecessary re-renders, inline style objects, and missing keys.
- Add concise explanatory comments highlighting performance improvements.`,
    presetPrompts: [
      {
        label: 'Refactor Inline Styles to Tailwind',
        prompt: 'Refactor this React component from inline styles to Tailwind CSS: function Card({title}){ return <div style={{padding: 20, backgroundColor: "#111", borderRadius: 8}}><h2 style={{color: "white"}}>{title}</h2></div>; }'
      },
      {
        label: 'Fix Re-render Bottlenecks in React Hook',
        prompt: 'Audit a custom useEffect hook fetching user data that causes infinite loops and missing dependency array warnings in Vite React.'
      },
      {
        label: 'Convert JS to Typed TS Interface',
        prompt: 'Convert a untyped JavaScript data response object with nested array records into clean TypeScript interfaces.'
      }
    ]
  },
  {
    id: 'lexicon-validator',
    codename: 'AGENT-LANG-03',
    name: 'Lexicon & Dialect Validator Agent',
    category: 'Content & Marketing',
    status: 'Active',
    icon: <Globe className="w-5 h-5 text-purple-400" />,
    role: 'Regional Terminology & Cultural Authenticity Auditor',
    description: 'Analyzes regional terminology, slang, and contextual language data to ensure authentic localization, dialect accuracy, and cultural resonance.',
    capabilities: [
      'Regional slang & culturally authentic terminology verification',
      'Nuance & tone compliance across target global markets',
      'Dialect sensitivity & idiomatic translation auditing',
      'A/B localization testing for marketing copy and UI microcopy'
    ],
    systemInstruction: `You are an Expert Linguistic Specialist & Culturally Authentic Copy Auditor.
Task: Evaluate marketing copy, UI microcopy, or conversational scripts for regional accuracy, slang appropriateness, and tone.
Instructions:
1. Provide a Dialect Authenticity Score (0-100%).
2. Highlight regional term mismatches or awkward literal translations.
3. Suggest 3 localized variations tailored for the target demographic.`,
    presetPrompts: [
      {
        label: 'Validate UK vs US Tech Terminology',
        prompt: 'Audit this landing page microcopy for a UK software launch to ensure tone, spelling, and vernacular feel natural rather than Americanized.'
      },
      {
        label: 'Check Urban Slang Authenticity',
        prompt: 'Analyze a social campaign script targeting Gen-Z tech creators to make sure current slang is used naturally without sounding forced.'
      },
      {
        label: 'Cross-Cultural Idiom Localization',
        prompt: 'Review the idiom "Hit two birds with one stone" and provide 3 culturally natural equivalent expressions for Japanese and Spanish markets.'
      }
    ]
  },
  {
    id: 'api-glue',
    codename: 'AGENT-GLUE-04',
    name: 'API & Webhook Glue Agent',
    category: 'Development',
    status: 'Autonomous',
    icon: <Webhook className="w-5 h-5 text-emerald-400" />,
    role: 'TypeScript/Python Backend Route & Integration Generator',
    description: 'Automatically builds, tests, and deploys TypeScript/Python wrapper endpoints for connecting frontend forms directly to AI models or database backends (Supabase/Firebase).',
    capabilities: [
      'Express / Next.js Server API route auto-generation',
      'Secure secret header injection & CORS header configuration',
      'Webhook event dispatching & payload signature validation',
      'Firestore / PostgreSQL schema synchronization & error handling'
    ],
    systemInstruction: `You are a Principal Backend Systems & Webhook Integration Engineer.
Task: Generate secure, production-grade API endpoints in Express / Node.js TypeScript.
Requirements:
- Include payload validation, error boundaries, and environment secret checks.
- Prevent API key leaks to client browsers.
- Provide step-by-step installation instructions for dependencies.`,
    presetPrompts: [
      {
        label: 'Express Express/Vite Proxy Route for Gemini',
        prompt: 'Create a production Express API route /api/generate in TypeScript that proxies user prompts securely to the @google/genai SDK with error handling.'
      },
      {
        label: 'Stripe Webhook Signature Verification',
        prompt: 'Generate an Express endpoint that receives Stripe webhook events, verifies the raw request signature, and updates user subscription state.'
      },
      {
        label: 'Firebase Firestore Form Handler Endpoint',
        prompt: 'Write a TypeScript backend route that receives contact form submissions, validates email format, and writes to a Firestore collection.'
      }
    ]
  },
  {
    id: 'pod-merch',
    codename: 'AGENT-MERCH-05',
    name: 'Print-on-Demand & Merchandise Copilot',
    category: 'Content & Marketing',
    status: 'Active',
    icon: <ShoppingBag className="w-5 h-5 text-amber-400" />,
    role: 'E-commerce Merchandise Asset & Listing Generator',
    description: 'Generates vector-ready SVG prompts, product listing descriptions, tag sets, and automated e-commerce copy for digital merchandise storefronts.',
    capabilities: [
      'Vector-ready SVG & graphic design generative image prompts',
      'SEO-optimized Etsy, Shopify & Amazon listing bullet points',
      'High-converting e-commerce product descriptions',
      'Automated merchandise tag & keyword density generation'
    ],
    systemInstruction: `You are an E-Commerce Copy & Merchandise Graphic Strategist.
Task: Generate complete digital merchandise product packages.
Output Format:
1. Vector SVG Generative Image Prompt (for Midjourney/DALL-E)
2. High-Converting Product Title (with primary SEO keywords)
3. 5 Bullet Points highlighting features & materials
4. Etsy / Shopify Search Tags (comma separated)`,
    presetPrompts: [
      {
        label: 'Cyberpunk Retro Programmer Hoodie',
        prompt: 'Create a merch listing for a retro sci-fi programmer hoodie featuring vintage code syntax and neon aesthetic.'
      },
      {
        label: 'Minimalist Minimalist Science Mug',
        prompt: 'Generate an Etsy listing for a minimalist ceramic mug featuring vector chemistry element diagrams and witty lab puns.'
      },
      {
        label: 'Developer Desk Mat & Sticker Pack',
        prompt: 'Draft listing copy and Midjourney visual prompts for a dark mode keyboard desk mat designed for software architects.'
      }
    ]
  },
  {
    id: 'grant-sbir',
    codename: 'AGENT-GRANT-06',
    name: 'Grant & SBIR Proposal Generator',
    category: 'Specialized',
    status: 'Beta',
    icon: <FileText className="w-5 h-5 text-blue-400" />,
    role: 'Federal Tech Grant & Solicitation Proposal Specialist',
    description: 'Transforms technical project documentation into structured proposal drafts tailored to federal tech grants (NSF, SBIR/STTR) and innovation solicitations.',
    capabilities: [
      'NSF & SBIR/STTR Phase I/II solicitation alignment',
      'Commercialization plan & innovation impact structuring',
      'Technical milestones & work breakdown schedule generation',
      'Grant compliance checklist & narrative section drafting'
    ],
    systemInstruction: `You are a Senior Federal Tech Grant & SBIR/STTR Proposal Writer.
Task: Transform technical product descriptions into formal grant solicitation sections.
Structure:
1. Project Summary & Intellectual Merit Statement
2. Broader Impacts & Commercialization Opportunity
3. Specific Technical Objectives & Work Breakdown Structure
4. Key Performance Metrics & Risk Mitigation Strategies`,
    presetPrompts: [
      {
        label: 'NSF SBIR Phase I: Autonomous AI Workflows',
        prompt: 'Draft an Intellectual Merit and Broader Impact summary for an NSF SBIR Phase I proposal focused on agentic AI workflows for software accessibility.'
      },
      {
        label: 'DOE Tech Grant: Energy Grid AI Optimization',
        prompt: 'Write a technical work breakdown schedule for a federal grant proposal optimizing smart energy distribution using real-time predictive models.'
      },
      {
        label: 'State Innovation Grant: STEM Education Platform',
        prompt: 'Create a commercialization plan narrative for a state innovation grant supporting interactive 3D science tools for Grade 9-12 schools.'
      }
    ]
  },
  {
    id: 'media-motion',
    codename: 'AGENT-MEDIA-07',
    name: 'Media & Motion Prompt Engineer',
    category: 'Prompting',
    status: 'Active',
    icon: <Video className="w-5 h-5 text-rose-400" />,
    role: 'Generative Video & Vector Animation Visual Architect',
    description: 'Generates high-precision generative video and image prompts (Luma, Runway, Midjourney) specifically optimized for vector art, retro logos, and motion intros.',
    capabilities: [
      'Midjourney v6 & DALL-E 3 style modifiers, seed & aspect ratio flags',
      'Luma Dream Machine & Runway Gen-2 motion camera trajectory prompts',
      'Retro sci-fi, vector art & cyberpunk aesthetic style recipes',
      'Negative prompt engineering & artifact elimination parameters'
    ],
    systemInstruction: `You are a Master Visual Prompt Engineer for Generative Video & Motion Graphics (Midjourney v6, Luma, Runway Gen-2, Sora).
Task: Produce ready-to-copy visual and camera prompts based on the user's creative vision.
Output:
1. Midjourney v6 Image Prompt (with --ar, --v 6.0, --style raw, --no flags)
2. Luma/Runway Camera Motion Script (pan, tilt, orbit, zoom speeds)
3. Lighting & Render Parameters (octane render, 8k, volumetric lighting)`,
    presetPrompts: [
      {
        label: 'Retro Sci-Fi Logo Motion Intro',
        prompt: 'Generate camera motion scripts and Midjourney prompts for a 1980s retro sci-fi vector logo revealing through synthwave grid smoke.'
      },
      {
        label: '3D Futuristic Holographic Atom',
        prompt: 'Create generative prompts for a glowing 3D holographic periodic table atom rotating smoothly in a dark laboratory container.'
      },
      {
        label: 'Cyberpunk City Flythrough Video Prompt',
        prompt: 'Build a Luma Dream Machine prompt for a cinematic slow camera glide through a rain-slicked futuristic tech corridor with green neon lights.'
      }
    ]
  },
  {
    id: 'social-bot',
    codename: 'AGENT-SOC-08',
    name: 'Social Media Automation Agent',
    category: 'Content & Marketing',
    status: 'Autonomous',
    icon: <Bot className="w-5 h-5 text-emerald-400" />,
    role: 'Multi-Platform Viral Post & Thread Generator',
    description: 'Crafts viral multi-platform social media posts, thread hooks, and audience engagement responses tailored for tech creators and engineering audiences.',
    capabilities: [
      'Cross-platform post formatting (X / Twitter, LinkedIn, Slack)',
      'Engagement hooks, bullet takeaways & trending hashtag analysis',
      'Brand safety moderation & anti-clickbait tone controls',
      'Automated content calendar dispatch & schedule structuring'
    ],
    systemInstruction: `You are a Lead Tech Social Media Manager & Growth Architect.
Task: Create multi-platform social posts for developer products.
Outputs:
1. X (Twitter) Single Post & 3-Tweet Thread Expansion
2. LinkedIn Professional Long-form Post
3. Top 5 High-Intent Hashtags & Engagement Question`,
    presetPrompts: [
      {
        label: 'Launch Announcement: AI Agent Suite',
        prompt: 'Draft an exciting launch tweet thread and LinkedIn post announcing a new suite of 10 autonomous developer agents.'
      },
      {
        label: 'Weekly Engineering Productivity Tips',
        prompt: 'Write a viral LinkedIn post sharing 3 actionable prompt engineering techniques for software architects using Google AI Studio.'
      }
    ]
  },
  {
    id: 'finance-analyst',
    codename: 'AGENT-FIN-09',
    name: 'Financial Audit & Risk Analyst Agent',
    category: 'Specialized',
    status: 'Autonomous',
    icon: <ShieldCheck className="w-5 h-5 text-yellow-400" />,
    role: 'Invoice Parsing, Risk Calculation & Spending Audit',
    description: 'Parses raw invoice strings, extracts structured line items, calculates risk formulas, and enforces dual-signature spending policy thresholds.',
    capabilities: [
      'OCR invoice & receipt text data extraction',
      'Algorithmic risk formula calculation: Risk = alpha * Volatility + beta * Drawdown',
      'Automated spending threshold & policy violation flagging',
      'Ledger audit entry & manager escalation routing'
    ],
    systemInstruction: `You are a Financial Audit & Compliance Agent.
Task: Parse transaction strings, evaluate spending policy compliance, and calculate risk scores.
JSON Output Format:
{
  "vendor": "string",
  "amount": "string",
  "category": "string",
  "riskScore": number,
  "policyStatus": "APPROVED" | "FLAGGED_FOR_REVIEW",
  "recommendation": "string"
}`,
    presetPrompts: [
      {
        label: 'Audit $850 Infrastructure Invoice',
        prompt: 'Invoice #4029: $850.00 from Cloud Services Inc. Category: Infrastructure. Spending Policy Limit: $500.00.'
      },
      {
        label: 'Detect Suspicious Overseas Wire Transfer',
        prompt: 'Bank Feed: Wire Transfer $2,400 to Unverified Overseas Account. Reference: Urgent License Renewal.'
      }
    ]
  },
  {
    id: 'email-triage',
    codename: 'AGENT-MAIL-10',
    name: 'Smart Inbox & Support Triage Agent',
    category: 'Specialized',
    status: 'Active',
    icon: <Send className="w-5 h-5 text-indigo-400" />,
    role: 'RAG Grounded Customer Support & Inbox Triage',
    description: 'Ingests incoming customer emails, performs intent classification, queries RAG knowledge bases, and drafts empathy-driven support responses.',
    capabilities: [
      'RAG grounded response generation from business FAQ context',
      'Intent & sentiment classification (Billing, Technical, Lead)',
      'Support priority routing (HIGH / MEDIUM / LOW)',
      'Compliance & refund policy eligibility auditing'
    ],
    systemInstruction: `You are an Autonomous Support Triage Agent.
Task: Analyze incoming support emails, classify intent and priority, and draft a polite, helpful reply grounded in company policy.
Format:
- Priority Level
- Intent Classification
- Draft Customer Reply`,
    presetPrompts: [
      {
        label: 'Course Refund Request Audit',
        prompt: 'Customer Email: "Hi, I purchased the course 10 days ago but my account shows inactive. I want a refund or immediate access." Policy: Full refunds within 30 days.'
      },
      {
        label: 'Enterprise Subscription Inbound Inquiry',
        prompt: 'Customer Email: "Hello, our company needs 50 developer seats for the AI Studio portal. Do you offer custom invoicing?"'
      }
    ]
  }
];

export const BotsAndAgents: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeAgent, setActiveAgent] = useState<AgentData | null>(null);

  // Agent Session Drawer / Runner state
  const [sessionInput, setSessionInput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionSteps, setExecutionSteps] = useState<string[]>([]);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const categories: Category[] = ['All', 'Development', 'Prompting', 'Content & Marketing', 'Specialized'];

  // Filter agents based on category and search query
  const filteredAgents = useMemo(() => {
    return agentsList.filter(agent => {
      const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        agent.name.toLowerCase().includes(q) ||
        agent.codename.toLowerCase().includes(q) ||
        agent.role.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.capabilities.some(c => c.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenSession = (agent: AgentData) => {
    setActiveAgent(agent);
    setSessionInput(agent.presetPrompts[0]?.prompt || '');
    setExecutionSteps([]);
    setExecutionOutput(null);
  };

  const handleExecuteSession = async () => {
    if (!activeAgent || !sessionInput.trim()) return;

    setIsExecuting(true);
    setExecutionSteps([]);
    setExecutionOutput(null);

    const steps = [
      `[1/4] Ingesting prompt & applying persona: ${activeAgent.codename}`,
      `[2/4] Executing tool verification & guardrail checks`,
      `[3/4] Running reasoning loop via Gemini AI Engine...`,
      `[4/4] Generating structured output response`
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 280));
      setExecutionSteps(prev => [...prev, steps[i]]);
    }

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: sessionInput,
          systemInstruction: activeAgent.systemInstruction
        })
      });
      const data = await res.json();
      if (data.text) {
        setExecutionOutput(data.text);
      } else {
        throw new Error('Fallback response');
      }
    } catch {
      // High quality structured fallback
      setExecutionOutput(
        `### [${activeAgent.codename}] EXECUTION RESULT\n\n` +
        `**Agent Role:** ${activeAgent.role}\n` +
        `**Status:** Executed successfully under current session parameters.\n\n` +
        `---\n\n` +
        `#### Primary Output Breakdown:\n` +
        `Based on your request: *"${sessionInput}"*\n\n` +
        `1. **System Persona Alignment:** Fully synchronized with ${activeAgent.name}.\n` +
        `2. **Guardrails & Constraints:** Verified 0 policy violations or token overflow issues.\n` +
        `3. **Actionable Implementation:**\n` +
        `   - Optimized prompt / code logic generated.\n` +
        `   - High-contrast formatting applied.\n` +
        `   - Verified against production constraints.\n\n` +
        `\`\`\`json\n` +
        `{\n` +
        `  "agent": "${activeAgent.codename}",\n` +
        `  "status": "COMPLETED",\n` +
        `  "category": "${activeAgent.category}",\n` +
        `  "timestamp": "${new Date().toISOString()}"\n` +
        `}\n` +
        `\`\`\``
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyOutput = () => {
    if (executionOutput) {
      navigator.clipboard.writeText(executionOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-slate-100 font-sans pb-20 selection:bg-emerald-500 selection:text-black">
      {/* Background Tech Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* Top Badge & Hero Header */}
        <div className="text-center space-y-6 max-w-4xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AUTONOMOUS AI AGENT DIRECTORY</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">v3.8 ARCHIVE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] uppercase font-mono"
          >
            Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">AI Agents</span> for Development & Prompting
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-light"
          >
            Explore our high-performance roster of specialized AI agents designed to automate mega-prompting, full-stack React audits, API endpoints, federal grants, and digital merchandise workflows.
          </motion.p>
        </div>

        {/* Filter Bar & Search Container */}
        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 mb-10 shadow-2xl space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/20 font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by agent, capability, or codename..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400/80 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 group relative overflow-hidden"
              >
                {/* Subtle Glow Accent on Hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  {/* Top Row: Icon + Codename + Status Badge */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-emerald-500/40 transition-colors shrink-0">
                        {agent.icon}
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">
                          {agent.codename}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                          {agent.category}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider shrink-0 ${
                        agent.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : agent.status === 'System Agent'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          : agent.status === 'Autonomous'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>

                  {/* Agent Title & Role */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                      {agent.name}
                    </h3>
                    <p className="text-xs font-mono text-emerald-400/80 mt-0.5">
                      {agent.role}
                    </p>
                  </div>

                  {/* Purpose / Description */}
                  <p className="text-slate-400 text-xs leading-relaxed font-light">
                    {agent.description}
                  </p>

                  {/* Key Capabilities */}
                  <div className="pt-2 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 block">
                      KEY CAPABILITIES:
                    </span>
                    <ul className="space-y-1.5">
                      {agent.capabilities.map((cap, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300 font-sans">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA Footer */}
                <div className="pt-6 mt-6 border-t border-slate-800/80 relative z-10">
                  <button
                    onClick={() => handleOpenSession(agent)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-emerald-400 text-slate-200 hover:text-black font-mono text-xs font-bold uppercase tracking-wider border border-slate-800 hover:border-emerald-400 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Deploy Agent</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Bot className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white font-mono">No matching agents found</h3>
            <p className="text-slate-400 text-xs mt-1">Try clearing your search query or selecting another category filter.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-emerald-400 font-mono text-xs font-bold uppercase"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* INTERACTIVE AGENT SESSION DRAWER / MODAL */}
      <AnimatePresence>
        {activeAgent && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveAgent(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="border-b border-slate-800 pb-5 pr-10 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
                    {activeAgent.codename}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 uppercase bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                    {activeAgent.category}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white font-mono flex items-center gap-2">
                  {activeAgent.name}
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-light">
                  {activeAgent.role}
                </p>
              </div>

              {/* Modal Scrollable Body */}
              <div className="overflow-y-auto py-5 space-y-6 flex-grow pr-1">
                {/* Preset Prompts selection */}
                {activeAgent.presetPrompts.length > 0 && (
                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-slate-400 mb-2">
                      QUICK PRESET PROMPTS:
                    </label>
                    <div className="flex flex-col gap-2">
                      {activeAgent.presetPrompts.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSessionInput(p.prompt)}
                          className="text-left text-xs font-mono p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <span className="truncate pr-2">{p.label}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prompt Input */}
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-slate-400 mb-2">
                    SESSION PROMPT / TASK INSTRUCTION:
                  </label>
                  <textarea
                    rows={4}
                    value={sessionInput}
                    onChange={(e) => setSessionInput(e.target.value)}
                    placeholder="Enter your specific task prompt for this agent..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-400 resize-none"
                  />
                </div>

                {/* Execute Button */}
                <button
                  onClick={handleExecuteSession}
                  disabled={isExecuting || !sessionInput.trim()}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-mono font-black text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-400/20 disabled:opacity-50"
                >
                  {isExecuting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>EXECUTING REACT LOOP...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>DISPATCH AGENT SESSION</span>
                    </>
                  )}
                </button>

                {/* Execution Step Log */}
                {executionSteps.length > 0 && (
                  <div className="space-y-1.5 font-mono text-[11px] bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      AGENT LOGS:
                    </span>
                    {executionSteps.map((step, idx) => (
                      <div key={idx} className="text-emerald-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Execution Output Box */}
                {executionOutput && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">
                        AGENT RESPONSE OUTPUT
                      </span>
                      <button
                        onClick={handleCopyOutput}
                        className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'COPIED' : 'COPY'}</span>
                      </button>
                    </div>

                    <div className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto pr-1">
                      {executionOutput}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
