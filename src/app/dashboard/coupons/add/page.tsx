import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'
import CouponForm from '@/components/dashboard/coupons/coupon-form'

const page = () => {
  return (
    <Stack spacing={3}>
    <Stack direction="row" spacing={3}>
      <div className="flex w-full justify-between items-center">
        <Typography variant="h4">Add Coupon</Typography>
      </div>
    </Stack>

    <CouponForm />

  </Stack>
  )
}

export default page