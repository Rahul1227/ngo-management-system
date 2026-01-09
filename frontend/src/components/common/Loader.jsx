const Loader = ({ size = 'md', text = '', showNote = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
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
  );
};

export default Loader;