import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, X, QrCode, ClipboardCheck, MessageSquare, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { getEventQr } from "../../api/eventApi";

const QRModal = ({ eventId, eventTitle, qrCodeBase64, onClose }) => {
  const [activeTab, setActiveTab] = useState("checkin"); // 'checkin' or 'feedback'
  const [checkInQrUrl, setCheckInQrUrl] = useState(qrCodeBase64 || "");
  const [loadingQr, setLoadingQr] = useState(!qrCodeBase64);
  
  const feedbackUrl = `${window.location.origin}/feedback/submit/${eventId}`;
  const feedbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(feedbackUrl)}`;

  const currentQr = activeTab === "checkin" ? checkInQrUrl : feedbackQrUrl;

  useEffect(() => {
    const fetchQr = async () => {
      if (qrCodeBase64) {
        setCheckInQrUrl(qrCodeBase64);
        setLoadingQr(false);
        return;
      }

      try {
        const data = await getEventQr(eventId);
        setCheckInQrUrl(data.qrCodeBase64 || "");
      } catch {
        toast.error("Failed to load event QR code");
      } finally {
        setLoadingQr(false);
      }
    };

    fetchQr();
  }, [eventId, qrCodeBase64]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card max-w-sm w-full bg-slate-900 border-white/10 relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 pt-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <QrCode className="text-primary w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Event QR Codes</h2>
          <p className="text-slate-400 text-sm mt-1">{eventTitle}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-800/50 p-1 rounded-xl mb-6 mx-4">
          <button
            onClick={() => setActiveTab("checkin")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "checkin" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" /> Check-In
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "feedback" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Feedback
          </button>
        </div>

        <div className="bg-white p-4 rounded-2xl mb-6 mx-4 flex justify-center items-center shadow-inner min-h-[224px]">
          {activeTab === "checkin" && loadingQr ? (
            <Loader2 className="w-10 h-10 text-slate-500 animate-spin" />
          ) : currentQr ? (
            <img src={currentQr} alt="Event QR Code" className="w-48 h-48" />
          ) : (
            <p className="text-sm text-slate-500 text-center">QR code is not available for this event yet.</p>
          )}
        </div>

        <div className="space-y-3 px-4 pb-4">
          <p className="text-[10px] text-slate-500 text-center leading-relaxed">
            {activeTab === "checkin" 
              ? "Attendees scan this with their phone's Camera app to mark attendance. (Do not use GPay/Payment apps)"
              : "Scan with your phone's Camera app to access the feedback form. (Do not use GPay/Payment apps)"}
          </p>
          <a 
            href={currentQr || "#"} 
            download={`${eventTitle}_${activeTab}_QR.png`}
            className={`btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 ${!currentQr ? "pointer-events-none opacity-50" : ""}`}
            target="_blank"
            rel="noreferrer"
          >
            <Download className="w-4 h-4" /> Download QR
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QRModal;
