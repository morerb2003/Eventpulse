import { Star } from "lucide-react";

const RatingStars = ({ rating, setRating, interactive = true }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating(star)}
          className={`transition-all duration-200 ${
            interactive ? "hover:scale-110 active:scale-95" : ""
          }`}
        >
          <Star
            className={`w-8 h-8 ${
              star <= rating
                ? "fill-primary text-primary"
                : "text-slate-700 hover:text-slate-600"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
