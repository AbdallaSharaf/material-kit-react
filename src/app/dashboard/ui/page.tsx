import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { config } from '@/config';
import { TopProductsCard } from '@/components/dashboard/ui-settings/top-products-card';

export const metadata = {
  title: `UI Settings | Dashboard | ${config.site.name}`,
};

export default function UISettingsPage(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">UI Settings</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TopProductsCard />
        </Grid>
      </Grid>
    </Stack>
  );
}
