import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User, LayoutDashboard, Calendar, Home } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Calendar className="text-white w-6 h-6" />
            </div>
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              EventPulse
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-primary transition-colors">
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link to="/events" className="flex items-center gap-2 text-slate-300 hover:text-primary transition-colors">
              <Calendar className="w-4 h-4" /> Events
            </Link>
            {user && (
              <Link to={isAdmin() ? "/admin/dashboard" : "/user/dashboard"} className="flex items-center gap-2 text-slate-300 hover:text-primary transition-colors">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{user.firstName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
