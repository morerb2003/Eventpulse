import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Ticket, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import SeatSelection from './SeatSelection';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookingModal = ({ event, isOpen, onClose, user }) => {
  const [step, setStep] = useState(1); // 1: Seat Selection, 2: Payment, 3: Confirmation
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchSeats();
    }
  }, [isOpen, event.id]);

  const fetchSeats = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bookings/event/${event.id}/seats`);
      setSeats(response.data);
    } catch (error) {
      toast.error("Failed to load seats");
    }
  };

  const handleInitiateBooking = async (gateway) => {
    if (!selectedSeat) {
      toast.error("Please select a seat first");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/bookings/initiate', {
        eventId: event.id,
        userId: user.id,
        seatId: selectedSeat.id,
        gateway: gateway
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const booking = response.data;
      setBookingDetails(booking);

      if (gateway === 'RAZORPAY') {
        handleRazorpayPayment(booking);
      } else {
        handleStripePayment(booking);
      }
    } catch (error) {
      toast.error(error.response?.data || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = (booking) => {
    const options = {
      key: "rzp_test_your_key_id", // Should come from backend or config
      amount: booking.amount * 100,
      currency: "INR",
      name: "EventPulse",
      description: `Ticket for ${event.title}`,
      order_id: booking.razorpayOrderId,
      handler: async (response) => {
        try {
          const verifyRes = await axios.post('http://localhost:8080/api/bookings/complete', {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            gateway: 'RAZORPAY'
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          
          if (verifyRes.data.paymentStatus === 'COMPLETED') {
            setStep(3);
            toast.success("Payment Successful!");
          }
        } catch (error) {
          toast.error("Payment verification failed");
        }
      },
      prefill: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      },
      theme: { color: "#6366f1" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleStripePayment = (booking) => {
    // In a real app, redirect to Stripe Checkout or use Stripe Elements
    // For this demo, we'll simulate success since Stripe requires a client secret/session redirect
    toast.loading("Redirecting to Stripe...");
    setTimeout(async () => {
      try {
        await axios.post('http://localhost:8080/api/bookings/complete', {
          paymentId: "stripe_simulated_success",
          orderId: booking.stripeSessionId,
          gateway: 'STRIPE'
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStep(3);
        toast.dismiss();
        toast.success("Payment Successful via Stripe!");
      } catch (e) {
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
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Book Your Spot</h2>
              <p className="text-xs text-slate-400">{event.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-10 max-h-[80vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Select Your Seat</h3>
                  <p className="text-slate-400">Choose your preferred seating position</p>
                </div>
                {selectedSeat && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-primary/10 border border-primary/20 rounded-2xl px-6 py-3 flex items-center gap-4"
                  >
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Selected Seat</div>
                      <div className="text-xl font-bold text-white">Row {selectedSeat.rowLabel}, Seat {selectedSeat.seatNumber}</div>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Price</div>
                      <div className="text-xl font-bold text-primary">₹{event.price || 499}</div>
                    </div>
                  </motion.div>
                )}
              </div>

              <SeatSelection 
                seats={seats} 
                selectedSeat={selectedSeat} 
                onSelectSeat={setSelectedSeat} 
              />

              <div className="flex justify-end gap-4 mt-8">
                <button onClick={onClose} className="px-8 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button 
                  disabled={!selectedSeat || loading}
                  onClick={() => setStep(2)}
                  className="btn-primary px-12 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-md mx-auto space-y-8 py-10">
              <div className="text-center">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Secure Payment</h3>
                <p className="text-slate-400">Select your preferred payment method</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => handleInitiateBooking('RAZORPAY')}
                  disabled={loading}
                  className="w-full p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <img src="https://razorpay.com/favicon.png" className="w-8 h-8 rounded-lg" alt="" />
                    <div className="text-left">
                      <div className="font-bold text-white">Razorpay</div>
                      <div className="text-xs text-slate-400">Cards, UPI, Netbanking</div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-slate-700 group-hover:text-primary transition-colors" />
                </button>

                <button 
                  onClick={() => handleInitiateBooking('STRIPE')}
                  disabled={loading}
                  className="w-full p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <img src="https://stripe.com/favicon.ico" className="w-8 h-8 rounded-lg" alt="" />
                    <div className="text-left">
                      <div className="font-bold text-white">Stripe</div>
                      <div className="text-xs text-slate-400">International Cards & Apple Pay</div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-slate-700 group-hover:text-indigo-400 transition-colors" />
                </button>
              </div>

              <button 
                onClick={() => setStep(1)}
                className="w-full py-4 text-slate-500 hover:text-white font-medium"
              >
                Go back to seat selection
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-16 space-y-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", damping: 10 }}
                className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </motion.div>
              
              <div>
                <h3 className="text-4xl font-bold text-white mb-3">Booking Confirmed!</h3>
                <p className="text-slate-400 text-lg">Your seat has been successfully reserved.</p>
              </div>

              <div className="max-w-sm mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                <div className="flex justify-between mb-4 pb-4 border-b border-white/5">
                  <span className="text-slate-400">Event</span>
                  <span className="text-white font-bold">{event.title}</span>
                </div>
                <div className="flex justify-between mb-4 pb-4 border-b border-white/5">
                  <span className="text-slate-400">Seat</span>
                  <span className="text-white font-bold">Row {selectedSeat.rowLabel}, Seat {selectedSeat.seatNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction ID</span>
                  <span className="text-primary font-mono text-sm">{bookingDetails?.paymentId || "TRANS_827364"}</span>
                </div>
              </div>

              <button onClick={onClose} className="btn-primary px-12 py-4">
                Done
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BookingModal;
