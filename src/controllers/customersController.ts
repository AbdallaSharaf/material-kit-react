import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { fetchCustomers, setRowCount} from "../redux/slices/customerSlice";   
export const useCustomerHandlers = () => {

const dispatch = useDispatch<AppDispatch>()

  const {
    pagination,
    columnFilters,
    searchQuery,
    sorting,
} = useSelector((state: RootState) => state.customers);

  const fetchData = async () => {
        const { pageIndex, pageSize } = pagination;
  
        // Dispatch the action with the necessary parameters
        const resultAction = await dispatch(fetchCustomers({
          page: pageIndex,
          pageSize,
          sorting,
          globalFilter: searchQuery,
          columnFilters
        }));
        // Check if the action was fulfilled and extract data
        if (fetchCustomers.fulfilled.match(resultAction)) {
          const { totalCount } = resultAction.payload;
          dispatch(setRowCount(totalCount)); // Set the total row count from the response
        } else {
          // Handle errors (e.g., by showing a message or updating UI)
          console.error('Error fetching customers:', resultAction.payload);
        }
      };

    return {
        fetchData,
      };
}