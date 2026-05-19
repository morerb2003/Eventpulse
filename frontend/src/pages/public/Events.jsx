import { useState, useEffect, useCallback } from "react";
import { getAllEvents } from "../../api/eventApi";
import EventCard from "../../components/event/EventCard";
import { Search, Calendar, Sparkles, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Music", "Tech", "Business", "Entertainment", "Sports"];

  const fetchEvents = useCallback(async () => {
    try {
      const data = await getAllEvents();
      setEvents(data.content);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || event.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-12 mb-16">
        <div className="text-center max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3 h-3" /> Discover Your Pulse
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6"
          >
            Explore Events
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-lg font-medium"
          >
            Join thousands of people discovering unforgettable experiences every day.
          </motion.p>
        </div>

        <div className="glass rounded-[2rem] p-4 flex flex-col md:flex-row items-center gap-4 shadow-premium border-white/10 bg-white/[0.03]">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <input
              type="text"
              placeholder="Search by title, artist, or location..."
              className="w-full pl-16 pr-6 py-5 bg-transparent border-none outline-none text-white font-black placeholder:text-slate-500 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="h-10 w-px bg-white/10 hidden md:block" />

          <div className="flex items-center gap-2 w-full md:w-auto px-4 overflow-x-auto no-scrollbar py-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-black whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <button className="p-5 glass rounded-2xl text-slate-400 hover:text-white hover:border-primary/30 transition-all group hidden lg:block">
            <Filter className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-40"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-slate-500 font-bold mt-6 tracking-widest uppercase text-xs">Syncing Experiences...</p>
          </motion.div>
        ) : filteredEvents.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-40 glass rounded-[3rem] border-dashed border-2 border-white/5"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <Calendar className="w-12 h-12 text-slate-700" />
            </div>
            <h3 className="text-3xl font-black text-white mb-2">No Matches Found</h3>
            <p className="text-slate-500 text-lg font-medium">We couldn't find any events matching your criteria.</p>
            <button 
              onClick={() => {setSearchTerm(""); setActiveCategory("All");}}
              className="mt-8 text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
