import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h1 className="text-5xl font-extrabold mb-8">Get in Touch</h1>
          <p className="text-slate-400 text-lg mb-12">
            Have questions about our platform? Our team is here to help you elevate your event experience.
          </p>

          <div className="space-y-8">
            <ContactItem 
              icon={<Mail />} 
              title="Email Us" 
              detail="support@eventpulse.com" 
              description="We usually respond within 24 hours."
            />
            <ContactItem 
              icon={<Phone />} 
              title="Call Us" 
              detail="+1 (555) 000-0000" 
              description="Mon-Fri from 9am to 6pm EST."
            />
            <ContactItem 
              icon={<MapPin />} 
              title="Our Office" 
              detail="123 Tech Plaza, New York, NY" 
              description="Visit us for a demo!"
            />
          </div>
        </div>

        <div className="card shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">First Name</label>
                <input type="text" required className="input-field" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Last Name</label>
                <input type="text" required className="input-field" placeholder="Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <input type="email" required className="input-field" placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Message</label>
              <textarea rows={5} required className="input-field resize-none" placeholder="How can we help?"></textarea>
            </div>

            <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
              Send Message <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ContactItem = ({ icon, title, detail, description }) => (
  <div className="flex gap-6">
    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-lg font-bold text-white">{title}</h4>
      <p className="text-primary font-medium">{detail}</p>
      <p className="text-slate-500 text-sm mt-1">{description}</p>
    </div>
  </div>
);

export default Contact;
