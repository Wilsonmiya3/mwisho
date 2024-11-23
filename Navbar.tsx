import React from 'react';
import { Coins, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const currentUser = isAuthenticated ? JSON.parse(localStorage.getItem('currentUser') || '{}') : null;

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Coins className="h-8 w-8 text-yellow-300" />
              <span className="text-2xl font-bold text-white">W-Squared Agency</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-white">Welcome, {currentUser?.name}!</span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <span className="text-white">Welcome to W-Squared Agency</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;