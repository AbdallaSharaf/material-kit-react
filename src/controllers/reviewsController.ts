import { setRefreshData, updateReview } from "../redux/slices/reviewSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { fetchReviews } from "../redux/slices/reviewSlice";
import { ReviewOut } from "../interfaces/reviewInterface";

   
export const useReviewHandlers = () => {

  const {
    refreshData,
  } = useSelector((state: RootState) => state.reviews);

const dispatch = useDispatch<AppDispatch>()

    const handleUpdateReview = async (
        {id, values}: {id: string, values: Partial<ReviewOut>}) => {
      try {
        const resultAction = await dispatch(updateReview({id, updatedData: values}));
        if (updateReview.fulfilled.match(resultAction)) {
          dispatch(setRefreshData(refreshData+1));
          return true
        } else {
          return false
        }
      } catch (error: any) {
        return false

      }
    };

   
  const fetchData = async () => {
    // Fetch reviews with pagination, sorting, and search
    const resultAction = await dispatch(
      fetchReviews()
    );
    if (!fetchReviews.fulfilled.match(resultAction)) {
      console.error('Error fetching Reviews:', resultAction.payload);
    } 
      // Handle errors (e.g., by showing a message or updating UI)
  };

  return {
    fetchData,
    handleUpdateReview,
  };
}