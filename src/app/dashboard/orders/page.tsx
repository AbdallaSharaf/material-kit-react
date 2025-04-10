
import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { config } from '@/config';
import { OrdersTable } from '@/components/dashboard/orders/orders-table';
import OrderSettingsModal from '@/components/dashboard/orders/order-settings-modal';

export const metadata = {
  title: `Orders | Dashboard | ${config.site.name}`,
} satisfies Metadata;

export default function Page(): React.JSX.Element {

    // const isOrdersLive = true;

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
            <div className='flex gap-3 items-center'>
                <Typography variant="h4">Orders</Typography>
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
          <OrderSettingsModal />
        </div>
      </Stack>

      <OrdersTable />

    </Stack>
  );
}
