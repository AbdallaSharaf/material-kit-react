import { Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'
import ItemForm from '@/components/dashboard/items/items-form'

const page = () => {
  return (
    <Stack spacing={3}>
    <Stack direction="row" spacing={3}>
      <div className="flex w-full justify-between items-center">
        <Typography variant="h4">Add Item</Typography>
      </div>
    </Stack>

    <ItemForm />

  </Stack>
  )
}

export default page