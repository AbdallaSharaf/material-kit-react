import Swal from "sweetalert2";
import { addSetting, setRefreshData, updateSetting, deleteSetting, fetchUiSettings } from "../redux/slices/uiSettingsSlice"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store/store";
import { SettingIn, SettingOut } from "../interfaces/uiSettingsInterface";
import { useRouter } from 'next/navigation'; // App Router

   
export const useSettingHandlers = () => {

  const {
    refreshData,
  } = useSelector((state: RootState) => state.uiSettings);

  const router = useRouter();

const dispatch = useDispatch<AppDispatch>()
  const handleCreateSetting = async ({values, key }: {values: SettingOut, key: string}) => {
    
        // This setting is a Setting.
        Swal.fire({
          title: "Adding Photo...",
          text: "Please wait while we add the photo.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); // Show loading spinner
          },
        });
        try {
          const resultAction = await dispatch(addSetting({key, settingData: values}));
          Swal.hideLoading();
          if (addSetting.fulfilled.match(resultAction)) {
            Swal.update({
              title: "Photo added!",
              text: `Photo has been successfully added.`,
              icon: "success",
              showConfirmButton: true,
            });
            setTimeout(() => {
                Swal.close();
              }, 500);
            dispatch(setRefreshData(refreshData+1));
            return true

          } else {
            Swal.hideLoading()
            Swal.update({
              title: "Error adding photo",
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

    const handleUpdateSetting = async (
        {id, values, key}: {id: string, values: Partial<SettingOut>, key: string}) => {
      // This setting is a Setting.
      Swal.fire({
        title: "Updating Photo...",
        text: "Please wait while we update the photo.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Show loading spinner
        },
      });
      try {
        const resultAction = await dispatch(updateSetting({id: id, updatedData: values, key}));
        Swal.hideLoading();
        if (updateSetting.fulfilled.match(resultAction)) {
          Swal.update({
            title: "Photo updated!",
            text: `Photo has been successfully updated.`,
            icon: "success",
            showConfirmButton: true,
          });
          setTimeout(() => {
              Swal.close();
            }, 500);
          dispatch(setRefreshData(refreshData+1));
          return true
        } else {
          Swal.update({
            title: "Error updating photo",
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

const handleDelete = async (key: string, setting: SettingIn) => {
    // Show confirmation dialog and await the user's response.
    const result = await Swal.fire({
      title: `Are you sure you want to delete this photo?`,
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
      // This setting is a Setting.
      Swal.update({
        title: "Deleting Photo...",
        text: "Please wait while we delete the photo.",
        allowOutsideClick: false,
      });
      try {
        const resultAction = await dispatch(deleteSetting({id: setting._id, key}));
        Swal.hideLoading();
        if (deleteSetting.fulfilled.match(resultAction)) {
          Swal.update({
            title: "Setting Deleted!",
            text: `Setting photo has been successfully deleted.`,
            icon: "success",
            confirmButtonText: "OK",
          });
          setTimeout(() => {
            Swal.close();
          }, 500);
          dispatch(setRefreshData(refreshData+1));
        } else {
          Swal.update({
            title: "Error Deleting photo",
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
   
  const fetchData = async (key: string) => {
    // Fetch uiSettings with pagination, sorting, and search
    const resultAction =  await dispatch(fetchUiSettings({key}));

    if (!fetchUiSettings.fulfilled.match(resultAction)) {
      console.error('Error fetching UiSettings:', resultAction.payload);
    } 
      // Handle errors (e.g., by showing a message or updating UI)
  };


  return {
    handleDelete,
    fetchData,
    handleUpdateSetting,
    handleCreateSetting,
  };
}