import { motion } from "framer-motion";

const Skeleton = ({ className }) => {
  return (
    <div 
      className={`bg-slate-800 animate-pulse rounded-md ${className}`}
    ></div>
  );
};

export const CardSkeleton = () => (
  <div className="card h-full">
    <div className="flex justify-between mb-4">
      <Skeleton className="w-20 h-6 rounded-full" />
      <Skeleton className="w-16 h-4" />
    </div>
    <Skeleton className="w-3/4 h-7 mb-3" />
    <Skeleton className="w-full h-4 mb-2" />
    <Skeleton className="w-2/3 h-4 mb-6" />
    <div className="space-y-3">
      <Skeleton className="w-1/2 h-4" />
      <Skeleton className="w-1/3 h-4" />
    </div>
    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between">
      <Skeleton className="w-24 h-5" />
      <Skeleton className="w-8 h-8 rounded-lg" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-4">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 py-4 border-b border-white/5">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-grow space-y-2">
          <Skeleton className="w-1/4 h-5" />
          <Skeleton className="w-1/6 h-3" />
        </div>
        <Skeleton className="w-20 h-8 rounded-lg" />
      </div>
    ))}
  </div>
);

export default Skeleton;
