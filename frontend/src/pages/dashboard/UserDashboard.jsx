import { useState, useEffect } from "react";
import { getUserFeedback } from "../../api/feedbackApi";
import { useAuth } from "../../context/AuthContext";
import { MessageSquare, Star, Calendar, ArrowRight, Loader2, User as UserIcon, Mail } from "lucide-react";
import { TableSkeleton } from "../../components/common/Loader";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserFeedback();
    }
  }, [user]);

  const fetchUserFeedback = async () => {
    try {
      const data = await getUserFeedback(user.id);
      setFeedbacks(data);
    } catch (error) {
      toast.error("Failed to load your activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/5">
              <UserIcon className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mt-1 mb-6">
              <Mail className="w-4 h-4" /> {user?.email}
            </div>
            
            <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
              <div>
                <div className="text-lg font-bold text-white">{feedbacks.length}</div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Feedbacks</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">0</div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Events</div>
              </div>
            </div>
          </div>

          <div className="card mt-6">
            <h3 className="font-bold mb-4">Account Settings</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-sm text-slate-400 hover:text-white transition-colors">Edit Profile</button>
              <button className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-sm text-slate-400 hover:text-white transition-colors">Notifications</button>
              <button className="w-full text-left p-2 rounded-lg hover:bg-white/5 text-sm text-slate-400 hover:text-white transition-colors">Change Password</button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">My Feedback Activity</h2>
              <div className="text-sm text-slate-500">History of your contributions</div>
            </div>

            {loading ? (
              <TableSkeleton rows={5} />
            ) : feedbacks.length > 0 ? (
              <div className="space-y-6">
                {feedbacks.map((fb) => (
                  <div key={fb.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-primary font-bold">
                          {fb.rating}
                        </div>
                        <div>
                          <div className="font-bold flex items-center gap-2">
                            Event #{fb.eventId}
                            {fb.sentiment === 'POSITIVE' && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                            {fb.sentiment === 'NEGATIVE' && <span className="w-2 h-2 rounded-full bg-accent" />}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" /> {new Date(fb.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < fb.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-700'}`} />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-sm leading-relaxed italic">
                      "{fb.comments}"
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs text-primary font-bold flex items-center gap-1">
                        View Event <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-900/50 rounded-2xl border-2 border-dashed border-white/5">
                <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="font-bold text-slate-400">No feedback given yet</h3>
                <p className="text-sm text-slate-600 mt-1">Start exploring events and share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
