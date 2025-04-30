'use client';

import * as React from 'react';
import axios from '@/utils/axiosInstance';
import { Button, CircularProgress, Paper, Stack, TextField, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';

export function OffersParagraphCard(): React.JSX.Element {
  const t = useTranslations('common');

  const [englishParagraph, setEnglishParagraph] = React.useState('');
  const [arabicParagraph, setArabicParagraph] = React.useState('');
  const [offersTime, setOffersTime] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const id = '67dc69372d9f897557d7f023'; // Static ID

  React.useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://fruits-heaven-api.onrender.com/api/v1/siteSettings/${id}`);
        const data = res.data.SiteSettings;
        console.log(data);
        setEnglishParagraph(data.offersParagraph?.en ?? '');
        setArabicParagraph(data.offersParagraph?.ar ?? '');
        setOffersTime(data.offersTime ?? '');
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
        offersParagraph: {
          en: englishParagraph,
          ar: arabicParagraph,
        },
        offersTime: offersTime,
      });
      // You can show success feedback here if you want
    } catch (error) {
      console.error('Error updating offer settings:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={600}>
          {t('Offers Paragraph')}
        </Typography>

        {loading ? (
          <Stack alignItems="center" justifyContent="center" py={4}>
            <CircularProgress />
          </Stack>
        ) : (
          <>
            <TextField
              fullWidth
              label={t('Paragraph (English)')}
              value={englishParagraph}
              onChange={(e) => setEnglishParagraph(e.target.value)}
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label={t('Paragraph (Arabic)')}
              value={arabicParagraph}
              onChange={(e) => setArabicParagraph(e.target.value)}
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label={t('Offers End Time')}
              type="datetime-local"
              value={offersTime ? dayjs(offersTime).format('YYYY-MM-DDTHH:mm') : ''}
              onChange={(e) => {
                const newValue = e.target.value;
                setOffersTime(newValue ? dayjs(newValue).toISOString() : '');
              }}
              InputLabelProps={{
                shrink: true,
              }}
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