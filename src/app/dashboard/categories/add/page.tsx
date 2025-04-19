import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'
import CategoryForm from '@/components/dashboard/categories/category-form'
import { useTranslations } from 'next-intl'

const page = () => {
  const t = useTranslations('common');
  return (
    <Stack spacing={3}>
    <Stack direction="row" spacing={3}>
      <div className="flex w-full justify-between items-center">
        <Typography variant="h4">{t('Add Category')}</Typography>
      </div>
    </Stack>

    <CategoryForm />

  </Stack>
  )
}

export default page