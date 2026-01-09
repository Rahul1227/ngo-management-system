import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/assets/images/logo.png"
              alt="Aarambh Logo"
              className="h-22 w-auto"
            />

            <div className="flex flex-col leading-tight">
              <span className="font-heading font-bold text-primary-600 text-3xl">
                Aarambh
              </span>

              <span className="font-[var(--font-hindi)] text-primary-500 text-[15px]">
                सेवा की नई शुरुआत
              </span>

              <span className="text-gray-500 text-[9px]">
                An NSS Initiative
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to={
                    user.role === "admin"
                      ? "/admin/dashboard"
                      : "/user/dashboard"
                  }
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary-50">
                    <div className="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>

                    <div className="leading-tight">
                      <p className="text-xs text-gray-500">Welcome</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {user.fullName}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="btn btn-outline text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-down">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2"
              >
                Home
              </Link>

              {user ? (
                <>
                  <Link
                    to={
                      user.role === "admin"
                        ? "/admin/dashboard"
                        : "/user/dashboard"
                    }
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2"
                  >
                    Dashboard
                  </Link>

                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <div className="flex items-center gap-3 bg-primary-50 rounded-xl p-3">
                      <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>

                      <div className="leading-tight">
                        <p className="text-xs text-gray-500">Logged in as</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.fullName}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="btn btn-outline w-full"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn btn-primary w-full"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
