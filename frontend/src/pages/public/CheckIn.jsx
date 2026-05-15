import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, Calendar, MapPin, User, Mail, ClipboardCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import toast from "react-hot-toast";

const CheckIn = () => {
    const { token } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [status, setStatus] = useState("loading"); // loading, identify, success, error
    const [event, setEvent] = useState(null);
    const [guestEmail, setGuestEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // First find the event by token
        // Since we don't have a direct getByToken endpoint, we'll need to update the backend 
        // or just try to check-in directly if we have a user.
        // Actually, let's assume we need to identify the event first for UI purposes.
        // For simplicity in this demo, I'll just attempt check-in if user is logged in.
        if (user) {
            handleCheckIn(user.id, null);
        } else {
            setStatus("identify");
        }
    }, [token, user]);

    const handleCheckIn = async (userId, email) => {
        setStatus("loading");
        try {
            const response = await api.post(`/api/attendance/checkin-by-token`, null, {
                params: {
                    token: token,
                    userId: userId,
                    guestEmail: email
                }
            });
            
            setEvent(response.data);
            setStatus("success");
            toast.success("Check-in successful!");
        } catch (error) {
            setStatus("error");
            setErrorMessage(error.response?.data || "Check-in failed. Please try again.");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card max-w-md w-full bg-slate-900 border-white/10 overflow-hidden"
            >
                <div className="h-2 bg-primary"></div>
                
                <div className="p-8 text-center">
                    <AnimatePresence mode="wait">
                        {status === "loading" && (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="py-12"
                            >
                                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                                <h2 className="text-xl font-bold">Processing Check-In...</h2>
                                <p className="text-slate-400 mt-2">Validating your secure token</p>
                            </motion.div>
                        )}

                        {status === "identify" && (
                            <motion.div 
                                key="identify"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <ClipboardCheck className="text-primary w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold">Welcome to the Event</h2>
                                <p className="text-slate-400">Please provide your email to check in as a guest, or sign in to your account.</p>
                                
                                <div className="space-y-4 pt-4">
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                        <input 
                                            type="email"
                                            placeholder="Your Email Address"
                                            className="input-field pl-10"
                                            value={guestEmail}
                                            onChange={(e) => setGuestEmail(e.target.value)}
                                        />
                                    </div>
                                    <button 
                                        onClick={() => handleCheckIn(null, guestEmail)}
                                        disabled={!guestEmail}
                                        className="btn-primary w-full py-3 disabled:opacity-50"
                                    >
                                        Check In as Guest
                                    </button>
                                    <div className="flex items-center gap-4 py-2">
                                        <div className="h-[1px] flex-1 bg-white/5"></div>
                                        <span className="text-xs text-slate-500 font-bold uppercase">OR</span>
                                        <div className="h-[1px] flex-1 bg-white/5"></div>
                                    </div>
                                    <button 
                                        onClick={() => navigate("/login")}
                                        className="btn-outline w-full py-3"
                                    >
                                        Sign In to Account
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {status === "success" && (
                            <motion.div 
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="py-8"
                            >
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="text-emerald-500 w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-black mb-2">Verified!</h2>
                                <p className="text-slate-400 mb-8">You are successfully checked in.</p>
                                
                                {event && (
                                    <div className="bg-white/5 rounded-2xl p-6 text-left border border-white/5 mb-8">
                                        <h3 className="font-bold text-lg mb-4 text-primary">{event.eventTitle}</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Calendar className="w-4 h-4 text-slate-500" />
                                                {new Date(event.checkedInAt).toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <User className="w-4 h-4 text-slate-500" />
                                                {event.userName}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={() => navigate("/events")}
                                    className="btn-primary w-full py-3"
                                >
                                    Browse More Events
                                </button>
                            </motion.div>
                        )}

                        {status === "error" && (
                            <motion.div 
                                key="error"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="py-8"
                            >
                                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle className="text-accent w-10 h-10" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Check-In Failed</h2>
                                <p className="text-slate-400 mb-8">{errorMessage}</p>
                                
                                <button 
                                    onClick={() => setStatus("identify")}
                                    className="btn-outline w-full py-3"
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default CheckIn;
