import React, { useState, useEffect } from 'react';
import { X, Phone, Shield, AlertTriangle, Ambulance, Car } from 'lucide-react';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export function PhoneVerificationModal({ isOpen, onClose, onVerified }: PhoneVerificationModalProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!isOpen) return null;

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setCountdown(60);
      // In real implementation, this would call your SMS service
      console.log(`Sending OTP to ${phoneNumber}`);
    }, 2000);
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      if (otp === '123456') { // Demo OTP for testing
        onVerified();
      } else {
        setError('Invalid OTP. Please try again.');
      }
    }, 1500);
  };

  const handleEmergencyCall = (number: string, service: string) => {
    const confirmed = window.confirm(
      `⚠️ EMERGENCY CALL WARNING ⚠️\n\n` +
      `You are about to call ${service} (${number}).\n\n` +
      `This should ONLY be used for real emergencies where:\n` +
      `• Someone's life is in immediate danger\n` +
      `• A crime is happening right now\n` +
      `• Medical emergency requiring immediate attention\n\n` +
      `False emergency calls are illegal and can result in:\n` +
      `• Criminal charges\n` +
      `• Heavy fines\n` +
      `• Blocking emergency services for real emergencies\n\n` +
      `Are you sure this is a real emergency?`
    );
    
    if (confirmed) {
      window.location.href = `tel:${number}`;
    }
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      setCountdown(60);
      // Resend OTP logic here
      console.log(`Resending OTP to ${phoneNumber}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-orange-500 text-white p-6 rounded-t-3xl relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-black">Adult Report</h2>
                <p className="text-orange-100 text-sm font-semibold">For Grown-ups Only</p>
                <p className="text-orange-100 text-sm font-semibold">This is for reporting suspicious behavior (e.g Stranger giving out candy in the park, then add details about this)</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 p-2 hover:bg-orange-600 rounded-full transition-colors duration-200"
              aria-label="Close verification"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Child Warning Message */}
          <div className="mt-4 bg-orange-600 rounded-xl p-4 border-2 border-orange-300">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">👨‍👩‍👧‍👦</div>
              <div>
                <h3 className="text-lg font-black text-white mb-1">Hey Kids! 👋</h3>
                <p className="text-orange-100 text-sm leading-relaxed">
                  This special button is only for grown-ups like your parents, teachers, or other adults. 
                  If you're a child, please ask a grown-up to help you with this part! 
                  You can continue playing the safety games instead or click on the big red button if you want to call for help. 🎮
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Emergency Contacts - Always Visible */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
              <h3 className="text-lg font-bold text-red-800">Emergency Contacts</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleEmergencyCall('112', 'Emergency Services')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>112 - Emergency Services</span>
              </button>
              <button
                onClick={() => handleEmergencyCall('10177', 'Ambulance')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Ambulance className="w-5 h-5" />
                <span>10177 - Ambulance</span>
              </button>
              <button
                onClick={() => handleEmergencyCall('10111', 'Police')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Car className="w-5 h-5" />
                <span>10111 - Police</span>
              </button>
              <button
                onClick={() => handleEmergencyCall('116', 'Childline')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Shield className="w-5 h-5" />
                <span>116 - Childline</span>
              </button>
            </div>
          </div>

          {step === 'phone' ? (
            <>
              {/* Phone Number Step */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Verify Your Identity</h3>
                <p className="text-gray-600">
                  To protect children and prevent misuse, we need to verify you're an adult.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg"
                  maxLength={15}
                />
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200"
              >
                {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
              </button>
            </>
          ) : (
            <>
              {/* OTP Step */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Enter Verification Code</h3>
                <p className="text-gray-600">
                  We've sent a 6-digit code to {phoneNumber}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg text-center tracking-widest"
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={handleVerifyOTP}
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 mb-4"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>

              <div className="text-center">
                <button
                  onClick={handleResendOTP}
                  disabled={countdown > 0}
                  className="text-orange-600 hover:text-orange-800 font-semibold disabled:text-gray-400"
                >
                  {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setStep('phone')}
                  className="text-gray-600 hover:text-gray-800 font-semibold"
                >
                  Change phone number
                </button>
              </div>
            </>
          )}

          {/* Demo Note */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Use OTP code <strong>123456</strong> to verify.
              In production, this would send a real SMS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}