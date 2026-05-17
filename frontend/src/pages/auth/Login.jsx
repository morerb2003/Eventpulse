import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, ArrowRight, Loader2, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0); // 0: Login, 1: Email for OTP, 2: OTP & New Password
  const [resetEmail, setResetEmail] = useState("");
  const [otpData, setOtpData] = useState({ otp: "", newPassword: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await login(credentials);
      toast.success("Welcome back!");
      if (data.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { forgotPassword } = await import("../../api/authApi");
      await forgotPassword(resetEmail);
      toast.success("OTP sent to your email!");
      setForgotPasswordStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { resetPassword } = await import("../../api/authApi");
      await resetPassword({ email: resetEmail, otp: otpData.otp, newPassword: otpData.newPassword });
      toast.success("Password reset successfully! You can now log in.");
      setForgotPasswordStep(0);
      setCredentials({ email: resetEmail, password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="card shadow-2xl border-white/5">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mx-auto mb-6">
              <Calendar className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold">
              {forgotPasswordStep === 0 && "Welcome Back"}
              {forgotPasswordStep === 1 && "Reset Password"}
              {forgotPasswordStep === 2 && "Enter OTP"}
            </h1>
            <p className="text-slate-400 mt-2">
              {forgotPasswordStep === 0 && "Sign in to manage your events"}
              {forgotPasswordStep === 1 && "Enter your email to receive an OTP"}
              {forgotPasswordStep === 2 && "Enter the OTP sent to your email"}
            </p>
          </div>

          {forgotPasswordStep === 0 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@company.com"
                    className="input-field pl-12"
                    value={credentials.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  <button type="button" onClick={() => setForgotPasswordStep(1)} className="text-xs text-primary hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    className="input-field pl-12"
                    value={credentials.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : forgotPasswordStep === 1 ? (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="input-field pl-12"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP"}
              </button>
              
              <button
                type="button"
                onClick={() => setForgotPasswordStep(0)}
                className="w-full text-slate-400 text-sm hover:text-white"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">OTP Code</label>
                <input
                  type="text"
                  required
                  placeholder="Enter OTP"
                  className="input-field"
                  value={otpData.otp}
                  onChange={(e) => setOtpData({...otpData, otp: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input-field"
                  value={otpData.newPassword}
                  onChange={(e) => setOtpData({...otpData, newPassword: e.target.value})}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
              </button>
              
              <button
                type="button"
                onClick={() => setForgotPasswordStep(0)}
                className="w-full text-slate-400 text-sm hover:text-white"
              >
                Cancel
              </button>
            </form>
          )}

          {forgotPasswordStep === 0 && (
            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-slate-400">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  Create one now
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
