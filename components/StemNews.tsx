import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  BookOpen, 
  Globe2, 
  ShieldCheck, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Languages, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Send, 
  RefreshCw, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  ArrowLeft, 
  ArrowRight,
  Cpu, 
  Atom, 
  Wrench, 
  Binary,
  Layers,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { StemArticle, StemDiscipline, Citation } from '../types';
import { INITIAL_STEM_ARTICLES } from '../data/stemArticles';
import { sciFiAudio } from './SoundEffects';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
];

export const StemNews: React.FC = () => {
  const [articles, setArticles] = useState<StemArticle[]>(INITIAL_STEM_ARTICLES);
  const [selectedDiscipline, setSelectedDiscipline] = useState<StemDiscipline | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticleId, setActiveArticleId] = useState<string>(INITIAL_STEM_ARTICLES[0].id);

  // Mobile navigation tab: reader (default), list, factcheck
  const [mobileTab, setMobileTab] = useState<'reader' | 'list' | 'factcheck'>('reader');
  
  // Reader preferences
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isFullscreenReader, setIsFullscreenReader] = useState<boolean>(false);
  const readerRef = useRef<HTMLDivElement>(null);

  // Translation State
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationCache, setTranslationCache] = useState<Record<string, { headline: string; deck: string; content: string }>>({});

  // Audio state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Live Generator modal/panel state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genDiscipline, setGenDiscipline] = useState<StemDiscipline>('Science');
  const [genTopicPrompt, setGenTopicPrompt] = useState<string>('');
  const [showGenModal, setShowGenModal] = useState<boolean>(false);
  const [showSourcePolicy, setShowSourcePolicy] = useState<boolean>(false);

  // Fact check / Verification assistant state
  const [factCheckQuery, setFactCheckQuery] = useState<string>('');
  const [factCheckResponse, setFactCheckResponse] = useState<string | null>(null);
  const [isFactChecking, setIsFactChecking] = useState<boolean>(false);

  // Copy feedback
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);

  const activeArticle = useMemo(() => {
    return articles.find(a => a.id === activeArticleId) || articles[0];
  }, [articles, activeArticleId]);

  // Current translated content if language != 'en'
  const currentDisplayContent = useMemo(() => {
    if (selectedLanguage === 'en') {
      return {
        headline: activeArticle.headline,
        deck: activeArticle.deck,
        content: activeArticle.content
      };
    }
    const cacheKey = `${activeArticle.id}-${selectedLanguage}`;
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }
    return {
      headline: activeArticle.headline,
      deck: activeArticle.deck,
      content: activeArticle.content
    };
  }, [activeArticle, selectedLanguage, translationCache]);

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchDiscipline = selectedDiscipline === 'All' || art.discipline === selectedDiscipline;
      const matchSearch = searchQuery === '' || 
        art.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.deck.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.aiFocusTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.concepts.some(c => c.term.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchDiscipline && matchSearch;
    });
  }, [articles, selectedDiscipline, searchQuery]);

  // Active article navigation
  const currentIndex = useMemo(() => {
    return articles.findIndex(a => a.id === activeArticle.id);
  }, [articles, activeArticle.id]);

  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  const fontSizeClass = useMemo(() => {
    switch (fontSize) {
      case 'sm': return 'text-xs sm:text-sm';
      case 'lg': return 'text-base sm:text-lg';
      case 'xl': return 'text-lg sm:text-xl';
      case 'base':
      default: return 'text-sm sm:text-base';
    }
  }, [fontSize]);

  const handleSelectArticle = (id: string) => {
    sciFiAudio.playClick();
    setActiveArticleId(id);
    setSelectedLanguage('en');
    setMobileTab('reader');
    if (isSpeaking) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
    setTimeout(() => {
      readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  // Translation Handler
  const handleTranslate = async (langCode: string) => {
    setSelectedLanguage(langCode);
    if (langCode === 'en') return;

    const cacheKey = `${activeArticle.id}-${langCode}`;
    if (translationCache[cacheKey]) return;

    const targetLangObj = LANGUAGES.find(l => l.code === langCode);
    const targetName = targetLangObj ? targetLangObj.name : langCode;

    setIsTranslating(true);
    try {
      // Translate in parallel: headline, deck, and main content
      const [headRes, deckRes, contentRes] = await Promise.all([
        fetch('/api/news/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: activeArticle.headline, targetLanguage: targetName, context: 'headline' })
        }),
        fetch('/api/news/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: activeArticle.deck, targetLanguage: targetName, context: 'summary' })
        }),
        fetch('/api/news/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: activeArticle.content, targetLanguage: targetName, context: 'article' })
        })
      ]);

      const headData = await headRes.json();
      const deckData = await deckRes.json();
      const contentData = await contentRes.json();

      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: {
          headline: headData.translatedText || activeArticle.headline,
          deck: deckData.translatedText || activeArticle.deck,
          content: contentData.translatedText || activeArticle.content
        }
      }));
    } catch (e) {
      console.error('Translation failed:', e);
    } finally {
      setIsTranslating(false);
    }
  };

  // Text-To-Speech
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = `${currentDisplayContent.headline}. ${currentDisplayContent.deck}.`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Generate Fresh Article
  const handleGenerateArticle = async () => {
    setIsGenerating(true);
    sciFiAudio.playClick();
    try {
      const res = await fetch('/api/news/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discipline: genDiscipline,
          topicFocus: genTopicPrompt.trim() || undefined
        })
      });

      const data = await res.json();
      if (data.article) {
        const newArt: StemArticle = {
          ...data.article,
          id: `gen-${Date.now()}`,
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          citations: data.article.citations || []
        };
        setArticles(prev => [newArt, ...prev]);
        setActiveArticleId(newArt.id);
        setSelectedLanguage('en');
        setShowGenModal(false);
        setGenTopicPrompt('');
      }
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Fact Check / Verify query
  const handleFactCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factCheckQuery.trim()) return;
    setIsFactChecking(true);
    sciFiAudio.playClick();

    try {
      const res = await fetch('/api/news/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: factCheckQuery,
          articleContext: `${activeArticle.headline}\n${activeArticle.deck}\nCitations: ${JSON.stringify(activeArticle.citations)}`
        })
      });
      const data = await res.json();
      setFactCheckResponse(data.answer || 'No response returned.');
    } catch (err) {
      setFactCheckResponse('Verification service error. Please try again.');
    } finally {
      setIsFactChecking(false);
    }
  };

  const handleCopyCitation = (citation: Citation) => {
    const formatted = `${citation.institutionOrAuthors || 'Research Group'} (${citation.date}). "${citation.title}". ${citation.publication}. ${citation.doiOrUrl || ''}`;
    navigator.clipboard.writeText(formatted);
    setCopiedCitationId(citation.id);
    setTimeout(() => setCopiedCitationId(null), 2500);
  };

  const getDisciplineIcon = (discipline: StemDiscipline) => {
    switch (discipline) {
      case 'Science':
        return <Atom className="w-4 h-4 text-emerald-400" />;
      case 'Technology':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'Engineering':
        return <Wrench className="w-4 h-4 text-amber-400" />;
      case 'Mathematics':
        return <Binary className="w-4 h-4 text-purple-400" />;
    }
  };

  const getDisciplineColor = (discipline: StemDiscipline) => {
    switch (discipline) {
      case 'Science':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Technology':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Engineering':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Mathematics':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Journalistic Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 max-w-4xl mx-auto"
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-mono font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
            DAILY ACCREDITED STEM JOURNAL
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono">
            <Globe2 className="w-3.5 h-3.5 text-brand-green" />
            Global Peer-Reviewed Intelligence
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight glow-text">
          STEM & AI <span className="text-brand-green">Global Dispatch</span>
        </h1>
        
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Daily, verifiable science journalism spotlighting breakthroughs at the intersection of Science, Technology, Engineering, Math, and Machine Intelligence. Rigorously cited from accredited institutions worldwide.
        </p>

        {/* Global Journal Controls Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => { sciFiAudio.playClick(); setShowGenModal(true); }}
            className="px-4 py-2 rounded-xl bg-brand-green hover:bg-brand-green-dark text-brand-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-brand-green/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate Today's Dispatch</span>
          </button>

          <button
            onClick={() => { sciFiAudio.playClick(); setShowSourcePolicy(prev => !prev); }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-brand-green" />
            <span>Sourcing Standards</span>
          </button>
        </div>
      </motion.div>

      {/* Sourcing Requirements Modal / Callout */}
      <AnimatePresence>
        {showSourcePolicy && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl bg-slate-950 border border-brand-green/40 p-6 space-y-4 font-sans text-sm text-slate-300"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-brand-green font-mono font-bold uppercase tracking-wider text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Editorial Sourcing & Anti-Fabrication Standards</span>
              </div>
              <button
                onClick={() => setShowSourcePolicy(false)}
                className="text-slate-500 hover:text-white text-xs font-mono cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="text-white font-bold font-mono">1. Accredited Sources Only</div>
                <p className="text-slate-400">
                  Every claim derives strictly from peer-reviewed journals (*Nature, Science, IEEE*), established universities (MIT, Cambridge, Tokyo Tech), or verified governmental labs (CERN, LBNL, CNRS).
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="text-white font-bold font-mono">2. Zero Fabrication & Deferral</div>
                <p className="text-slate-400">
                  Studies, statistics, and citations are never invented. If verifiable news is absent in a chosen subdiscipline, our engine states so directly and pivots to verified discoveries.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="text-white font-bold font-mono">3. Global Innovation Footprint</div>
                <p className="text-slate-400">
                  Reporting spans international scientific hubs across Europe, Asia-Pacific, North America, and international consortia to maintain an unbiased worldview.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Tab Switcher (Visible on Mobile/Tablet < lg) */}
      <div className="flex items-center justify-between p-1.5 rounded-2xl bg-slate-950 border border-slate-800 lg:hidden mb-2">
        <button
          onClick={() => { sciFiAudio.playClick(); setMobileTab('reader'); }}
          className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'reader'
              ? 'bg-brand-green text-brand-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Read Article</span>
        </button>
        <button
          onClick={() => { sciFiAudio.playClick(); setMobileTab('list'); }}
          className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'list'
              ? 'bg-brand-green text-brand-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Dispatches ({filteredArticles.length})</span>
        </button>
        <button
          onClick={() => { sciFiAudio.playClick(); setMobileTab('factcheck'); }}
          className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'factcheck'
              ? 'bg-brand-green text-brand-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Fact-Check</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Article Selector & Archive (4 cols) */}
        <div className={`space-y-5 lg:col-span-4 ${mobileTab === 'list' || mobileTab === 'factcheck' ? 'block' : 'hidden lg:block'}`}>
          
          {/* Search and Filter */}
          <div className="tech-card p-4 rounded-2xl space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search STEM breakthroughs..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-green"
              />
            </div>

            {/* Discipline Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(['All', 'Science', 'Technology', 'Engineering', 'Mathematics'] as const).map(disc => {
                const isSelected = selectedDiscipline === disc;
                return (
                  <button
                    key={disc}
                    onClick={() => { sciFiAudio.playClick(); setSelectedDiscipline(disc); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-brand-green text-brand-black font-bold shadow-sm' 
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {disc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Article Deck List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span className="uppercase tracking-wider">Dispatches ({filteredArticles.length})</span>
              <span>Updated Daily</span>
            </div>

            <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
              {filteredArticles.map(art => {
                const isSelected = art.id === activeArticleId;
                return (
                  <motion.div
                    key={art.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleSelectArticle(art.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-3 ${
                      isSelected 
                        ? 'bg-slate-900/90 border-brand-green shadow-lg shadow-brand-green/15 ring-1 ring-brand-green/40' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getDisciplineColor(art.discipline)}`}>
                        {getDisciplineIcon(art.discipline)}
                        <span>{art.discipline}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{art.date}</span>
                    </div>

                    <h3 className={`text-sm font-bold line-clamp-2 leading-snug ${isSelected ? 'text-brand-green' : 'text-slate-100'}`}>
                      {art.headline}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {art.deck}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-800/60 text-[11px] font-mono">
                      <span className="text-slate-500 truncate max-w-[140px]">🤖 {art.aiFocusTag}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectArticle(art.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-brand-green/20 hover:bg-brand-green text-brand-green hover:text-brand-black text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              {filteredArticles.length === 0 && (
                <div className="p-6 text-center text-slate-500 font-mono text-xs rounded-2xl bg-slate-950 border border-slate-800">
                  No matching STEM dispatches found. Try relaxing your filters.
                </div>
              )}
            </div>
          </div>

          {/* Verification Assistant Card */}
          <div className="tech-card p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-green uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Ask the Fact-Checker</span>
            </div>
            <p className="text-xs text-slate-400">
              Query claims or request accredited source citations. If a claim cannot be verified, the bot strictly defers rather than guessing.
            </p>

            <form onSubmit={handleFactCheck} className="space-y-2">
              <input
                type="text"
                value={factCheckQuery}
                onChange={e => setFactCheckQuery(e.target.value)}
                placeholder="e.g., Can you verify the catalytic efficiency metric?"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-green"
              />
              <button
                type="submit"
                disabled={isFactChecking || !factCheckQuery.trim()}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {isFactChecking ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-green" />
                    <span>Verifying with Sources...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-brand-green" />
                    <span>Verify Claim</span>
                  </>
                )}
              </button>
            </form>

            {factCheckResponse && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed space-y-1.5"
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-brand-green font-bold">
                  <span>VERIFICATION DISPATCH</span>
                  <button onClick={() => setFactCheckResponse(null)} className="text-slate-500 hover:text-white">✕</button>
                </div>
                <p className="whitespace-pre-line">{factCheckResponse}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Active Article Journalistic View (8 cols) */}
        <div ref={readerRef} className={`space-y-6 lg:col-span-8 ${mobileTab === 'reader' ? 'block' : 'hidden lg:block'}`}>
          {/* Mobile Back Button to Browse List */}
          <div className="lg:hidden flex items-center justify-between pb-2">
            <button
              onClick={() => setMobileTab('list')}
              className="text-xs font-mono text-brand-green flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to All Dispatches ({filteredArticles.length})</span>
            </button>
            <span className="text-[11px] font-mono text-slate-400">
              {currentIndex + 1} of {articles.length}
            </span>
          </div>

          <motion.article 
            key={activeArticle.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="tech-card p-6 sm:p-10 rounded-3xl space-y-8"
          >
            {/* Metadata and Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${getDisciplineColor(activeArticle.discipline)}`}>
                  {getDisciplineIcon(activeArticle.discipline)}
                  <span>{activeArticle.discipline}</span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {activeArticle.date} • {activeArticle.readTime}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{activeArticle.verificationStatus}</span>
                </span>
              </div>

              {/* Utility Tools: Font Sizer, Focus Mode, Audio & Language Switcher */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Font Size Adjuster */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
                  <button
                    onClick={() => {
                      sciFiAudio.playClick();
                      setFontSize(prev => prev === 'xl' ? 'lg' : prev === 'lg' ? 'base' : 'sm');
                    }}
                    title="Decrease font size"
                    className="px-2 py-1 text-slate-400 hover:text-white text-xs font-mono font-bold cursor-pointer"
                  >
                    A-
                  </button>
                  <span className="text-[10px] font-mono text-slate-500 px-1 uppercase">{fontSize}</span>
                  <button
                    onClick={() => {
                      sciFiAudio.playClick();
                      setFontSize(prev => prev === 'sm' ? 'base' : prev === 'base' ? 'lg' : 'xl');
                    }}
                    title="Increase font size"
                    className="px-2 py-1 text-slate-400 hover:text-white text-xs font-mono font-bold cursor-pointer"
                  >
                    A+
                  </button>
                </div>

                {/* Focus / Fullscreen Mode */}
                <button
                  onClick={() => {
                    sciFiAudio.playClick();
                    setIsFullscreenReader(true);
                  }}
                  className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Immersive Focus Reading Mode"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-brand-green" />
                  <span className="hidden sm:inline">Focus</span>
                </button>

                {/* Audio Reader */}
                <button
                  onClick={handleToggleSpeech}
                  className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSpeaking 
                      ? 'bg-brand-green/20 text-brand-green border-brand-green/40' 
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                  title={isSpeaking ? 'Stop reading' : 'Listen to article'}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4 text-brand-green" /> : <Volume2 className="w-4 h-4 text-slate-400" />}
                  <span className="hidden sm:inline">{isSpeaking ? 'Listening...' : 'Listen'}</span>
                </button>

                {/* Translation Dropdown */}
                <div className="relative inline-flex items-center">
                  <Languages className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
                  <select
                    value={selectedLanguage}
                    onChange={e => handleTranslate(e.target.value)}
                    disabled={isTranslating}
                    className="pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-green cursor-pointer disabled:opacity-50"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code} className="bg-slate-950 text-white">
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Translation in Progress Banner */}
            {isTranslating && (
              <div className="p-3 rounded-xl bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-mono flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                <span>Translating article while strictly preserving scientific terminology and mathematical notation...</span>
              </div>
            )}

            {/* Article Headline & Deck */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                {currentDisplayContent.headline}
              </h2>
              
              <p className="text-base sm:text-lg text-slate-300 font-serif leading-relaxed italic border-l-2 border-brand-green pl-4">
                {currentDisplayContent.deck}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pt-1">
                <span>By {activeArticle.author}</span>
                <span>•</span>
                <span>Region: {activeArticle.regionFocus}</span>
                <span>•</span>
                <span className="text-brand-green">Focus: {activeArticle.aiFocusTag}</span>
              </div>
            </div>

            {/* Key Quantitative Data Points Bar */}
            {activeArticle.keyDataPoints && activeArticle.keyDataPoints.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {activeArticle.keyDataPoints.map((dp, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="text-xs font-mono uppercase text-slate-400">{dp.metric}</div>
                    <div className="text-xl sm:text-2xl font-mono font-black text-brand-green">{dp.value}</div>
                    <div className="text-[11px] text-slate-400 leading-tight">{dp.context}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Main Journalistic Content */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className={`space-y-4 ${fontSizeClass}`}>
                <ReactMarkdown 
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl sm:text-3xl font-black text-white mt-8 mb-4 border-b border-slate-800 pb-2">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl sm:text-2xl font-black text-white mt-7 mb-3 flex items-center gap-2 border-l-2 border-brand-green pl-3">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg sm:text-xl font-bold text-brand-green mt-6 mb-2">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-slate-200 leading-relaxed mb-4">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-outside pl-6 space-y-2 mb-5 text-slate-200">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-outside pl-6 space-y-2 mb-5 text-slate-200">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed pl-1 marker:text-brand-green">
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-white">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-slate-100">
                        {children}
                      </em>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-brand-green bg-slate-950/60 p-4 rounded-r-xl my-4 text-slate-300 italic">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className }) => {
                      const isBlock = className?.includes('language-');
                      return isBlock ? (
                        <code className="font-mono text-xs text-brand-green block p-3 bg-slate-950 rounded-lg overflow-x-auto border border-slate-800">
                          {children}
                        </code>
                      ) : (
                        <code className="font-mono text-xs text-brand-green bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800/80">
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto my-4 text-xs font-mono text-slate-200">
                        {children}
                      </pre>
                    )
                  }}
                >
                  {currentDisplayContent.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* AI Concepts Explained (Pedagogical Callouts) */}
            {activeArticle.concepts && activeArticle.concepts.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-green uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>Technical & AI Concepts Explained</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {activeArticle.concepts.map((c, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                      <div className="text-xs font-bold text-white font-mono">{c.term}</div>
                      <p className="text-xs text-slate-300 leading-normal">{c.definition}</p>
                      <div className="text-[11px] text-brand-green/90 font-mono pt-1">
                        💡 AI Role: {c.aiContext}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accredited Citations & Sources Table */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-brand-green" />
                  <span>Verified Accredited Sources ({activeArticle.citations.length})</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Peer-Reviewed & Academic Press</span>
              </div>

              <div className="space-y-3">
                {activeArticle.citations.map(cite => (
                  <div 
                    key={cite.id} 
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-brand-green text-[11px] px-2 py-0.5 rounded bg-brand-green/10 border border-brand-green/20">
                          {cite.publication}
                        </span>
                        <span className="text-slate-500 text-[10px] font-mono">{cite.region}</span>
                        {cite.peerReviewed && (
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                            Peer-Reviewed
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-slate-200">{cite.title}</div>
                      <div className="text-slate-400 text-[11px]">
                        {cite.institutionOrAuthors} • {cite.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopyCitation(cite)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                        title="Copy formatted citation"
                      >
                        {copiedCitationId === cite.id ? (
                          <>
                            <Check className="w-3 h-3 text-brand-green" />
                            <span className="text-brand-green">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400" />
                            <span>Cite</span>
                          </>
                        )}
                      </button>

                      {cite.doiOrUrl && (
                        <a
                          href={cite.doiOrUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/30 text-brand-green text-xs font-mono flex items-center gap-1 transition-colors"
                        >
                          <span>Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Article Pager: Prev & Next Article Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800/80">
              {prevArticle ? (
                <button
                  onClick={() => handleSelectArticle(prevArticle.id)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-brand-green" />
                  <div className="text-left">
                    <span className="text-[10px] text-slate-500 block">PREVIOUS DISPATCH</span>
                    <span className="text-brand-green font-bold truncate max-w-[160px] sm:max-w-xs block">{prevArticle.headline}</span>
                  </div>
                </button>
              ) : <div />}

              {nextArticle ? (
                <button
                  onClick={() => handleSelectArticle(nextArticle.id)}
                  className="px-4 py-2.5 rounded-xl bg-brand-green/15 hover:bg-brand-green/25 border border-brand-green/40 text-xs font-mono text-brand-green font-bold flex items-center gap-2 cursor-pointer transition-colors ml-auto"
                >
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">NEXT DISPATCH</span>
                    <span className="truncate max-w-[160px] sm:max-w-xs block text-white">{nextArticle.headline}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-green" />
                </button>
              ) : <div />}
            </div>

          </motion.article>
        </div>

      </div>

      {/* Fullscreen / Focus Mode Reader Modal */}
      <AnimatePresence>
        {isFullscreenReader && (
          <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/98 backdrop-blur-md overflow-y-auto p-4 sm:p-8">
            <div className="max-w-4xl w-full mx-auto space-y-8 my-auto py-6">
              {/* Focus Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase border ${getDisciplineColor(activeArticle.discipline)}`}>
                    {activeArticle.discipline}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{activeArticle.date}</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Font Size Adjuster */}
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
                    <button
                      onClick={() => setFontSize(prev => prev === 'xl' ? 'lg' : prev === 'lg' ? 'base' : 'sm')}
                      className="px-2.5 py-1 text-slate-400 hover:text-white text-xs font-mono font-bold cursor-pointer"
                    >
                      A-
                    </button>
                    <span className="text-[10px] font-mono text-slate-500 px-1 uppercase">{fontSize}</span>
                    <button
                      onClick={() => setFontSize(prev => prev === 'sm' ? 'base' : prev === 'base' ? 'lg' : 'xl')}
                      className="px-2.5 py-1 text-slate-400 hover:text-white text-xs font-mono font-bold cursor-pointer"
                    >
                      A+
                    </button>
                  </div>

                  <button
                    onClick={() => setIsFullscreenReader(false)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    <Minimize2 className="w-4 h-4 text-brand-green" />
                    <span>Exit Focus</span>
                  </button>
                </div>
              </div>

              {/* Focus Content */}
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                  {currentDisplayContent.headline}
                </h1>
                <p className="text-lg sm:text-xl text-slate-300 font-serif leading-relaxed italic border-l-2 border-brand-green pl-4">
                  {currentDisplayContent.deck}
                </p>

                <div className={`space-y-4 pt-4 border-t border-slate-800 ${fontSizeClass}`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      h1: ({ children }) => <h1 className="text-2xl sm:text-3xl font-black text-white mt-8 mb-4 border-b border-slate-800 pb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl sm:text-2xl font-black text-white mt-7 mb-3 flex items-center gap-2 border-l-2 border-brand-green pl-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg sm:text-xl font-bold text-brand-green mt-6 mb-2">{children}</h3>,
                      p: ({ children }) => <p className="text-slate-200 leading-relaxed mb-4">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-outside pl-6 space-y-2 mb-5 text-slate-200">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-outside pl-6 space-y-2 mb-5 text-slate-200">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed pl-1 marker:text-brand-green">{children}</li>,
                      strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                      em: ({ children }) => <em className="italic text-slate-100">{children}</em>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-brand-green bg-slate-900/60 p-4 rounded-r-xl my-4 text-slate-300 italic">{children}</blockquote>,
                    }}
                  >
                    {currentDisplayContent.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Bottom Close */}
              <div className="pt-8 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">The Development Archive • Verified STEM Journalism</span>
                <button
                  onClick={() => setIsFullscreenReader(false)}
                  className="px-6 py-2.5 rounded-full bg-brand-green text-brand-black font-mono font-bold text-xs cursor-pointer hover:bg-brand-green-dark transition-colors"
                >
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Fresh Dispatch Generator Modal */}
      <AnimatePresence>
        {showGenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="tech-card p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-6 border border-brand-green/50 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-green/20 border border-brand-green/40 flex items-center justify-center text-brand-green">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Generate Daily STEM Dispatch</h3>
                    <p className="text-xs text-slate-400 font-mono">Strict Accredited Sources & Verification</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGenModal(false)}
                  className="text-slate-500 hover:text-white font-mono text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider mb-2">
                    Select STEM Discipline
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Science', 'Technology', 'Engineering', 'Mathematics'] as const).map(disc => (
                      <button
                        key={disc}
                        type="button"
                        onClick={() => setGenDiscipline(disc)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-colors cursor-pointer ${
                          genDiscipline === disc
                            ? 'bg-brand-green/20 border-brand-green text-brand-green font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {getDisciplineIcon(disc)}
                        <span>{disc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider mb-2">
                    Optional Topic or Subfield Focus
                  </label>
                  <input
                    type="text"
                    value={genTopicPrompt}
                    onChange={e => setGenTopicPrompt(e.target.value)}
                    placeholder="e.g. Quantum error correction, fusion plasma control, or leave blank for today's top discovery"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-green font-sans"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                  <div className="text-brand-green font-bold mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Non-Negotiable Verification Enforced</span>
                  </div>
                  The AI bot uses only accredited sources (*Nature*, *Science*, *IEEE*, university research labs) and adheres strictly to the rule: if verifiable news is unavailable for this topic, it will state so and pivot to verifiable developments.
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-bold hover:text-white cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateArticle}
                  className="flex-1 py-3 rounded-xl bg-brand-green hover:bg-brand-green-dark text-brand-black text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-green/20 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Produce Article</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
