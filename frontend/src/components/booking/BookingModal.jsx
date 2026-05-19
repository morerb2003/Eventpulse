import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard, Ticket, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
import SeatSelection from './SeatSelection';
import api from '../../api/api';
import toast from 'react-hot-toast';

const BookingModal = ({ event, isOpen, onClose, user }) => {
  const [step, setStep] = useState(1); // 1: Seat Selection, 2: Payment, 3: Confirmation
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const fetchSeats = useCallback(async () => {
    try {
      const response = await api.get(`/bookings/event/${event.id}/seats`);
      setSeats(response.data);
    } catch {
      toast.error("Failed to load seats");
    }
  }, [event.id]);

  useEffect(() => {
    if (isOpen) {
      fetchSeats();
      setStep(1);
      setSelectedSeat(null);
    }
  }, [isOpen, fetchSeats]);

  const handleInitiateBooking = async (gateway) => {
    if (!selectedSeat) {
      toast.error("Please select a seat first");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/bookings/initiate', {
        eventId: event.id,
        userId: user.id,
        seatId: selectedSeat.id,
        gateway: gateway
      });

      const booking = response.data;
      setBookingDetails(booking);

      if (booking.paymentStatus === 'COMPLETED') {
        // Free event, skip payment processing
        setStep(3);
        toast.success("Seat booked successfully!");
      } else {
        if (gateway === 'RAZORPAY') {
          handleRazorpayPayment(booking);
        } else {
          handleStripePayment(booking);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "Booking failed";
      toast.error(typeof errorMessage === 'string' ? errorMessage : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = (booking) => {
    const options = {
      key: "rzp_test_Sq9B4jsq9vRVE3",
      amount: booking.amount * 100,
      currency: "INR",
      name: "EventPulse",
      description: `Ticket for ${event.title}`,
      order_id: booking.razorpayOrderId,
      handler: async (response) => {
        try {
          const verifyRes = await api.post('/bookings/complete', {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            gateway: 'RAZORPAY'
          });
          
          if (verifyRes.data.paymentStatus === 'COMPLETED') {
            setStep(3);
            toast.success("Payment Successful!");
          }
        } catch {
          toast.error("Payment verification failed");
        }
      },
      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
          toast.error("Payment cancelled");
        }
      },
      theme: { color: "#0ea5e9" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleStripePayment = (booking) => {
    toast.loading("Redirecting to Stripe...");
    setTimeout(async () => {
      try {
        await api.post('/bookings/complete', {
          paymentId: "stripe_simulated_success",
          orderId: booking.stripeSessionId,
          gateway: 'STRIPE'
        });
        setStep(3);
        toast.dismiss();
        toast.success("Payment Successful via Stripe!");
      } catch {
        toast.dismiss();
        toast.error("Stripe payment failed");
      }
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="relative w-full max-w-5xl bg-slate-900 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
              <Ticket className="w-7 h-7 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="badge bg-primary/20 text-primary">Checkout</span>
                 <span className="text-slate-500">•</span>
                 <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{step === 1 ? 'Step 1: Seat' : step === 2 ? 'Step 2: Pay' : 'Success'}</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">{event.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl hover:bg-white/5 text-slate-500 hover:text-white transition-all">
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="p-8 md:p-12 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {step === 1 && (
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <h3 className="text-4xl font-black text-white mb-3 tracking-tight">Choose Your Experience</h3>
                  <p className="text-slate-500 text-lg font-medium">Select your preferred seating position for the event.</p>
                </div>
                {selectedSeat && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass border-primary/30 rounded-[2rem] p-6 flex items-center gap-8 shadow-xl shadow-primary/5"
                  >
                    <div>
                      <div className="text-[10px] text-primary uppercase font-black tracking-[0.2em] mb-1">Selected Seat</div>
                      <div className="text-2xl font-black text-white">R-{selectedSeat.rowLabel} / S-{selectedSeat.seatNumber}</div>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-1">Total Due</div>
                      <div className="text-2xl font-black text-white">₹{event.price || 499}</div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="bg-black/20 p-8 rounded-[3rem] border border-white/5 relative overflow-hidden">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm" />
                 <SeatSelection 
                  seats={seats} 
                  selectedSeat={selectedSeat} 
                  onSelectSeat={setSelectedSeat} 
                />
              </div>

              <div className="flex items-center justify-between gap-4 mt-8 pt-8 border-t border-white/5">
                <div className="flex items-center gap-4 text-xs font-black text-slate-500 uppercase tracking-widest">
                   <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-800" /> Available</div>
                   <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /> Selected</div>
                   <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-600 opacity-30" /> Occupied</div>
                </div>
                <div className="flex gap-4">
                  <button onClick={onClose} className="px-8 py-4 rounded-2xl font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest text-xs">
                    Cancel
                  </button>
                  <button 
                    disabled={!selectedSeat || loading}
                    onClick={() => setStep(2)}
                    className="btn-primary px-12 py-4"
                  >
                    Confirm & Proceed <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-xl mx-auto space-y-12 py-10">
              <div className="text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-premium animate-float">
                  <CreditCard className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-4xl font-black text-white mb-3 tracking-tight">Finalize Payment</h3>
                <p className="text-slate-500 text-lg font-medium">Select a secure gateway to complete your reservation.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <PaymentMethod 
                   icon="https://razorpay.com/favicon.png"
                   title="Razorpay"
                   desc="Cards, UPI, & Netbanking"
                   onClick={() => handleInitiateBooking('RAZORPAY')}
                   loading={loading}
                />
                <PaymentMethod 
                   icon="https://stripe.com/favicon.ico"
                   title="Stripe"
                   desc="International Payments"
                   onClick={() => handleInitiateBooking('STRIPE')}
                   loading={loading}
                />
              </div>

              <button 
                onClick={() => setStep(1)}
                className="w-full py-4 text-slate-500 hover:text-primary font-black uppercase tracking-widest text-xs transition-colors"
              >
                ← Back to seat selection
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12 space-y-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-32 h-32 rounded-[2.5rem] bg-emerald-500/10 border-2 border-emerald-500/50 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/10"
              >
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              </motion.div>
              
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                   <Sparkles className="w-3 h-3" /> Booking Successful
                </div>
                <h3 className="text-5xl font-black text-white mb-4 tracking-tighter">You're All Set!</h3>
                <p className="text-slate-400 text-xl font-medium max-w-md mx-auto leading-relaxed">
                  Your seat has been successfully reserved. We've sent the details to your email.
                </p>
              </div>

              <div className="max-w-md mx-auto card bg-black/20 border-white/5 p-8 text-left space-y-6">
                <ConfirmationRow label="Event Name" value={event.title} />
                <ConfirmationRow label="Seat Position" value={`Row ${selectedSeat.rowLabel}, Seat ${selectedSeat.seatNumber}`} />
                <ConfirmationRow label="Ref Number" value={bookingDetails?.paymentId || "PULSE_928374"} highlight />
              </div>

              <button 
                onClick={onClose} 
                className="btn-primary px-16 py-5 text-lg"
              >
                View My Ticket
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const PaymentMethod = ({ icon, title, desc, onClick, loading }) => (
  <button 
    onClick={onClick}
    disabled={loading}
    className="group p-6 rounded-[2rem] border border-white/5 bg-white/5 hover:bg-primary/5 hover:border-primary/30 transition-all flex items-center justify-between disabled:opacity-50"
  >
    <div className="flex items-center gap-6">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center p-3 group-hover:scale-110 transition-transform">
        <img src={icon} className="w-full h-full object-contain" alt="" />
      </div>
      <div className="text-left">
        <div className="font-black text-white text-lg">{title}</div>
        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{desc}</div>
      </div>
    </div>
    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
       <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white" />
    </div>
  </button>
);

const ConfirmationRow = ({ label, value, highlight }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</span>
    <span className={`font-bold ${highlight ? 'text-primary font-mono' : 'text-slate-200'}`}>{value}</span>
  </div>
);

export default BookingModal;
