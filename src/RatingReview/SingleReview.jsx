import React from "react";

const SingleReview = ({ item }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const rating = item?.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-start gap-4 p-4 border-l-[5px] border-[#5790EA] rounded-r-[6px] bg-[#F8F8F8]">
      <div className="w-1 bg-blue-500 rounded-l-lg"></div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800 capitalize">
              {item?.username || "Anonymous"}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(item?.created_at)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array(fullStars).fill(0).map((_, index) => (
                <span key={`full-${index}`} className="text-yellow-400 text-[30px]">
                  ★
                </span>
              ))}
              
              {hasHalfStar && (
                <span className="text-yellow-400 text-[30px] relative">
                  ★
                  <span className="absolute inset-0 bg-[#F8F8F8] w-1/2"></span>
                </span>
              )}
              
              {Array(emptyStars).fill(0).map((_, index) => (
                <span key={`empty-${index}`} className="text-gray-300 text-[30px]">
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-600 text-sm">({rating.toFixed(1)})</span>
          </div>
        </div>

        <p className="mt-2 text-gray-600">
          "{item?.review || "No review text provided"}"
        </p>
      </div>
    </div>
  );
};

export default SingleReview;