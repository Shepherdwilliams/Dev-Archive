
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Check, Copy, ExternalLink, MessageSquare, ShieldCheck } from 'lucide-react';

const SUPPORT_EMAIL = 'support@developmentarchive.net';

export const Contact: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(SUPPORT_EMAIL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleDirectMailto = () => {
        const subject = encodeURIComponent(
            formData.name 
                ? `[Inquiry from ${formData.name}] Development Archive Contact`
                : 'Development Archive Contact & Support Inquiry'
        );
        const body = encodeURIComponent(
            formData.message 
                ? `From: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}`
                : ''
        );
        window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setError('Please fill out all fields.');
            return;
        }
        setError('');
        setIsLoading(true);

        const scriptUrl = 'https://script.google.com/macros/s/AKfycbwcqP5oYKfswzNYsBd1qqOVTZ5oc3EUN81a_nz8rpn2WmWuVSt7gcU3VVQ_uuhnWxtk/exec';

        try {
            const params = new URLSearchParams({
                name: formData.name,
                email: formData.email,
                message: formData.message,
                recipient: SUPPORT_EMAIL,
                target: SUPPORT_EMAIL,
                _t: Date.now().toString()
            });

            const finalUrl = `${scriptUrl}?${params.toString()}`;

            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.name = 'hidden_submit_iframe';
            document.body.appendChild(iframe);
            iframe.src = finalUrl;

            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
            }, 5000);

            setIsLoading(false);
            setIsSubmitted(true);
        } catch (err) {
            console.error('Submission error:', err);
            // If background transmission fails, open direct mailto to ensure delivery
            handleDirectMailto();
            setIsLoading(false);
            setIsSubmitted(true);
        }
    };

    if (isSubmitted) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center tech-card p-8 sm:p-12 rounded-3xl space-y-6"
            >
                <div className="w-20 h-20 bg-brand-green/20 border border-brand-green/40 rounded-full flex items-center justify-center mx-auto text-brand-green">
                    <Check className="w-10 h-10" />
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Transmission Dispatched</h2>
                    <p className="text-brand-light-gray text-base sm:text-lg max-w-md mx-auto">
                        Your message has been routed to <span className="text-brand-green font-mono font-bold">{SUPPORT_EMAIL}</span>. Our research and support team will reply to you shortly.
                    </p>
                </div>

                <div className="p-4 rounded-2xl bg-brand-black/60 border border-brand-border text-left font-mono text-xs text-slate-300 space-y-1">
                    <div className="text-brand-green font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Dispatch Details</span>
                    </div>
                    <div><span className="text-slate-500">Destination:</span> {SUPPORT_EMAIL}</div>
                    <div><span className="text-slate-500">Sender:</span> {formData.name} ({formData.email})</div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button 
                        onClick={() => {
                            setIsSubmitted(false);
                            setFormData({ name: '', email: '', message: '' });
                        }}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-gray-dark border border-brand-border hover:border-brand-green text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                        Send Another Message
                    </button>
                    
                    <button
                        onClick={handleDirectMailto}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-green hover:bg-brand-green-dark text-brand-black font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-green/20"
                    >
                        <Mail className="w-4 h-4" />
                        <span>Open in Email App</span>
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-3"
            >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-mono font-bold uppercase tracking-widest">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Direct Inquiries & Support</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight glow-text">Get in Touch</h1>
                <p className="text-base md:text-lg text-brand-light-gray max-w-xl mx-auto leading-relaxed">
                    Have questions about our STEM curriculum, AI tools, or need custom assistance? All messages are sent directly to our support desk.
                </p>
            </motion.div>

            {/* Direct Email Address Action Banner */}
            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-brand-gray-dark via-slate-900 to-brand-gray-dark border border-brand-green/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4"
            >
                <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-12 h-12 rounded-xl bg-brand-green/10 border border-brand-green/30 flex items-center justify-center text-brand-green shrink-0">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Direct Support Email</div>
                        <a 
                            href={`mailto:${SUPPORT_EMAIL}`}
                            className="text-lg sm:text-xl font-mono font-black text-brand-green hover:underline break-all"
                        >
                            {SUPPORT_EMAIL}
                        </a>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-brand-black/60 hover:bg-brand-black border border-brand-border hover:border-brand-green text-slate-200 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="Copy email to clipboard"
                    >
                        {copied ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-brand-green" />
                                <span className="text-brand-green font-bold">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleDirectMailto}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-brand-green hover:bg-brand-green-dark text-brand-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-brand-green/20"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Email Now</span>
                    </button>
                </div>
            </motion.div>

            {/* Transmission Form */}
            <motion.form 
                onSubmit={handleSubmit} 
                className="tech-card p-6 sm:p-10 rounded-3xl space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <div className="flex items-center justify-between pb-2 border-b border-brand-border/60">
                    <span className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-brand-green" />
                        <span>Transmission Form</span>
                    </span>
                    <span className="text-[11px] font-mono text-brand-green bg-brand-green/10 border border-brand-green/30 px-2 py-0.5 rounded">
                        TO: {SUPPORT_EMAIL}
                    </span>
                </div>

                <div className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                            Your Full Name <span className="text-brand-green">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full p-3.5 bg-brand-black/70 border border-brand-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all disabled:opacity-50 text-sm font-sans"
                            placeholder="e.g., Dr. Jane Doe"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                            Your Email Address <span className="text-brand-green">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full p-3.5 bg-brand-black/70 border border-brand-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all disabled:opacity-50 text-sm font-sans"
                            placeholder="you@domain.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                            Your Message / Inquiry <span className="text-brand-green">*</span>
                        </label>
                        <textarea
                            name="message"
                            id="message"
                            rows={5}
                            required
                            value={formData.message}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-full p-3.5 bg-brand-black/70 border border-brand-border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all disabled:opacity-50 resize-none text-sm font-sans"
                            placeholder="How can we assist you with our STEM modules, science platform, or custom solutions?"
                        />
                    </div>
                </div>
                
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono"
                    >
                        {error}
                    </motion.div>
                )}
                
                <div className="pt-2">
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full bg-brand-green hover:bg-brand-green-dark text-brand-black font-black py-4 px-8 rounded-xl text-base uppercase tracking-wider transition-all duration-300 shadow-xl shadow-brand-green/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden"
                    >
                        <Send className="w-5 h-5" />
                        <span>{isLoading ? 'Transmitting to support@developmentarchive.net...' : 'Send Message to Support Desk'}</span>
                        {isLoading && (
                            <motion.div 
                                className="absolute inset-0 bg-white/15"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            />
                        )}
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
};

