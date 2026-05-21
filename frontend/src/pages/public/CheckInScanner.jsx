import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  User, 
  Calendar, 
  Ticket, 
  ChevronLeft, 
  Keyboard, 
  Zap 
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../../api/api';
import toast from 'react-hot-toast';

const CheckInScanner = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); // idle, scanning, processing, success, error
  const [processing, setProcessing] = useState(false);
  const [attendeeData, setAttendeeData] = useState(null);
  const [resultMsg, setResultMsg] = useState("");
  
  const [manualToken, setManualToken] = useState("");
  const [showManual, setShowManual] = useState(false);
  
  const html5QrCodeRef = useRef(null);
  const readerId = "reader";

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current.stop().catch(err => console.error("Error stopping scanner on unmount", err));
        }
      }
    };
  }, []);

  const startScanner = async () => {
    setStatus("scanning");
    setShowManual(false);
    
    // Small delay to ensure the DOM element is rendered and ready
    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode(readerId);
        html5QrCodeRef.current = html5QrCode;
        
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            handleScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Ignore normal scanner search noise
          }
        );
      } catch (err) {
        console.error("Error starting camera", err);
        toast.error("Could not access camera. Please check permissions.");
        setStatus("idle");
      }
    }, 300);
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
  };

  const handleScanSuccess = async (decodedText) => {
    await stopScanner();
    processCheckIn(decodedText);
  };

  const extractCheckInToken = (rawValue) => {
    let token = rawValue.trim();
    
    // Support JSON payloads and older URL-shaped QR codes during rollout.
    try {
      if (token.startsWith('{')) {
        const parsed = JSON.parse(token);
        if (parsed.token || parsed.checkInToken) {
          return parsed.token || parsed.checkInToken;
        }
      }

      const parsedUrl = new URL(token);
      const queryToken = parsedUrl.searchParams.get("token");
      if (queryToken) {
        return queryToken;
      }

      const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
      const checkInIndex = pathParts.findIndex(part => part.toLowerCase() === "checkin");
      if (checkInIndex >= 0 && pathParts[checkInIndex + 1]) {
        return pathParts[checkInIndex + 1];
      }
    } catch {
      // Fallback to raw token text
    }

    return token;
  };

  const processCheckIn = async (decodedValue) => {
    const cleanToken = extractCheckInToken(decodedValue);

    if (!cleanToken) {
      setStatus("error");
      setResultMsg("Invalid ticket data format");
      return;
    }

    setProcessing(true);
    setStatus("processing");
    try {
      const response = await api.post('/checkin/scan', null, {
        params: {
          token: cleanToken
        }
      });
      if (response.data.success) {
        setAttendeeData(response.data);
        setStatus("success");
        toast.success("Attendee checked in!");
      } else {
        setResultMsg(response.data.message || "Verification failed");
        setStatus("error");
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Failed to process check-in";
      setResultMsg(errMsg);
      setStatus("error");
    } finally {
      setProcessing(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;
    processCheckIn(manualToken);
  };

  const handleReset = () => {
    setAttendeeData(null);
    setResultMsg("");
    setManualToken("");
    setStatus("idle");
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-950 text-white">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl z-10 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-semibold"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 fill-current" /> Live Terminal
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Ticket Gate Scanner
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            Scan attendee ticket QR codes to verify seat allocations.
          </p>
        </div>

        {/* Main Interface Card */}
        <div className="card bg-slate-900/80 border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />
          
          <AnimatePresence mode="wait">
            
            {/* Idle State */}
            {status === "idle" && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8 space-y-8"
              >
                <div className="w-24 h-24 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto shadow-lg shadow-primary/5">
                  <Camera className="w-12 h-12 text-primary" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-black">Camera Ready</h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                    Make sure you grant camera permissions to capture QR tickets.
                  </p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={startScanner}
                    className="btn-primary w-full py-4 text-base font-bold shadow-lg shadow-primary/20"
                  >
                    Activate Camera Scanner
                  </button>

                  <button 
                    onClick={() => setShowManual(!showManual)}
                    className="text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
                  >
                    <Keyboard className="w-4 h-4" /> {showManual ? "Hide Manual Input" : "Manual Ticket Token Lookup"}
                  </button>
                </div>

                {showManual && (
                  <motion.form 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleManualSubmit}
                    className="flex gap-2 pt-2"
                  >
                    <input 
                      type="text" 
                      placeholder="Enter Check-In Token" 
                      className="input-field flex-1"
                      value={manualToken}
                      onChange={(e) => setManualToken(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      disabled={!manualToken.trim()}
                      className="btn-primary px-6 disabled:opacity-50"
                    >
                      Verify
                    </button>
                  </motion.form>
                )}
              </motion.div>
            )}

            {/* Scanning State */}
            {status === "scanning" && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-4 space-y-6"
              >
                <div className="relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl shadow-emerald-500/5 bg-black">
                  
                  {/* Camera view element */}
                  <div id={readerId} className="w-full h-full object-cover [&_video]:w-full [&_video]:h-full [&_video]:object-cover" />
                  
                  {/* Scanning HUD Overlay */}
                  <div className="absolute inset-0 border-[24px] border-black/40 pointer-events-none" />
                  <div className="absolute inset-[24px] border-2 border-emerald-500/50 rounded-2xl pointer-events-none">
                    
                    {/* Laser scanning light */}
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{ y: 268 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 1.8,
                        ease: "easeInOut"
                      }}
                      className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_#ef4444] z-10"
                    />
                  </div>

                  {/* Corner Targets */}
                  <div className="absolute top-7 left-7 w-4 h-4 border-t-2 border-l-2 border-emerald-400 pointer-events-none" />
                  <div className="absolute top-7 right-7 w-4 h-4 border-t-2 border-r-2 border-emerald-400 pointer-events-none" />
                  <div className="absolute bottom-7 left-7 w-4 h-4 border-b-2 border-l-2 border-emerald-400 pointer-events-none" />
                  <div className="absolute bottom-7 right-7 w-4 h-4 border-b-2 border-r-2 border-emerald-400 pointer-events-none" />
                </div>

                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span className="text-sm font-black uppercase tracking-widest text-emerald-400">Aligning QR code...</span>
                  </div>
                  <p className="text-slate-500 text-xs font-medium">Position the QR code inside the box to check in automatically.</p>
                </div>

                <button 
                  onClick={async () => {
                    await stopScanner();
                    setStatus("idle");
                  }}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2"
                >
                  <CameraOff className="w-4 h-4" /> Cancel Scan
                </button>
              </motion.div>
            )}

            {/* Processing State */}
            {status === "processing" && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 space-y-6"
              >
                <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto shadow-premium">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Verifying Ticket</h3>
                  <p className="text-slate-400 text-sm">Validating booking status with the ticket server...</p>
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {status === "success" && attendeeData && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-6 space-y-8"
              >
                <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 border-2 border-emerald-500/50 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/10">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.25em] bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    Check-In Validated
                  </span>
                  <h3 className="text-3xl font-black pt-4">Welcome, Guest!</h3>
                </div>

                {/* Ticket Details Panel */}
                <div className="bg-black/20 rounded-[2rem] border border-white/5 p-6 text-left space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="flex items-start gap-4">
                    <User className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Attendee Name</div>
                      <div className="text-lg font-bold text-white">{attendeeData.attendeeName || attendeeData.userName}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Calendar className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Event / Performance</div>
                      <div className="text-base font-bold text-white">{attendeeData.eventTitle}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Ticket className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Seat Number</div>
                      <div className="text-base font-mono font-bold text-primary">{attendeeData.seatNumber}</div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleReset}
                  className="btn-primary w-full py-4 font-bold"
                >
                  Verify Next Ticket
                </button>
              </motion.div>
            )}

            {/* Error State */}
            {status === "error" && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-6 space-y-8"
              >
                <div className="w-24 h-24 rounded-[2.5rem] bg-accent/10 border-2 border-accent/50 flex items-center justify-center mx-auto shadow-2xl shadow-accent/10">
                  <AlertCircle className="w-12 h-12 text-accent" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-accent font-black uppercase tracking-[0.25em] bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
                    Invalid Ticket
                  </span>
                  <h3 className="text-3xl font-black pt-4">Verification Blocked</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed pt-2">
                    {resultMsg}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleReset}
                    className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white flex-1"
                  >
                    Reset Terminal
                  </button>
                  <button 
                    onClick={startScanner}
                    className="btn-primary flex-1 py-4 text-xs uppercase tracking-widest font-black"
                  >
                    Retry Scanner
                  </button>
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default CheckInScanner;
