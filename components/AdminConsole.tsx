import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Radio, 
  RefreshCw, 
  Server, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  LogIn, 
  LogOut, 
  Zap, 
  Terminal, 
  Sparkles, 
  Send, 
  ExternalLink 
} from 'lucide-react';
import { User } from 'firebase/auth';
import { isSiteOwner, OWNER_EMAIL } from '../src/security';
import { getAuthToken, signOutUser } from '../src/firebase';
import { sciFiAudio } from './SoundEffects';
import type { View } from '../App';

interface AdminConsoleProps {
  currentUser?: User | null;
  onOpenAuth?: () => void;
  setView: (view: View) => void;
}

interface ServerStatus {
  status: string;
  serverUptimeSeconds: number;
  nodeVersion: string;
  ownerEmail: string;
  authenticatedCaller?: string;
  rateLimiter: {
    activeTrackedIps: number;
    windowMs: number;
    maxPerMinute: number;
  };
  siteConfig: {
    tickerNotice: string;
    broadcastActive: boolean;
    broadcastMessage: string;
    aiChatEnabled: boolean;
    lastUpdated: string;
    updatedBy: string;
  };
  systemMemory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
  };
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  currentUser,
  onOpenAuth,
  setView
}) => {
  const isOwner = isSiteOwner(currentUser?.email);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'broadcast' | 'controls' | 'editorial' | 'security'>('broadcast');

  // Server Telemetry State
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Broadcast & Site Config Form State
  const [tickerNotice, setTickerNotice] = useState<string>('');
  const [broadcastActive, setBroadcastActive] = useState<boolean>(false);
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [aiChatEnabled, setAiChatEnabled] = useState<boolean>(true);
  const [savingConfig, setSavingConfig] = useState<boolean>(false);
  const [configSuccess, setConfigSuccess] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  // Rate Limiting Table Management
  const [resettingRateLimits, setResettingRateLimits] = useState<boolean>(false);
  const [rateLimitMsg, setRateLimitMsg] = useState<string | null>(null);

  // Editorial Dispatch Generator State
  const [editorialDiscipline, setEditorialDiscipline] = useState<'Science' | 'Technology' | 'Engineering' | 'Mathematics'>('Science');
  const [editorialPrompt, setEditorialPrompt] = useState<string>('');
  const [generatingArticle, setGeneratingArticle] = useState<boolean>(false);
  const [generatedArticle, setGeneratedArticle] = useState<any | null>(null);
  const [editorialError, setEditorialError] = useState<string | null>(null);

  // Fetch telemetry and config if authenticated as owner
  const fetchTelemetry = async () => {
    if (!isOwner) return;
    setLoadingStatus(true);
    setStatusError(null);
    try {
      const token = await getAuthToken();
      if (!token) {
        setStatusError('Session token missing. Please sign in again.');
        return;
      }

      const res = await fetch('/api/admin/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server returned ${res.status}`);
      }

      const data: ServerStatus = await res.json();
      setServerStatus(data);
      setTickerNotice(data.siteConfig.tickerNotice);
      setBroadcastActive(data.siteConfig.broadcastActive);
      setBroadcastMessage(data.siteConfig.broadcastMessage);
      setAiChatEnabled(data.siteConfig.aiChatEnabled);
    } catch (err: any) {
      console.error('Failed to fetch admin status:', err);
      setStatusError(err?.message || 'Failed to connect to administrative telemetry.');
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchTelemetry();
    }
  }, [isOwner]);

  // Save Site Configuration
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;
    setSavingConfig(true);
    setConfigSuccess(null);
    setConfigError(null);
    sciFiAudio.playClick();

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Authorization token unavailable.');

      const res = await fetch('/api/admin/site-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tickerNotice,
          broadcastActive,
          broadcastMessage,
          aiChatEnabled
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update site configuration.');
      }

      const data = await res.json();
      setConfigSuccess('Site configuration and announcements updated live.');
      sciFiAudio.playSuccess();
      if (data.config) {
        setServerStatus(prev => prev ? { ...prev, siteConfig: data.config } : null);
      }
    } catch (err: any) {
      console.error('Config save error:', err);
      setConfigError(err?.message || 'Error saving configuration.');
    } finally {
      setSavingConfig(false);
    }
  };

  // Reset Rate Limit Tracking Cache
  const handleResetRateLimits = async () => {
    if (!isOwner) return;
    setResettingRateLimits(true);
    setRateLimitMsg(null);
    sciFiAudio.playClick();

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Authorization token unavailable.');

      const res = await fetch('/api/admin/reset-rate-limits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to reset rate limits.');
      }

      const data = await res.json();
      setRateLimitMsg(data.message || 'Rate limit cache successfully flushed.');
      sciFiAudio.playSuccess();
      fetchTelemetry();
    } catch (err: any) {
      setRateLimitMsg(`Error: ${err?.message || 'Failed to reset rate limit cache.'}`);
    } finally {
      setResettingRateLimits(false);
    }
  };

  // Generate Editorial Dispatch via Admin Endpoint
  const handleEditorialGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;
    setGeneratingArticle(true);
    setEditorialError(null);
    setGeneratedArticle(null);
    sciFiAudio.playClick();

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Authorization token unavailable.');

      const res = await fetch('/api/news/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          discipline: editorialDiscipline,
          topicFocus: editorialPrompt.trim() || undefined
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Generation failed.');
      }

      const data = await res.json();
      setGeneratedArticle(data.article);
      sciFiAudio.playSuccess();
    } catch (err: any) {
      console.error('Editorial error:', err);
      setEditorialError(err?.message || 'Failed to generate verified editorial dispatch.');
    } finally {
      setGeneratingArticle(false);
    }
  };

  // --- ACCESS DENIED SCREEN (Non-owner visitors) ---
  if (!isOwner) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-slate-950 border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
          
          <div className="flex items-center gap-3 text-red-400 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-white tracking-wide">RESTRICTED ACCESS</h2>
              <p className="text-xs text-red-400/80 font-mono">Administrative Authorization Required</p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-sans text-slate-300 leading-relaxed">
            <p>
              This administrative console and all mutating operations are locked down and restricted exclusively to the site owner:
            </p>
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-amber-300 break-all">
              {OWNER_EMAIL}
            </div>
            <p className="text-slate-400">
              All backend endpoints enforce cryptographic token verification and server-side checks. Unauthorized access attempts are rejected with HTTP 403 Forbidden.
            </p>

            {currentUser ? (
              <div className="border-t border-slate-800/80 pt-4 space-y-3">
                <div className="text-[11px] text-slate-400">
                  Currently signed in as: <span className="text-white font-mono">{currentUser.email}</span> (Not Authorized)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => signOutUser()}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-mono text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                  <button
                    onClick={() => setView('home')}
                    className="flex-1 py-2.5 rounded-xl bg-brand-green/20 border border-brand-green/40 hover:bg-brand-green/30 text-brand-green font-mono text-xs font-bold transition-colors cursor-pointer"
                  >
                    Return Home
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-800/80 pt-4 flex gap-2">
                <button
                  onClick={() => {
                    sciFiAudio.playClick();
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-brand-black font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-green/20"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In as Owner</span>
                </button>
                <button
                  onClick={() => setView('home')}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono text-xs font-bold transition-colors cursor-pointer"
                >
                  Return Home
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // --- AUTHORIZED OWNER CONSOLE ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Console Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-brand-border/60 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white flex items-center gap-2">
                <span>OWNER / ADMIN CONSOLE</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full uppercase">
                  Verified Active
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Authenticated Owner: <span className="text-emerald-400 font-bold">{currentUser?.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={() => { sciFiAudio.playClick(); fetchTelemetry(); }}
            disabled={loadingStatus}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingStatus ? 'animate-spin text-brand-green' : ''}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={() => setView('news')}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>📰 View STEM News</span>
          </button>
          <button
            onClick={() => setView('home')}
            className="px-3 py-1.5 rounded-lg bg-brand-green/10 border border-brand-green/30 text-brand-green hover:bg-brand-green/20 transition-colors cursor-pointer"
          >
            <span>Exit Console</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-brand-border/60 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => { sciFiAudio.playClick(); setActiveTab('broadcast'); }}
          className={`px-4 py-2.5 text-xs font-mono font-bold uppercase transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'broadcast'
              ? 'border-brand-green text-brand-green bg-brand-green/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Live Ticker & Broadcasts</span>
        </button>

        <button
          onClick={() => { sciFiAudio.playClick(); setActiveTab('controls'); }}
          className={`px-4 py-2.5 text-xs font-mono font-bold uppercase transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'controls'
              ? 'border-brand-green text-brand-green bg-brand-green/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>System Controls & Limits</span>
        </button>

        <button
          onClick={() => { sciFiAudio.playClick(); setActiveTab('editorial'); }}
          className={`px-4 py-2.5 text-xs font-mono font-bold uppercase transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'editorial'
              ? 'border-brand-green text-brand-green bg-brand-green/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>STEM News Publishing Hub</span>
        </button>

        <button
          onClick={() => { sciFiAudio.playClick(); setActiveTab('security'); }}
          className={`px-4 py-2.5 text-xs font-mono font-bold uppercase transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-brand-green text-brand-green bg-brand-green/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Telemetry & Security Rules</span>
        </button>
      </div>

      {/* TAB 1: LIVE TICKER & BROADCASTS */}
      {activeTab === 'broadcast' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="text-sm font-mono font-bold uppercase text-white tracking-wider flex items-center gap-2">
                    <Radio className="w-4 h-4 text-brand-green" />
                    <span>Live Ticker Banner Customizer</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Modifies the persistent scrolling marquee at the very top of all site pages.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1.5">
                    Top Ticker Message Text
                  </label>
                  <textarea
                    rows={3}
                    value={tickerNotice}
                    onChange={e => setTickerNotice(e.target.value)}
                    placeholder="e.g. ⚡ Gemini 1.5 Pro Operational • 🤖 10 Autonomous Agents Online • 🧪 24/7 Zperiod Science Engine Active"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:border-brand-green focus:outline-none transition-colors"
                  />
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    Max 300 characters. Supports Unicode symbols and emojis.
                  </p>
                </div>

                <div className="border-t border-slate-800/80 pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold uppercase text-white">
                        Special Broadcast Banner
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Displays an eye-catching announcement banner across the site for webinars, launches, or alerts.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={broadcastActive}
                        onChange={e => setBroadcastActive(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                    </label>
                  </div>

                  {broadcastActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1.5"
                    >
                      <label className="block text-xs font-mono uppercase text-amber-400 font-bold">
                        Broadcast Banner Message
                      </label>
                      <input
                        type="text"
                        value={broadcastMessage}
                        onChange={e => setBroadcastMessage(e.target.value)}
                        placeholder="📢 Attention: New Deep-Dive Course Module Launched: Orbital Mechanics & Space Science!"
                        className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-4 py-2.5 text-sm text-white font-sans focus:border-amber-400 focus:outline-none"
                      />
                    </motion.div>
                  )}
                </div>

                {configSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{configSuccess}</span>
                  </div>
                )}

                {configError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{configError}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingConfig}
                    className="px-6 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-brand-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-brand-green/20 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{savingConfig ? 'Publishing Changes...' : 'Save & Publish Live'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-green" />
                <span>Active Preview</span>
              </h4>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60 p-3 space-y-3">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Top Marquee Ticker:</div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-brand-light-gray break-words">
                  <span className="text-brand-green font-bold mr-2">LIVE TICKER:</span>
                  {tickerNotice || "No ticker configured."}
                </div>

                {broadcastActive && (
                  <>
                    <div className="text-[10px] font-mono text-amber-500 uppercase pt-2">Broadcast Banner:</div>
                    <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-lg text-xs text-amber-200 font-medium">
                      {broadcastMessage || "Enter a broadcast message above."}
                    </div>
                  </>
                )}
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                Last modified: {serverStatus?.siteConfig.lastUpdated ? new Date(serverStatus.siteConfig.lastUpdated).toLocaleString() : 'Never'}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: SYSTEM CONTROLS & LIMITS */}
      {activeTab === 'controls' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* AI Chat Kill-Switch */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-mono font-bold uppercase text-white">Global AI Chat Master Switch</h3>
                <p className="text-xs text-slate-400">Controls student/visitor access to /api/ai proxy</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-white uppercase">
                  Status: {aiChatEnabled ? <span className="text-emerald-400">OPERATIONAL</span> : <span className="text-red-400">DISABLED</span>}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {aiChatEnabled ? 'Visitors can converse with the AI Science Specialist.' : 'Endpoints reject with 503 Maintenance Notice.'}
                </div>
              </div>

              <button
                onClick={() => {
                  setAiChatEnabled(prev => !prev);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer transition-colors ${
                  aiChatEnabled
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                }`}
              >
                {aiChatEnabled ? 'Disable AI' : 'Enable AI'}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 font-mono">
              Note: Click "Save & Publish Live" in the Ticker tab or save below to apply toggle changes to the live server.
            </p>
          </div>

          {/* Rate Limiting Table Inspector */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-mono font-bold uppercase text-white">Rate Limiter Tracking Table</h3>
                <p className="text-xs text-slate-400">In-memory sliding window (30 requests/minute)</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Currently Tracked Remote IPs:</span>
                <span className="text-white font-bold">{serverStatus?.rateLimiter.activeTrackedIps ?? 0}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Max Threshold:</span>
                <span className="text-cyan-400 font-bold">30 req / min</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Stale Cache Cleanup:</span>
                <span className="text-slate-300">Every 5 Minutes (Automated)</span>
              </div>
            </div>

            {rateLimitMsg && (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                {rateLimitMsg}
              </div>
            )}

            <button
              onClick={handleResetRateLimits}
              disabled={resettingRateLimits}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resettingRateLimits ? 'animate-spin' : ''}`} />
              <span>{resettingRateLimits ? 'Flushing Cache...' : 'Flush Rate Limit Table (Unblock All IPs)'}</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* TAB 3: STEM NEWS EDITORIAL DESK */}
      {activeTab === 'editorial' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-mono font-bold uppercase text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-brand-green" />
                  <span>Verified STEM News Editorial Desk</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Directly invoke /api/news/generate with authorized owner credentials to research and publish daily dispatches.
                </p>
              </div>
            </div>

            <form onSubmit={handleEditorialGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                  Discipline Focus
                </label>
                <select
                  value={editorialDiscipline}
                  onChange={e => setEditorialDiscipline(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:border-brand-green focus:outline-none"
                >
                  <option value="Science">Science (Physics / Chemistry / Biology)</option>
                  <option value="Technology">Technology (Quantum / Compute / AI)</option>
                  <option value="Engineering">Engineering (Aerospace / Robotics / Energy)</option>
                  <option value="Mathematics">Mathematics (Cryptography / Algorithms)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1">
                  Specific Breakthrough / Topic Prompt (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editorialPrompt}
                    onChange={e => setEditorialPrompt(e.target.value)}
                    placeholder="e.g. Breakthroughs in room-temperature superconductors or topological quantum bits"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-sans focus:border-brand-green focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={generatingArticle}
                    className="px-5 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-brand-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-lg shadow-brand-green/20 disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${generatingArticle ? 'animate-spin' : ''}`} />
                    <span>{generatingArticle ? 'Synthesizing...' : 'Generate Dispatch'}</span>
                  </button>
                </div>
              </div>
            </form>

            {editorialError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{editorialError}</span>
              </div>
            )}

            {generatedArticle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 rounded-2xl bg-slate-900/90 border border-brand-green/40 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-mono bg-brand-green text-brand-black px-2 py-0.5 rounded font-bold uppercase">
                    Synthesized Dispatch
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Verification: <strong className="text-brand-green">{generatedArticle.verificationStatus}</strong>
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white font-sans">{generatedArticle.headline}</h4>
                  <p className="text-xs text-slate-300 mt-1">{generatedArticle.deck}</p>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
                  <span className="bg-slate-800 px-2 py-1 rounded">Discipline: {generatedArticle.discipline}</span>
                  <span className="bg-slate-800 px-2 py-1 rounded">AI Focus: {generatedArticle.aiFocusTag}</span>
                  <span className="bg-slate-800 px-2 py-1 rounded">Citations: {generatedArticle.citations?.length || 0} Accredited</span>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => setView('news')}
                    className="px-4 py-2 rounded-xl bg-brand-green hover:bg-brand-green-dark text-brand-black font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    View in Live STEM News Feed →
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* TAB 4: TELEMETRY & SECURITY RULES */}
      {activeTab === 'security' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Node & Server Telemetry */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-brand-green" />
              <span>Server Environment Telemetry</span>
            </h3>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Node Runtime:</span>
                <span className="text-white">{serverStatus?.nodeVersion || 'v22.x'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Container Uptime:</span>
                <span className="text-brand-green">{serverStatus?.serverUptimeSeconds ? `${Math.floor(serverStatus.serverUptimeSeconds / 60)} minutes` : 'Active'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Designated Owner:</span>
                <span className="text-emerald-400 break-all">{OWNER_EMAIL}</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Heap Memory Used:</span>
                <span className="text-white">
                  {serverStatus?.systemMemory ? `${Math.round(serverStatus.systemMemory.heapUsed / 1024 / 1024)} MB` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Firestore Security Rules Status */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-green" />
              <span>Cloud Firestore Access Gates</span>
            </h3>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Database ID:</span>
                <span className="text-slate-300 text-[11px] truncate max-w-[200px]">ai-studio-developmentarchi-...</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">isOwner() Rule:</span>
                <span className="text-emerald-400">Deployed & Active</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Collection 'site_config':</span>
                <span className="text-slate-300">Read: Public / Write: Owner Only</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Collection 'articles':</span>
                <span className="text-slate-300">Read: Public / Write: Owner Only</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-500">Collection 'users':</span>
                <span className="text-slate-300">Self-Write / Owner Audit Read</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
