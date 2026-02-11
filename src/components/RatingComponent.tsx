import React, { useState, useEffect } from "react";
import axios from "../config/axios";
import { useAppDispatch, useAppSelector } from "../redux/app/hook";

import Button from "./Button";
import { useToast } from "./Toast";

interface Rating {
  id: string;
  rating: number;
  comment?: string;
  user: {
    id: string;
    fullName: string;
  };
  createdAt: string;
}

interface RatingResponse {
  ratings: Rating[];
  averageRating: number;
  totalRatings: number;
}

interface RatingComponentProps {
  recipeId: string;
  showReviews?: boolean;
  className?: string;
}

export default function RatingComponent({
  recipeId,
  showReviews = true,
  className = "",
}: RatingComponentProps) {
 const {   user } = useAppSelector((state) => state.auth)
  const { showToast } = useToast();

  const [ratingData, setRatingData] = useState<RatingResponse>({
    ratings: [],
    averageRating: 0,
    totalRatings: 0,
  });
  const [userRating, setUserRating] = useState<number>(0);
  const [userComment, setUserComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  // useEffect(() => {
  //   fetchRatings();
  // }, [recipeId]);

  // const fetchRatings = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.get(
  //       API_ENDPOINTS.RATINGS.GET("recipes", recipeId)
  //     );
  //     setRatingData(response.data);

  //     // Check if user has already rated this recipe
  //     if (user) {
  //       const existingRating = response.data.ratings.find(
  //         (r: Rating) => r.user.id === user._id
  //       );
  //       if (existingRating) {
  //         setUserRating(existingRating.rating);
  //         setUserComment(existingRating.comment || "");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching ratings:", error);
  //     showToast("Failed to load ratings", "error");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleSubmitRating = async () => {
  //   if (!user) {
  //     showToast("You must be logged in to rate recipes", "error");
  //     return;
  //   }

  //   if (userRating === 0) {
  //     showToast("Please select a rating", "error");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     const ratingData = {
  //       recipeId,
  //       rating: userRating,
  //       comment: userComment.trim() || undefined,
  //     };

  //     await axios.post(API_ENDPOINTS.RATINGS.CREATE, ratingData);

  //     // Refresh ratings
  //     await fetchRatings();
  //     setShowRatingForm(false);
  //     showToast("Rating submitted successfully!", "success");
  //   } catch (error: any) {
  //     console.error("Error submitting rating:", error);
  //     showToast(
  //       error.response?.data?.message || "Failed to submit rating",
  //       "error"
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const renderStars = (
    rating: number,
    interactive = false,
    size = "w-5 h-5"
  ) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      const halfFilled = i === Math.floor(rating) && rating % 1 >= 0.5;

      return (
        <button
          key={i}
          type="button"
          className={`${size} transition-colors ${
            interactive ? "hover:text-yellow-400 cursor-pointer" : ""
          } ${
            filled || (interactive && i < (hoveredRating || userRating))
              ? "text-yellow-400"
              : halfFilled
              ? "text-yellow-300"
              : "text-gray-300"
          }`}
          onClick={interactive ? () => setUserRating(i + 1) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(i + 1) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          disabled={!interactive}
        >
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      );
    });
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {/* Rating Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Ratings & Reviews
          </h3>
          {user && !showRatingForm && (
            <Button
              onClick={() => setShowRatingForm(true)}
              variant="outline"
              size="sm"
            >
              {userRating > 0 ? "Update Rating" : "Rate Recipe"}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl font-bold text-gray-900">
            {ratingData.averageRating > 0
              ? ratingData.averageRating.toFixed(1)
              : "0.0"}
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              {renderStars(ratingData.averageRating)}
            </div>
            <div className="text-sm text-gray-600">
              {ratingData.totalRatings} rating
              {ratingData.totalRatings !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Rating Form */}
      {showRatingForm && (
        <div className="border-t pt-6 mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            {userRating > 0 ? "Update Your Rating" : "Rate This Recipe"}
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                {renderStars(hoveredRating || userRating, true, "w-6 h-6")}
                <span className="text-sm text-gray-600 ml-2">
                  {(hoveredRating || userRating) > 0 && (
                    <>
                      {hoveredRating || userRating} star
                      {(hoveredRating || userRating) !== 1 ? "s" : ""}
                    </>
                  )}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Share your thoughts about this recipe..."
              />
            </div>

            <div className="flex gap-3">
              <Button
                // onClick={handleSubmitRating}
                loading={isSubmitting}
                disabled={isSubmitting || userRating === 0}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {userRating > 0 &&
                ratingData.ratings.some((r) => r.user.id === user?._id)
                  ? "Update Rating"
                  : "Submit Rating"}
              </Button>
              <Button
                onClick={() => {
                  setShowRatingForm(false);
                  setHoveredRating(0);
                }}
                variant="outline"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {showReviews && ratingData.ratings.length > 0 && (
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Recent Reviews
          </h4>

          <div className="space-y-4">
            {ratingData.ratings.slice(0, 5).map((rating) => (
              <div
                key={rating.id}
                className="border-b border-gray-100 pb-4 last:border-b-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {rating.user.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {rating.user.fullName}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {renderStars(rating.rating, false, "w-4 h-4")}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {rating.comment && (
                  <p className="text-gray-600 text-sm ml-11">
                    {rating.comment}
                  </p>
                )}
              </div>
            ))}
          </div>

          {ratingData.ratings.length > 5 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All Reviews ({ratingData.ratings.length})
              </Button>
            </div>
          )}
        </div>
      )}

      {ratingData.ratings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">⭐</div>
          <p>No ratings yet. Be the first to rate this recipe!</p>
        </div>
      )}
    </div>
  );
}
