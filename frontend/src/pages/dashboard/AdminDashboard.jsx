import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllEvents } from "../../api/eventApi";
import { getGlobalStats } from "../../api/analyticsApi";
import { Calendar, Users, MessageSquare, Plus, QrCode, BarChart3, Search, Trash2, Edit, ChevronRight, Sparkles, TrendingUp, Filter, Download, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import QRModal from "../../components/event/QRModal";
import NotificationPanel from "../../components/notifications/NotificationPanel";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalUsers: 0, totalFeedbacks: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [eventsData, statsData] = await Promise.all([
        getAllEvents(0, 5, "id", "desc"),
        getGlobalStats()
      ]);
      setEvents(eventsData.content);
      setStats(statsData);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [fetchData]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-4"
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Command Center
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-white tracking-tighter"
          >
            Admin Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-4 text-lg font-medium"
          >
            Real-time insights and professional event management.
          </motion.p>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4"
        >
          <NotificationPanel onNewFeedback={fetchData} />
          <Link to="/admin/events/new" className="btn-primary py-4 px-8 shadow-2xl shadow-primary/30">
            <Plus className="w-5 h-5" /> New Event
          </Link>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <StatCard 
          icon={<Calendar className="text-primary w-6 h-6" />}
          label="Total Events"
          value={stats.totalEvents}
          trend="+2 This Month"
          color="primary"
        />
        <StatCard 
          icon={<Users className="text-secondary w-6 h-6" />}
          label="Active Users"
          value={stats.totalUsers}
          trend="+12% Retention"
          color="secondary"
        />
        <StatCard 
          icon={<MessageSquare className="text-accent w-6 h-6" />}
          label="Total Pulse"
          value={stats.totalFeedbacks}
          trend="48 Submissions"
          color="accent"
        />
        <StatCard 
          icon={<BarChart3 className="text-emerald-400 w-6 h-6" />}
          label="Satisfaction"
          value="4.8/5"
          trend="Elite Rating"
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Recent Events Table */}
        <div className="lg:col-span-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-0 overflow-hidden border-white/5"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                 <h2 className="text-xl font-black text-white">Recent Activity</h2>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"><Filter className="w-4 h-4" /></button>
                 <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"><Search className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] bg-white/5">
                    <th className="px-8 py-5">Event Experience</th>
                    <th className="px-8 py-5 text-center">Passcode</th>
                    <th className="px-8 py-5">Timeline</th>
                    <th className="px-8 py-5 text-right">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {events.map((event, index) => (
                    <motion.tr 
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                              <Sparkles className="w-5 h-5 text-primary opacity-50" />
                           </div>
                           <div>
                             <div className="font-black text-white text-lg group-hover:text-primary transition-colors">{event.title}</div>
                             <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mt-0.5">
                               <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> {event.location}
                             </div>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button 
                          onClick={() => setSelectedQR(event)}
                          className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 text-slate-500 hover:text-primary hover:bg-primary/10 hover:border-primary/30 border border-white/5 transition-all group/qr"
                        >
                          <QrCode className="w-6 h-6 group-hover/qr:scale-110 transition-transform" />
                        </button>
                      </td>
                      <td className="px-8 py-6">
                         <div className="text-sm font-black text-slate-300">
                           {new Date(event.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                         </div>
                         <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">Confirmed</div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <Link title="Analytics" to={`/admin/analytics/${event.id}`} className="p-3 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"><BarChart3 className="w-5 h-5" /></Link>
                          <button title="Edit" className="p-3 hover:text-secondary hover:bg-secondary/10 rounded-xl transition-all"><Edit className="w-5 h-5" /></button>
                          <button title="Delete" className="p-3 hover:text-accent hover:bg-accent/10 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 bg-white/5 border-t border-white/5 flex justify-center">
               <button className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                 Load More Events <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions / Analytics Preview */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card bg-gradient-to-br from-surface to-slate-950 border-white/5 p-10 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
               Engagement Insights
            </h2>
            <div className="space-y-10">
              <ProgressItem label="Positive Sentiment" value={84} color="emerald" />
              <ProgressItem label="Response Rate" value={62} color="primary" />
              <ProgressItem label="Attendance Growth" value={45} color="secondary" />
            </div>

            <div className="mt-14 space-y-3">
              <button className="btn-primary w-full py-4 text-sm tracking-widest">
                <BarChart3 className="w-5 h-5" /> Detailed Analytics
              </button>
              <button className="btn-outline w-full py-4 text-sm tracking-widest border-white/5">
                <Download className="w-5 h-5" /> Export Data
              </button>
            </div>
          </motion.div>

          <div className="card border-white/5 p-8 bg-primary/5 relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative z-10">
               <div className="text-xs text-primary font-black uppercase tracking-widest mb-2">Pro Tip</div>
               <p className="text-slate-300 font-medium leading-relaxed italic">
                 "Events with QR codes at entry points see a 40% increase in feedback response rates."
               </p>
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedQR && (
          <QRModal 
            eventId={selectedQR.id} 
            eventTitle={selectedQR.title} 
            qrCodeBase64={selectedQR.qrCodeBase64}
            onClose={() => setSelectedQR(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, color }) => {
  const colors = {
    primary: "text-primary bg-primary/10 border-primary/20",
    secondary: "text-secondary bg-secondary/10 border-secondary/20",
    accent: "text-accent bg-accent/10 border-accent/20",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="card border-white/5 group relative overflow-hidden p-8"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-all duration-700 ${colors[color].split(' ')[0].replace('text-', 'bg-')}`} />
      
      <div className="flex items-center gap-5 mb-8 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 shadow-lg ${colors[color]}`}>
          {icon}
        </div>
        <div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5 block">{label}</span>
          <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest relative z-10">
        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> {trend}
      </div>
    </motion.div>
  );
};

const ProgressItem = ({ label, value, color }) => {
  const barColors = {
    primary: "bg-primary shadow-primary/20",
    secondary: "bg-secondary shadow-secondary/20",
    accent: "bg-accent shadow-accent/20",
    emerald: "bg-emerald-500 shadow-emerald-500/20"
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className={`text-sm font-black tracking-tighter ${color === 'emerald' ? 'text-emerald-400' : color === 'primary' ? 'text-primary' : 'text-white'}`}>{value}%</span>
      </div>
      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-[1px] border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full rounded-full shadow-[0_0_10px] ${barColors[color]}`}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
