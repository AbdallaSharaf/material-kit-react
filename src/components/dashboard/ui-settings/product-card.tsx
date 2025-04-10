"use client";
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface ProductCardProps {
  product: {
    _id: string;
    name: { en: string; ar?: string };
    images?: string[];
  };
}

export const ProductCard = ({ product }: ProductCardProps): React.JSX.Element => {
  return (
    <Card sx={{ width: 200 }}>
      {product.images && (
        <img src={product.images?.[0]} alt={product.name.en ?? product.name.ar} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
      )}
      <CardContent>
        <Typography variant="subtitle1">{product.name.en ?? product.name.ar}</Typography>
      </CardContent>
    </Card>
  );
};
