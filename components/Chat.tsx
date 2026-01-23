
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat as GenAIChat, GenerateContentResponse } from '@google/genai';
import type { ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const ModelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);


export const Chat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<GenAIChat | null>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            if (!chatRef.current) {
                const ai = new GoogleGenAI({ apiKey: API_KEY });
                chatRef.current = ai.chats.create({
                    model: 'gemini-flash-latest',
                    config: {
                        systemInstruction: 'You are a friendly and knowledgeable AI assistant for an educational website teaching the fundamentals of Artificial Intelligence. Your goal is to help users understand the course material and answer their questions about AI clearly and concisely. Keep your answers focused on the topic of AI and learning.',
                    }
                });
            }
            
            const stream = await chatRef.current.sendMessageStream({ message: input });

            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                const c = chunk as GenerateContentResponse
                const chunkText = c.text;
                if(chunkText) {
                    modelResponse += chunkText;
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1].text = modelResponse;
                        return newMessages;
                    });
                }
            }

        } catch (err) {
            console.error(err);
            setError('Sorry, something went wrong. Please try again.');
            // remove the empty model message on error
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-200px)]">
            <div className="text-center mb-6">
                 <h1 className="text-4xl font-bold text-white mb-2">AI Learning Assistant</h1>
                 <p className="text-lg text-brand-light-gray">Ask me anything about the course content or general AI topics.</p>
            </div>

            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-6 bg-brand-gray-dark/50 rounded-xl border border-brand-border">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-brand-black"><ModelIcon/></div>}
                        <div className={`max-w-lg p-3 rounded-xl ${msg.role === 'user' ? 'bg-brand-green text-brand-black' : 'bg-brand-border text-white'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                         {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-border flex items-center justify-center"><UserIcon/></div>}
                    </div>
                ))}
                {isLoading && messages[messages.length-1].role === 'user' && (
                     <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-brand-black"><ModelIcon/></div>
                        <div className="max-w-lg p-3 rounded-xl bg-brand-border text-white">
                            <p>Thinking...</p>
                        </div>
                    </div>
                )}
            </div>

            {error && <p className="text-center text-brand-red mt-2">{error}</p>}
            
            <form onSubmit={handleSendMessage} className="mt-6 flex items-center gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question here..."
                    disabled={isLoading}
                    className="flex-grow w-full p-4 bg-brand-gray-dark border border-brand-border rounded-full text-white placeholder-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="p-4 bg-brand-green text-brand-black rounded-full hover:bg-brand-green-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
            </form>
        </div>
    );
};
