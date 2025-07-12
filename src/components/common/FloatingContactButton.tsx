import { useState } from 'react';
import { MessageCircle, Phone, X, Send } from 'lucide-react';

export default function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (showChat) {
      setShowChat(false);
    }
  };

  const openChat = () => {
    setShowChat(true);
    setIsOpen(false);
  };

  const closeChat = () => {
    setShowChat(false);
  };

  return (
    <>
      {/* Chat Window */}
      {showChat && (
        <div className="fixed bottom-24 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Chat Header */}
          <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Live Chat Support</h3>
                <p className="text-sm opacity-90">Online now</p>
              </div>
            </div>
            <button
              onClick={closeChat}
              className="text-white/80 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 h-64 overflow-y-auto">
            <div className="space-y-4">
              {/* Agent Message */}
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs font-medium">PR</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-gray-800">
                    Hello! 👋 Welcome to Philippines Rental. How can I help you today?
                  </p>
                  <span className="text-xs text-gray-500 mt-1 block">Just now</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">Quick actions:</p>
                <div className="grid grid-cols-1 gap-2">
                  <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm p-2 rounded-lg transition-colors">
                    🏠 I want to rent a property
                  </button>
                  <button className="bg-green-50 hover:bg-green-100 text-green-700 text-sm p-2 rounded-lg transition-colors">
                    📝 I want to list my property
                  </button>
                  <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm p-2 rounded-lg transition-colors">
                    ❓ I have questions
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button className="bg-primary text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Average response time: 2 minutes
            </p>
          </div>
        </div>
      )}

      {/* Floating Menu */}
      <div className="fixed bottom-4 right-4 z-40">
        {/* Menu Options */}
        {isOpen && (
          <div className="mb-4 space-y-2">
            {/* Chat Option */}
            <button
              onClick={openChat}
              className="flex items-center bg-white shadow-lg rounded-full px-4 py-3 hover:shadow-xl transition-all duration-200 border border-gray-200"
            >
              <MessageCircle className="h-5 w-5 text-primary mr-3" />
              <span className="text-sm font-medium text-gray-700">Live Chat</span>
            </button>

            {/* Phone Option */}
            <button
              onClick={() => window.open('tel:+639123456789', '_self')}
              className="flex items-center bg-white shadow-lg rounded-full px-4 py-3 hover:shadow-xl transition-all duration-200 border border-gray-200"
            >
              <Phone className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-sm font-medium text-gray-700">Call Us</span>
            </button>

            {/* WhatsApp Option */}
            <button
              onClick={() => window.open('https://wa.me/639123456789', '_blank')}
              className="flex items-center bg-white shadow-lg rounded-full px-4 py-3 hover:shadow-xl transition-all duration-200 border border-gray-200"
            >
              <span className="text-green-500 mr-3 text-lg">📱</span>
              <span className="text-sm font-medium text-gray-700">WhatsApp</span>
            </button>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={toggleMenu}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
            isOpen
              ? 'bg-gray-600 hover:bg-gray-700'
              : 'bg-primary hover:bg-blue-700'
          }`}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </button>

        {/* Notification Dot */}
        {!isOpen && !showChat && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}