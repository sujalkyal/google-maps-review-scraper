export default function ReviewSummary({ summary }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6 text-text">
      <h2 className="text-xl font-bold mb-4 text-accent">Review Summary</h2>
      <p>Average Rating: {summary.avgRating} ⭐</p>
      <p>Total Reviews: {summary.total}</p>
      <p>Positive: {summary.positive} | Neutral: {summary.neutral} | Negative: {summary.negative}</p>
    </div>
  );
}