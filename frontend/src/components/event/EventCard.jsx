import { motion } from "framer-motion";
import { Calendar, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card group flex flex-col h-full"
    >
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-4">
          <div className="px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary uppercase tracking-wider">
            Live Event
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
            <MessageSquare className="w-3 h-3" /> 24 Feedbacks
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">
          {event.title}
        </h3>
        
        <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
          {event.description || "No description available for this event."}
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-slate-300 text-sm">
            <Calendar className="w-4 h-4 text-slate-500" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-sm">
            <MapPin className="w-4 h-4 text-slate-500" />
            {event.location || "Remote / Online"}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <Link 
          to={`/feedback/submit/${event.id}`}
          className="text-sm font-semibold text-primary flex items-center gap-2 group/btn"
        >
          Give Feedback <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
        <Link to={`/events/${event.id}`} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;
