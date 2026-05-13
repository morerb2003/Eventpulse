import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEventAnalytics } from "../../api/analyticsApi";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Loader2, TrendingUp, Users, MessageSquare, Star } from "lucide-react";
import toast from "react-hot-toast";

const COLORS = ['#0ea5e9', '#6366f1', '#f43f5e', '#fbbf24', '#10b981'];
const SENTIMENT_COLORS = {
  POSITIVE: '#10b981',
  NEUTRAL: '#6366f1',
  NEGATIVE: '#f43f5e'
};

const Analytics = () => {
  const { eventId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [eventId]);

  const fetchAnalytics = async () => {
    try {
      const result = await getEventAnalytics(eventId);
      setData(result);
    } catch (error) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold">{data.eventTitle}</h1>
        <p className="text-slate-400 mt-1">Detailed performance analytics and feedback trends.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MessageSquare className="text-primary w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{data.totalFeedbacks}</div>
            <div className="text-sm text-slate-400">Total Responses</div>
          </div>
        </div>
        <div className="card flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 flex items-center justify-center">
            <Star className="text-yellow-400 w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{data.averageRating.toFixed(1)}/5.0</div>
            <div className="text-sm text-slate-400">Average Rating</div>
          </div>
        </div>
        <div className="card flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 flex items-center justify-center">
            <TrendingUp className="text-emerald-400 w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">84%</div>
            <div className="text-sm text-slate-400">Engagement Rate</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rating Distribution Bar Chart */}
        <div className="card min-h-[400px]">
          <h3 className="text-lg font-bold mb-8">Rating Distribution</h3>
          <div className="h-80 w-full" style={{ minHeight: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                  itemStyle={{ color: '#0ea5e9' }}
                />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Distribution Pie Chart */}
        <div className="card min-h-[400px]">
          <h3 className="text-lg font-bold mb-8">Sentiment Analysis</h3>
          <div className="h-80 w-full" style={{ minHeight: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
