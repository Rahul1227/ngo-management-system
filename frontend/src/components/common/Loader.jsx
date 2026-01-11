import { useEffect, useState } from 'react';

const Loader = ({ size = 'md', text = '', showNote = false }) => {
  const [showPopup, setShowPopup] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  useEffect(() => {
    // Show popup after 1 second of loading
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);

    // Cleanup timer when component unmounts
    return () => {
      clearTimeout(timer);
      setShowPopup(false);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`spinner ${sizeClasses[size]}`}></div>
        {text && <p className="text-gray-600 text-sm">{text}</p>}
        
        {showNote && (
          <div className="mt-4 max-w-md text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              ℹ️ Backend is deployed on Render free tier. If you're using the app after some time, 
              the first request may take 30-60 seconds as the server spins up. 
              Subsequent requests will be fast.
            </p>
          </div>
        )}
      </div>

      {/* Center Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPopup(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-heading font-bold text-center text-gray-900 mb-3">
              Please Hold On...
            </h3>

            {/* Message */}
            <div className="text-center space-y-3 mb-6">
              <p className="text-gray-700 leading-relaxed">
                Our backend is deployed on <span className="font-semibold text-orange-600">Render's free tier</span>.
              </p>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                If you're accessing after a period of inactivity, the server is spinning up from sleep mode. 
                This may take <span className="font-semibold text-orange-600">30-60 seconds</span>.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-green-800 font-medium">
                  ✨ Good news: Subsequent requests will be lightning fast!
                </p>
              </div>
            </div>

            {/* Animated Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-pulse" 
                     style={{ 
                       width: '70%',
                       animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                     }}>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Server is waking up...</p>
            </div>

            {/* Loading Dots */}
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="mt-6 w-full btn btn-outline text-sm"
            >
              Got it, I'll wait
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;