import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'
import ProductForm from '@/components/dashboard/products/product-form'
import { useTranslations } from 'next-intl'

const page = () => {
  const t = useTranslations("common")

  return (
    <Stack spacing={3}>
    <Stack direction="row" spacing={3}>
      <div className="flex w-full justify-between items-center">
        <Typography variant="h4">{t("Add Product")}</Typography>
      </div>
    </Stack>

    <ProductForm />

  </Stack>
  )
}

export default page