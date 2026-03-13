import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/apply', label: 'Apply Now' },
    { to: '/track', label: 'Track Application' },
    { to: '/admin', label: 'Admin Panel' },
  ];

  return (
    <header className="bg-tdm-dark border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-tdm-red rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-tight">THE DETAILING MAFIA</div>
              <div className="text-gray-400 text-xs tracking-widest">FRANCHISE DIVISION</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
                  location.pathname === link.to
                    ? 'bg-tdm-red text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-300 p-2">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium no-underline ${
                  location.pathname === link.to
                    ? 'bg-tdm-red text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
