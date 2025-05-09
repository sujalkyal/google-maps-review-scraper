export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 mt-8">
      <div className="h-24 bg-gray-300 rounded" />
      <div className="h-24 bg-gray-300 rounded" />
      <div className="h-24 bg-gray-300 rounded" />
    </div>
  );
}