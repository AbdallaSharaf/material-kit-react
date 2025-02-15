'use client';

import * as React from 'react';
import { MaterialReactTable, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table';
import { Chip, ChipProps, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import CustomToolbar from './custom-toolbar';
import { Box } from '@mui/system';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.min.css';
import dayjs from 'dayjs';
import EditOrderDialog from './edit-order-dialog';
import { products } from '../products/products-table';

type ChipColor = ChipProps['color']; 

const statusColors: Record<Order['shippingStatus'], ChipColor> = {
    pending: 'warning',
    shipped: 'primary',
    delivered: 'success',
    returned: 'error',
    canceled: 'default',
  };
  
  const paymentColors: Record<Order['paymentStatus'], ChipColor> = {
    pending: 'warning',
    paid: 'success',
    failed: 'error',
    refunded: 'info',
  };

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
    grow: true,

    size: 70,
    enableColumnActions: false,
    enableSorting: false,
    enableColumnFilter: false
},
{ 
    accessorKey: 'customer.name', // Accessing phone inside customer object
    header: 'Name',
    grow: true,
    size: 140
},
{
    accessorKey: 'createdAt',
    enableEditing: false,
    filterVariant: 'datetime-range',
    size: 120,
    header: 'Date',
    Cell: ({ cell }) => <div>{dayjs(cell.getValue<Date>()).format('MMMM D, YYYY, h:mm A')}</div>, // Format the date
},
  { 
    accessorKey: 'customer.phone', // Accessing phone inside customer object
    header: 'Phone',
    size: 110,
},
{
    accessorKey: 'paymentStatus',
    header: 'Payment',
    editVariant: 'select',
    filterVariant: "select",
    filterSelectOptions: ['pending' , 'paid' , 'failed' , 'refunded'],
    editSelectOptions: ['pending' , 'paid' , 'failed' , 'refunded'],
    size: 100,
    Cell: ({ cell }) => {
        const status = cell.getValue<Order['paymentStatus']>();
        return <Chip label={status.toUpperCase()} color={paymentColors[status]}/>;
    },
},
{
    accessorKey: 'shippingStatus',
    header: 'Shipping',
    editVariant: 'select',
    filterVariant: "select",
    filterSelectOptions: ['pending' , 'shipped' , 'delivered' , 'returned' , 'canceled'],
    editSelectOptions: ['pending' , 'shipped' , 'delivered' , 'returned' , 'canceled'],
    size: 100,
    Cell: ({ cell }) => {
      const status = cell.getValue<Order['shippingStatus']>();
      return <Chip label={status.toUpperCase()} color={statusColors[status]} />;
    },
  },
  {
    accessorKey: 'amount',
    header: 'Total',
    enableEditing: false,
    size: 100,
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
        enableColumnResizing
        
        onEditingRowSave={handleSaveRow} 
        columnFilterDisplayMode = 'popover'
        positionToolbarAlertBanner= 'bottom'
        getRowId = {(row) => row.id}
        positionActionsColumn="last" 
        renderCreateRowDialogContent={ ({ table, row, internalEditComponents }) => (
            <EditOrderDialog table={table} row={row} internalEditComponents={internalEditComponents} products={products} />
        )}

        renderEditRowDialogContent={({ table, row, internalEditComponents }) => (
            <EditOrderDialog table={table} row={row} internalEditComponents={internalEditComponents} products={products} isEditing/>
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
        layoutMode='grid'
        renderTopToolbarCustomActions = {({ table }) => (<CustomToolbar table={table} data={data}/>)}
        renderRowActions= {({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '4px'}}>
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
