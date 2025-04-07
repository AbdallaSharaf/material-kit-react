import Swal from "sweetalert2";
import { addCoupon, setRefreshData, updateCoupon, updateCouponOrder, deleteCoupon, fetchActiveCoupons, fetchExpiredCoupons } from "../redux/slices/couponSlice"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { CouponIn, CouponOut } from "../interfaces/couponInterface";
import { useRouter } from 'next/navigation'; // App Router
import { fetchProducts } from "@/redux/slices/productSlice";
import { fetchCategories } from "@/redux/slices/categorySlice";

   
export const useCouponHandlers = () => {

  const {
    refreshData,
  } = useSelector((state: RootState) => state.coupons);

  const router = useRouter();

const dispatch = useDispatch<AppDispatch>()
  const handleCreateCoupon = async (
    values: CouponOut) => {
    
        // This coupon is a Coupon.
        Swal.fire({
          title: "Adding Coupon...",
          text: "Please wait while we add the coupon.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); // Show loading spinner
          },
        });
        try {
          const resultAction = await dispatch(addCoupon(values));
          Swal.hideLoading();
          if (addCoupon.fulfilled.match(resultAction)) {
            Swal.update({
              title: "Coupon added!",
              text: `Coupon has been successfully added.`,
              icon: "success",
              showConfirmButton: true,
            });
            setTimeout(() => {
                Swal.close();
              }, 500);
            dispatch(setRefreshData(refreshData+1));
            router.push('/dashboard/coupons'); // 👈 Navigate here
            return true

          } else {
            Swal.hideLoading()
            Swal.update({
              title: "Error adding coupon",
              text: resultAction.payload
                ? String(resultAction.payload)
                : "Unknown error occurred.",
              icon: "error",
              confirmButtonText: "OK",
            });
            return false

          }
        } catch (error: any) {
          Swal.hideLoading()
          Swal.update({
            title: "Unexpected Error",
            text: error.message || "Something went wrong!",
            icon: "error",
            confirmButtonText: "OK",
          });
          return false

        }
  };

    const handleUpdateCoupon = async (
        {id, values}: {id: string, values: Partial<CouponOut>}) => {
      // This coupon is a Coupon.
      Swal.fire({
        title: "Updating Coupon...",
        text: "Please wait while we update the coupon.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Show loading spinner
        },
      });
      try {
        const resultAction = await dispatch(updateCoupon({id: id, updatedData: values}));
        Swal.hideLoading();
        if (updateCoupon.fulfilled.match(resultAction)) {
          Swal.update({
            title: "Coupon updated!",
            text: `Coupon has been successfully updated.`,
            icon: "success",
            showConfirmButton: true,
          });
          setTimeout(() => {
              Swal.close();
            }, 500);
          dispatch(setRefreshData(refreshData+1));
          router.push('/dashboard/coupons'); // 👈 Navigate here
          return true
        } else {
          Swal.update({
            title: "Error updating coupon",
            text: resultAction.payload
              ? String(resultAction.payload)
              : "Unknown error occurred.",
            icon: "error",
            confirmButtonText: "OK",
          });
          return false
        }
      } catch (error: any) {
        Swal.update({
          title: "Unexpected Error",
          text: error.message || "Something went wrong!",
          icon: "error",
          confirmButtonText: "OK",
        });
        return false

      }
    };

    const handleChangeOrder = async ({id, newOrder}: {id: string, newOrder: number}) => {
      try {
          const resultAction = await dispatch(updateCouponOrder({id,  order: newOrder}));
          if (updateCouponOrder.fulfilled.match(resultAction)) {
            // Update the existing Swal instead of reopening it
            dispatch(setRefreshData(refreshData + 1));
          }
          else {  
            // Update the Swal alert with an error
            Swal.fire({
              title: 'Error Updating Coupon',
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

const handleChangeStatus = async (coupon: CouponIn) => {
  try {
      const resultAction = await dispatch(updateCoupon({id: coupon._id!, updatedData: {isActive: !coupon.isActive}}));
      if (updateCoupon.fulfilled.match(resultAction)) {
        // Update the existing Swal instead of reopening it
        dispatch(setRefreshData(refreshData + 1));
      }
      else {  
        // Update the Swal alert with an error
        Swal.fire({
          title: 'Error Updating Coupon',
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

const handleDelete = async (coupon: CouponIn) => {
    // Show confirmation dialog and await the user's response.
    const result = await Swal.fire({
      title: `Are you sure you want to delete ${coupon.code}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
  
    if (!result.isConfirmed) {
      return;
    }
  
    // Start loading indicator.
    Swal.showLoading();
      // This coupon is a Coupon.
      Swal.update({
        title: "Deleting Coupon...",
        text: "Please wait while we delete the coupon.",
        allowOutsideClick: false,
      });
      try {
        const resultAction = await dispatch(deleteCoupon(coupon._id));
        Swal.hideLoading();
        if (deleteCoupon.fulfilled.match(resultAction)) {
          Swal.update({
            title: "Coupon Deleted!",
            text: `Coupon ${coupon.code} has been successfully deleted.`,
            icon: "success",
            confirmButtonText: "OK",
          });
          setTimeout(() => {
            Swal.close();
          }, 500);
          dispatch(setRefreshData(refreshData+1));
        } else {
          Swal.update({
            title: "Error Deleting Coupon",
            text: resultAction.payload
              ? String(resultAction.payload)
              : "Unknown error occurred.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error: any) {
        Swal.update({
          title: "Unexpected Error",
          text: error.message || "Something went wrong!",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
  };
   
  const fetchData = async (active: boolean) => {
    // Fetch coupons with pagination, sorting, and search
    const resultAction = !active ? await dispatch(fetchExpiredCoupons()) : await dispatch(
      fetchActiveCoupons()
    );

    if (!fetchActiveCoupons.fulfilled.match(resultAction)) {
      console.error('Error fetching Coupons:', resultAction.payload);
    } 
      // Handle errors (e.g., by showing a message or updating UI)
  };

  const fetchOptions = async () => {
        await dispatch(fetchCategories())
        await dispatch(fetchProducts({ 
          page: 0,
          pageSize: 10000,
          columnFilters:[],
          sorting: null,
          globalFilter: null,
         }))
    };

  return {
    handleDelete,
    fetchData,
    handleUpdateCoupon,
    handleCreateCoupon,
    handleChangeOrder,
    handleChangeStatus,
    fetchOptions
  };
}