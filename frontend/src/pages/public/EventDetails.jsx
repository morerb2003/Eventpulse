import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../../api/eventApi";
import { Calendar, MapPin, Users, Clock, MessageSquare, ArrowLeft, Share2, ShieldCheck, Loader2, Ticket, Banknote, Sparkles, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import BookingModal from "../../components/booking/BookingModal";
import { BASE_URL } from "../../utils/constants";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    fetchEvent();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchEvent = async () => {
    try {
      const data = await getEventById(id);
      setEvent(data);
    } catch (error) {
      toast.error("Failed to load event details");
      navigate("/events");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <p className="text-slate-400">Loading experience details...</p>
    </div>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: 'long',
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="relative">
      {/* Hero Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden -z-10">
        {event.posterUrl ? (
          <div className="relative w-full h-full">
            <img 
              src={`${BASE_URL}${event.posterUrl}`} 
              alt=""
              className="w-full h-full object-cover blur-2xl opacity-20 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-transparent" />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/events")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="badge bg-primary/20 text-primary px-4 py-1.5 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
                <span className="badge bg-white/5 text-slate-400 px-4 py-1.5 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" /> {event.category || "General"}
                </span>
                <span className="badge bg-amber-400/10 text-amber-400 px-4 py-1.5 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Featured
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight text-white">
                {event.title}
              </h1>
              
              {event.posterUrl && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl shadow-black/50 border border-white/5 group"
                >
                  <img 
                    src={`${BASE_URL}${event.posterUrl}`} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <p className="text-white font-medium italic">"{event.title}" - Live Experience</p>
                  </div>
                </motion.div>
              )}

              <div className="card border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/50" />
                <h3 className="text-2xl font-black mb-6 text-white flex items-center gap-3">
                   About the Event
                </h3>
                <div className="space-y-4 text-slate-300 leading-relaxed text-lg font-medium">
                  {event.description?.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  )) || "No description available for this event. Join us for an unforgettable experience."}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="card bg-surface/60 border-white/10 sticky top-24 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />
              
              <div className="space-y-6 mb-10">
                <InfoItem icon={<Calendar className="text-primary" />} label="Date" value={formatDate(event.date)} />
                <InfoItem icon={<Clock className="text-emerald-400" />} label="Time" value={`${event.startTime || "09:00 AM"} onwards`} />
                <InfoItem icon={<MapPin className="text-orange-400" />} label="Location" value={event.location || "Online / Remote"} />
                <InfoItem icon={<Users className="text-purple-400" />} label="Capacity" value={`${event.capacity || "Unlimited"} spots available`} />
                
                <div className="pt-6 border-t border-white/5">
                  <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Entry Fee</div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-black text-white">₹{event.price || 499}</div>
                    <div className="text-sm text-slate-500 line-through">₹{Math.round((event.price || 499) * 1.5)}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => {
                    if (!user) {
                      toast.error("Please login to book tickets");
                      navigate("/login");
                      return;
                    }
                    setIsBookingModalOpen(true);
                  }}
                  className="btn-primary w-full py-4 text-lg"
                >
                  <Ticket className="w-5 h-5" />
                  Secure My Spot
                </button>
                <button 
                  onClick={() => navigate(`/feedback/submit/${event.id}`)}
                  className="btn-outline w-full py-4"
                >
                  <MessageSquare className="w-5 h-5" />
                  Share Feedback
                </button>
                <div className="pt-4 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest px-2">
                   <span>Non-refundable</span>
                   <span className="text-primary">Free Cancellation*</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <AnimatePresence>
          {isBookingModalOpen && (
            <BookingModal 
              event={event} 
              user={user} 
              isOpen={isBookingModalOpen} 
              onClose={() => setIsBookingModalOpen(false)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 group">
    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <div>
      <div className="text-xs text-slate-500 font-black uppercase tracking-widest mb-0.5">{label}</div>
      <div className="font-bold text-slate-200">{value}</div>
    </div>
  </div>
);

export default EventDetails;
