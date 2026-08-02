import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SubTab = 'social' | 'finance' | 'email' | 'code';

interface Step {
  title: string;
  detail: string;
  type: 'perception' | 'tool' | 'reasoning' | 'guardrail' | 'output';
}

export const BotsAndAgents: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SubTab>('social');

  // --- TAB 1: SOCIAL MEDIA STATE ---
  const [platform, setPlatform] = useState<'twitter' | 'linkedin' | 'instagram' | 'slack'>('twitter');
  const [socialGoal, setSocialGoal] = useState<'creator' | 'replier' | 'summarizer' | 'moderator'>('creator');
  const [socialTone, setSocialTone] = useState<'professional' | 'tech' | 'witty' | 'academic'>('tech');
  const [socialPrompt, setSocialPrompt] = useState('Build AI agents for social media, finance tracking, and smart email triage.');
  const [isSimulatingSocial, setIsSimulatingSocial] = useState(false);
  const [socialSteps, setSocialSteps] = useState<Step[]>([]);
  const [socialOutput, setSocialOutput] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // --- TAB 2: FINANCE STATE ---
  const [financeMode, setFinanceMode] = useState<'expense' | 'market' | 'budget'>('expense');
  const [riskTolerance, setRiskTolerance] = useState<number>(15);
  const [financeInput, setFinanceInput] = useState('Invoice #4029: $850.00 from Cloud Services Inc. Category: Infrastructure. Expense limit: $500.00.');
  const [isSimulatingFinance, setIsSimulatingFinance] = useState(false);
  const [financeSteps, setFinanceSteps] = useState<Step[]>([]);
  const [financeOutput, setFinanceOutput] = useState<{
    category: string;
    amount: string;
    riskScore: number;
    flagged: boolean;
    recommendation: string;
    auditLog: string;
  } | null>(null);

  // --- TAB 3: EMAIL STATE ---
  const [emailMode, setEmailMode] = useState<'support' | 'triage' | 'scheduler'>('support');
  const [knowledgeBase, setKnowledgeBase] = useState('Return Policy: Refunds accepted within 30 days of purchase with proof of receipt. Support Hours: Mon-Fri 9AM-5PM EST.');
  const [rawEmail, setRawEmail] = useState('Hi Support, I bought a course 10 days ago but my account shows inactive. I would like a refund or account access immediately.');
  const [isSimulatingEmail, setIsSimulatingEmail] = useState(false);
  const [emailSteps, setEmailSteps] = useState<Step[]>([]);
  const [emailOutput, setEmailOutput] = useState<{
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    category: string;
    ragMatched: string;
    draftReply: string;
  } | null>(null);

  // --- TAB 4: CODE VIEW STATE ---
  const [codeBotType, setCodeBotType] = useState<'social' | 'finance' | 'email'>('social');
  const [codeLanguage, setCodeLanguage] = useState<'ts' | 'python'>('ts');
  const [copiedCode, setCopiedCode] = useState(false);

  // ================= SIMULATE SOCIAL MEDIA BOT =================
  const handleSimulateSocial = async () => {
    setIsSimulatingSocial(true);
    setSocialSteps([]);
    setSocialOutput(null);
    setAiError(null);

    // Build execution trail steps
    const steps: Step[] = [
      { title: '1. Perception & Intent', detail: `Analyzed prompt for ${platform.toUpperCase()} [${socialGoal}] with tone '${socialTone}'`, type: 'perception' },
      { title: '2. Tool Invocation', detail: `Called tool: search_trending_hashtags(topic="${socialPrompt.slice(0, 20)}...")`, type: 'tool' },
      { title: '3. Reasoning & Structuring', detail: 'Applying platform formatting constraints, character limits, and engaging hooks', type: 'reasoning' },
      { title: '4. Guardrails & Safety', detail: 'Passed brand safety check & rate-limit validation', type: 'guardrail' },
      { title: '5. Action Dispatch', detail: 'Generated optimized draft ready for publishing or API dispatch', type: 'output' }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(res => setTimeout(res, 350));
      setSocialSteps(prev => [...prev, steps[i]]);
    }

    // Try live AI generation via /api/ai
    try {
      const systemInstruction = `You are an expert Social Media AI Agent operating on ${platform}. Goal: ${socialGoal}. Tone: ${socialTone}. Craft a compelling, production-ready social media post with relevant hashtags and engagement hooks based on the user topic.`;
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: socialPrompt, systemInstruction })
      });
      const data = await res.json();
      if (data.text) {
        setSocialOutput(data.text);
      } else {
        throw new Error('Fallback simulation');
      }
    } catch {
      // Fallback structured draft
      let draft = '';
      if (platform === 'twitter') {
        draft = `🚀 AI Agents are revolutionizing productivity!\n\nFrom automated social scheduling to smart financial triage and inbox zero, autonomous bots handle the heavy lifting while you focus on high-impact strategy.\n\n💡 Key takeaways:\n1️⃣ Perception-Action Loops\n2️⃣ Function Calling APIs\n3️⃣ Human-in-the-Loop Safeguards\n\n#AIAgents #Automation #Productivity #DevArchive #TechTrends`;
      } else if (platform === 'linkedin') {
        draft = `How Autonomous AI Agents are Redefining Workflow Productivity in 2026 📈\n\nTraditional LLM prompts only generate text. AI Agents, however, operate in an active loop:\n• Perception of incoming triggers\n• Tool calling & API integration\n• Autonomous decision reasoning\n• Real-world execution with human oversight\n\nWhether it's classifying financial transactions or drafting smart customer support replies, agentic workflows are shaving 80% off routine operations.\n\nAre you building or deploying AI bots in your team? Let's discuss in the comments below!\n\n#ArtificialIntelligence #WorkflowAutomation #Productivity #Engineering`;
      } else {
        draft = `✨ Transform your workflow with AI Agents!\n\n🤖 Automated Social Media Scheduling\n📊 Instant Financial OCR & Risk Analysis\n✉️ Smart Email Triage & Customer Support\n\nDrop a 🚀 below if you're ready to build your first autonomous bot!`;
      }
      setSocialOutput(draft);
    } finally {
      setIsSimulatingSocial(false);
    }
  };

  // ================= SIMULATE FINANCE AGENT =================
  const handleSimulateFinance = async () => {
    setIsSimulatingFinance(true);
    setFinanceSteps([]);
    setFinanceOutput(null);

    const steps: Step[] = [
      { title: '1. OCR & Data Parsing', detail: `Parsing entity details from string: "${financeInput.slice(0, 30)}..."`, type: 'perception' },
      { title: '2. Financial Math Check', detail: 'Evaluating Risk Formula: Risk = alpha * Volatility + beta * Drawdown', type: 'tool' },
      { title: '3. Risk & Threshold Analysis', detail: `Checking tolerance threshold against set limit of ${riskTolerance}%`, type: 'reasoning' },
      { title: '4. Audit & Escalation Check', detail: 'Comparing transaction amount against automated threshold rules', type: 'guardrail' },
      { title: '5. Action Trigger Executed', detail: 'Generated structured accounting entry & audit log record', type: 'output' }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(res => setTimeout(res, 350));
      setFinanceSteps(prev => [...prev, steps[i]]);
    }

    const calculatedRisk = Math.min(95, Math.max(5, Math.floor(Math.random() * 25) + 12));
    const isFlagged = calculatedRisk > riskTolerance || financeInput.toLowerCase().includes('exceed') || financeInput.toLowerCase().includes('limit');

    setFinanceOutput({
      category: financeMode === 'expense' ? 'Cloud Infrastructure & Software' : financeMode === 'market' ? 'Market News Sentiment' : 'Budget Policy Check',
      amount: '$850.00',
      riskScore: calculatedRisk,
      flagged: isFlagged,
      recommendation: isFlagged 
        ? '⚠️ Action Required: Transaction exceeds approved $500 threshold. Escalating to Finance Manager for dual-signature approval.'
        : '✅ Auto-Approved: Transaction falls within normal spending parameters and is reconciled in ledger.',
      auditLog: `[AUDIT_LOG_ID_${Math.floor(Math.random()*89999+10000)}] Entity: Cloud Services Inc | Calculated Risk: ${calculatedRisk}% | Policy Threshold: ${riskTolerance}% | Status: ${isFlagged ? 'REQUIRES_APPROVAL' : 'APPROVED_AUTO'}`
    });

    setIsSimulatingFinance(false);
  };

  // ================= SIMULATE EMAIL AGENT =================
  const handleSimulateEmail = async () => {
    setIsSimulatingEmail(true);
    setEmailSteps([]);
    setEmailOutput(null);

    const steps: Step[] = [
      { title: '1. Inbox Ingestion', detail: `Received raw email input (${rawEmail.length} characters)`, type: 'perception' },
      { title: '2. Sentiment & Priority Triage', detail: 'Running Intent Classification: Priority HIGH detected based on urgency keywords', type: 'reasoning' },
      { title: '3. Knowledge Base RAG Search', detail: `Querying internal knowledge context: "${knowledgeBase.slice(0, 35)}..."`, type: 'tool' },
      { title: '4. Compliance & Policy Match', detail: 'Match Found: Purchase within 30-day window verified', type: 'guardrail' },
      { title: '5. Draft Response Generation', detail: 'Generating personalized customer support reply draft', type: 'output' }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(res => setTimeout(res, 350));
      setEmailSteps(prev => [...prev, steps[i]]);
    }

    setEmailOutput({
      priority: 'HIGH',
      category: 'Billing & Account Access',
      ragMatched: 'Return Policy (Refunds allowed within 30 days) & Account Activation Protocol',
      draftReply: `Dear Valued Customer,\n\nThank you for reaching out to our support team. We sincerely apologize for the inconvenience with your account activation.\n\nSince your purchase occurred 10 days ago, it is well within our 30-day satisfaction window. We have manually refreshed your account license key and activated your access immediately.\n\nIf you still prefer a full refund, simply reply "REFUND" to this email and our billing team will process it right away.\n\nBest regards,\nAutomated Support Triage Agent`
    });

    setIsSimulatingEmail(false);
  };

  // --- CODE BLUEPRINT CONTENT ---
  const getCodeSnippet = () => {
    if (codeLanguage === 'ts') {
      if (codeBotType === 'social') {
        return `// ========================================================
// SOCIAL MEDIA AI AGENT (TypeScript / Node.js)
// ========================================================
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface SocialPostRequest {
  topic: string;
  platform: 'twitter' | 'linkedin';
  tone: string;
}

// 1. Tool Function Definition
async function searchTrendingHashtags(topic: string) {
  // Simulated external API call to social analytics
  return ["#AIAgents", "#Productivity", "#TechTrends", "#Automation"];
}

// 2. Main Agent Execution Loop
export async function runSocialMediaAgent(req: SocialPostRequest) {
  console.log(\`[AGENT] Processing topic: \${req.topic} for \${req.platform}\`);
  
  // Step A: Call Tool
  const hashtags = await searchTrendingHashtags(req.topic);
  
  // Step B: Formulate System Prompt
  const systemInstruction = \`
  You are an autonomous Social Media Agent.
  Platform: \${req.platform}
  Tone: \${req.tone}
  Task: Create a viral, high-converting post using topic information and these hashtags: \${hashtags.join(', ')}.
  \`;

  // Step C: LLM Reasoning
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [\`Topic: \${req.topic}\`],
    config: { systemInstruction }
  });

  return {
    platform: req.platform,
    hashtags,
    postText: response.text,
    status: "READY_FOR_REVIEW"
  };
}`;
      } else if (codeBotType === 'finance') {
        return `// ========================================================
// FINANCIAL ANALYTICS & RISK AGENT (TypeScript / Node.js)
// ========================================================
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function processExpenseAgent(rawInvoiceText: string, maxLimit: number = 500) {
  const systemInstruction = \`
  You are a Financial Audit Agent.
  Extract the following JSON from the raw text:
  {
    "vendor": "string",
    "amount": number,
    "category": "string",
    "summary": "string"
  }
  Output strictly raw JSON without markdown formatting.
  \`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [rawInvoiceText],
    config: { systemInstruction }
  });

  const parsed = JSON.parse(response.text || "{}");
  
  // Formula: Risk Score = Risk Factor * (Amount / Limit)
  const riskScore = Math.min(100, Math.round((parsed.amount / maxLimit) * 50));
  const requiresApproval = parsed.amount > maxLimit;

  return {
    parsed,
    riskScore,
    requiresApproval,
    action: requiresApproval ? "ESCALATE_TO_MANAGER" : "AUTO_APPROVE"
  };
}`;
      } else {
        return `// ========================================================
// SMART EMAIL TRIAGE & SUPPORT AGENT (TypeScript / Node.js)
// ========================================================
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const KNOWLEDGE_BASE_DOCS = \`
Return Policy: Full refund within 30 days of purchase.
Technical Support: Available Mon-Fri 9AM-5PM EST.
\`;

export async function runEmailTriageAgent(customerEmail: string) {
  const systemInstruction = \`
  You are an Autonomous Email Support Triage Agent.
  Ground your answer using this Knowledge Base:
  \${KNOWLEDGE_BASE_DOCS}

  Perform:
  1. Classify sentiment & priority (HIGH, MEDIUM, LOW)
  2. Categorize intent (Billing, Tech Support, Sales, Spam)
  3. Draft an empathetic, polite, accurate response draft
  \`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [customerEmail],
    config: { systemInstruction }
  });

  return {
    rawInput: customerEmail,
    agentDraft: response.text,
    timestamp: new Date().toISOString()
  };
}`;
      }
    } else {
      // PYTHON
      return `# ========================================================
# PYTHON AI AGENT WORKFLOW (Google GenAI SDK)
# ========================================================
import os
from google import genai

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

def run_agent_workflow(topic: str):
    system_instruction = """
    You are an Autonomous AI Productivity Agent.
    Your objective is to perceive incoming requests, reason about tool availability,
    and generate structured outputs for Social Media, Finance, and Email triage.
    """
    
    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[f"Execute productivity workflow for topic: {topic}"],
        config={"system_instruction": system_instruction}
    )
    
    return {
        "status": "SUCCESS",
        "result": response.text
    }

if __name__ == "__main__":
    res = run_agent_workflow("Automated finance and social bot deployment")
    print(res["result"])`;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Header Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green text-sm font-semibold">
          <span>🤖 Autonomous AI Agent Studio</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight glow-text">
          Building AI Bots & Productivity Agents
        </h1>
        <p className="text-brand-light-gray max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
          Learn how to design, configure, and orchestrate autonomous AI bots that automate real-world workflows in <span className="text-brand-green font-semibold">Social Media</span>, <span className="text-brand-green font-semibold font-mono">Finance</span>, and <span className="text-brand-green font-semibold">Smart Email Triage</span>.
        </p>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-brand-gray-dark/80 rounded-2xl border border-brand-border">
        {[
          { id: 'social', label: '📱 Social Media Bot', badge: 'Creator & Moderation' },
          { id: 'finance', label: '📈 Finance & Expense Analyst', badge: 'OCR & Risk Math' },
          { id: 'email', label: '✉️ Smart Email Triage', badge: 'Inbox & Support' },
          { id: 'code', label: '🛠️ Code & Blueprints', badge: 'Node.js & Python' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SubTab)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-brand-green text-brand-black shadow-lg font-bold'
                : 'text-brand-light-gray hover:text-white hover:bg-brand-border/40'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === tab.id ? 'bg-brand-black/20 text-brand-black font-semibold' : 'bg-brand-black text-brand-green border border-brand-green/30'
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT AREAS */}
      <AnimatePresence mode="wait">
        {/* ==================== TAB 1: SOCIAL MEDIA BOT ==================== */}
        {activeTab === 'social' && (
          <motion.div
            key="social"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Controls Panel */}
            <div className="lg:col-span-5 bg-brand-gray-dark p-6 rounded-2xl border border-brand-border space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center justify-between">
                <span>1. Configure Social Bot</span>
                <span className="text-xs text-brand-green font-mono bg-brand-green/10 px-2 py-1 rounded border border-brand-green/30">AGENT_CONFIG</span>
              </h2>

              {/* Platform Selector */}
              <div>
                <label className="block text-xs font-semibold text-brand-light-gray uppercase tracking-wider mb-2">Target Platform</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'twitter', label: 'X / Twitter' },
                    { id: 'linkedin', label: 'LinkedIn' },
                    { id: 'instagram', label: 'Instagram' },
                    { id: 'slack', label: 'Slack / Discord' },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id as any)}
                      className={`p-2 rounded-lg text-xs font-semibold border transition-all ${
                        platform === p.id 
                          ? 'bg-brand-green/20 text-brand-green border-brand-green' 
                          : 'bg-brand-black/40 text-brand-light-gray border-brand-border hover:border-brand-light-gray'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bot Goal */}
              <div>
                <label className="block text-xs font-semibold text-brand-light-gray uppercase tracking-wider mb-2">Agent Goal / Mode</label>
                <select
                  value={socialGoal}
                  onChange={e => setSocialGoal(e.target.value as any)}
                  className="w-full bg-brand-black text-white p-3 rounded-lg border border-brand-border focus:border-brand-green focus:outline-none text-sm"
                >
                  <option value="creator">Viral Content Creator & Scheduler</option>
                  <option value="replier">Comment & DM Auto-Responder</option>
                  <option value="summarizer">Industry Trend Summarizer & Thread Creator</option>
                  <option value="moderator">Community Moderation & Safety Bot</option>
                </select>
              </div>

              {/* Persona / Tone */}
              <div>
                <label className="block text-xs font-semibold text-brand-light-gray uppercase tracking-wider mb-2">Brand Voice / Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'tech', label: '⚡ Tech Savvy' },
                    { id: 'professional', label: '💼 Professional' },
                    { id: 'witty', label: '🎭 Witty & Engaging' },
                    { id: 'academic', label: '🎓 Academic & Research' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSocialTone(t.id as any)}
                      className={`p-2.5 rounded-lg text-xs font-medium border text-left transition-all ${
                        socialTone === t.id
                          ? 'bg-brand-green text-brand-black border-brand-green font-bold'
                          : 'bg-brand-black/30 text-brand-light-gray border-brand-border hover:border-brand-light-gray'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic / Prompt */}
              <div>
                <label className="block text-xs font-semibold text-brand-light-gray uppercase tracking-wider mb-2">Topic or Trigger Prompt</label>
                <textarea
                  value={socialPrompt}
                  onChange={e => setSocialPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-brand-black text-white p-3 rounded-lg border border-brand-border focus:border-brand-green focus:outline-none text-sm resize-none"
                  placeholder="e.g., How AI agents transform software engineering productivity..."
                />
              </div>

              {/* Action Button */}
              <button
                onClick={handleSimulateSocial}
                disabled={isSimulatingSocial}
                className="w-full bg-brand-green text-brand-black font-bold py-3 px-6 rounded-xl text-sm hover:bg-brand-green-dark transition-all duration-200 shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSimulatingSocial ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-brand-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Executing Agent Loop...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 Run Social Agent Loop</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Agent Execution & Output */}
            <div className="lg:col-span-7 space-y-6">
              {/* Agent Reasoning Trail */}
              <div className="bg-brand-gray-dark p-6 rounded-2xl border border-brand-border">
                <h3 className="text-sm font-semibold text-brand-light-gray uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>Agent Perception-Action Execution Trail</span>
                  <span className="text-xs font-mono text-brand-green">REACT_LOOP</span>
                </h3>

                {socialSteps.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-brand-border rounded-xl text-brand-light-gray text-sm">
                    Click <span className="text-brand-green font-semibold">"Run Social Agent Loop"</span> to observe the agent's step-by-step reasoning, tool call execution, and safety validation.
                  </div>
                ) : (
                  <div className="space-y-3 font-mono text-xs">
                    {socialSteps.map((step, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg bg-brand-black/60 border border-brand-border/60 flex items-start space-x-3"
                      >
                        <span className="p-1 rounded bg-brand-green/20 text-brand-green font-bold text-[10px]">
                          STEP_0{idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-white text-sm">{step.title}</div>
                          <div className="text-brand-light-gray mt-0.5">{step.detail}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Output Preview Card */}
              {socialOutput && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-brand-black p-6 rounded-2xl border border-brand-green/50 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-brand-green text-brand-black font-bold flex items-center justify-center text-xs">
                        AI
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">DevArchive Social Agent</div>
                        <div className="text-xs text-brand-light-gray">@devarchive_bot • Just now</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-brand-green/10 text-brand-green border border-brand-green/30">
                      {platform.toUpperCase()} POST READY
                    </span>
                  </div>

                  <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {socialOutput}
                  </div>

                  <div className="pt-3 border-t border-brand-border/60 flex flex-wrap items-center justify-between gap-2 text-xs text-brand-light-gray">
                    <div className="flex items-center space-x-4">
                      <span>📊 Engagement Score: <strong className="text-brand-green">94%</strong></span>
                      <span>🛡️ Moderation: <strong className="text-brand-green">PASSED</strong></span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(socialOutput);
                        alert('Copied generated post to clipboard!');
                      }}
                      className="text-xs bg-brand-gray-dark hover:bg-brand-border text-white px-3 py-1.5 rounded-lg border border-brand-border transition-colors font-semibold"
                    >
                      📋 Copy Post Text
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ==================== TAB 2: FINANCE & EXPENSE ANALYST ==================== */}
        {activeTab === 'finance' && (
          <motion.div
            key="finance"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Controls Panel */}
            <div className="lg:col-span-5 bg-brand-gray-dark p-6 rounded-2xl border border-brand-border space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center justify-between">
                <span>1. Configure Finance Agent</span>
                <span className="text-xs font-mono text-brand-green bg-brand-green/10 px-2 py-1 rounded border border-brand-green/30">RISK_ENGINE</span>
              </h2>

              {/* Mode */}
              <div>
                <label className="block text-xs font-semibold text-brand-light-gray uppercase tracking-wider mb-2">Financial Workflow</label>
                <select
                  value={financeMode}
                  onChange={e => setFinanceMode(e.target.value as any)}
                  className="w-full bg-brand-black text-white p-3 rounded-lg border border-brand-border focus:border-brand-green focus:outline-none text-sm"
                >
                  <option value="expense">Expense Categorizer & Invoice OCR</option>
                  <option value="market">Market News Sentiment & Stock Watchdog</option>
                  <option value="budget">Budget Guardrails & Auto-Alerting</option>
                </select>
              </div>

              {/* Risk Tolerance Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-brand-light-gray uppercase tracking-wider">Risk Tolerance Threshold</label>
                  <span className="text-xs font-mono font-bold text-brand-green">{riskTolerance}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={riskTolerance}
                  onChange={e => setRiskTolerance(Number(e.target.value))}
                  className="w-full accent-brand-green bg-brand-black"
                />
                <p className="text-[11px] text-brand-light-gray mt-1">
                  Risk Formula: $\text{'Risk Score'} = \alpha \cdot \text{'Volatility'} + \beta \cdot \text{'Drawdown'}$
                </p>
              </div>

              {/* Sample Presets */}
              <div>
                <label className="block text-xs font-semibold text-brand-light-gray uppercase tracking-wider mb-2">Quick Input Presets</label>
                <div className="space-y-2">
                  {[
                    { label: '🧾 Software Invoice ($850)', text: 'Invoice #4029: $850.00 from Cloud Services Inc. Category: Infrastructure. Expense limit: $500.00.' },
                    { label: '💸 Unrecognized Wire ($2,400)', text: 'Bank Feed: Wire Transfer $2,400 to Unverified Overseas Account. Reference: Urgent Software License.' },
                    { label: '📈 Stock News Alert', text: 'Market Watch: Tech sector drops 3.8% following supply chain bottleneck reports.' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFinanceInput(preset.text)}
                      className="w-full text-left text-xs p-2.5 rounded-lg bg-brand-black/50 border border-brand-border hover:border-brand-green text-brand-light-gray hover:text-white transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div>
                <label className="block text-xs font-semibold text-brand-light-gray uppercase tracking-wider mb-2">Financial String / Transaction Data</label>
                <textarea
                  value={financeInput}
                  onChange={e => setFinanceInput(e.target.value)}
                  rows={3}
                  className="w-full bg-brand-black text-white p-3 rounded-lg border border-brand-border focus:border-brand-green focus:outline-none text-sm resize-none font-mono"
                />
              </div>

              <button
                onClick={handleSimulateFinance}
                disabled={isSimulatingFinance}
                className="w-full bg-brand-green text-brand-black font-bold py-3 px-6 rounded-xl text-sm hover:bg-brand-green-dark transition-all duration-200 shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSimulatingFinance ? (
                  <span>Evaluating Risk Math & Ledger...</span>
                ) : (
                  <span>📊 Run Financial Agent Loop</span>
                )}
              </button>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-7 space-y-6">
              {/* Steps Trail */}
              <div className="bg-brand-gray-dark p-6 rounded-2xl border border-brand-border">
                <h3 className="text-sm font-semibold text-brand-light-gray uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>Financial Agent Step Execution</span>
                  <span className="text-xs font-mono text-brand-green">FINANCE_AGENT</span>
                </h3>

                {financeSteps.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-brand-border rounded-xl text-brand-light-gray text-sm">
                    Click <span className="text-brand-green font-semibold">"Run Financial Agent Loop"</span> to test financial parsing, risk score math, and automated ledger actions.
                  </div>
                ) : (
                  <div className="space-y-3 font-mono text-xs">
                    {financeSteps.map((step, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg bg-brand-black/60 border border-brand-border/60 flex items-start space-x-3"
                      >
                        <span className="p-1 rounded bg-brand-green/20 text-brand-green font-bold text-[10px]">
                          STEP_0{idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-white text-sm">{step.title}</div>
                          <div className="text-brand-light-gray mt-0.5">{step.detail}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Output Report */}
              {financeOutput && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-brand-black p-6 rounded-2xl border border-brand-green/50 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                    <span className="text-sm font-bold text-white">Financial Audit & Triage Output</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      financeOutput.flagged ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-brand-green/20 text-brand-green border border-brand-green/40'
                    }`}>
                      {financeOutput.flagged ? 'FLAGGED FOR REVIEW' : 'AUTO APPROVED'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
                    <div className="p-3 bg-brand-gray-dark rounded-lg border border-brand-border">
                      <div className="text-brand-light-gray text-[10px]">CATEGORY</div>
                      <div className="font-bold text-white mt-1">{financeOutput.category}</div>
                    </div>
                    <div className="p-3 bg-brand-gray-dark rounded-lg border border-brand-border">
                      <div className="text-brand-light-gray text-[10px]">AMOUNT</div>
                      <div className="font-bold text-brand-green mt-1">{financeOutput.amount}</div>
                    </div>
                    <div className="p-3 bg-brand-gray-dark rounded-lg border border-brand-border">
                      <div className="text-brand-light-gray text-[10px]">CALCULATED RISK</div>
                      <div className="font-bold text-yellow-400 mt-1">{financeOutput.riskScore}%</div>
                    </div>
                  </div>

                  <div className="p-4 bg-brand-gray-dark/80 rounded-xl border border-brand-border text-xs leading-relaxed text-gray-200">
                    <div className="font-bold text-brand-green mb-1">Agent Action Recommendation:</div>
                    {financeOutput.recommendation}
                  </div>

                  <div className="p-3 bg-brand-black rounded-lg border border-brand-border/40 font-mono text-[11px] text-brand-light-gray">
                    {financeOutput.auditLog}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ==================== TAB 3: SMART EMAIL TRIAGE ==================== */}
        {activeTab === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Controls Panel */}
            <div className="lg:col-span-5 bg-brand-gray-dark p-6 rounded-2xl border border-brand-border space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center justify-between">
                <span>1. Configure Email Agent</span>
                <span className="text-xs font-mono text-brand-green bg-brand-green/10 px-2 py-1 rounded border border-brand-green/30">INBOX_RAG</span>
              </h2>

              {/* Mode */}
              <div>
                <label className="block text-xs font-semibold text-brand-light-gray uppercase tracking-wider mb-2">Agent Role</label>
                <select
                  value={emailMode}
                  onChange={e => setEmailMode(e.target.value as any)}
                  className="w-full bg-brand-black text-white p-3 rounded-lg border border-brand-border focus:border-brand-green focus:outline-none text-sm"
                >
                  <option value="support">Customer Support Auto-Drafting</option>
                  <option value="triage">Inbox Triage & Department Routing</option>
                  <option value="scheduler">Meeting & Calendar Scheduler Assistant</option>
                </select>
              </div>

              {/* Knowledge Base Input */}
              <div>
                <label className="block text-xs font-semibold text-brand-light-gray uppercase tracking-wider mb-2">Knowledge Base Context (RAG Source)</label>
                <textarea
                  value={knowledgeBase}
                  onChange={e => setKnowledgeBase(e.target.value)}
                  rows={3}
                  className="w-full bg-brand-black text-white p-3 rounded-lg border border-brand-border focus:border-brand-green focus:outline-none text-sm resize-none font-sans"
                  placeholder="Paste business policies or FAQs..."
                />
              </div>

              {/* Sample Email Presets */}
              <div>
                <label className="block text-xs font-semibold text-brand-light-gray uppercase tracking-wider mb-2">Sample Incoming Emails</label>
                <div className="space-y-2">
                  {[
                    { label: '⚠️ Refund & Inactive Account Request', text: 'Hi Support, I bought a course 10 days ago but my account shows inactive. I would like a refund or account access immediately.' },
                    { label: '💼 Enterprise Partnership Lead', text: 'Hello, I represent a team of 40 developers looking to purchase bulk subscriptions. Can we schedule a demo call this Thursday?' },
                    { label: '🚫 Spam / Suspicious Password Reset', text: 'Urgent: Click here to verify your account security credentials immediately or face permanent deletion.' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setRawEmail(preset.text)}
                      className="w-full text-left text-xs p-2.5 rounded-lg bg-brand-black/50 border border-brand-border hover:border-brand-green text-brand-light-gray hover:text-white transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Incoming Email Textarea */}
              <div>
                <label className="block text-xs font-semibold text-brand-light-gray uppercase tracking-wider mb-2">Raw Incoming Email</label>
                <textarea
                  value={rawEmail}
                  onChange={e => setRawEmail(e.target.value)}
                  rows={3}
                  className="w-full bg-brand-black text-white p-3 rounded-lg border border-brand-border focus:border-brand-green focus:outline-none text-sm resize-none"
                />
              </div>

              <button
                onClick={handleSimulateEmail}
                disabled={isSimulatingEmail}
                className="w-full bg-brand-green text-brand-black font-bold py-3 px-6 rounded-xl text-sm hover:bg-brand-green-dark transition-all duration-200 shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSimulatingEmail ? (
                  <span>Analyzing Email & RAG Docs...</span>
                ) : (
                  <span>✉️ Run Email Triage Agent Loop</span>
                )}
              </button>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-7 space-y-6">
              {/* Execution Trail */}
              <div className="bg-brand-gray-dark p-6 rounded-2xl border border-brand-border">
                <h3 className="text-sm font-semibold text-brand-light-gray uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>Email Agent Execution Steps</span>
                  <span className="text-xs font-mono text-brand-green">INBOX_AGENT</span>
                </h3>

                {emailSteps.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-brand-border rounded-xl text-brand-light-gray text-sm">
                    Click <span className="text-brand-green font-semibold">"Run Email Triage Agent Loop"</span> to test intent classification, RAG lookup, and auto-generated response drafts.
                  </div>
                ) : (
                  <div className="space-y-3 font-mono text-xs">
                    {emailSteps.map((step, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg bg-brand-black/60 border border-brand-border/60 flex items-start space-x-3"
                      >
                        <span className="p-1 rounded bg-brand-green/20 text-brand-green font-bold text-[10px]">
                          STEP_0{idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-white text-sm">{step.title}</div>
                          <div className="text-brand-light-gray mt-0.5">{step.detail}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Output Response */}
              {emailOutput && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-brand-black p-6 rounded-2xl border border-brand-green/50 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border/60 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                        PRIORITY: {emailOutput.priority}
                      </span>
                      <span className="text-xs font-mono text-brand-green">
                        [{emailOutput.category}]
                      </span>
                    </div>
                    <span className="text-xs text-brand-light-gray">Status: Ready for Human Approval</span>
                  </div>

                  <div className="p-3 bg-brand-gray-dark/80 rounded-lg border border-brand-border text-xs">
                    <span className="text-brand-light-gray">RAG Match Source:</span>{' '}
                    <strong className="text-brand-green">{emailOutput.ragMatched}</strong>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-brand-light-gray uppercase tracking-wider">Generated Email Draft</label>
                    <div className="p-4 bg-brand-gray-dark rounded-xl border border-brand-border text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {emailOutput.draftReply}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      onClick={() => alert('Draft approved & queued for sending via Gmail API!')}
                      className="bg-brand-green text-brand-black font-bold px-4 py-2 rounded-lg text-xs hover:bg-brand-green-dark transition-colors"
                    >
                      ✅ Approve & Send Reply
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ==================== TAB 4: CODE & BLUEPRINTS ==================== */}
        {activeTab === 'code' && (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Top Toolbar */}
            <div className="bg-brand-gray-dark p-6 rounded-2xl border border-brand-border flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Production Starter Blueprints</h2>
                <p className="text-xs text-brand-light-gray">Select an agent type and runtime environment to view production boilerplate code.</p>
              </div>

              <div className="flex items-center space-x-3">
                {/* Agent Type */}
                <select
                  value={codeBotType}
                  onChange={e => setCodeBotType(e.target.value as any)}
                  className="bg-brand-black text-white px-3 py-2 rounded-lg border border-brand-border text-xs font-semibold focus:outline-none"
                >
                  <option value="social">📱 Social Media Agent</option>
                  <option value="finance">📈 Finance Audit Agent</option>
                  <option value="email">✉️ Email Triage Agent</option>
                </select>

                {/* Language Switch */}
                <div className="flex bg-brand-black rounded-lg p-1 border border-brand-border">
                  <button
                    onClick={() => setCodeLanguage('ts')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      codeLanguage === 'ts' ? 'bg-brand-green text-brand-black' : 'text-brand-light-gray hover:text-white'
                    }`}
                  >
                    TypeScript
                  </button>
                  <button
                    onClick={() => setCodeLanguage('python')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      codeLanguage === 'python' ? 'bg-brand-green text-brand-black' : 'text-brand-light-gray hover:text-white'
                    }`}
                  >
                    Python
                  </button>
                </div>

                {/* Copy Button */}
                <button
                  onClick={copyToClipboard}
                  className="bg-brand-green/20 border border-brand-green/50 text-brand-green hover:bg-brand-green hover:text-brand-black px-4 py-2 rounded-lg text-xs font-bold transition-all"
                >
                  {copiedCode ? '✓ Copied Code!' : '📋 Copy Code'}
                </button>
              </div>
            </div>

            {/* Architecture Flowchart Diagram */}
            <div className="bg-brand-black p-6 rounded-2xl border border-brand-border text-center space-y-4">
              <h3 className="text-sm font-semibold text-brand-light-gray uppercase tracking-wider">
                Autonomous Agent Perception-Action Dataflow
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono text-xs">
                <div className="p-3 bg-brand-gray-dark rounded-xl border border-brand-border text-white">
                  📥 Input Trigger<br/><span className="text-[10px] text-brand-light-gray">(Email / Tweet / Invoice)</span>
                </div>
                <div className="text-brand-green font-bold">➔</div>
                <div className="p-3 bg-brand-gray-dark rounded-xl border border-brand-green/50 text-brand-green">
                  🧠 Gemini LLM Core<br/><span className="text-[10px] text-brand-light-gray">(System Instructions)</span>
                </div>
                <div className="text-brand-green font-bold">➔</div>
                <div className="p-3 bg-brand-gray-dark rounded-xl border border-brand-border text-white">
                  🛠️ Tool Calling / APIs<br/><span className="text-[10px] text-brand-light-gray">(DB / RAG / Web Search)</span>
                </div>
                <div className="text-brand-green font-bold">➔</div>
                <div className="p-3 bg-brand-gray-dark rounded-xl border border-brand-border text-yellow-400">
                  🛡️ Human Review<br/><span className="text-[10px] text-brand-light-gray">(Approval Safeguard)</span>
                </div>
                <div className="text-brand-green font-bold">➔</div>
                <div className="p-3 bg-brand-gray-dark rounded-xl border border-brand-border text-white">
                  🚀 Output Action<br/><span className="text-[10px] text-brand-light-gray">(Dispatch / Reply)</span>
                </div>
              </div>
            </div>

            {/* Code Block */}
            <div className="bg-brand-black rounded-2xl border border-brand-border overflow-hidden">
              <div className="bg-brand-gray-dark/80 px-6 py-3 border-b border-brand-border flex items-center justify-between text-xs font-mono text-brand-light-gray">
                <span>{codeLanguage === 'ts' ? 'agent_service.ts' : 'agent_service.py'}</span>
                <span>Language: {codeLanguage === 'ts' ? 'TypeScript' : 'Python 3.11'}</span>
              </div>
              <pre className="p-6 overflow-x-auto text-xs font-mono text-gray-200 leading-relaxed">
                <code>{getCodeSnippet()}</code>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
