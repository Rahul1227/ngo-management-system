import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Hero = () => {
    const {user} = useAuth();
  return (
    <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative container mx-auto container-padding py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/assets/images/logo.png" 
              alt="Aarambh Logo" 
              className="h-32 md:h-40 w-auto drop-shadow-2xl animate-slide-down"
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 animate-slide-up">
            Aarambh
          </h1>
          
          {/* Hindi Tagline */}
          <p className="text-2xl md:text-3xl lg:text-4xl font-medium mb-3 text-primary-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            सेवा की नई शुरुआत
          </p>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            An NSS Initiative
          </p>

          {/* Description */}
          <p className="text-base md:text-lg text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Join us in making a difference. Register to support meaningful causes and contribute to positive change in our community through transparent and ethical donations.
          </p>

          {/* CTA Buttons */}
          {!user && (
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up"
          style={{ animationDelay: '0.4s' }}
        >
          <Link
            to="/register"
            className="btn bg-white text-primary-600 hover:bg-gray-100 hover:scale-105 transform transition-all shadow-lg w-full sm:w-auto"
          >
            Register Now
          </Link>

          <Link
            to="/login"
            className="btn border-2 border-white text-white hover:bg-white/10 hover:scale-105 transform transition-all w-full sm:w-auto"
          >
            Login to Donate
          </Link>
        </div>
      )}

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
              <div className="text-sm md:text-base text-white/80">Registered Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">₹50L+</div>
              <div className="text-sm md:text-base text-white/80">Donations Raised</div>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-3xl md:text-4xl font-bold mb-2">100%</div>
              <div className="text-sm md:text-base text-white/80">Transparent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;