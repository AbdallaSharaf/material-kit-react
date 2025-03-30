import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { addProduct, deleteProduct, fetchProducts, setRefreshData, setRowCount, updateOrder, updateProduct } from "../redux/slices/productSlice";
import { Product } from "@/components/dashboard/products/products-table";
import { ProductIn, ProductOut } from "@/interfaces/productInterface";
import { useRouter } from "next/navigation";
   
export const useProductHandlers = () => {

const dispatch = useDispatch<AppDispatch>()
const router = useRouter();

  const {
    pagination,
    columnFilters,
    searchQuery,
    refreshData,
    sorting,
} = useSelector((state: RootState) => state.products);

const handleChangeStatus = async (product: ProductIn) => {
  try {
      const resultAction = await dispatch(updateProduct({id: product._id!, updatedData: {available: !product.available}}));
      if (updateProduct.fulfilled.match(resultAction)) {
        // Update the existing Swal instead of reopening it
        dispatch(setRefreshData(refreshData + 1));
      }
      else {  
        // Update the Swal alert with an error
        Swal.fire({
          title: 'Error Updating Product',
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

const handleChangeOrder = async ({id, newOrder}: {id: string, newOrder: number}) => {
  try {
      const resultAction = await dispatch(updateOrder({id,  order: newOrder}));
      if (updateOrder.fulfilled.match(resultAction)) {
        // Update the existing Swal instead of reopening it
        dispatch(setRefreshData(refreshData + 1));
      }
      else {  
        // Update the Swal alert with an error
        Swal.fire({
          title: 'Error Updating Product',
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


const handleUpdateProduct = async ({id, values}: {id: string, values: Partial<ProductOut>}) => {
    Swal.fire({
      title: 'Updating Product...',
      text: 'Please wait while we update the product.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Show loading spinner
      },
    });
    try {
      const resultAction = await dispatch(updateProduct({id, updatedData: values}));
      Swal.hideLoading()
      if (updateProduct.fulfilled.match(resultAction)) {
        // Update the existing Swal instead of reopening it
        Swal.update({
          title: 'Product Updated!',
          text: `Product has been successfully updated.`,
          icon: 'success',
          showConfirmButton: true,
        });
        setTimeout(() => {
            Swal.close();
          }, 500);
        dispatch(setRefreshData(refreshData + 1));
        router.push('/dashboard/products'); // 👈 Navigate here
        return true
      } else {  
        // Update the Swal alert with an error
        Swal.update({
          title: 'Error Updating Product',
          text: resultAction.payload ? String(resultAction.payload) : 'Unknown error',
          icon: 'error',
          showConfirmButton: true,
        });
        return false
      }
    } catch (error: any) {
      // Update the Swal alert for unexpected errors
      Swal.update({
        title: 'Unexpected Error',
        text: error.message,
        icon: 'error',
        showConfirmButton: true,
      });
      return false
    }
  };

  const fetchData = async () => {
        const { pageIndex, pageSize } = pagination;
  
        // Dispatch the action with the necessary parameters
        const resultAction = await dispatch(fetchProducts({
          page: pageIndex,
          pageSize,
          sorting,
          globalFilter: searchQuery,
          columnFilters
        }));
        // Check if the action was fulfilled and extract data
        if (fetchProducts.fulfilled.match(resultAction)) {
          const { totalCount } = resultAction.payload;
          dispatch(setRowCount(totalCount)); // Set the total row count from the response
        } else {
          // Handle errors (e.g., by showing a message or updating UI)
          console.error('Error fetching products:', resultAction.payload);
        }
      };

const handleDelete = async (product: ProductIn) => {
    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${product.name}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
  
    if (!confirmation.isConfirmed) {
      return; // Exit if the user cancels
    }
  
    // Show loading while processing deletion
    Swal.showLoading();
    Swal.update({
      title: 'Deleting Product...',
      text: 'Please wait while we delete the product.',
      allowOutsideClick: false,
    });
  
    try {
      const resultAction = await dispatch(deleteProduct(product._id));
      Swal.hideLoading();
  
      if (deleteProduct.fulfilled.match(resultAction)) {
        Swal.update({
          title: 'Product Deleted!',
          text: `Product ${product.name} has been successfully deleted.`,
          icon: 'success',
          showConfirmButton: true,
        });
      setTimeout(() => {
        Swal.close();
      }, 500);
        dispatch(setRefreshData(refreshData + 1));
      } else {
        Swal.update({
          title: 'Error Deleting Product',
          text: resultAction.payload ? String(resultAction.payload) : 'Unknown error occurred.',
          icon: 'error',
          showConfirmButton: true,
        });
      }
    } catch (error: any) {
      Swal.update({
        title: 'Unexpected Error',
        text: error.message || 'Something went wrong!',
        icon: 'error',
        showConfirmButton: true,
      });
    }
  };

  const handleCreateProduct = async (
      values: ProductOut) => {
      // Show the Swal alert immediately (only once)
      Swal.fire({
        title: 'Adding Product...',
        text: 'Please wait while we add the product.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Show loading spinner
        },
      });
      try {
        const resultAction = await dispatch(addProduct(values));
        Swal.hideLoading()
        if (addProduct.fulfilled.match(resultAction)) {
          // Update the existing Swal instead of reopening it
          Swal.update({
            title: 'Product Added!',
            text: `Product has been successfully added.`,
            icon: 'success',
            showConfirmButton: true,
          });
          setTimeout(() => {
              Swal.close();
            }, 500);
          dispatch(setRefreshData(refreshData + 1));
          router.push('/dashboard/products'); // 👈 Navigate here
          return true
        } else {  
          // Update the Swal alert with an error
          Swal.update({
            title: 'Error Adding Product',
            text: resultAction.payload ? String(resultAction.payload) : 'Unknown error',
            icon: 'error',
            showConfirmButton: true,
          });
          return false
        }
      } catch (error: any) {
        Swal.hideLoading()
        // Update the Swal alert for unexpected errors
        Swal.update({
          title: 'Unexpected Error',
          text: error.message,
          icon: 'error',
          showConfirmButton: true,
        });
        return false
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
        handleDelete,
        fetchOptions,
        handleCreateProduct,
        handleUpdateProduct,
        handleChangeOrder,
        handleChangeStatus
      };
}