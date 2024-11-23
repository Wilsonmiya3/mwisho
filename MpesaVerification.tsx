import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface MpesaVerificationProps {
  onVerificationComplete: () => void;
  onClose: () => void;
}

const MpesaVerification: React.FC<MpesaVerificationProps> = ({ onVerificationComplete, onClose }) => {
  const [mpesaCode, setMpesaCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    // Validate M-Pesa code format (typically starts with PK or NK followed by numbers)
    const mpesaCodeRegex = /^[PNK][A-Z][0-9A-Z]{8}$/;
    if (!mpesaCodeRegex.test(mpesaCode)) {
      setError('Please enter a valid M-Pesa confirmation code');
      setIsVerifying(false);
      return;
    }

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo purposes, accept any valid format
    // In production, this would verify against actual M-Pesa API
    if (mpesaCodeRegex.test(mpesaCode)) {
      localStorage.setItem('paymentVerified', 'true');
      onVerificationComplete();
    } else {
      setError('Invalid M-Pesa confirmation code. Please try again.');
    }
    setIsVerifying(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4 p-6 border border-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Payment Required</h2>
          <p className="text-gray-300">To complete your registration, please pay KES 500</p>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Payment Instructions:</h3>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Go to M-Pesa menu</li>
            <li>Select Pay Bill</li>
            <li>Enter Business Number: <span className="font-mono font-bold text-purple-400">247247</span></li>
            <li>Enter Account Number: <span className="font-mono font-bold text-purple-400">0930185656575</span></li>
            <li>Enter Amount: <span className="font-bold text-purple-400">KES 500</span></li>
            <li>Enter your M-Pesa PIN</li>
            <li>Wait for confirmation SMS</li>
          </ol>
        </div>

        <form onSubmit={handleVerification} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Enter M-Pesa Confirmation Code
            </label>
            <input
              type="text"
              value={mpesaCode}
              onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
              placeholder="e.g., PK7XXXXX123"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
              maxLength={10}
            />
            {error && (
              <div className="mt-2 flex items-center text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying || mpesaCode.length < 10}
            className={`w-full py-3 px-4 rounded-md text-white font-medium flex items-center justify-center space-x-2
              ${isVerifying || mpesaCode.length < 10
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600'
              }`}
          >
            {isVerifying ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Verify Payment</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-400 text-center">
          Having issues? Contact support at support@w-squared.com
        </p>
      </div>
    </div>
  );
};

export default MpesaVerification;