import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { fetchCustomers, setRefreshData, setRowCount, verifyUser} from "../redux/slices/customerSlice";   
import Swal from "sweetalert2";
import { CustomerIn } from "@/interfaces/customerInterface";
export const useCustomerHandlers = () => {

const dispatch = useDispatch<AppDispatch>()

  const {
    pagination,
    columnFilters,
    searchQuery,
    sorting,
    refreshData
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

      const handleVerifyUserCustomer = async (customer: CustomerIn) => {
        try {
            const resultAction = await dispatch(verifyUser({id: customer._id!, updatedData: {verified: !customer.verified}}));
            if (verifyUser.fulfilled.match(resultAction)) {
              // Update the existing Swal instead of reopening it
              dispatch(setRefreshData(refreshData + 1));
            }
            else {  
              // Update the Swal alert with an error
              Swal.fire({
                title: 'Error Updating Customer',
                text: resultAction.payload ? String(resultAction.payload) : 'Unknown error',
                icon: 'error',
                showConfirmButton: true,
              });
            }
          } catch (error: any) {
            // Fire the Swal alert for unexpected errors
            Swal.fire({
              title: 'Unexpected Error',
              text: error.message,
              icon: 'error',
              showConfirmButton: true,
            });
          }
        };

    return {
        fetchData,
        handleVerifyUserCustomer
      };
}