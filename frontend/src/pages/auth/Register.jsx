import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { register as registerApi } from "../../api/authApi";
import { User, Mail, Lock, ArrowRight, Loader2, Calendar, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "USER"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await registerApi(formData);
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="card shadow-2xl border-white/5 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="hidden md:flex flex-col justify-between p-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border border-white/5">
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="text-primary w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Join our community</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Start managing your events and gathering meaningful feedback today. Join thousands of organizers who trust EventPulse.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Real-time insights
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                Smart feedback tools
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                Secure data management
              </div>
            </div>
          </div>

          <div>
            <div className="md:hidden text-center mb-8">
              <h1 className="text-3xl font-bold">Create Account</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className="input-field py-2.5 text-sm"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className="input-field py-2.5 text-sm"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    className="input-field pl-11 py-2.5 text-sm"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    name="password"
                    required
                    className="input-field pl-11 py-2.5 text-sm"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-1">Account Role</label>
                <select
                  name="role"
                  className="input-field py-2.5 text-sm appearance-none"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="USER">Attendee / Feedback Giver</option>
                  <option value="ADMIN">Event Organizer</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 group mt-4 text-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-8">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
