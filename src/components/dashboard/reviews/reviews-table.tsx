'use client';

import * as React from 'react';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import { Box, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';

export interface Review {
  id: string;
  type: string;
  name: string;
  date: string;
  status: boolean;
  rating: string;
  content: string;
  phone: string;
}

// Define columns outside the component
const columns: MRT_ColumnDef<Review>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'status',
    header: 'Visible',
    Cell: ({ row }) => (
      <Switch
        checked={row.original.status}
        onChange={() => console.log(`Toggled status for ${row.original.id}`)}
        color="primary"
      />
    ),
    enableSorting: false,
    enableColumnActions: false,
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    Cell: ({ cell }) => (
      <Rating
        value={parseFloat(cell.getValue<string>())}
        precision={0.5}
        readOnly
      />
    ),
  },
];

// Table Component
export function ReviewsTable({ data = [] }: { data?: Review[] }): React.JSX.Element {
  return (
    <Paper>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableRowSelection
        columnFilterDisplayMode="popover"
        positionToolbarAlertBanner="bottom"
        getRowId={(row) => row.id}
        enableEditing={false} // Editing disabled
        enableRowActions={false} // Deleting disabled
        enableExpandAll
        renderDetailPanel={({ row }) => (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2">{row.original.content}</Typography>
          </Box>
        )}
      />
    </Paper>
  );
}
