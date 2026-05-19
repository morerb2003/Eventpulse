import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventAnalytics } from "../../api/analyticsApi";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Loader2, TrendingUp, MessageSquare, Star, Banknote, Ticket, ChevronLeft, BarChart3, Download, Share2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const COLORS = ['#0ea5e9', '#6366f1', '#f43f5e', '#fbbf24', '#10b981'];
const SENTIMENT_COLORS = {
  POSITIVE: '#10b981',
  NEUTRAL: '#6366f1',
  NEGATIVE: '#f43f5e'
};

const Analytics = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const result = await getEventAnalytics(eventId);
      setData(result);
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchAnalytics();
    window.scrollTo(0, 0);
  }, [fetchAnalytics]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-60">
      <Loader2 className="w-16 h-16 text-primary animate-spin" />
      <div className="mt-8 text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Aggregating Pulse Data...</div>
    </div>
  );

  const ratingData = data?.ratingDistribution ? Object.entries(data.ratingDistribution).map(([star, count]) => ({
    name: `${star} Star`,
    count: count
  })) : [];

  const sentimentData = data?.sentimentDistribution ? Object.entries(data.sentimentDistribution).map(([sentiment, count]) => ({
    name: sentiment,
    value: count
  })) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
           <button 
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-6 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-4"
          >
            <BarChart3 className="w-3.5 h-3.5" /> Performance Report
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-white tracking-tighter"
          >
            {data.eventTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-4 text-lg font-medium"
          >
            Detailed performance analytics and audience feedback trends.
          </motion.p>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3"
        >
          <button className="btn-outline px-6 py-4 border-white/5 bg-white/5">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="btn-primary px-8 py-4 shadow-2xl shadow-primary/20">
            <Download className="w-5 h-5" /> Export Insights
          </button>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <AnalyticsStatCard 
          icon={<Ticket className="w-6 h-6" />}
          label="Conversion"
          value={data.totalBookings || 0}
          trend="Total Tickets"
          color="primary"
        />
        <AnalyticsStatCard 
          icon={<Banknote className="w-6 h-6" />}
          label="Revenue"
          value={`₹${data.totalRevenue?.toLocaleString() || 0}`}
          trend="Gross Volume"
          color="emerald"
        />
        <AnalyticsStatCard 
          icon={<Star className="w-6 h-6" />}
          label="Sentiment Score"
          value={`${data.averageRating?.toFixed(1) || 0}/5.0`}
          trend="User Rating"
          color="yellow"
        />
        <AnalyticsStatCard 
          icon={<MessageSquare className="w-6 h-6" />}
          label="Engagement"
          value={data.totalFeedbacks || 0}
          trend="Total Feedbacks"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Rating Distribution Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 card p-10 bg-white/[0.02] border-white/5 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-8">
             <Sparkles className="w-6 h-6 text-primary/20" />
          </div>
          <h3 className="text-xl font-black text-white mb-10 flex items-center gap-3 uppercase tracking-tighter">
            <BarChart3 className="w-5 h-5 text-primary" /> Rating Distribution
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight="900" 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight="900" 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '12px'
                  }}
                  labelStyle={{ fontWeight: '900', color: '#fff', marginBottom: '4px', fontSize: '12px' }}
                  itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="url(#colorBar)" radius={[10, 10, 0, 0]} barSize={40} />
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sentiment Distribution Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 card p-10 bg-white/[0.02] border-white/5 overflow-hidden relative"
        >
          <h3 className="text-xl font-black text-white mb-10 flex items-center gap-3 uppercase tracking-tighter">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Sentiment Analysis
          </h3>
          <div className="h-[400px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={SENTIMENT_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Pro Insight Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-12 card bg-gradient-to-r from-primary/10 via-surface to-slate-950 border-white/5 p-12 overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -ml-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
           <div className="w-24 h-24 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
              <TrendingUp className="w-10 h-10 text-primary" />
           </div>
           <div>
              <div className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-3">Audience Retention Insight</div>
              <p className="text-2xl font-medium text-white leading-tight">
                 Based on the high {data.averageRating > 4 ? 'positive' : 'mixed'} feedback, your audience is most engaged with the <span className="text-primary font-black italic">technical depth</span> and <span className="text-primary font-black italic">networking opportunities</span> of this session.
              </p>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

const AnalyticsStatCard = ({ icon, label, value, trend, color }) => {
  const colors = {
    primary: "text-primary bg-primary/10 border-primary/20",
    secondary: "text-secondary bg-secondary/10 border-secondary/20",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    yellow: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20"
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="card border-white/5 group relative overflow-hidden p-8 bg-white/[0.02]"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-all duration-700 ${colors[color].split(' ')[0].replace('text-', 'bg-')}`} />
      
      <div className="flex items-center gap-5 relative z-10">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 shadow-lg ${colors[color]}`}>
          {icon}
        </div>
        <div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5 block">{label}</span>
          <div className="text-3xl font-black text-white tracking-tighter leading-none">{value}</div>
          <div className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-wider">{trend}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
