'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignupMode, setIsSignupMode] = useState(false);
  
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    let result;
    if (isSignupMode) {
      if (!name.trim()) {
        setError('Name is required for signup');
        setIsLoading(false);
        return;
      }
      result = await signup(name, email, password);
    } else {
      result = await login(email, password);
    }
    
    if (result.success) {
      router.push('/'); // Redirect to main app
    } else {
      setError(result.error || `${isSignupMode ? 'Signup' : 'Login'} failed`);
    }
    
    setIsLoading(false);
  };

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          {/* Company Logo Placeholder */}
          <div className="mx-auto h-50 w-50 flex items-center justify-center mb-6">
            {/* <div className="text-blue-600 text-2xl font-bold">LOGO</div> */}
            <Image
              src="/offd-logo.png"
              alt="Company Logo"
              width={300}
              height={300}
              className="mx-auto"
            />
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isSignupMode ? 'Create your SimplePOS account' : 'Sign in to SimplePOS'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignupMode 
              ? 'Enter your details to create a new account' 
              : 'Enter your email and password to access the system'
            }
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {isSignupMode && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={isSignupMode}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                minLength={6}
              />
              {isSignupMode && (
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 6 characters required
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              } transition duration-150 ease-in-out`}
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading 
                ? (isSignupMode ? 'Creating account...' : 'Signing in...') 
                : (isSignupMode ? 'Create account' : 'Sign in')
              }
            </button>
          </div>
        </form>

        <div className="text-center space-y-4">
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              {isSignupMode ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              type="button"
              onClick={toggleMode}
              className="mt-1 font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isSignupMode ? 'Sign in here' : 'Create an account'}
            </button>
          </div>
          
          <p className="text-xs text-gray-500">
            Secure access to your funeral management system
          </p>
        </div>
      </div>
    </div>
  );
}