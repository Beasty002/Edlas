import { useEffect, useState } from "react";
import { Star, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api_base } from "../App";
import axios, { Axios } from "axios";
import toast from "react-hot-toast";

export default function RatingDescription({ data: initialData, productId }) {
  const [isReview, setIsReview] = useState(true);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const { user } = useAuth();
  const [data, setData] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid date";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating, interactive = false) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        stars.push(
          <Star
            key={i}
            size={20}
            className={`cursor-pointer ${
              i <= (hoverRating || newRating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setNewRating(i)}
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            size={16}
            className={
              i <= fullStars
                ? "text-yellow-400 fill-yellow-400"
                : i <= fullStars + (hasHalfStar ? 1 : 0)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
          />
        );
      }
    }
    return stars;
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${api_base}/review`, {
        rating: newRating,
        comment: newReview,
        product_id: productId,
        user_id: user._id,
      });
      console.log(res);
    } catch (error) {
      // toast.error(error);
      console.log(error);
    } finally {
      setNewRating(5);
      setNewReview("");
    }
  };

  useEffect(() => {
    const checkCanReview = async () => {
      try {
        const res = await axios.post(`${api_base}/review/check`, {
          user_id: user._id,
          product_id: productId,
        });

        setCanReview(res.data.hasOrder);
      } catch (error) {
        console.log(error);
      }
    };

    checkCanReview();

    setData(initialData);
  }, []);

  return (
    <section className="mt-4">
      <div className="mt-20">
        <div className="flex">
          <p
            className={`border border-gray-400 px-5 py-3 text-sm cursor-pointer ${
              !isReview && "font-bold"
            }`}
            onClick={() => setIsReview(false)}
          >
            Description
          </p>
          <p
            className={`border border-gray-400 px-5 py-3 text-sm cursor-pointer ${
              isReview && "font-bold"
            }`}
            onClick={() => setIsReview(true)}
          >
            Reviews ({data?.nRating || 0})
          </p>
        </div>

        {!isReview ? (
          <div
            className="flex flex-col gap-4 border rounded-sm rounded-l-none rounded-bl-sm border-gray-400 px-6 py-6 text-sm text-gray-500"
            dangerouslySetInnerHTML={{ __html: data.description }}
          ></div>
        ) : (
          <div className="border p-6 rounded-sm rounded-l-none rounded-bl-sm border-gray-400">
            {/* ------------------------------------------------------------------------Reviews List --------------*/}
            <div className="space-y-6 mb-8">
              {data?.reviews ? (
                data.reviews.map((review, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <UserCircle size={36} className="text-gray-400" />
                        <span className="font-medium">
                          {review.user_id.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <div className="flex my-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-500">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-center">
                  No reviews yet <br /> <b>Be the first one to Review</b>
                </p>
              )}
            </div>

            {/*------------------------------------------------ Submit Review--------------------------*/}
            <div className="bg-gray-50 p-4 rounded-lg shadow-xs border border-gray-300">
              <h3 className="font-medium mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex gap-1">{renderStars(newRating, true)}</div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review
                </label>
                <textarea
                  className="w-full border rounded-md p-2 min-h-24"
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder={`${
                    canReview
                      ? "Share your ecperience with this product"
                      : "first buy then write your thoughts Till then play with the start up"
                  }`}
                  disabled={!canReview}
                />
              </div>
              <button
                className={`${
                  canReview
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white px-4 py-2 rounded-md transition-colors`}
                onClick={handleSubmit}
                disabled={!canReview}
              >
                Submit Review
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
