import { motion } from "framer-motion";
import { Calendar, MapPin, MessageSquare, ArrowRight, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -12 }}
      className="card group flex flex-col h-full overflow-hidden p-0 border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/40 transition-all duration-500"
    >
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 z-10" />
        {event.posterUrl ? (
          <img 
            src={`${BASE_URL}${event.posterUrl}`} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-white/10" />
          </div>
        )}
        <div className="absolute top-5 left-5 z-20">
          <span className="badge bg-primary text-white px-4 py-2 rounded-xl shadow-2xl shadow-primary/40 text-[10px] font-black uppercase tracking-widest">
            {event.category || "General"}
          </span>
        </div>
      </div>

      <div className="p-8 flex-grow flex flex-col relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-primary text-[11px] font-black uppercase tracking-widest">
            <Clock className="w-4 h-4" /> {event.startTime || "09:00 AM"}
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 text-slate-400 text-xs font-black">
               <Users className="w-4 h-4 text-slate-600" /> {event.capacity || 0}
             </div>
             <div className="flex items-center gap-1.5 text-slate-400 text-xs font-black">
               <MessageSquare className="w-4 h-4 text-slate-600" /> 24
             </div>
          </div>
        </div>

        <h3 className="text-2xl font-black text-white mb-4 group-hover:text-primary transition-colors line-clamp-2 tracking-tighter leading-tight">
          {event.title}
        </h3>
        
        <p className="text-slate-400 text-sm mb-8 line-clamp-2 leading-relaxed font-semibold">
          {event.description || "Join us for an exclusive and unforgettable experience tailored just for you."}
        </p>

        <div className="space-y-4 mt-auto">
          <div className="flex items-center gap-4 text-slate-200 text-sm font-black tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-primary/30 transition-colors">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            {formatDate(event.date)}
          </div>
          <div className="flex items-center gap-4 text-slate-200 text-sm font-black tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-accent/30 transition-colors">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            {event.location || "Online Experience"}
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Standard Entry</span>
             <div className="text-3xl font-black text-white tracking-tighter">₹{event.price || 499}</div>
          </div>
          <Link 
            to={`/events/${event.id}`}
            className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
          >
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
