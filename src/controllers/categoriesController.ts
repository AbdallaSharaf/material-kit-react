import Swal from "sweetalert2";
import { addCategory, setRefreshData, updateCategory } from "../redux/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { deleteCategory, fetchCategories } from "../redux/slices/categorySlice";
import { CategoryIn, CategoryOut } from "../interfaces/categoryInterface";
import { useRouter } from 'next/navigation'; // App Router

   
export const useCategoryHandlers = () => {

  const {
    refreshData,
  } = useSelector((state: RootState) => state.categories);

  const router = useRouter();

const dispatch = useDispatch<AppDispatch>()
  const handleCreateCategory = async (
    values: CategoryOut) => {
    
        // This item is a Category.
        Swal.update({
          title: "Adding Category...",
          text: "Please wait while we add the category.",
          allowOutsideClick: false,
        });
        try {
          const resultAction = await dispatch(addCategory(values));
          Swal.hideLoading();
          if (addCategory.fulfilled.match(resultAction)) {
            await Swal.fire({
              title: "Category added!",
              text: `Values ${values.name} has been successfully added.`,
              icon: "success",
              confirmButtonText: "OK",
            });
            setTimeout(() => {
                Swal.close();
              }, 500);
            dispatch(setRefreshData(refreshData+1));
            router.push('/dashboard/products'); // 👈 Navigate here
            return true

          } else {
            await Swal.fire({
              title: "Error adding category",
              text: resultAction.payload
                ? String(resultAction.payload)
                : "Unknown error occurred.",
              icon: "error",
              confirmButtonText: "OK",
            });
            return false

          }
        } catch (error: any) {
          await Swal.fire({
            title: "Unexpected Error",
            text: error.message || "Something went wrong!",
            icon: "error",
            confirmButtonText: "OK",
          });
          return false

        }
  };

    const handleUpdateCategory = async (
        {id, values}: {id: string, values: Partial<CategoryOut>}) => {
  
      // This item is a Category.
      Swal.update({
        title: "Updating Category...",
        text: "Please wait while we update the category.",
        allowOutsideClick: false,
      });
      try {
        const resultAction = await dispatch(updateCategory({id, updatedData: values}));
        Swal.hideLoading();
        if (updateCategory.fulfilled.match(resultAction)) {
          await Swal.fire({
            title: "Category updated!",
            text: `Category ${values.name} has been successfully updated.`,
            icon: "success",
            confirmButtonText: "OK",
          });
          setTimeout(() => {
              Swal.close();
            }, 500);
          dispatch(setRefreshData(refreshData+1));
          router.push('/dashboard/products'); // 👈 Navigate here
          return true
        } else {
          await Swal.fire({
            title: "Error updating category",
            text: resultAction.payload
              ? String(resultAction.payload)
              : "Unknown error occurred.",
            icon: "error",
            confirmButtonText: "OK",
          });
          return false
        }
      } catch (error: any) {
        await Swal.fire({
          title: "Unexpected Error",
          text: error.message || "Something went wrong!",
          icon: "error",
          confirmButtonText: "OK",
        });
        return false

      }
    };


const handleDelete = async (item: CategoryIn) => {
    // Show confirmation dialog and await the user's response.
    const result = await Swal.fire({
      title: `Are you sure you want to delete ${item.name}?`,
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
      // This item is a Category.
      Swal.update({
        title: "Deleting Category...",
        text: "Please wait while we delete the category.",
        allowOutsideClick: false,
      });
      try {
        const resultAction = await dispatch(deleteCategory(item._id));
        Swal.hideLoading();
        if (deleteCategory.fulfilled.match(resultAction)) {
          await Swal.fire({
            title: "Item Deleted!",
            text: `Item ${item.name} has been successfully deleted.`,
            icon: "success",
            confirmButtonText: "OK",
          });
          setTimeout(() => {
            Swal.close();
          }, 500);
          dispatch(setRefreshData(refreshData+1));
        } else {
          await Swal.fire({
            title: "Error Deleting Item",
            text: resultAction.payload
              ? String(resultAction.payload)
              : "Unknown error occurred.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error: any) {
        await Swal.fire({
          title: "Unexpected Error",
          text: error.message || "Something went wrong!",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
  };
   
  const fetchData = async () => {
    // Fetch categories with pagination, sorting, and search
    const resultAction = await dispatch(
      fetchCategories()
    );

    if (!fetchCategories.fulfilled.match(resultAction)) {
      console.error('Error fetching Categories:', resultAction.payload);
    } 
      // Handle errors (e.g., by showing a message or updating UI)
  };

  return {
    handleDelete,
    fetchData,
    handleUpdateCategory,
    handleCreateCategory
  };
}