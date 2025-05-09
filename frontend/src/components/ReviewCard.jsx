import { motion } from "framer-motion";
import SentimentBadge from "./SentimentBadge";

export default function ReviewCard({ review }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl p-4 shadow-md"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-accent">{review.name}</h3>
        <span className="text-sm text-gray-500">{review.date}</span>
      </div>
      <p className="mb-2 text-text">{review.text}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm">⭐ {review.rating}</span>
        <SentimentBadge label={review.sentiment_label} />
      </div>
    </motion.div>
  );
}