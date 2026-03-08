
import React, { useState } from 'react';

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
            <div className="max-w-2xl mx-auto text-center bg-brand-gray-dark p-8 rounded-xl">
                <h2 className="text-3xl font-bold text-brand-green mb-4">Thank You!</h2>
                <p className="text-brand-light-gray">Your message has been sent. We'll get back to you shortly.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-center text-white mb-4">Get in Touch</h1>
            <p className="text-lg text-brand-light-gray text-center mb-8">
                Have a question or feedback? Fill out the form below to reach out to us.
            </p>

            <form onSubmit={handleSubmit} className="bg-brand-gray-dark p-8 rounded-xl border border-brand-border space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-light-gray mb-2">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full p-3 bg-brand-black border border-brand-border rounded-md text-white placeholder-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-50"
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-light-gray mb-2">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full p-3 bg-brand-black border border-brand-border rounded-md text-white placeholder-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-50"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-brand-light-gray mb-2">Message</label>
                    <textarea
                        name="message"
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full p-3 bg-brand-black border border-brand-border rounded-md text-white placeholder-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-50"
                        placeholder="Your message here..."
                    />
                </div>
                
                {error && <p className="text-sm text-brand-red">{error}</p>}
                
                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-brand-green text-brand-black font-bold py-3 px-6 rounded-full text-lg hover:bg-brand-green-dark transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Sending...' : 'Send Message'}
                    </button>
                </div>
            </form>
        </div>
    );
};
