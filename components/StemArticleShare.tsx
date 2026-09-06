import React, { useState, useEffect, useRef } from 'react';
import { 
  Share2, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Mail, 
  Link2, 
  Check, 
  Copy,
  MessageCircle,
  ExternalLink,
  X
} from 'lucide-react';
import { StemArticle } from '../types';
import { sciFiAudio } from './SoundEffects';

interface StemArticleShareProps {
  article: StemArticle;
  variant?: 'compact' | 'full' | 'inline';
  className?: string;
}

export const StemArticleShare: React.FC<StemArticleShareProps> = ({
  article,
  variant = 'compact',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };
    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  // Construct absolute URL for the article permalink
  const getShareUrl = (): string => {
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('article', article.id);
        url.hash = `dispatch-${article.id}`;
        return url.toString();
      } catch {
        return window.location.href;
      }
    }
    return `https://developmentarchive.net/?article=${article.id}#dispatch-${article.id}`;
  };

  const shareUrl = getShareUrl();
  const title = article.headline;
  const summary = article.deck;

  // Formatted share URLs for external platforms
  const tweetText = `🔬 ${title}\n\nVia @DevelopmentArch #STEM #${article.discipline} #Science`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const redditShareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`[${article.discipline}] ${title}`)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  
  const emailSubject = `STEM Breakthrough: ${title}`;
  const emailBody = `I thought you would find this verified scientific breakthrough interesting:\n\n${title}\n\n${summary}\n\nAccredited Research Dispatch:\n${shareUrl}\n\n— Via The Development Archive (developmentarchive.net)`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const handleCopyLink = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shareUrl);
      sciFiAudio.playSuccess();
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sciFiAudio.playClick();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} — ${summary}`,
          url: shareUrl
        });
      } catch {
        // User cancelled or aborted
      }
    } else {
      handleCopyLink();
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  // 1. Compact Variant (for top action bar or inside Focus reader)
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 ${className}`}>
        <span className="text-[10px] font-mono text-slate-400 uppercase px-2 hidden sm:inline flex items-center gap-1">
          <Share2 className="w-3 h-3 text-brand-green" />
          <span>Share:</span>
        </span>

        {/* X (Twitter) */}
        <a
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sciFiAudio.playClick()}
          title="Share breakthrough on X (Twitter)"
          aria-label="Share on X"
          className="p-1.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white border border-transparent hover:border-slate-700 transition-colors"
        >
          <Twitter className="w-3.5 h-3.5" />
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sciFiAudio.playClick()}
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
          className="p-1.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-[#0A66C2] border border-transparent hover:border-[#0A66C2]/30 transition-colors"
        >
          <Linkedin className="w-3.5 h-3.5" />
        </a>

        {/* Reddit */}
        <a
          href={redditShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sciFiAudio.playClick()}
          title="Discuss on Reddit"
          aria-label="Discuss on Reddit"
          className="p-1.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-[#FF4500] border border-transparent hover:border-[#FF4500]/30 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </a>

        {/* Facebook */}
        <a
          href={facebookShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sciFiAudio.playClick()}
          title="Share on Facebook"
          aria-label="Share on Facebook"
          className="p-1.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-[#1877F2] border border-transparent hover:border-[#1877F2]/30 transition-colors"
        >
          <Facebook className="w-3.5 h-3.5" />
        </a>

        {/* Email */}
        <a
          href={mailtoUrl}
          onClick={() => sciFiAudio.playClick()}
          title="Email this breakthrough"
          aria-label="Email article"
          className="p-1.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-brand-green border border-transparent hover:border-brand-green/30 transition-colors"
        >
          <Mail className="w-3.5 h-3.5" />
        </a>

        {/* Native Web Share API (mobile/tablet devices) */}
        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            title="System share sheet"
            aria-label="System share"
            className="p-1.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-brand-green border border-transparent hover:border-brand-green/30 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          title={copied ? 'Link copied!' : 'Copy article permalink'}
          aria-label="Copy article link"
          className={`px-2.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
            copied
              ? 'bg-brand-green/20 text-brand-green border border-brand-green/40'
              : 'hover:bg-slate-900 text-slate-300 hover:text-white border border-transparent hover:border-slate-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-brand-green" />
              <span className="text-[11px] font-bold text-brand-green">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-3 h-3 text-slate-400" />
              <span className="text-[11px] hidden sm:inline">Copy Link</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // 2. Inline Popover Variant (for list cards or compact rows)
  if (variant === 'inline') {
    return (
      <div className={`relative inline-block ${className}`} ref={popoverRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            sciFiAudio.playClick();
            setIsPopoverOpen(!isPopoverOpen);
          }}
          title="Share dispatch"
          aria-label="Share dispatch"
          className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-brand-green border border-slate-800 hover:border-slate-700 text-xs transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Share2 className="w-3 h-3" />
          <span className="font-mono text-[11px]">Share</span>
        </button>

        {isPopoverOpen && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 bottom-full mb-2 w-56 p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl z-40 space-y-2"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase font-bold">
              <span>Share Dispatch</span>
              <button 
                onClick={() => setIsPopoverOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1 pt-1">
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { sciFiAudio.playClick(); setIsPopoverOpen(false); }}
                title="Share on X"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>

              <a
                href={linkedinShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { sciFiAudio.playClick(); setIsPopoverOpen(false); }}
                title="Share on LinkedIn"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-[#0A66C2] flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>

              <a
                href={redditShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { sciFiAudio.playClick(); setIsPopoverOpen(false); }}
                title="Share on Reddit"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-[#FF4500] flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>

              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { sciFiAudio.playClick(); setIsPopoverOpen(false); }}
                title="Share on Facebook"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-[#1877F2] flex items-center justify-center transition-colors"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="pt-1 space-y-1">
              <button
                onClick={(e) => {
                  handleCopyLink(e);
                  setTimeout(() => setIsPopoverOpen(false), 1200);
                }}
                className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  copied
                    ? 'bg-brand-green/20 text-brand-green border border-brand-green/40'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-brand-green" />
                    <span className="text-brand-green font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              {hasNativeShare && (
                <button
                  onClick={(e) => {
                    handleNativeShare(e);
                    setIsPopoverOpen(false);
                  }}
                  className="w-full py-1 px-2 rounded-lg text-[11px] font-mono text-slate-400 hover:text-brand-green flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3 h-3" />
                  <span>More share options</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Full Variant (for bottom of article callout)
  return (
    <div className={`p-6 sm:p-7 rounded-3xl bg-slate-950 border border-slate-800 space-y-5 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-green uppercase tracking-wider">
            <Share2 className="w-4 h-4" />
            <span>Share This Breakthrough</span>
          </div>
          <p className="text-xs text-slate-400">
            Disseminate verified scientific and deep-tech discoveries across research networks and social channels.
          </p>
        </div>

        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            className="px-4 py-2 rounded-xl bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/30 text-brand-green text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-colors shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Sheet</span>
          </button>
        )}
      </div>

      {/* Social Media Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {/* X (Twitter) */}
        <a
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sciFiAudio.playClick()}
          className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex flex-col items-center justify-center gap-2 text-xs font-mono transition-all group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Twitter className="w-4 h-4 text-slate-300 group-hover:text-white" />
          </div>
          <span className="font-semibold">X (Twitter)</span>
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sciFiAudio.playClick()}
          className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-[#0A66C2]/40 text-slate-300 hover:text-white flex flex-col items-center justify-center gap-2 text-xs font-mono transition-all group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
          </div>
          <span className="font-semibold">LinkedIn</span>
        </a>

        {/* Reddit */}
        <a
          href={redditShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sciFiAudio.playClick()}
          className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-[#FF4500]/40 text-slate-300 hover:text-white flex flex-col items-center justify-center gap-2 text-xs font-mono transition-all group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageCircle className="w-4 h-4 text-[#FF4500]" />
          </div>
          <span className="font-semibold">Reddit</span>
        </a>

        {/* Facebook */}
        <a
          href={facebookShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sciFiAudio.playClick()}
          className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-[#1877F2]/40 text-slate-300 hover:text-white flex flex-col items-center justify-center gap-2 text-xs font-mono transition-all group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Facebook className="w-4 h-4 text-[#1877F2]" />
          </div>
          <span className="font-semibold">Facebook</span>
        </a>

        {/* Email */}
        <a
          href={mailtoUrl}
          onClick={() => sciFiAudio.playClick()}
          className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-brand-green/40 text-slate-300 hover:text-white flex flex-col items-center justify-center gap-2 text-xs font-mono transition-all group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Mail className="w-4 h-4 text-brand-green" />
          </div>
          <span className="font-semibold">Email Dispatch</span>
        </a>
      </div>

      {/* Permalink Copy Input Bar */}
      <div className="pt-2">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-brand-green/60 transition-colors">
          <Link2 className="w-4 h-4 text-slate-500 ml-2.5 shrink-0" />
          <input
            type="text"
            readOnly
            value={shareUrl}
            onFocus={e => e.target.select()}
            className="w-full bg-transparent text-xs font-mono text-slate-300 focus:outline-none select-all truncate"
            title="Direct article permalink"
          />
          <button
            onClick={handleCopyLink}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              copied
                ? 'bg-brand-green text-brand-black shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-brand-green" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
