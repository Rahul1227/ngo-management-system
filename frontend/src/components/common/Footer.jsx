import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto container-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/assets/images/logo.png" 
                alt="Aarambh Logo" 
                className="h-10 w-auto"
              />
              <div>
                <h3 className="text-xl font-heading font-bold text-white">Aarambh</h3>
                <p className="text-sm text-gray-400">An NSS Initiative</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Supporting social causes through transparent donation management. 
              Every contribution makes a difference.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm hover:text-primary-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm hover:text-primary-400 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-primary-400 mr-2">📧</span>
                <span>nss@iitr.ac.in</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-400 mr-2">📍</span>
                <span>IIT Roorkee, Uttarakhand</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {currentYear} Aarambh - NSS IIT Roorkee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;