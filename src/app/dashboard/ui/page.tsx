import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { config } from '@/config';
import { TopProductsCard } from '@/components/dashboard/ui-settings/top-products-card';
import { ImageSliderManager } from '@/components/dashboard/ui-settings/SliderManager';
import { useTranslations } from 'next-intl';
import { OffersParagraphCard } from '@/components/dashboard/ui-settings/offers-paragraph-card';

export const metadata = {
  title: `UI Settings | Dashboard | ${config.site.name}`,
};

export default function UISettingsPage(): React.JSX.Element {
  const t = useTranslations('common');

  return (
    <Stack spacing={3}>
      <Typography variant="h4">{t('UI Settings')}</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TopProductsCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <OffersParagraphCard />
        </Grid>
        <Grid item xs={12}>
          <ImageSliderManager title={t('Home Slider')} sectionKey="homeSlider" />
        </Grid>
        <Grid item xs={12}>
          <ImageSliderManager title={t('Offers First Slider')} sectionKey="offersFirstSlider" />
        </Grid>
        <Grid item xs={12}>
          <ImageSliderManager title={t('Offers Last Slider')} sectionKey="offersLastSlider" />
        </Grid>
      </Grid>
    </Stack>
  );
}
