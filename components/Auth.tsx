
import React, { useState } from 'react';
import { account, databases, ID, APPWRITE_CONFIG, Permission, Role } from '../lib/appwrite';
import type { Models } from 'appwrite';


interface AuthProps {
  onLoginSuccess: (user: Models.User<Models.Preferences>) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const createInitialProgressDocument = async (userId: string) => {
    try {
        await databases.createDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.userProgressCollectionId,
            userId,
            {
                userId: userId,
                completedLessons: [],
            },
            [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ]
        );
    } catch (err) {
        console.error("Failed to create user progress document:", err);
        setError("Failed to initialize user profile. Please try logging in again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!isLoginMode && password !== confirmPassword) {
        setError('Passwords do not match.');
        setIsLoading(false);
        return;
    }
    
    try {
        if (isLoginMode) {
            // Login Logic
            await account.createEmailPasswordSession(email, password);
        } else {
            // Sign Up Logic
            const newUser = await account.create(ID.unique(), email, password);
            await account.createEmailPasswordSession(email, password);
            await createInitialProgressDocument(newUser.$id);
        }
        
        const user = await account.get();
        onLoginSuccess(user);

    } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
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
