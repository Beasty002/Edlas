import React from "react";
import ViewHeader from "../../sharedComponents/ViewHeader";
import SingleReview from "./SingleReview";

function ProductReview({ reviews }) {
  const heading = {
    main: "Product Reviews",
    sub: "Reviews and ratings for the products",
  };
  return (
    <div className="flex-1 border-[2px] border-[#D2D2D2] bg-[white] rounded-[3px] flex flex-col gap-2 p-3">
      <ViewHeader heading={heading} />
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        {
          reviews?.map((item) => (
            <SingleReview item={item} />
          ))
        }
      </div>
    </div>
  );
}

export default ProductReview;
