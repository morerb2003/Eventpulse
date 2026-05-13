import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../api/eventApi";
import { Calendar, MapPin, Type, AlignLeft, Image as ImageIcon, Users, Save, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
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
    capacity: 100
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
      // API expects multipart form data
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Event</h1>
          <p className="text-slate-400 mt-1">Set up a new experience for your audience.</p>
        </div>
        <button 
          onClick={() => navigate("/admin/dashboard")}
          className="p-2 glass rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Media & Meta */}
        <div className="md:col-span-1 space-y-6">
          <div className="card border-dashed border-2 border-white/10 hover:border-primary/50 transition-colors group relative overflow-hidden aspect-[3/4] flex flex-col items-center justify-center cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handleFileChange}
            />
            {posterPreview ? (
              <img src={posterPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-500 group-hover:text-primary transition-colors">
                <ImageIcon className="w-12 h-12" />
                <span className="text-xs font-bold uppercase tracking-wider">Upload Poster</span>
              </div>
            )}
            {posterPreview && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold uppercase">Change Image</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-400 block ml-1">Category</label>
            <select 
              name="category"
              className="input-field"
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

          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-400 block ml-1">Capacity</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="number" 
                name="capacity"
                className="input-field pl-11"
                placeholder="1000"
                value={eventData.capacity}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="card space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Type className="w-4 h-4" /> Event Title
              </label>
              <input 
                required
                type="text" 
                name="title"
                className="input-field text-lg font-bold"
                placeholder="e.g. AI & Cloud Bootcamp 2026"
                value={eventData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Date & Time
                </label>
                <input 
                  required
                  type="datetime-local" 
                  name="date"
                  className="input-field"
                  value={eventData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </label>
                <input 
                  required
                  type="text" 
                  name="location"
                  className="input-field"
                  placeholder="e.g. Pune, India"
                  value={eventData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <AlignLeft className="w-4 h-4" /> Description
              </label>
              <textarea 
                required
                name="description"
                rows={8}
                className="input-field resize-none leading-relaxed"
                placeholder="Describe your event..."
                value={eventData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="flex-1 btn-outline py-4"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] btn-primary py-4 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" /> Publish Event
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateEvent;
