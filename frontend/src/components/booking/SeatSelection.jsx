import { Armchair } from 'lucide-react';
import { motion } from 'framer-motion';

const SeatSelection = ({ seats, selectedSeat, onSelectSeat }) => {
  // Group seats by row
  const rows = seats.reduce((acc, seat) => {
    if (!acc[seat.rowLabel]) {
      acc[seat.rowLabel] = [];
    }
    acc[seat.rowLabel].push(seat);
    return acc;
  }, {});

  return (
    <div className="space-y-8 py-6">
      <div className="flex justify-center mb-10">
        <div className="w-2/3 h-2 bg-slate-700 rounded-full relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            Stage / Screen
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-x-auto pb-4">
        {Object.entries(rows).map(([rowLabel, rowSeats]) => (
          <div key={rowLabel} className="flex items-center gap-4 justify-center min-w-max">
            <div className="w-6 text-sm font-bold text-slate-500">{rowLabel}</div>
            <div className="flex gap-2">
              {rowSeats.sort((a, b) => a.seatNumber - b.seatNumber).map((seat) => (
                <motion.button
                  key={seat.id}
                  whileHover={!seat.booked ? { scale: 1.1 } : {}}
                  whileTap={!seat.booked ? { scale: 0.9 } : {}}
                  onClick={() => !seat.booked && onSelectSeat(seat)}
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-all relative
                    ${seat.booked 
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                      : selectedSeat?.id === seat.id 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' 
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600 hover:text-white border border-white/5'}
                  `}
                  title={`Seat ${rowLabel}${seat.seatNumber} - ${seat.booked ? 'Booked' : 'Available'}`}
                >
                  <Armchair className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 text-[8px] font-bold">
                    {seat.seatNumber}
                  </span>
                </motion.button>
              ))}
            </div>
            <div className="w-6 text-sm font-bold text-slate-500">{rowLabel}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-8 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-700/50 border border-white/5"></div>
          <span className="text-xs text-slate-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-800"></div>
          <span className="text-xs text-slate-400">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary"></div>
          <span className="text-xs text-slate-400">Selected</span>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
