import { motion } from "framer-motion";
import { Users, Target, Shield, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold mb-6"
        >
          Our Mission is to <br />
          <span className="text-primary">Bridge the Gap</span>
        </motion.h1>
        <p className="text-slate-400 text-xl max-w-3xl mx-auto">
          EventPulse was founded with a simple goal: to help event organizers understand their audience through data, not guesswork.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
          <p className="text-slate-400 leading-relaxed mb-6">
            We are a team of event enthusiasts and data scientists who believe that every piece of feedback is a goldmine of opportunity. Our platform provides the tools to collect, analyze, and act on attendee insights in real-time.
          </p>
          <div className="space-y-4">
            <FeatureItem icon={<Users />} text="Over 10,000+ Organizers" />
            <FeatureItem icon={<Globe />} text="Global Event Support" />
            <FeatureItem icon={<Shield />} text="Enterprise-grade Security" />
          </div>
        </div>
        <div className="glass rounded-3xl p-8 aspect-video flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse"></div>
          <Target className="w-20 h-20 text-white relative z-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ValueCard title="Transparency" description="We believe in open communication and honest data." />
        <ValueCard title="Innovation" description="Constantly pushing the boundaries of what event tech can do." />
        <ValueCard title="Privacy" description="Your data and attendee privacy are our top priorities." />
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-white font-medium">
    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
      {icon}
    </div>
    {text}
  </div>
);

const ValueCard = ({ title, description }) => (
  <div className="card text-center">
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </div>
);

export default About;
