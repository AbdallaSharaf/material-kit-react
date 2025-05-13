'use client';

import { 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  CardHeader, 
  Divider, 
  TextField,
  Box
} from '@mui/material';
import { FormikProps } from 'formik';
import { useTranslations } from 'next-intl';

interface AccountFormValues {
  name: string;
  email: string;
  phone: string;
  profilePic: string | undefined;
}

interface AccountDetailsFormProps {
  formik: FormikProps<AccountFormValues>;
}

export function AccountDetailsForm({ formik }: AccountDetailsFormProps): React.JSX.Element {
  const t = useTranslations('common');
  
  return (
    <Card>
      <CardHeader subheader={t('editableInfo')} title={t('profile')} />
      <Divider />
      <CardContent>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          '& .row': {
            display: 'flex',
            gap: 3,
            '& .field': {
              flex: 1
            },
            '@media (max-width: 600px)': {
              flexDirection: 'column',
              gap: 3
            }
          }
        }}>
          {/* Name Field - Full Width */}
          <Box className="field">
            <TextField
              fullWidth
              required
              label={t('name')}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name && t('errors.required')}
              variant="outlined"
            />
          </Box>

          {/* Email and Phone - Row */}
          <Box className="row">
            <Box className="field">
              <TextField
                fullWidth
                required
                label={t('email')}
                name="email"
                disabled
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={
                  formik.touched.email && 
                  (formik.errors.email === 'required' 
                    ? t('errors.required') 
                    : t('errors.invalidEmail'))
                }
                variant="outlined"
              />
            </Box>
            <Box className="field">
              <TextField
                fullWidth
                disabled
                label={t('phone')}
                name="phone"
                type="tel"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={
                  formik.touched.phone && 
                  (formik.errors.phone === 'required' 
                    ? t('errors.required') 
                    : t('errors.invalidPhone'))
                }
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button 
          type="submit" 
          variant="contained"
          disabled={formik.isSubmitting}
        >
          {t('saveDetails')}
        </Button>
      </CardActions>
    </Card>
  );
}