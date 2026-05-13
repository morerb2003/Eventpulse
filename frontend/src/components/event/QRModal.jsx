import { motion } from "framer-motion";
import { Download, X, QrCode } from "lucide-react";

const QRModal = ({ eventId, eventTitle, onClose }) => {
  const feedbackUrl = `${window.location.origin}/feedback/submit/${eventId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(feedbackUrl)}`;

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
        className="card max-w-sm w-full bg-slate-900 border-white/10 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <QrCode className="text-primary w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Feedback QR Code</h2>
          <p className="text-slate-400 text-sm mt-1">{eventTitle}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl mb-6 flex justify-center">
          <img src={qrUrl} alt="Event QR Code" className="w-48 h-48" />
        </div>

        <div className="space-y-3">
          <p className="text-xs text-slate-500 text-center px-4">
            Attendees can scan this code to instantly access the feedback form for this event.
          </p>
          <a 
            href={qrUrl} 
            download={`${eventTitle}_QR.png`}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
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
