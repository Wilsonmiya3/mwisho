import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import MpesaVerification from './components/MpesaVerification';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [showMpesaVerification, setShowMpesaVerification] = React.useState(false);
  const [isPaymentVerified, setIsPaymentVerified] = React.useState(false);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    const paymentVerified = localStorage.getItem('paymentVerified');
    if (user) {
      if (paymentVerified === 'true') {
        setIsAuthenticated(true);
        setIsPaymentVerified(true);
      } else {
        setShowMpesaVerification(true);
      }
    }
  }, []);

  const handleLogin = () => {
    const paymentVerified = localStorage.getItem('paymentVerified');
    if (paymentVerified === 'true') {
      setIsAuthenticated(true);
      setIsPaymentVerified(true);
    } else {
      setShowMpesaVerification(true);
    }
  };

  const handlePaymentVerification = () => {
    setIsPaymentVerified(true);
    setIsAuthenticated(true);
    setShowMpesaVerification(false);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar isAuthenticated={isAuthenticated} />
        {showMpesaVerification && (
          <MpesaVerification
            onVerificationComplete={handlePaymentVerification}
            onClose={() => {
              localStorage.removeItem('currentUser');
              setShowMpesaVerification(false);
              setIsAuthenticated(false);
            }}
          />
        )}
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Auth onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated && isPaymentVerified ? 
                <Dashboard /> : 
                <Navigate to="/" replace />
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;