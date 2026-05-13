import { Calendar } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-primary w-6 h-6" />
              <span className="text-xl font-bold text-white">EventPulse</span>
            </div>
            <p className="text-slate-400 max-w-sm">
              The advanced platform for event organizers to gather meaningful feedback and improve attendee experience through data-driven insights.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/events" className="hover:text-primary transition-colors">Events</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-12 pt-8 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} EventPulse Management System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
