import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Zap
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// Category → accent color (cycles if unlisted)
const CATEGORY_COLORS = [
  '#0ea5e9','#a855f7','#f59e0b','#10b981','#ef4444','#ec4899','#06b6d4',
];
function categoryColor(cat = '') {
  const h = [...cat].reduce((a, c) => a + c.charCodeAt(0), 0);
  return CATEGORY_COLORS[h % CATEGORY_COLORS.length];
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function firstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

// ─── Dot strip (up to 3 event dots per cell) ─────────────────────────────────
const EventDots = ({ events }) => (
  <div className="flex gap-0.5 mt-1 justify-center">
    {events.slice(0, 3).map((ev, i) => (
      <div
        key={i}
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: categoryColor(ev.category) }}
      />
    ))}
    {events.length > 3 && (
      <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
    )}
  </div>
);

// ─── Flyout panel for selected day ───────────────────────────────────────────
const DayPanel = ({ date, events, onClose }) => {
  const label = date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
  return (
    <motion.div
      key={date.toISOString()}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute z-20 left-0 right-0 mt-3 rounded-3xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
      style={{ top: '100%' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/3">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-black text-white">{label}</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white transition-colors text-xl leading-none px-1"
        >
          ×
        </button>
      </div>

      {/* Event list */}
      <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm font-medium">
            No events scheduled for this day.
          </div>
        ) : (
          events.map(ev => {
            const color = categoryColor(ev.category);
            const time = ev.date
              ? new Date(ev.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              : null;
            return (
              <Link
                key={ev.id}
                to={`/events/${ev.id}`}
                onClick={onClose}
                className="flex items-start gap-4 p-4 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all group"
              >
                {/* Color bar */}
                <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: color }} />

                <div className="flex-1 min-w-0">
                  <div className="font-black text-white text-sm truncate group-hover:text-primary transition-colors">
                    {ev.title}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 font-bold">
                    {time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {time}
                      </span>
                    )}
                    {ev.location && (
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0" /> {ev.location}
                      </span>
                    )}
                  </div>
                  {ev.category && (
                    <span
                      className="inline-block mt-2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: color + '20', color }}
                    >
                      {ev.category}
                    </span>
                  )}
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
              </Link>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

// ─── Main Calendar ────────────────────────────────────────────────────────────
const EventCalendar = ({ events = [] }) => {
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null); // Date object or null

  // Index events by local date string "YYYY-M-D"
  const eventsByDay = useMemo(() => {
    const map = {};
    events.forEach(ev => {
      if (!ev.date) return;
      const d = new Date(ev.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    });
    return map;
  }, [events]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };

  const totalDays  = daysInMonth(viewYear, viewMonth);
  const startOffset = firstDayOfMonth(viewYear, viewMonth);
  // Build cell array: nulls for padding + day numbers
  const cells = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  // Pad to full 6-week grid
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedDayEvents = selectedDay
    ? (eventsByDay[`${selectedDay.getFullYear()}-${selectedDay.getMonth()}-${selectedDay.getDate()}`] || [])
    : [];

  // Unique categories for legend
  const categories = useMemo(() => {
    const cats = new Set(events.map(e => e.category).filter(Boolean));
    return [...cats].slice(0, 5);
  }, [events]);

  return (
    <div className="relative">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            {MONTH_NAMES[viewMonth]} <span className="text-slate-500">{viewYear}</span>
          </h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
            {events.filter(ev => {
              const d = new Date(ev.date);
              return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
            }).length} events this month
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); setSelectedDay(null); }}
            className="px-4 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-600 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 relative">
        {cells.map((day, idx) => {
          if (!day) return <div key={`pad-${idx}`} className="aspect-square" />;

          const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
          const dateObj = new Date(viewYear, viewMonth, day);
          const key = `${viewYear}-${viewMonth}-${day}`;
          const dayEvents = eventsByDay[key] || [];
          const isSelected = selectedDay?.getTime() === dateObj.getTime();
          const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <motion.button
              key={`day-${day}`}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedDay(isSelected ? null : dateObj)}
              className={`
                aspect-square flex flex-col items-center justify-start pt-2 rounded-xl text-sm font-black transition-all border
                ${isSelected
                  ? 'bg-primary/20 border-primary/50 text-white'
                  : isToday
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : dayEvents.length > 0
                      ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/15 text-white'
                      : 'border-transparent hover:bg-white/5 hover:border-white/5 text-slate-500'}
                ${isPast && !isSelected && !isToday ? 'opacity-50' : ''}
              `}
            >
              <span>{day}</span>
              <EventDots events={dayEvents} />
            </motion.button>
          );
        })}
      </div>

      {/* Category legend */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/5">
          {categories.map(cat => (
            <div key={cat} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: categoryColor(cat) }} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{cat}</span>
            </div>
          ))}
        </div>
      )}

      {/* Flyout day panel */}
      <AnimatePresence>
        {selectedDay && (
          <DayPanel
            date={selectedDay}
            events={selectedDayEvents}
            onClose={() => setSelectedDay(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventCalendar;
