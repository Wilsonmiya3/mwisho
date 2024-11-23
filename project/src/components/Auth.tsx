import React, { useState } from 'react';
import { Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { saveUser, findUserByEmail, validateCredentials } from '../utils/auth';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = validateCredentials(email, password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        onLogin();
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (!name || !email || !password || !phone) {
        setError('All fields are required');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      if (!/^0[17]\d{8}$/.test(phone)) {
        setError('Please enter a valid Safaricom or Airtel number');
        return;
      }

      const existingUser = findUserByEmail(email);
      if (existingUser) {
        setError('An account with this email already exists');
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        phone
      };

      saveUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.removeItem('paymentVerified'); // Reset payment verification for new users
      onLogin();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 bg-gray-900">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-md flex items-center gap-2 text-red-200">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Name</label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">Phone (M-Pesa)</label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
                      placeholder="07XXXXXXXX"
                      pattern="^0[17]\d{8}$"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-400">Enter your Safaricom/Airtel number for payments</p>
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="w-full text-center text-sm text-purple-400 hover:text-purple-300"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;