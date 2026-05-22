import { useState, useEffect, useCallback } from "react";
import { getUserFeedback } from "../../api/feedbackApi";
import { useAuth } from "../../context/AuthContext";
import { MessageSquare, Star, Calendar, ArrowRight, User as UserIcon, Mail, Award, Download, Settings, Bell, Lock, ChevronRight, TrendingUp } from "lucide-react";
import { getUserBookings, downloadCertificate, emailCertificate } from "../../api/bookingApi";
import { TableSkeleton } from "../../components/common/Loader";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const UserDashboard = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feedback"); // feedback, bookings
  const [emailingId, setEmailingId] = useState(null);

  const handleEmailCertificate = async (eventId) => {
    setEmailingId(eventId);
    const toastId = toast.loading("Emailing your certificate...");
    try {
      await emailCertificate(eventId);
      toast.success("Certificate sent to your inbox!", { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send email", { id: toastId });
    } finally {
      setEmailingId(null);
    }
  };

   const fetchData = useCallback(async () => {
     setLoading(true);
     try {
       const [fbData, bookingData] = await Promise.all([
         getUserFeedback(user.id),
         getUserBookings(user.id)
       ]);
       setFeedbacks(fbData);
       setBookings(bookingData);
     } catch {
       toast.error("Failed to load your activity");
     } finally {
       setLoading(false);
     }
   }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
    window.scrollTo(0, 0);
  }, [user, fetchData]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Profile Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card text-center p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
            <div className="w-28 h-28 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-4 border-white/5 relative group">
              <UserIcon className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-slate-900 rounded-full" />
            </div>
            <h2 className="text-2xl font-black text-white leading-tight">{user?.firstName} {user?.lastName}</h2>
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mt-2 mb-8 font-bold">
              <Mail className="w-4 h-4" /> {user?.email}
            </div>
            
            <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-black text-white tracking-tighter">{feedbacks.length}</div>
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Feedbacks</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white tracking-tighter">{bookings.length}</div>
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Bookings</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h3 className="font-black text-white uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
               <Settings className="w-4 h-4 text-slate-500" /> Account Settings
            </h3>
            <div className="space-y-1">
              <SettingButton icon={<UserIcon className="w-4 h-4" />} label="Profile Details" />
              <SettingButton icon={<Bell className="w-4 h-4" />} label="Notifications" />
              <SettingButton icon={<Lock className="w-4 h-4" />} label="Security" />
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card min-h-[600px] flex flex-col"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
              <div className="flex bg-white/5 p-1.5 rounded-2xl gap-1">
                <TabButton 
                  active={activeTab === 'feedback'} 
                  onClick={() => setActiveTab("feedback")}
                  label="Feedback Activity"
                />
                <TabButton 
                  active={activeTab === 'bookings'} 
                  onClick={() => setActiveTab("bookings")}
                  label="My Certificates"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Real-time History
              </div>
            </div>

            <div className="flex-grow">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <TableSkeleton rows={5} />
                  </motion.div>
                ) : activeTab === 'feedback' ? (
                  <motion.div 
                    key="feedback"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {feedbacks.length > 0 ? (
                      feedbacks.map((fb) => (
                        <div key={fb.id} className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-all" />
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-primary text-xl font-black shadow-lg">
                                {fb.rating}
                              </div>
                              <div>
                                <div className="font-black text-lg flex items-center gap-2 text-white">
                                  Event #{fb.eventId}
                                  {fb.sentiment === 'POSITIVE' && <span className="badge bg-emerald-500/20 text-emerald-500 font-black">Success</span>}
                                  {fb.sentiment === 'NEGATIVE' && <span className="badge bg-accent/20 text-accent font-black">Issue</span>}
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-bold">
                                  <Calendar className="w-3.5 h-3.5" /> {new Date(fb.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < fb.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-800'}`} />
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-slate-400 text-lg leading-relaxed italic font-medium">
                            "{fb.comments}"
                          </p>

                          <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                            <button className="text-xs text-primary font-black uppercase tracking-widest flex items-center gap-2 group/btn">
                              Event Details <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyState 
                        icon={<MessageSquare className="w-16 h-16 text-slate-800" />} 
                        title="Voice your thoughts" 
                        description="You haven't shared any feedback yet. Your insights help organizers create better experiences." 
                      />
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="bookings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {bookings.length > 0 ? (
                      bookings.map((booking) => (
                        <div key={booking.id} className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all flex flex-col md:flex-row items-center justify-between gap-8 group relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all" />
                          <div className="flex items-center gap-8 w-full md:w-auto">
                            <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner group-hover:scale-110 transition-transform duration-500">
                              <Award className="w-10 h-10" />
                            </div>
                            <div>
                              <div className="text-[10px] text-emerald-500 uppercase font-black tracking-[0.2em] mb-2">Certificate Earned</div>
                              <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors">{booking.event.title}</h3>
                              <div className="flex flex-wrap items-center gap-4 mt-3">
                                <span className="badge bg-white/10 text-slate-300">
                                  Seat {booking.seat.rowLabel}{booking.seat.seatNumber}
                                </span>
                                <span className="text-slate-500 text-sm font-bold">•</span>
                                <span className="text-slate-500 text-sm font-bold flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5" /> {new Date(booking.bookingDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <button 
                              onClick={() => downloadCertificate(booking.event.id)}
                              className="btn-primary py-4 px-8 w-full sm:w-auto shadow-2xl shadow-primary/20 flex items-center justify-center gap-2"
                            >
                              <Download className="w-4 h-4" /> Download PDF
                            </button>
                            <button 
                              onClick={() => handleEmailCertificate(booking.event.id)}
                              disabled={emailingId === booking.event.id}
                              className="btn-outline py-4 px-8 w-full sm:w-auto flex items-center justify-center gap-2 border-white/10 hover:bg-white/5 disabled:opacity-50 text-slate-300 hover:text-white"
                            >
                              <Mail className="w-4 h-4" /> Email PDF
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyState 
                        icon={<Award className="w-16 h-16 text-slate-800" />} 
                        title="Achieve Greatness" 
                        description="Complete events to earn official participation certificates. Your journey starts with the first ticket." 
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const SettingButton = ({ icon, label }) => (
  <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group">
    <div className="flex items-center gap-4 font-bold text-sm">
      <span className="p-2 rounded-xl bg-white/5 group-hover:bg-primary/10 transition-colors">{icon}</span>
      {label}
    </div>
    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
  </button>
);

const TabButton = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`px-8 py-3.5 rounded-xl text-sm font-black transition-all duration-300 ${
      active 
        ? "bg-primary text-white shadow-xl shadow-primary/20" 
        : "text-slate-500 hover:text-slate-300"
    }`}
  >
    {label}
  </button>
);

const EmptyState = ({ icon, title, description }) => (
  <div className="text-center py-32 bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-white/5">
    <div className="mb-8 flex justify-center">{icon}</div>
    <h3 className="text-2xl font-black text-slate-300 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 text-lg font-medium max-w-sm mx-auto leading-relaxed">{description}</p>
    <button className="mt-10 btn-outline py-3 px-8 text-sm">Explore events</button>
  </div>
);

export default UserDashboard;
