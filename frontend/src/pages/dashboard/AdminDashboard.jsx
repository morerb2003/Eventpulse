import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { getAllEvents } from "../../api/eventApi";
import { getGlobalStats } from "../../api/analyticsApi";
import { Calendar, Users, MessageSquare, Plus, QrCode, BarChart3, Search, Trash2, Edit, ChevronRight } from "lucide-react";
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
  }, [fetchData]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Monitor event performance and engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <NotificationPanel onNewFeedback={fetchData} />
          <Link to="/admin/events/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create New Event
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <StatCard 
          icon={<Calendar className="text-primary w-5 h-5" />}
          label="Total Events"
          value={stats.totalEvents}
          trend="+2 this month"
        />
        <StatCard 
          icon={<Users className="text-secondary w-5 h-5" />}
          label="Active Users"
          value={stats.totalUsers}
          trend="+12% vs last month"
        />
        <StatCard 
          icon={<MessageSquare className="text-accent w-5 h-5" />}
          label="Total Feedback"
          value={stats.totalFeedbacks}
          trend="+48 today"
        />
        <StatCard 
          icon={<BarChart3 className="text-emerald-400 w-5 h-5" />}
          label="Avg. Satisfaction"
          value="4.8/5"
          trend="Top 1% in sector"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Events Table */}
        <div className="lg:col-span-2">
          <div className="card h-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Recent Events</h2>
              <button className="text-sm text-primary hover:underline">View All</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-sm border-b border-white/5">
                    <th className="pb-4 font-medium">Event Name</th>
                    <th className="pb-4 font-medium text-center">QR Code</th>
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {events.map((event) => (
                    <tr key={event.id} className="group hover:bg-white/5 transition-colors">
                      <td className="py-4">
                        <div className="font-semibold">{event.title}</div>
                        <div className="text-xs text-slate-500">{event.location}</div>
                      </td>
                      <td className="py-4">
                        <button 
                          onClick={() => setSelectedQR(event)}
                          className="mx-auto flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-primary transition-colors"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="py-4 text-sm text-slate-400">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/admin/analytics/${event.id}`} className="p-1.5 hover:text-primary transition-colors"><BarChart3 className="w-4 h-4" /></Link>
                          <button className="p-1.5 hover:text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                          <button className="p-1.5 hover:text-accent transition-colors"><Trash2 className="w-4 h-4" /></button>
                          <ChevronRight className="w-4 h-4 text-slate-600" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions / Analytics Preview */}
        <div className="lg:col-span-1">
          <div className="card h-full bg-gradient-to-br from-surface to-slate-900 border-primary/10">
            <h2 className="text-xl font-bold mb-6">Engagement Insights</h2>
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Positive Feedback</span>
                  <span className="text-emerald-400 text-xs font-bold">84%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[84%]"></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Response Rate</span>
                  <span className="text-primary text-xs font-bold">62%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[62%]"></div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <button className="w-full btn-outline flex items-center justify-center gap-2 text-sm">
                <BarChart3 className="w-4 h-4" /> Open Full Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedQR && (
        <QRModal 
          eventId={selectedQR.id} 
          eventTitle={selectedQR.title} 
          qrCodeBase64={selectedQR.qrCodeBase64}
          onClose={() => setSelectedQR(null)} 
        />
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }) => (
  <div className="card border-white/5 group hover:border-primary/20 transition-all">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-400">{label}</span>
    </div>
    <div className="text-2xl font-black text-white">{value}</div>
    <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{trend}</div>
  </div>
);

export default AdminDashboard;
