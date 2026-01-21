
import React, { useState } from 'react';

interface AuthProps {
  onLoginSuccess: (email: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // For this simulation, we use localStorage as a simple key-value database.
    // In a real app, this would be a secure backend with hashed passwords.
    const users = JSON.parse(localStorage.getItem('dev-archive-users') || '{}');

    if (isLoginMode) {
      // Login Logic
      if (!users[email] || users[email] !== password) {
        setError('Invalid email or password.');
        return;
      }
      onLoginSuccess(email);
    } else {
      // Sign Up Logic
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (users[email]) {
        setError('An account with this email already exists.');
        return;
      }
      
      users[email] = password;
      localStorage.setItem('dev-archive-users', JSON.stringify(users));
      onLoginSuccess(email);
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
            className="w-full px-4 py-3 bg-brand-black border border-brand-border rounded-md text-white placeholder-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
        </div>
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 bg-brand-black border border-brand-border rounded-md text-white placeholder-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-green"
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
              className="w-full px-4 py-3 bg-brand-black border border-brand-border rounded-md text-white placeholder-brand-light-gray focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>
        )}
        
        {error && <p className="text-sm text-brand-red text-center">{error}</p>}

        <div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-brand-green text-brand-black font-bold rounded-md hover:bg-brand-green-dark transition-colors duration-300 transform hover:scale-105"
          >
            {isLoginMode ? 'Login' : 'Create Account'}
          </button>
        </div>
      </form>
      
      <div className="text-center">
        <button onClick={toggleMode} className="text-sm text-brand-green hover:underline">
          {isLoginMode ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};
