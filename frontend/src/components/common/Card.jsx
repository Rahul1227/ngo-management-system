const Card = ({ children, className = '', hover = true }) => {
  return (
    <div className={`card ${hover ? 'hover:shadow-xl' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;