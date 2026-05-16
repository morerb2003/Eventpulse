import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User, LayoutDashboard, Calendar, Home, Menu, X, ChevronRight } from "lucide-react";
import NotificationPanel from "../notifications/NotificationPanel";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setIsMobileMenuOpen(false), [location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Events", path: "/events", icon: <Calendar className="w-4 h-4" /> },
  ];

  if (user) {
    navLinks.push({ 
      name: "Dashboard", 
      path: isAdmin() ? "/admin/dashboard" : "/user/dashboard", 
      icon: <LayoutDashboard className="w-4 h-4" /> 
    });
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2" : "py-4"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`glass rounded-2xl transition-all duration-300 ${isScrolled ? "shadow-premium" : "border-transparent bg-transparent"}`}>
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transform hover:rotate-12 transition-transform cursor-pointer">
                <Calendar className="text-white w-6 h-6" />
              </div>
              <Link to="/" className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tighter">
                EventPulse
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    location.pathname === link.path 
                      ? "text-primary bg-primary/10" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.icon} {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block">
                    {isAdmin() && <NotificationPanel />}
                  </div>
                  <div className="hidden sm:flex items-center gap-2 pl-2 pr-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                    <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center text-primary text-[10px] font-bold uppercase">
                      {user.firstName[0]}
                    </div>
                    <span className="text-xs font-bold text-slate-200">{user.firstName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 text-slate-400 hover:text-accent hover:bg-accent/10 rounded-xl transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-3">
                  <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white px-4">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary py-2.5 px-5 text-sm">
                    Join EventPulse
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 md:hidden text-slate-300 hover:bg-white/5 rounded-xl transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-4 right-4 mt-2 md:hidden"
          >
            <div className="glass rounded-3xl p-4 shadow-premium border-white/5 overflow-hidden">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 text-slate-300 hover:text-primary transition-all font-bold"
                  >
                    <div className="flex items-center gap-3">
                      {link.icon} {link.name}
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                ))}
                {!user && (
                  <div className="pt-4 grid grid-cols-2 gap-3">
                    <Link to="/login" className="btn-outline py-3 text-sm">Login</Link>
                    <Link to="/register" className="btn-primary py-3 text-sm">Register</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
