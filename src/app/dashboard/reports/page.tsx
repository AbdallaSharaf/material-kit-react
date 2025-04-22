import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { config } from '@/config';
import { OrdersTable } from '@/components/dashboard/orders/orders-table';
import { useTranslations } from 'next-intl';
import { ReportsCard } from '@/components/dashboard/reports/reports-card';
import { Grid } from '@mui/material';

export const metadata = {
  title: `Reports | Dashboard | ${config.site.name}`,
} satisfies Metadata;

export default function Page() {
  const t = useTranslations("common")
    // const isOrdersLive = true;

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
            <div className='flex gap-3 items-center'>
                <Typography variant="h4">{t("Reports")}</Typography>
                {/* {isOrdersLive && (
                <Chip
                    label="Live"
                    color="success"
                    icon={
                    <CircularProgress
                        size={20}
                        thickness={5}
                        color="inherit"
                    />
                    }
                />
                )} */}
            </div>
            <div className='flex gap-3 items-center'>
                
            </div>
          {/* <OrderSettingsModal /> */}
        </div>
      </Stack>

   {/* Section 1 */}
   <Stack spacing={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <ReportsCard reportKey="salesReport" title={t("Sales Report")} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <ReportsCard reportKey="topSellingByQty" title={t("topSellingByQty")} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <ReportsCard reportKey="topSellingByRevenue" title={t("topSellingByRevenue")} />
          </Grid>
        </Grid>
      </Stack>

      {/* Section 2 */}
      <Stack spacing={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <ReportsCard reportKey="lowestSelling" title={t("lowestSelling")} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <ReportsCard reportKey="repeatedCustomers" title={t("repeatedCustomers")} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <ReportsCard reportKey="newCustomers" title={t("newCustomers")} />
          </Grid>
        </Grid>
      </Stack>

      {/* Section 3 */}
      <Stack spacing={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <ReportsCard reportKey="highValueCustomers" title={t("highValueCustomers")} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <ReportsCard reportKey="ordersAndInvoices" title={t("ordersAndInvoices")} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <ReportsCard reportKey="monthlyComparison" title={t("monthlyComparison")} />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
}
