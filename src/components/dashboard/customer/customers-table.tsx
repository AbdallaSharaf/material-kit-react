'use client';

import * as React from 'react';
import {MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import Avatar from '@mui/material/Avatar';
import dayjs from 'dayjs';
import { Paper } from '@mui/material';

export interface Customer {
  id: string;
  avatar: string;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  phone: string;
}

interface CustomersTableProps {
  rows?: Customer[];
}

export function CustomersTable({
  rows = [],
}: CustomersTableProps): React.JSX.Element {
  // Define columns for the MRT table
  const columns = React.useMemo<MRT_ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        Cell: ({ row }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Avatar src={row.original.avatar} />
            {row.original.name}
          </div>
        ),
      },
      { accessorKey: 'phone', header: 'Phone' },
      { accessorKey: 'email', header: 'Email' },
      {
        accessorKey: 'ordersCount',
        header: 'NO. of orders',
      },
      {
        accessorKey: 'totalSpent',
        header: 'Total Spent',
        Cell: ({ cell }) => <div>{cell.getValue<number>()} SAR</div>,
      },
    ],
    []
  );

  return (
    <Paper>
    <MaterialReactTable
      columns={columns}
      data={rows}
      enableRowSelection
      />
      </Paper>
  );
}
