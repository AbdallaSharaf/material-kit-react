import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'
import CategoryForm from '@/components/dashboard/categories/category-form'

const page = () => {
  return (
    <Stack spacing={3}>
    <Stack direction="row" spacing={3}>
      <div className="flex w-full justify-between items-center">
        <Typography variant="h4">Add Category</Typography>
      </div>
    </Stack>

    <CategoryForm />

  </Stack>
  )
}

export default page