import { useState, useEffect } from "react";
import { MessageSquare, Star, Calendar, ArrowRight, Loader2, User as UserIcon, Mail, Ticket, Award, Download } from "lucide-react";
import { getUserBookings, downloadCertificate } from "../../api/bookingApi";
import { TableSkeleton } from "../../components/common/Loader";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("feedback"); // feedback, bookings

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);
 
   const fetchData = async () => {
     setLoading(true);
     try {
       const [fbData, bookingData] = await Promise.all([
         getUserFeedback(user.id),
         getUserBookings(user.id)
       ]);
       setFeedbacks(fbData);
       setBookings(bookingData);
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
                <div className="text-lg font-bold text-white">{bookings.length}</div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Bookings</div>
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
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab("feedback")}
                  className={`pb-2 px-1 font-bold transition-all ${activeTab === 'feedback' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Feedback Activity
                </button>
                <button 
                  onClick={() => setActiveTab("bookings")}
                  className={`pb-2 px-1 font-bold transition-all ${activeTab === 'bookings' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  My Certificates
                </button>
              </div>
              <div className="text-sm text-slate-500">History of your contributions</div>
            </div>

            {loading ? (
              <TableSkeleton rows={5} />
            ) : activeTab === 'feedback' ? (
              feedbacks.length > 0 ? (
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
            ) : (
              bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all flex flex-col md:flex-row items-center justify-between gap-6 group">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <Award className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Completion Certificate</div>
                          <h3 className="text-xl font-bold text-white">{booking.event.title}</h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              Seat {booking.seat.rowLabel}{booking.seat.seatNumber}
                            </span>
                            <span className="text-slate-600 text-xs">•</span>
                            <span className="text-slate-500 text-xs font-medium">Booked on {new Date(booking.bookingDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => downloadCertificate(booking.event.id, user.id)}
                        className="btn-primary py-3 px-6 flex items-center gap-2 whitespace-nowrap shadow-lg shadow-primary/20"
                      >
                        <Download className="w-4 h-4" /> Download PDF
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-900/50 rounded-2xl border-2 border-dashed border-white/5">
                  <Award className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <h3 className="font-bold text-slate-400">No certificates earned</h3>
                  <p className="text-sm text-slate-600 mt-1">Attend events to earn completion certificates!</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
