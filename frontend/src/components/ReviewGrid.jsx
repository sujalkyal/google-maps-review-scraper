import ReviewCard from "./ReviewCard";

export default function ReviewGrid({ reviews }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map((review, i) => (
        <ReviewCard key={i} review={review} />
      ))}
    </div>
  );
}