import { Star } from "lucide-react";
import { cx } from "@/utils/cx";

export interface RatingStarsProps {
  rating?: number;
  className?: string;
  starClassName?: string;
}

export const RatingStars = ({ rating = 5, className, starClassName }: RatingStarsProps) => {
  return (
    <div className={cx("flex", className)}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cx(
            "fill-current",
            i < Math.floor(rating) ? "text-[#FFC107]" : "text-slate-200",
            starClassName
          )}
        />
      ))}
    </div>
  );
};
