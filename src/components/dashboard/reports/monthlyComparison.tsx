'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Typography, Paper, Stack } from '@mui/material';

interface MonthlySales {
  totalSales: number;
  month: number;
}

interface Props {
  data: MonthlySales[];
}

const monthLabels = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MonthlyComparisonReportView = ({ data }: Props) => {
  const formattedData = Array.from({ length: 12 }, (_, i) => {
    const monthData = data.find((d) => d.month === i + 1);
    return {
      month: monthLabels[i + 1],
      totalSales: monthData?.totalSales || 0,
    };
  });

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Monthly Sales Comparison</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalSales" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
};

export default MonthlyComparisonReportView;
