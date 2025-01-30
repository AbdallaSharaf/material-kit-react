'use client';

import * as React from 'react';
import { MaterialReactTable, MRT_ColumnDef, MRT_EditActionButtons, MRT_TableOptions } from 'material-react-table';
import { DialogActions, DialogContent, DialogTitle, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import CustomToolbar from './custom-toolbar';
import { Box } from '@mui/system';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { products } from '@/app/dashboard/products/page';
import dayjs from 'dayjs';


export interface Order {
    id: string;
    customer: {
      id: string;
      name: string;
      phone: string;
    };
    amount: number;
    shippingStatus: 'pending' | 'shipped' | 'delivered' | 'returned' | 'canceled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    createdAt: Date;
    notes?: string; // Optional field for extra info
    items: {
      id: string;
      quantity: number;
    }[];
  }
  

interface OrdersTableProps {
  data?: Order[];
}

const handleSaveRow: MRT_TableOptions<Order>['onEditingRowSave'] = ({
  exitEditingMode,
}) => {
  exitEditingMode();
};

// Define columns outside the component to avoid defining them during render
const columns: MRT_ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: 'Number',
    enableEditing: false,
    size: 70,
    enableColumnActions: false,
    enableSorting: false,
    enableColumnFilter: false
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    Cell: ({ cell }) => <div>{dayjs(cell.getValue<Date>()).format('MMMM D, YYYY, h:mm A')}</div>, // Format the date
  },
  { 
    accessorKey: 'customer.name', // Accessing phone inside customer object
    header: 'Name' 
  },
  { 
    accessorKey: 'customer.phone', // Accessing phone inside customer object
    header: 'Phone' 
  },
  {
    accessorKey: 'amount',
    header: 'Total Amount',
    enableEditing: false,
    filterVariant: 'range-slider',
    muiFilterSliderProps: {
      marks: true,
      max: 10000, //custom max (as opposed to faceted max)
      min: 100, //custom min (as opposed to faceted min)
      step: 100,
      valueLabelFormat: (value) =>
        value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'SAR',
        }),
    },
    Cell: ({ cell }) => <div>{cell.getValue<number>()} SAR</div>,
  },
];

const handleDelete = async (id: string) => {
  const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
  });
  console.log(id)
  if (result.isConfirmed) {
      try {
          Swal.fire('Deleted!', 'The user has been deleted.', 'success');
      } catch (error) {
          console.error('Error deleting user:', error);
          Swal.fire('Error!', 'There was a problem deleting the user.', 'error');
      }
  }
};

export function OrdersTable({
  data = [],
}: OrdersTableProps): React.JSX.Element {


  return (
    <Paper>
      <MaterialReactTable 
        columns={columns} 
        data={data} 
        enableRowSelection
        createDisplayMode= 'modal' //default ('row', and 'custom' are also available)
        editDisplayMode= 'modal' //default ('row', 'cell', 'table', and 'custom' are also available)
        enableEditing = {true}
        enableRowActions
        onEditingRowSave={handleSaveRow} 
        columnFilterDisplayMode = 'popover'
        positionToolbarAlertBanner= 'bottom'
        getRowId = {(row) => row.id}
        initialState= {{
          columnPinning: {
            right: ['mrt-row-actions'],
          },
        }}
        renderCreateRowDialogContent={ ({ table, row, internalEditComponents }) => (
          <>
            <DialogTitle variant="h3">Create New User</DialogTitle>
            <DialogContent
              sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {internalEditComponents} {/* or render custom edit components here */}
            </DialogContent>
            <DialogActions>
              <MRT_EditActionButtons variant="text" table={table} row={row} />
            </DialogActions>
          </>
        )}
        //optionally customize modal content
        renderEditRowDialogContent = {({ table, row, internalEditComponents }) => (
          <>
            <DialogTitle variant="h3">Edit User</DialogTitle>
            <DialogContent
              sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              {internalEditComponents} {/* or render custom edit components here */}
            </DialogContent>
            <DialogActions>
              <MRT_EditActionButtons variant="text" table={table} row={row} />
            </DialogActions>
          </>
        )}
        enableExpandAll= {false} //disable expand all button
        muiDetailPanelProps= {() => ({
          sx: (theme) => ({
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,210,244,0.1)'
                : 'rgba(0,0,0,0.1)',
          }),
        })}
        //custom expand button rotation
        muiExpandButtonProps= {({ row, table }) => ({
          onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
          sx: {
            transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
            transition: 'transform 0.2s',
          },
        })}
        //conditionally render detail panel
        renderDetailPanel= {({ row }) =>
            row.original.items ? (
                <Box className="flex flex-col gap-3">
                    {row.original.items.map((item) => {
                    const product = products.find((prod) => prod.id === item.id); // Find the product by item.id
                    return product ? (
                        <Box key={item.id} className='flex items-center'>
                        <img
                            src={product.image}
                            alt={product.name}
                            className='w-20 h-20 mr-3'
                        />
                        <Box className="flex flex-col gap-1">
                            <Typography><strong>ID:</strong> {item.id}</Typography>
                            <Typography><strong>Name:</strong> {product.name}</Typography>
                            <Typography><strong>Quantity:</strong> {item.quantity}</Typography>
                        </Box>
                        </Box>
                    ) : null;
                    })}
                </Box>
            ) : null
        }
        renderTopToolbarCustomActions = {({ table }) => (<CustomToolbar table={table} data={data}/>)}
        renderRowActions= {({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <i
                  className="fa fa-pencil !text-sm text-yellow-500 hover:text-yellow-600 cursor-pointer"
                ></i>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => handleDelete(row.original.id)}>
                <i
                  className="fa fa-trash !text-sm text-red-500 hover:text-red-600 cursor-pointer"
                ></i>
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
    </Paper>
  );
}
