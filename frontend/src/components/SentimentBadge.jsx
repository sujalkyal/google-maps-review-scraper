export default function SentimentBadge({ label }) {
  const sentimentColor = {
    positive: "bg-green-100 text-green-700",
    neutral: "bg-yellow-100 text-yellow-700",
    negative: "bg-red-100 text-red-700",
  }[label.toLowerCase()] || "bg-gray-100 text-gray-700";

  return (
    <span className={`text-xs px-2 py-1 rounded ${sentimentColor}`}>{label}</span>
  );
}