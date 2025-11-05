export default function OrderCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex gap-4">
          <div className="flex -space-x-2">
            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
          </div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div className="text-right">
          <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}
