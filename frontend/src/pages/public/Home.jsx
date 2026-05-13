import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Zap, Calendar, Users, MessageSquare } from "lucide-react";

const Home = () => {
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
      <section className="relative pt-32 pb-20 px-4">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
        </div>

        <motion.div 
          className="max-w-7xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-8">
            <Zap className="w-4 h-4 fill-primary" />
            <span>The Future of Event Management</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            Elevate Your Events with <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Actionable Feedback
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-slate-400 max-w-3xl mx-auto mb-12">
            The all-in-one platform to manage events, gather real-time attendee feedback, 
            and transform insights into extraordinary experiences.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/events" className="btn-outline text-lg px-8 py-4">
              Explore Events
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Why Choose EventPulse?</h2>
            <p className="text-slate-400">Advanced tools designed for modern organizers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Calendar className="w-8 h-8 text-primary" />}
              title="Seamless Scheduling"
              description="Create and manage events with ease using our intuitive dashboard and calendar integration."
            />
            <FeatureCard 
              icon={<MessageSquare className="w-8 h-8 text-secondary" />}
              title="Smart Feedback"
              description="Customizable feedback forms that capture what truly matters to your attendees."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-accent" />}
              title="Real-time Analytics"
              description="Instant insights into attendee satisfaction with beautiful, data-driven visualizations."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto glass rounded-3xl p-12 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10 text-center">
            <StatItem value="10k+" label="Events Hosted" />
            <StatItem value="500k+" label="Feedbacks Collected" />
            <StatItem value="98%" label="Satisfaction Rate" />
            <StatItem value="50+" label="Global Partners" />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="card group cursor-default"
  >
    <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">
      {description}
    </p>
  </motion.div>
);

const StatItem = ({ value, label }) => (
  <div>
    <div className="text-3xl md:text-5xl font-black text-white mb-2">{value}</div>
    <div className="text-slate-400 font-medium">{label}</div>
  </div>
);

export default Home;
