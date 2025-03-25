import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import ProductForm from '@/components/dashboard/products/product-form';
import dayjs from 'dayjs';
import { Product } from '@/components/dashboard/products/products-table';

interface PageProps {
  params: { id: string };
}

const products: Product[] = [
  {
    id: 'PRD-005',
    name: 'Soja & Co. Eucalyptus',
    image: '/assets/product-5.png',
    price: 150, // Price in SAR
    updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),
    tags: ['aromatic', 'organic'],
    isPricePerKilo: true,
    isActive: true,
  },
  {
    id: 'PRD-004',
    name: 'Necessaire Body Lotion',
    image: '/assets/product-4.png',
    price: 120,
    updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate(),
    tags: ['skincare', 'hydrating'],
    isPricePerKilo: false,
    isActive: false,
  },
  {
    id: 'PRD-003',
    name: 'Ritual of Sakura',
    image: '/assets/product-3.png',
    price: 200,
    updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate(),
    tags: ['luxury', 'floral'],
    isPricePerKilo: true,
    isActive: true,
  },
  {
    id: 'PRD-002',
    name: 'Lancome Rouge',
    image: '/assets/product-2.png',
    price: 180,
    updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate(),
    tags: ['makeup', 'bold'],
    isPricePerKilo: false,
    isActive: true,
  },
  {
    id: 'PRD-001',
    name: 'Erbology Aloe Vera',
    image: '/assets/product-1.png',
    price: 250,
    updatedAt: dayjs().subtract(10, 'minutes').toDate(),
    tags: ['natural', 'soothing'],
    isPricePerKilo: true,
    isActive: false,
  },
];


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

