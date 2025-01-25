'use client';

import * as React from 'react';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import Avatar from '@mui/material/Avatar';
import { Paper } from '@mui/material';
import CustomToolbar from './custom-toolbar';

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
  data?: Customer[];
}

// Define columns outside the component to avoid defining them during render
const columns: MRT_ColumnDef<Customer>[] = [
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
];

export function CustomersTable({
  data = [],
}: CustomersTableProps): React.JSX.Element {


  return (
    <Paper>
      <MaterialReactTable 
        columns={columns} 
        data={data} 
        enableRowSelection
        columnFilterDisplayMode = 'popover'
        positionToolbarAlertBanner= 'bottom'
        renderTopToolbarCustomActions = {({ table }) => (<CustomToolbar table={table} data={data}/>)}
      />
    </Paper>
  );
}
