import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../api/eventApi";
import { Calendar, MapPin, Type, AlignLeft, Image as ImageIcon, Users, Save, X, Loader2, Banknote, Sparkles, ChevronLeft, Layout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    category: "Technology",
    capacity: 100,
    price: 499
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPoster(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createEvent(eventData, poster);
      toast.success("Event created successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10 translate-x-1/4 translate-y-1/4" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4 py-16"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-12">
          <div>
            <button 
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-6 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-3">
               <Layout className="w-3.5 h-3.5" /> Studio Mode
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">Create Experience</h1>
            <p className="text-slate-500 mt-4 text-lg font-medium">Design and publish your next premium event pulse.</p>
          </div>
          
          <div className="hidden md:flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5">
             <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
             </div>
             <div>
                <div className="text-xs font-black text-white uppercase tracking-tight">AI Enhancement Active</div>
                <div className="text-[10px] text-slate-500 font-bold">Smart descriptions enabled</div>
             </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Visual Assets */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Event Poster</label>
              <div className="card border-dashed border-2 border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden aspect-[4/5] flex flex-col items-center justify-center cursor-pointer bg-white/[0.02]">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                />
                {posterPreview ? (
                  <img src={posterPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-slate-600 group-hover:text-primary transition-all duration-500">
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                       <ImageIcon className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Upload Masterpiece</span>
                  </div>
                )}
                <AnimatePresence>
                  {posterPreview && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
                    >
                      <span className="text-white text-[10px] font-black uppercase tracking-widest border-2 border-white/20 px-6 py-2 rounded-full">Change Artwork</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="card border-white/5 bg-white/[0.02] p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Classification</label>
                <select 
                  name="category"
                  className="input-field py-4 bg-slate-900/60"
                  value={eventData.category}
                  onChange={handleInputChange}
                >
                  <option value="Technology">Technology</option>
                  <option value="Education">Education</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Conference">Conference</option>
                  <option value="Startup">Startup</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Seats</label>
                <div className="relative group">
                  <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="number" 
                    name="capacity"
                    className="input-field pl-14 py-4 bg-slate-900/60"
                    placeholder="1000"
                    value={eventData.capacity}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry Price (INR)</label>
                <div className="relative group">
                  <Banknote className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                  <input 
                    type="number" 
                    name="price"
                    className="input-field pl-14 py-4 bg-slate-900/60"
                    placeholder="499"
                    value={eventData.price}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Information Architecture */}
          <div className="lg:col-span-8 space-y-10">
            <div className="card border-white/5 p-10 space-y-10 bg-white/[0.02]">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" /> Event Title
                </label>
                <input 
                  required
                  type="text" 
                  name="title"
                  className="input-field text-2xl font-black bg-transparent border-b-2 border-t-0 border-x-0 rounded-none focus:border-primary px-0 focus:ring-0 placeholder:text-slate-700"
                  placeholder="The Future of Web 3.0"
                  value={eventData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-secondary" /> Date & Time
                  </label>
                  <input 
                    required
                    type="datetime-local" 
                    name="date"
                    className="input-field py-4 bg-slate-900/60"
                    value={eventData.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" /> Venue Location
                  </label>
                  <input 
                    required
                    type="text" 
                    name="location"
                    className="input-field py-4 bg-slate-900/60"
                    placeholder="Grand Central, Silicon Valley"
                    value={eventData.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-primary" /> Experience Description
                </label>
                <textarea 
                  required
                  name="description"
                  rows={10}
                  className="input-field py-6 px-6 bg-slate-900/60 resize-none leading-relaxed text-slate-300"
                  placeholder="Provide a compelling narrative for your event audience..."
                  value={eventData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="flex-1 btn-outline py-5 text-sm font-black tracking-widest border-white/5 bg-white/5"
              >
                Discard Changes
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] btn-primary py-5 text-sm font-black tracking-widest shadow-2xl shadow-primary/20"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing Experience...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <Save className="w-5 h-5" /> Launch Event Pulse
                  </div>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateEvent;
