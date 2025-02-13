import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import ProductForm from '@/components/dashboard/products/product-form';
import { products } from '../../page'; // Ensure this path is correct

interface PageProps {
  params: { id: string };
}

export default function ProductPage({ params }: PageProps) {
  const { id } = params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4">Product Not Found</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">
            {product && `Edit ${product.name}`}
          </Typography>
        </div>
      </Stack>

      {product && <ProductForm product={product} />}
    </Stack>
  );
};

