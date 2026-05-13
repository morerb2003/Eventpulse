import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../../api/eventApi";
import { Calendar, MapPin, Users, Clock, MessageSquare, ArrowLeft, Share2, ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/events")}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Events
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold uppercase mb-6">
              <ShieldCheck className="w-3 h-3" /> Verified Event
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              {event.title}
            </h1>
            
            {event.posterUrl && (
              <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 glass p-2">
                <img 
                  src={`http://localhost:8080${event.posterUrl}`} 
                  alt={event.title}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            )}

            <div className="card prose prose-invert max-w-none">
              <h3 className="text-xl font-bold mb-4 text-white">About this Event</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card bg-primary/5 border-primary/20 sticky top-24"
          >
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Date</div>
                  <div className="font-semibold">{formatDate(event.date)}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Time</div>
                  <div className="font-semibold">{event.startTime || "09:00 AM"} onwards</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Location</div>
                  <div className="font-semibold">{event.location || "Online"}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400">Capacity</div>
                  <div className="font-semibold">{event.capacity || "Unlimited"} spots available</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => navigate(`/feedback/submit/${event.id}`)}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2 group"
              >
                <MessageSquare className="w-5 h-5" />
                Give Feedback
              </button>
              <button className="w-full btn-outline py-4 flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Event
              </button>
            </div>
            
            <p className="text-center text-xs text-slate-500 mt-6">
              Registration is not required to provide feedback.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
