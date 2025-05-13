'use client';

import { AccountInfo } from "./account-info";
import { AccountDetailsForm } from "./account-details-form";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Box } from '@mui/material';
import { AppDispatch } from '@/redux/store/store';
import { updateAccount } from "@/redux/slices/userSlice";
import Swal from 'sweetalert2';

const AccountWrapper = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      profilePic: user?.profilePic || undefined,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone: Yup.string().matches(/^[0-9]+$/, 'Must be only numbers'),
      profilePic: Yup.string().optional(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const resultAction = await dispatch(updateAccount(values));
        
        if (updateAccount.fulfilled.match(resultAction)) {
          await Swal.fire({
            title: 'Success!',
            text: 'Profile updated successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else if (updateAccount.rejected.match(resultAction)) {
          const error = resultAction.payload || 'Update failed';
          await Swal.fire({
            title: 'Error!',
            text: error as string,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        await Swal.fire({
          title: 'Error!',
          text: 'An unexpected error occurred',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        width: '100%'
      }}>
        <Box sx={{
          width: { xs: '100%', md: '33%', lg: '33%' },
          minWidth: { md: '300px' }
        }}>
          <AccountInfo formik={formik} />
        </Box>
        <Box sx={{
          width: { xs: '100%', md: '67%', lg: '67%' },
          flexGrow: 1
        }}>
          <AccountDetailsForm formik={formik} />
        </Box>
      </Box>
    </form>
  );
};

export default AccountWrapper;