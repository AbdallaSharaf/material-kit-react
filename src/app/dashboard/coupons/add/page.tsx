
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import CouponForm from '@/components/dashboard/coupons/coupon-form';
import { useTranslations } from 'next-intl';

const Page = () => {
  const t = useTranslations('common');

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">{t('AddCoupon')}</Typography>
        </div>
      </Stack>

      <CouponForm />
    </Stack>
  );
};

export default Page;
