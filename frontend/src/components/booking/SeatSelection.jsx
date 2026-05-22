import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Layout constants ─────────────────────────────────────────────────────────
const SEAT_SIZE   = 28;   // px – rendered SVG seat width/height
const SEAT_GAP    = 7;    // px – gap between seats in a row
const ROW_HEIGHT  = 46;   // px – vertical space per row
const AISLE_AFTER = 5;    // insert an aisle gap after every Nth seat
const AISLE_WIDTH = 20;   // px – aisle width
const PAD_LEFT    = 44;   // px – left margin (row label column)
const PAD_TOP     = 68;   // px – top margin (stage + spacing)
const PAD_BOTTOM  = 24;
const STAGE_H     = 36;

// ─── Colour helpers ───────────────────────────────────────────────────────────
const COLORS = {
  available : { fill: '#1e293b', stroke: '#334155', text: '#94a3b8' },
  selected  : { fill: '#0ea5e9', stroke: '#38bdf8', text: '#ffffff' },
  booked    : { fill: '#0f172a', stroke: '#1e293b', text: '#334155' },
  hover     : { fill: '#1e3a5f', stroke: '#0ea5e9', text: '#bae6fd' },
};

// ─── Single SVG seat ─────────────────────────────────────────────────────────
const Seat = ({ seat, x, y, isSelected, onSelect, isBooked }) => {
  const [hovered, setHovered] = useState(false);

  const state = isBooked ? 'booked' : isSelected ? 'selected' : hovered ? 'hover' : 'available';
  const { fill, stroke, text } = COLORS[state];
  const R = 5; // corner radius

  return (
    <g
      transform={`translate(${x},${y})`}
      style={{ cursor: isBooked ? 'not-allowed' : 'pointer' }}
      onMouseEnter={() => !isBooked && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !isBooked && onSelect(seat)}
    >
      {/* Selection glow */}
      {isSelected && (
        <motion.rect
          x={-4} y={-4}
          width={SEAT_SIZE + 8} height={SEAT_SIZE + 8}
          rx={R + 3}
          fill="none"
          stroke="#38bdf8"
          strokeWidth={1.5}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.92, 1.05, 0.92] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        />
      )}

      {/* Hover glow */}
      {hovered && !isSelected && (
        <rect
          x={-3} y={-3}
          width={SEAT_SIZE + 6} height={SEAT_SIZE + 6}
          rx={R + 2}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth={1}
          opacity={0.5}
        />
      )}

      {/* Chair back */}
      <rect
        x={3} y={0}
        width={SEAT_SIZE - 6} height={7}
        rx={3}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
      />

      {/* Chair seat */}
      <rect
        x={0} y={8}
        width={SEAT_SIZE} height={SEAT_SIZE - 8}
        rx={R}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
      />

      {/* Seat number micro-label */}
      <text
        x={SEAT_SIZE / 2}
        y={SEAT_SIZE - 4}
        textAnchor="middle"
        fontSize={8}
        fontWeight="700"
        fill={text}
        fontFamily="monospace"
      >
        {seat.seatNumber}
      </text>
    </g>
  );
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────
const Tooltip = ({ seat, x, y }) => {
  if (!seat) return null;
  const state = seat.booked ? 'Occupied' : 'Available';
  const color = seat.booked ? '#ef4444' : '#10b981';
  return (
    <g transform={`translate(${x - 44},${y - 56})`} style={{ pointerEvents: 'none' }}>
      <rect x={0} y={0} width={88} height={44} rx={8} fill="#0f172a" stroke="#334155" strokeWidth={1} />
      <text x={44} y={16} textAnchor="middle" fontSize={10} fontWeight="800" fill="#f8fafc" fontFamily="system-ui">
        Row {seat.rowLabel} · #{seat.seatNumber}
      </text>
      <circle cx={44} cy={30} r={4} fill={color} />
      <text x={52} y={34} fontSize={9} fontWeight="700" fill={color} fontFamily="system-ui">
        {state}
      </text>
    </g>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const SeatSelection = ({ seats, selectedSeat, onSelectSeat }) => {
  const [tooltip, setTooltip] = useState(null); // { seat, x, y }
  const svgRef = useRef(null);

  // Group & sort seats into row arrays
  const rows = useMemo(() => {
    const map = {};
    seats.forEach(s => {
      if (!map[s.rowLabel]) map[s.rowLabel] = [];
      map[s.rowLabel].push(s);
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .map(([label, rowSeats]) => ({
        label,
        seats: [...rowSeats].sort((a, b) => +a.seatNumber - +b.seatNumber),
      }));
  }, [seats]);

  // Compute per-row x positions (with aisle gaps)
  const rowLayouts = useMemo(() => {
    return rows.map(({ seats: rowSeats }) => {
      const positions = [];
      let xCursor = 0;
      rowSeats.forEach((seat, idx) => {
        if (idx > 0 && idx % AISLE_AFTER === 0) xCursor += AISLE_WIDTH;
        positions.push({ seat, xOffset: xCursor });
        xCursor += SEAT_SIZE + SEAT_GAP;
      });
      return { positions, totalWidth: xCursor - SEAT_GAP };
    });
  }, [rows]);

  const maxRowWidth = useMemo(
    () => Math.max(...rowLayouts.map(r => r.totalWidth), 0),
    [rowLayouts]
  );

  const svgWidth  = PAD_LEFT + maxRowWidth + PAD_LEFT;
  const svgHeight = PAD_TOP + rows.length * ROW_HEIGHT + PAD_BOTTOM;

  const stageWidth = Math.min(maxRowWidth * 0.75, 400);
  const stageX     = PAD_LEFT + (maxRowWidth - stageWidth) / 2;

  // Stats
  const totalSeats     = seats.length;
  const bookedSeats    = seats.filter(s => s.booked).length;
  const availableSeats = totalSeats - bookedSeats;

  const handleSeatHover = (seat, svgX, svgY) => setTooltip({ seat, x: svgX, y: svgY });
  const clearTooltip = () => setTooltip(null);

  return (
    <div className="flex flex-col gap-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest px-1">
        <span className="text-slate-500">{totalSeats} total seats</span>
        <div className="flex items-center gap-4">
          <span className="text-emerald-400">{availableSeats} available</span>
          <span className="text-slate-600">{bookedSeats} occupied</span>
        </div>
      </div>

      {/* SVG map container */}
      <div className="w-full overflow-x-auto rounded-2xl bg-slate-950/60 border border-white/5 p-2">
        <div style={{ minWidth: svgWidth }}>
          <svg
            ref={svgRef}
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={{ display: 'block', margin: '0 auto' }}
          >
            {/* ── Background grid dots ── */}
            <defs>
              <pattern id="grid" width={20} height={20} patternUnits="userSpaceOnUse">
                <circle cx={1} cy={1} r={0.8} fill="#1e293b" />
              </pattern>
              {/* Radial fade mask so edges fade nicely */}
              <radialGradient id="stageFade" cx="50%" cy="100%" r="60%">
                <stop offset="0%"   stopColor="#0ea5e9" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"    />
              </radialGradient>
            </defs>
            <rect width={svgWidth} height={svgHeight} fill="url(#grid)" />

            {/* ── Stage ── */}
            <g>
              {/* Glow behind stage */}
              <ellipse
                cx={svgWidth / 2}
                cy={PAD_TOP - STAGE_H / 2}
                rx={stageWidth * 0.6}
                ry={STAGE_H * 1.4}
                fill="url(#stageFade)"
              />
              {/* Stage arc */}
              <path
                d={`M ${stageX} ${PAD_TOP - 8}
                    Q ${svgWidth / 2} ${PAD_TOP - STAGE_H - 12}
                      ${stageX + stageWidth} ${PAD_TOP - 8}
                    L ${stageX + stageWidth} ${PAD_TOP - 4}
                    Q ${svgWidth / 2} ${PAD_TOP - STAGE_H - 4}
                      ${stageX} ${PAD_TOP - 4} Z`}
                fill="#0c1a2e"
                stroke="#0ea5e9"
                strokeWidth={1.5}
              />
              <text
                x={svgWidth / 2}
                y={PAD_TOP - STAGE_H / 2 + 2}
                textAnchor="middle"
                fontSize={9}
                fontWeight="800"
                letterSpacing={3}
                fill="#0ea5e9"
                fontFamily="system-ui"
              >
                STAGE
              </text>
            </g>

            {/* ── Seats ── */}
            {rows.map((row, rowIdx) => {
              const layout = rowLayouts[rowIdx];
              const rowY   = PAD_TOP + rowIdx * ROW_HEIGHT;
              const rowContentWidth = layout.totalWidth;
              const rowStartX = PAD_LEFT + (maxRowWidth - rowContentWidth) / 2;

              return (
                <g key={row.label}>
                  {/* Row label – left */}
                  <text
                    x={rowStartX - 14}
                    y={rowY + SEAT_SIZE / 2 + 4}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight="800"
                    fill="#475569"
                    fontFamily="system-ui"
                  >
                    {row.label}
                  </text>

                  {/* Row label – right */}
                  <text
                    x={rowStartX + rowContentWidth + 14}
                    y={rowY + SEAT_SIZE / 2 + 4}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight="800"
                    fill="#475569"
                    fontFamily="system-ui"
                  >
                    {row.label}
                  </text>

                  {/* Seats */}
                  {layout.positions.map(({ seat, xOffset }) => {
                    const sx = rowStartX + xOffset;
                    const sy = rowY;
                    return (
                      <g
                        key={seat.id}
                        onMouseEnter={() => handleSeatHover(seat, sx + SEAT_SIZE / 2, sy)}
                        onMouseLeave={clearTooltip}
                      >
                        <Seat
                          seat={seat}
                          x={sx}
                          y={sy}
                          isSelected={selectedSeat?.id === seat.id}
                          isBooked={seat.booked}
                          onSelect={onSelectSeat}
                        />
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* ── Tooltip ── */}
            {tooltip && (
              <Tooltip seat={tooltip.seat} x={tooltip.x} y={tooltip.y} />
            )}
          </svg>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center justify-center gap-6 pt-1">
        {[
          { color: '#1e293b', border: '#334155', label: 'Available'  },
          { color: '#0ea5e9', border: '#38bdf8', label: 'Selected'   },
          { color: '#0f172a', border: '#1e293b', label: 'Occupied'   },
        ].map(({ color, border, label }) => (
          <div key={label} className="flex items-center gap-2">
            <svg width={16} height={16} viewBox="0 0 16 16">
              <rect x={0} y={0} width={16} height={16} rx={4}
                fill={color} stroke={border} strokeWidth={1.5} />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Selected seat callout ── */}
      <AnimatePresence>
        {selectedSeat && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex items-center justify-between rounded-2xl border border-sky-500/30 bg-sky-500/5 px-6 py-4"
          >
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 mb-0.5">
                Seat Selected
              </div>
              <div className="text-base font-black text-white">
                Row&nbsp;<span className="text-sky-400">{selectedSeat.rowLabel}</span>
                &nbsp;·&nbsp;Seat&nbsp;<span className="text-sky-400 font-mono">{selectedSeat.seatNumber}</span>
              </div>
            </div>
            <button
              onClick={() => onSelectSeat(null)}
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeatSelection;
