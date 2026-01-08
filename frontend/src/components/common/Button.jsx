const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClass = 'btn';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`
        ${baseClass} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${(loading || disabled) ? 'btn-disabled' : ''} 
        ${className}
      `}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <div className="spinner w-5 h-5 mr-2"></div>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;