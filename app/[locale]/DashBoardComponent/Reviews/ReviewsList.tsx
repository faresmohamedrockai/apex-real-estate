import { Switch } from "@/components/ui/switch";

interface Review {
  _id: string;
  name: string;
  rating: number;
  review: string;
  canShow: boolean;
}

interface ReviewsListProps {
  reviews: Review[];
  onReviewUpdated?: () => void;
  onReviewDeleted?: () => void;
  loading?: boolean;
}

export default function ReviewsList({ reviews, onReviewUpdated, loading }: ReviewsListProps) {
  const handleToggle = async (id: string, canShow: boolean) => {
    await fetch(`/api/review/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ canShow }),
    });
    onReviewUpdated && onReviewUpdated();
  };

  if (loading) return <div className="text-center text-white py-10">جاري التحميل...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {reviews.length > 0 ? reviews.map((rev) => (
        <div key={rev._id} className="relative bg-gradient-to-b from-[#b70501]/80 to-neutral-900/90 rounded-2xl shadow-xl p-8 flex flex-col gap-4 items-center border border-white/10">
          {/* علامة مرئية */}
          {rev.canShow && (
            <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">مرئية</span>
          )}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-bold text-white">{rev.name}</span>
            <span className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < rev.rating ? "text-yellow-400" : "text-gray-400"}>★</span>
              ))}
            </span>
          </div>
          <p className="text-white/90 text-right w-full">{rev.review}</p>
          <div className="flex items-center gap-2 mt-4 w-full justify-between">
            <span className="text-white text-sm">إظهار المراجعة</span>
            <Switch checked={rev.canShow} onCheckedChange={val => handleToggle(rev._id, val)} />
          </div>
        </div>
      )) : (
        <div className="col-span-full text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-xl font-medium text-white">لا توجد مراجعات</p>
        </div>
      )}
    </div>
  );
} 