import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { fetchOrders, setRefreshData, setRowCount,updateOrder } from "../redux/slices/orderSlice";
import { OrderOut } from "@/interfaces/orderInterface";
   
export const useOrderHandlers = () => {

const dispatch = useDispatch<AppDispatch>()

  const {
    pagination,
    columnFilters,
    searchQuery,
    refreshData,
    sorting,
} = useSelector((state: RootState) => state.orders);

const handleChangeStatus = async (order: OrderOut) => {
  try {
      const resultAction = await dispatch(updateOrder({id: order._id, updatedData: {status: order.status}}));
      if (updateOrder.fulfilled.match(resultAction)) {
        // Update the existing Swal instead of reopening it
        dispatch(setRefreshData(refreshData + 1));
      }
      else {
        // Update the Swal alert with an error
        Swal.fire({
          title: 'Error Updating Order',
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


  const fetchData = async () => {
        const { pageIndex, pageSize } = pagination;
  
        // Dispatch the action with the necessary parameters
        const resultAction = await dispatch(fetchOrders({
          page: pageIndex,
          pageSize,
          sorting,
          globalFilter: searchQuery,
          columnFilters
        }));
        // Check if the action was fulfilled and extract data
        if (fetchOrders.fulfilled.match(resultAction)) {
          const { totalCount } = resultAction.payload;
          dispatch(setRowCount(totalCount)); // Set the total row count from the response
        } else {
          // Handle errors (e.g., by showing a message or updating UI)
          console.error('Error fetching orders:', resultAction.payload);
        }
      };

    const fetchOptions = async (id: string) => {
        // if ((subcategories.length === 0) || categories.length === 0) { // Avoid refetching if data is already loaded
        // await dispatch(fetchSubcategories({ id: id }))
        // await dispatch(fetchCategories({ 
        //   id: id,
        //   page: 0,
        //   pageSize: 1000,
        //   sorting: null,
        //   globalFilter: null,
        //  }))
        // }
    };

    return {
        fetchData,
        fetchOptions,
        handleChangeStatus,
      };
}