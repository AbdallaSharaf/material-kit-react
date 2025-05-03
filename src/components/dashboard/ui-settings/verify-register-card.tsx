'use client';

import * as React from 'react';
import axios from '@/utils/axiosInstance';
import { Button, CircularProgress, Paper, Stack, Switch, Typography, FormControlLabel } from '@mui/material';
import { useTranslations } from 'next-intl';

export function VerifyRegisterCard(): React.JSX.Element {
  const t = useTranslations('common');

  const [verifyRegister, setVerifyRegister] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const id = '67dc69372d9f897557d7f023'; // Static ID

  React.useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://fruits-heaven-api.onrender.com/api/v1/siteSettings/${id}`);
        const data = res.data.SiteSettings;
        setVerifyRegister(data.verifyRegister);
      } catch (error) {
        console.error('Error fetching offer settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`https://fruits-heaven-api.onrender.com/api/v1/siteSettings/${id}`, {
        verifyRegister: verifyRegister
      });
      // You can show success feedback here if you want
    } catch (error) {
      console.error('Error updating offer settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVerifyRegister(event.target.checked);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={600}>
          {t('Verify Registration')}
        </Typography>

        {loading ? (
          <Stack alignItems="center" justifyContent="center" py={4}>
            <CircularProgress />
          </Stack>
        ) : (
          <>
            <FormControlLabel
              control={
                <Switch
                  checked={verifyRegister}
                  onChange={handleSwitchChange}
                  color="primary"
                />
              }
              label={verifyRegister ? t('Enabled') : t('Disabled')}
            />
            <Button variant="contained" onClick={handleSave} disabled={saving}>
              {saving ? t('Saving') : t('Save')}
            </Button>
          </>
        )}
      </Stack>
    </Paper>
  );
}