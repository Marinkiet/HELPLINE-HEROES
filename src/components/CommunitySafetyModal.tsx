import React from 'react';
import { X, Shield, AlertTriangle, Phone, MessageSquare, Eye, Lock, FileText, Wifi } from 'lucide-react';

interface CommunitySafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommunitySafetyModal({ isOpen, onClose }: CommunitySafetyModalProps) {
  if (!isOpen) return null;

  const handleWhatsAppReport = () => {
    const message = encodeURIComponent("I would like to report suspicious behavior. Please provide me with the reporting guidelines.");
    window.open(`https://wa.me/27123456789?text=${message}`, '_blank');
  };

  const handleSMSReport = () => {
    const message = encodeURIComponent("REPORT: Suspicious behavior");
    window.open(`sms:32312?body=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 rounded-full p-3">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-black text-gray-800">Community Safety Network</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Close community safety"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Introduction */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-xl">
            <h3 className="text-xl font-bold text-blue-800 mb-3">Building a Safer Community Together</h3>
            <p className="text-blue-700 leading-relaxed">
              Our community-based reporting system empowers adults and teens to create a networked community focused on safety and vigilance. 
              Report suspicious behavior anonymously and help protect children in your area.
            </p>
          </div>

          {/* Reporting Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Anonymous Reporting */}
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <Eye className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-green-800">Anonymous Reporting</h3>
              </div>
              <p className="text-green-700 mb-4">
                Report suspicious behavior without revealing your identity. Your privacy and safety are protected.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppReport}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Report via WhatsApp</span>
                </button>
                <button
                  onClick={handleSMSReport}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Phone className="w-5 h-5" />
                  <span>Report via SMS</span>
                </button>
              </div>
            </div>

            {/* Amber Alerts */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-600 mr-3" />
                <h3 className="text-xl font-bold text-amber-800">Amber Alerts</h3>
              </div>
              <p className="text-amber-700 mb-4">
                Receive real-time notifications about missing persons in your area. All alerts are verified by local authorities.
              </p>
              <div className="bg-amber-100 p-4 rounded-xl">
                <h4 className="font-bold text-amber-800 mb-2">How it works:</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Police file and verify missing persons report</li>
                  <li>• System triggers alert to registered community members</li>
                  <li>• Notifications sent via WhatsApp/SMS</li>
                  <li>• Full compliance with legal protocols</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center mb-4">
              <Lock className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-xl font-bold text-purple-800">Privacy & Data Security</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-purple-800 mb-2">POPIA Compliance</h4>
                <p className="text-purple-700 text-sm mb-4">
                  Our platform fully complies with the Protection of Personal Information Act (POPIA) to ensure your sensitive personal information remains protected.
                </p>
                <h4 className="font-bold text-purple-800 mb-2">Anonymity Protection</h4>
                <p className="text-purple-700 text-sm">
                  Report suspicious behavior without revealing your identity. Whistleblower protection is guaranteed.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-purple-800 mb-2">Code of Conduct</h4>
                <p className="text-purple-700 text-sm mb-4">
                  Clear guidelines outline acceptable reporting behavior. Malicious reporting will not be tolerated.
                </p>
                <h4 className="font-bold text-purple-800 mb-2">Legal Compliance</h4>
                <p className="text-purple-700 text-sm">
                  All Amber Alerts are linked to official police reports and verified by local authorities.
                </p>
              </div>
            </div>
          </div>

          {/* Zero-Rated Access */}
          <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
            <div className="flex items-center mb-4">
              <Wifi className="w-8 h-8 text-cyan-600 mr-3" />
              <h3 className="text-xl font-bold text-cyan-800">Zero-Rated Access (Telkom Users)</h3>
            </div>
            <p className="text-cyan-700 mb-4">
              To ensure every child can access this essential resource, we provide zero-rated access for Telkom users:
            </p>
            <div className="bg-cyan-100 p-4 rounded-xl">
              <ul className="text-cyan-700 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                  <span>No data charges for accessing the app</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                  <span>Free reporting of suspicious behavior</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                  <span>Free Amber Alert notifications via SMS</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                  <span>Complete access without any data costs</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 text-gray-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-800">Reporting Guidelines</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-green-800 mb-2">✅ What to Report:</h4>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Suspicious behavior around children</li>
                  <li>• Adults approaching children inappropriately</li>
                  <li>• Unusual activity near schools or playgrounds</li>
                  <li>• Concerning online behavior targeting minors</li>
                  <li>• Any situation that makes you feel unsafe</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-800 mb-2">❌ What NOT to Report:</h4>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Personal disputes or disagreements</li>
                  <li>• Normal parenting or discipline</li>
                  <li>• Cultural or religious practices</li>
                  <li>• False accusations or rumors</li>
                  <li>• Non-emergency situations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
            <div className="flex items-center mb-4">
              <Phone className="w-8 h-8 text-red-600 mr-3" />
              <h3 className="text-xl font-bold text-red-800">Emergency Contacts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg mb-2">
                  Emergency: 911
                </div>
                <p className="text-red-700 text-sm">Life-threatening situations</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg mb-2">
                  Childline: 116
                </div>
                <p className="text-blue-700 text-sm">Child abuse reporting</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg mb-2">
                  Crisis Text: 741741
                </div>
                <p className="text-purple-700 text-sm">Text HOME for help</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-6 rounded-b-3xl">
          <p className="text-center text-gray-600 text-sm">
            Together, we can create a safer community for all children. Your vigilance and care make a difference.
          </p>
        </div>
      </div>
    </div>
  );
}