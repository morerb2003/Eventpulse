import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Zap, Calendar, Users, MessageSquare, Sparkles, TrendingUp } from "lucide-react";
import { getAllEvents } from "../../api/eventApi";
import EventCard from "../../components/event/EventCard";
import { Loader2 } from "lucide-react";

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const data = await getAllEvents(0, 3);
      setFeaturedEvents(data.content);
    } catch (error) {
      console.error("Failed to load featured events");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-4">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
        </div>

        <motion.div 
          className="max-w-7xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-black uppercase tracking-widest mb-10 shadow-premium">
            <Sparkles className="w-4 h-4 fill-primary" />
            <span>Redefining Live Experiences</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black mb-10 leading-[1] tracking-tighter text-white">
            Where Moments <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent italic">
              Become Memories
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-slate-400 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
            The premium platform for discovering elite events, securing exclusive tickets, 
            and providing impactful feedback that shapes the future of entertainment.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="btn-primary py-5 px-10 text-lg shadow-2xl shadow-primary/40">
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/events" className="btn-outline py-5 px-10 text-lg backdrop-blur-md">
              Discover Events
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Events Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-4">
                 <TrendingUp className="w-4 h-4" /> Trending Now
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Featured Experiences</h2>
              <p className="text-slate-500 mt-4 text-lg font-medium">Curated events that are making waves this week.</p>
            </div>
            <Link to="/events" className="btn-outline py-3 px-6 text-sm border-white/5 bg-white/5 hover:bg-white/10 group">
              View All Events <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
             <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-slate-900/40 -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <div className="inline-block p-3 rounded-2xl bg-white/5 border border-white/10 mb-6">
                <Zap className="w-6 h-6 text-primary fill-primary" />
             </div>
            <h2 className="text-5xl font-black text-white tracking-tight mb-6">Built for Excellence</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">Every tool you need to attend, manage, and evaluate events at a professional level.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Calendar className="w-8 h-8 text-primary" />}
              title="Global Access"
              description="Discover events happening across the globe or right in your neighborhood with precision filtering."
            />
            <FeatureCard 
              icon={<MessageSquare className="w-8 h-8 text-secondary" />}
              title="Verified Insights"
              description="Submit and browse authentic reviews from real attendees to make informed decisions."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-accent" />}
              title="Instant Ticketing"
              description="Secure your spot in seconds with our integrated, high-speed payment and reservation system."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto glass rounded-[3rem] p-16 overflow-hidden relative border-white/5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 relative z-10 text-center">
            <StatItem value="10k+" label="Global Events" />
            <StatItem value="500k+" label="Happy Attendees" />
            <StatItem value="98%" label="Positive Pulse" />
            <StatItem value="24/7" label="VIP Support" />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -12 }}
    className="card group cursor-default p-10"
  >
    <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-10 group-hover:bg-primary/10 transition-all duration-500 group-hover:scale-110 shadow-premium">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 text-white">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium">
      {description}
    </p>
  </motion.div>
);

const StatItem = ({ value, label }) => (
  <div className="space-y-2">
    <div className="text-5xl md:text-6xl font-black text-white tracking-tighter">{value}</div>
    <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{label}</div>
  </div>
);

export default Home;
