
import React, { useState } from 'react';
import { supabase } from '../lib/appwrite';

export const Auth: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setMessage('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    if (!isLoginMode && password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    
    try {
      if (isLoginMode) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Sign up successful! Please check your email to confirm your account. (Note: New Supabase projects may use a mock email server; you might need to disable email confirmation in your Supabase project settings if you don\'t receive an email.)');
      }
    } catch (err: any) {
      let errorMessage = err.message || 'An unexpected error occurred.';
      if (errorMessage.toLowerCase().includes('email not confirmed')) {
          errorMessage = 'Your email has not been confirmed. Please check your inbox for a confirmation link. The project owner may need to configure a real email provider in Supabase for emails to be sent.';
      } else if (errorMessage.toLowerCase().includes('invalid login credentials')) {
          errorMessage = 'Incorrect email or password. Please try again.';
      } else if (errorMessage.toLowerCase().includes('failed to fetch')) {
          errorMessage = 'Could not connect to the authentication server. Please check the Supabase URL in the configuration file (lib/appwrite.ts) and ensure it is correct.';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-brand-gray-dark rounded-xl border border-brand-border shadow-2xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">
          Welcome to <span className="text-brand-green">Dev</span> Archive
        </h1>
        <p className="text-brand-light-gray">{isLoginMode ? 'Sign in to continue your journey' : 'Create an account to start learning'}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 bg-brand-black border border-brand-border rounded-md text-white placeholder-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-50"
            disabled={isLoading}
          />
        </div>
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 bg-brand-black border border-brand-border rounded-md text-white placeholder-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-50"
            disabled={isLoading}
          />
        </div>
        {!isLoginMode && (
          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-3 bg-brand-black border border-brand-border rounded-md text-white placeholder-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-green disabled:opacity-50"
              disabled={isLoading}
            />
          </div>
        )}
        
        {error && <p className="text-sm text-brand-red text-center">{error}</p>}
        {message && <p className="text-sm text-brand-green text-center">{message}</p>}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-brand-green text-brand-black font-bold rounded-md hover:bg-brand-green-dark transition-colors duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : (isLoginMode ? 'Login' : 'Create Account')}
          </button>
        </div>
      </form>
      
      <div className="text-center">
        <button onClick={toggleMode} className="text-sm text-brand-green hover:underline disabled:opacity-50" disabled={isLoading}>
          {isLoginMode ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};