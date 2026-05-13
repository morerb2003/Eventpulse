import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../../api/eventApi";
import { submitFeedback } from "../../api/feedbackApi";
import { useAuth } from "../../context/AuthContext";
import RatingStars from "../../components/feedback/RatingStars";
import { MessageSquare, Calendar, MapPin, Send, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const SubmitFeedback = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 0,
    comments: ""
  });

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const data = await getEventById(eventId);
      setEvent(data);
    } catch (error) {
      toast.error("Could not load event details");
      navigate("/events");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (feedback.rating === 0) {
      toast.error("Please provide a rating");
      return;
    }
    if (!user) {
      toast.error("You must be logged in to submit feedback");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback({
        ...feedback,
        eventId: parseInt(eventId),
        userId: user.id
      });
      toast.success("Thank you for your feedback!");
      navigate("/events");
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-xl font-bold mb-6">Event Details</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">{event?.title}</h3>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Calendar className="w-4 h-4" />
                {new Date(event?.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4" />
                {event?.location}
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mt-4">
                {event?.description}
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card border-primary/20 shadow-xl shadow-primary/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="text-primary w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Your Feedback</h1>
                <p className="text-slate-400 text-sm">How was your experience at this event?</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-300 ml-1">Overall Rating</label>
                <RatingStars 
                  rating={feedback.rating} 
                  setRating={(r) => setFeedback({ ...feedback, rating: r })} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Comments & Suggestions</label>
                <textarea
                  required
                  rows={6}
                  className="input-field resize-none"
                  placeholder="What did you like? What could be improved?"
                  value={feedback.comments}
                  onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Submit Feedback <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitFeedback;
