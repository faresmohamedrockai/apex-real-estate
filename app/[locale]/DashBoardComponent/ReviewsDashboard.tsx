import { useState, useEffect } from "react";
import ReviewsList from "./Reviews/ReviewsList";
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";
import { useSession } from "next-auth/react";

interface Review {
  _id: string;
  name: string;
  phone: string;
  rating: number;
  review: string;
  review_en?: string;
  canShow: boolean;
  isApproved: boolean;
  project?: string;
  project_en?: string;
  unitType: string;
  unitType_en?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

const ReviewsDashboard = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    fetch("/api/review")
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewUpdated = () => {
    fetchReviews();
  };
  const handleReviewDeleted = () => {
    fetchReviews();
  };

  const allowedCount = reviews.filter(r => r.canShow).length;
  const totalCount = reviews.length;

  return (
    <div className="p-6 min-h-[60vh]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h2 className="text-3xl font-extrabold text-white text-right">المراجعات</h2>
        <div className="flex gap-4 text-white text-lg font-bold">
          <span>المسموح بها: <span className="text-green-400">{allowedCount}</span></span>
          <span>كل المراجعات: <span className="text-yellow-400">{totalCount}</span></span>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <LoadingSpinner size="lg" color="red" />
        </div>
      ) : (
        <ReviewsList reviews={reviews} onReviewUpdated={handleReviewUpdated} onReviewDeleted={handleReviewDeleted} />
      )}
    </div>
  );
};

export default ReviewsDashboard; 