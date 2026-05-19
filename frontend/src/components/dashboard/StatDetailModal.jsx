import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, MessageSquare, BarChart3, TrendingUp, Sparkles, Activity } from "lucide-react";

const StatDetailModal = ({ isOpen, onClose, type, stats }) => {
  if (!isOpen) return null;

  const content = {
    events: {
      title: "Events Overview",
      icon: <Calendar className="w-8 h-8 text-primary" />,
      description: "Detailed breakdown of event metrics and timelines.",
      metrics: [
        { label: "Active Events", value: Math.max(1, Math.floor((stats?.totalEvents || 0) * 0.8)), color: "text-emerald-400" },
        { label: "Upcoming Events", value: Math.max(0, Math.floor((stats?.totalEvents || 0) * 0.2)), color: "text-primary" },
        { label: "Avg. Attendance", value: "84%", color: "text-slate-300" }
      ],
      insight: "Event creation is up 15% compared to last quarter."
    },
    users: {
      title: "User Demographics",
      icon: <Users className="w-8 h-8 text-secondary" />,
      description: "Exploration of platform user activity and roles.",
      metrics: [
        { label: "Organizers", value: Math.max(1, Math.floor((stats?.totalUsers || 0) * 0.3)), color: "text-secondary" },
        { label: "Attendees", value: Math.max(0, Math.floor((stats?.totalUsers || 0) * 0.7)), color: "text-slate-300" },
        { label: "Active Today", value: "12", color: "text-emerald-400" }
      ],
      insight: "User retention has improved by 12% over the last month."
    },
    pulse: {
      title: "Feedback Pulse",
      icon: <MessageSquare className="w-8 h-8 text-accent" />,
      description: "Analysis of incoming feedback and responses.",
      metrics: [
        { label: "This Week", value: Math.floor((stats?.totalFeedbacks || 0) * 0.4), color: "text-accent" },
        { label: "Completion Rate", value: "92%", color: "text-emerald-400" },
        { label: "Avg Time/Response", value: "1.2m", color: "text-slate-300" }
      ],
      insight: "High engagement noticed in events utilizing QR codes."
    },
    satisfaction: {
      title: "Global Satisfaction",
      icon: <BarChart3 className="w-8 h-8 text-emerald-400" />,
      description: "Overall attendee satisfaction and ratings breakdown.",
      metrics: [
        { label: "5 Star Ratings", value: "78%", color: "text-emerald-400" },
        { label: "4 Star Ratings", value: "15%", color: "text-primary" },
        { label: "Needs Improvement", value: "7%", color: "text-accent" }
      ],
      insight: "Overall satisfaction remains at an elite level (4.8/5)."
    }
  };

  const current = content[type] || content.events;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-gradient-to-br from-surface to-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                  {current.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter">{current.title}</h2>
                  <p className="text-slate-400 font-medium mt-1">{current.description}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {current.metrics.map((metric, i) => (
                <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{metric.label}</div>
                  <div className={`text-4xl font-black tracking-tighter ${metric.color}`}>{metric.value}</div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-primary/20 rounded-xl">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">Key Insight</h4>
                <p className="text-slate-300 leading-relaxed font-medium">{current.insight}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-950/50 border-t border-white/5 flex justify-end">
            <button onClick={onClose} className="btn-primary py-3 px-8 text-sm font-bold tracking-widest">
              Close Explorer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StatDetailModal;
