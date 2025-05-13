"use client";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { FormikProps } from 'formik';

interface AccountFormValues {
  profilePic: string | undefined;
  name: string;
  email: string;
  phone: string;
}

interface AccountDetailsFormProps {
  formik: FormikProps<AccountFormValues>;
}

export function AccountInfo({formik}: AccountDetailsFormProps): React.JSX.Element {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          // Update the formik values with the new image URL
          formik.setFieldValue('profilePic', e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Use the formik value if available, otherwise fall back to Redux store
  const profilePic = formik.values?.profilePic;

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={profilePic} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user?.name}</Typography>
            <Typography color="text.secondary" variant="body2">
              {user?.email}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'center' }}>
        <label htmlFor="profile-picture-upload">
          <Button 
            fullWidth 
            variant="text"
            component="span" // Important for file upload button
          >
            {profilePic ? 'Change picture' : 'Upload picture'}
          </Button>
        </label>
      </CardActions>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="profile-picture-upload"
          type="file"
          onChange={handleFileChange}
        />
    </Card>
  );
}