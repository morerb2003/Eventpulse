import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  MapPin,
  Users,
  Mic2,
  Coffee,
  Presentation,
  Music,
  Award,
  ChevronDown,
  Zap,
  PartyPopper
} from 'lucide-react';

// ─── Session type config ──────────────────────────────────────────────────────
const SESSION_TYPES = {
  keynote:      { icon: Mic2,         color: '#0ea5e9', label: 'Keynote'       },
  workshop:     { icon: Presentation, color: '#a855f7', label: 'Workshop'      },
  panel:        { icon: Users,        color: '#f59e0b', label: 'Panel'         },
  break:        { icon: Coffee,       color: '#64748b', label: 'Break'         },
  networking:   { icon: PartyPopper,  color: '#10b981', label: 'Networking'    },
  performance:  { icon: Music,        color: '#ec4899', label: 'Performance'   },
  ceremony:     { icon: Award,        color: '#eab308', label: 'Ceremony'      },
  general:      { icon: Zap,          color: '#06b6d4', label: 'Session'       },
};

function getSessionConfig(type = 'general') {
  return SESSION_TYPES[type] || SESSION_TYPES.general;
}

// ─── Generate mock sessions from event data ───────────────────────────────────
// Since the backend doesn't have a sessions table, we generate a realistic
// agenda from the event's date, category, and title.
function generateAgenda(event) {
  if (!event?.date) return [];

  const d = new Date(event.date);
  const base = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const cat = (event.category || '').toLowerCase();

  // Default agenda template
  const templates = {
    technology: [
      { time: [9,0],   dur: 30,  type: 'general',     title: 'Registration & Welcome Kit' },
      { time: [9,30],  dur: 60,  type: 'keynote',     title: 'Opening Keynote' },
      { time: [10,30], dur: 15,  type: 'break',       title: 'Coffee Break' },
      { time: [10,45], dur: 75,  type: 'workshop',    title: 'Hands-on Technical Workshop' },
      { time: [12,0],  dur: 60,  type: 'break',       title: 'Lunch Break' },
      { time: [13,0],  dur: 60,  type: 'panel',       title: 'Expert Panel Discussion' },
      { time: [14,0],  dur: 90,  type: 'workshop',    title: 'Advanced Deep-Dive Session' },
      { time: [15,30], dur: 30,  type: 'networking',   title: 'Networking Hour' },
      { time: [16,0],  dur: 45,  type: 'keynote',     title: 'Closing Keynote & Takeaways' },
      { time: [16,45], dur: 15,  type: 'ceremony',    title: 'Certificate Distribution' },
    ],
    music: [
      { time: [17,0],  dur: 60,  type: 'general',     title: 'Gates Open & Seating' },
      { time: [18,0],  dur: 30,  type: 'performance', title: 'Opening Act' },
      { time: [18,30], dur: 15,  type: 'break',       title: 'Intermission' },
      { time: [18,45], dur: 90,  type: 'performance', title: 'Main Performance' },
      { time: [20,15], dur: 30,  type: 'performance', title: 'Encore & Finale' },
      { time: [20,45], dur: 45,  type: 'networking',   title: 'Meet & Greet' },
    ],
    education: [
      { time: [9,0],   dur: 30,  type: 'general',     title: 'Welcome & Introduction' },
      { time: [9,30],  dur: 90,  type: 'keynote',     title: 'Main Lecture' },
      { time: [11,0],  dur: 15,  type: 'break',       title: 'Tea Break' },
      { time: [11,15], dur: 75,  type: 'workshop',    title: 'Interactive Workshop' },
      { time: [12,30], dur: 60,  type: 'break',       title: 'Lunch Break' },
      { time: [13,30], dur: 60,  type: 'panel',       title: 'Q&A with Faculty Panel' },
      { time: [14,30], dur: 60,  type: 'workshop',    title: 'Group Project Session' },
      { time: [15,30], dur: 30,  type: 'ceremony',    title: 'Closing & Certificates' },
    ],
    default: [
      { time: [9,0],   dur: 30,  type: 'general',     title: 'Registration & Welcome' },
      { time: [9,30],  dur: 60,  type: 'keynote',     title: 'Opening Session' },
      { time: [10,30], dur: 15,  type: 'break',       title: 'Break' },
      { time: [10,45], dur: 75,  type: 'workshop',    title: 'Main Session' },
      { time: [12,0],  dur: 60,  type: 'break',       title: 'Lunch Break' },
      { time: [13,0],  dur: 90,  type: 'panel',       title: 'Discussion & Activities' },
      { time: [14,30], dur: 45,  type: 'networking',   title: 'Networking' },
      { time: [15,15], dur: 30,  type: 'ceremony',    title: 'Closing Ceremony' },
    ],
  };

  const template = templates[cat] || templates.default;

  return template.map((s, i) => {
    const start = new Date(base);
    start.setHours(s.time[0], s.time[1], 0, 0);
    const end = new Date(start.getTime() + s.dur * 60 * 1000);
    return {
      id: i + 1,
      title: s.title,
      type: s.type,
      startTime: start,
      endTime: end,
      durationMin: s.dur,
      description: null,
    };
  });
}

// ─── Single session card ──────────────────────────────────────────────────────
const SessionCard = ({ session, index, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = getSessionConfig(session.type);
  const Icon = cfg.icon;
  const isBreak = session.type === 'break';

  const fmt = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center pt-1">
        {/* Node */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.06, type: 'spring', stiffness: 300 }}
          className="w-4 h-4 rounded-full border-2 shrink-0 relative z-10"
          style={{
            borderColor: cfg.color,
            background: isBreak ? 'transparent' : cfg.color + '40',
          }}
        >
          {/* Pulse for non-break */}
          {!isBreak && (
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: cfg.color + '20' }}
            />
          )}
        </motion.div>
        {/* Connector line */}
        {!isLast && (
          <div className="w-px flex-1 -mt-0.5" style={{ background: cfg.color + '30' }} />
        )}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.06 + 0.05 }}
        className={`flex-1 mb-4 ${isBreak ? 'mb-2' : ''}`}
      >
        {isBreak ? (
          // Compact break row
          <div className="flex items-center gap-3 py-2 px-4 rounded-xl bg-white/3 border border-white/5">
            <Coffee className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{session.title}</span>
            <span className="text-[10px] text-slate-600 ml-auto font-mono">
              {fmt(session.startTime)} – {fmt(session.endTime)}
            </span>
          </div>
        ) : (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-left group rounded-2xl border border-white/5 hover:border-white/15 bg-white/3 hover:bg-white/5 transition-all overflow-hidden"
          >
            <div className="p-5 flex items-start gap-4">
              {/* Icon bubble */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                style={{ background: cfg.color + '15', border: `1px solid ${cfg.color}30` }}
              >
                <Icon className="w-5 h-5" style={{ color: cfg.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: cfg.color + '20', color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">
                    {session.durationMin} min
                  </span>
                </div>

                <div className="text-sm font-black text-white group-hover:text-primary transition-colors truncate">
                  {session.title}
                </div>

                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 font-bold">
                  <Clock className="w-3 h-3" />
                  {fmt(session.startTime)} – {fmt(session.endTime)}
                </div>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-600 shrink-0 mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
            </div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-0 border-t border-white/5 mt-0">
                    <p className="text-xs text-slate-400 leading-relaxed pt-4">
                      {session.description || `This ${cfg.label.toLowerCase()} session is part of the event's curated agenda. Arrive on time for the best experience.`}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        )}
      </motion.div>
    </div>
  );
};

// ─── Main Agenda Component ────────────────────────────────────────────────────
const EventAgenda = ({ event }) => {
  const sessions = generateAgenda(event);

  if (!sessions.length) return null;

  const totalDuration = sessions.reduce((s, x) => s + x.durationMin, 0);
  const hours = Math.floor(totalDuration / 60);
  const mins = totalDuration % 60;

  return (
    <div className="card border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-secondary to-accent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black text-white flex items-center gap-3">
          <Clock className="w-6 h-6 text-primary" />
          Event Agenda
        </h3>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <span>{sessions.length} sessions</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>{hours}h {mins > 0 ? `${mins}m` : ''} total</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="pl-2">
        {sessions.map((session, i) => (
          <SessionCard
            key={session.id}
            session={session}
            index={i}
            isLast={i === sessions.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default EventAgenda;
