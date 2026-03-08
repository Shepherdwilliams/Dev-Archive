
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const Contact: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            setError('Please fill out all fields.');
            return;
        }
        setError('');
        setIsLoading(true);

        // Forcing the latest URL to avoid any environment variable conflicts
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbwcqP5oYKfswzNYsBd1qqOVTZ5oc3EUN81a_nz8rpn2WmWuVSt7gcU3VVQ_uuhnWxtk/exec';

        console.log('Attempting to send to:', scriptUrl);

        try {
            // Using URLSearchParams to build the query string
            const params = new URLSearchParams({
                name: formData.name,
                email: formData.email,
                message: formData.message,
                _t: Date.now().toString() // Anti-caching timestamp
            });

            const finalUrl = `${scriptUrl}?${params.toString()}`;
            console.log('Navigating hidden iframe to:', finalUrl);

            // Create a hidden iframe to perform a "real" navigation
            // This is the most reliable way to handle Google's 302 redirects
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.name = 'hidden_submit_iframe';
            document.body.appendChild(iframe);

            // Set the source to trigger the script
            iframe.src = finalUrl;

            // Give it a few seconds to complete the hop before cleanup
            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
            }, 5000);

            console.log('Submission triggered via background navigation');
            setIsLoading(false);
            setIsSubmitted(true);
        } catch (err) {
            console.error('Submission error:', err);
            setError('Could not send message. Please try again later.');
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center tech-card p-12 rounded-2xl"
            >
                <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-brand-green">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">Message Received</h2>
                <p className="text-brand-light-gray text-lg">Your transmission has been successfully sent. We'll get back to you shortly.</p>
                <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-brand-green hover:underline font-medium"
                >
                    Send another message
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl md:text-6xl font-bold text-center text-white mb-6 tracking-tight glow-text">Get in Touch</h1>
                <p className="text-lg md:text-xl text-brand-light-gray text-center mb-12 leading-relaxed">
                    Have a question or feedback? Fill out the form below to reach out to us.
                </p>

                <motion.form 
                    onSubmit={handleSubmit} 
                    className="tech-card p-8 sm:p-10 rounded-2xl space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-brand-light-gray uppercase tracking-wider mb-3">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full p-4 bg-brand-black/50 border border-brand-border rounded-xl text-white placeholder-brand-light-gray/30 focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all disabled:opacity-50"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-brand-light-gray uppercase tracking-wider mb-3">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full p-4 bg-brand-black/50 border border-brand-border rounded-xl text-white placeholder-brand-light-gray/30 focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all disabled:opacity-50"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-semibold text-brand-light-gray uppercase tracking-wider mb-3">Message</label>
                            <textarea
                                name="message"
                                id="message"
                                rows={5}
                                value={formData.message}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full p-4 bg-brand-black/50 border border-brand-border rounded-xl text-white placeholder-brand-light-gray/30 focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all disabled:opacity-50 resize-none"
                                placeholder="Your message here..."
                            />
                        </div>
                    </div>
                    
                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-sm text-brand-red font-medium"
                        >
                            {error}
                        </motion.p>
                    )}
                    
                    <div>
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-brand-green text-brand-black font-bold py-4 px-8 rounded-xl text-xl hover:bg-brand-green-dark transition-all duration-300 shadow-lg shadow-brand-green/20 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                        >
                            <span className="relative z-10">{isLoading ? 'Transmitting...' : 'Send Message'}</span>
                            {isLoading && (
                                <motion.div 
                                    className="absolute inset-0 bg-white/10"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                />
                            )}
                        </motion.button>
                    </div>
                </motion.form>
            </motion.div>
        </div>
    );
};
