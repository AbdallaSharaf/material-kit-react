'use client';

import * as React from 'react';
import { MaterialReactTable, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table';
import { Chip, ChipProps, IconButton, Menu, MenuItem, Paper, Select, SelectChangeEvent, Tooltip, Typography } from '@mui/material';
import CustomToolbar from './custom-toolbar';
import { Box } from '@mui/system';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store/store';
import { OrderIn } from '@/interfaces/orderInterface';
import dayjs from 'dayjs';
import { useOrderHandlers } from '@/controllers/ordersController';
import { setColumnFilters, setPagination, setSearchQuery } from '@/redux/slices/orderSlice';

// Define columns outside the component to avoid defining them during render


export function OrdersTable(): React.JSX.Element {
  const { fetchData, handleChangeStatus } = useOrderHandlers();
  const dispatch = useDispatch<AppDispatch>()
  
  const { refreshData, loading, orders, rowCount, pagination, columnFilters, searchQuery } = useSelector(
    (state: RootState) => state.orders
  )

  const orderColumns: MRT_ColumnDef<OrderIn>[] = [
    { 
      accessorKey: 'name',
      header: 'Name',
      size: 140,
      Cell: ({ row }) => row.original.shippingAddress?.name ?? row.original.user?.name ?? "N/A",
      enableColumnFilter: true,
      enableSorting: false,
    },
    {
      accessorKey: 'shippingAddress.phone',
      header: 'Phone',
      size: 110,
      enableColumnFilter: true,
      enableSorting: false,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 150,
      Cell: ({ row }) => row.original.shippingAddress.email,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      filterVariant: 'datetime-range',
      size: 120,
      Cell: ({ cell }) => <div>{dayjs(cell.getValue<string>()).format('MMMM D, YYYY, h:mm A')}</div>,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 100,
      Cell: ({ cell, row }) => {
        const status = cell.getValue<string>();
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
    
        const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        };
    
        const handleCloseMenu = () => {
          setAnchorEl(null);
        };
    
        const handleStatusChange = async (newStatus: string) => {
          handleCloseMenu();
          try {
            await handleChangeStatus({ _id: row.original._id, status: newStatus });
          } catch (error) {
            console.error('Failed to update status:', error);
          }
        };
    
        const color: ChipProps['color'] =
          status === 'newOrder' ? 'default' :
          status === 'accepted' ? 'primary' :
          status === 'shipped' ? 'info' :
          status === 'delivered' ? 'success' :
          status === 'cancelled' ? 'error' : 'warning';
    
        return (
          <>
            <Chip
              label={status}
              color={color}
              size="small"
              onDoubleClick={handleOpenMenu}
              sx={{ cursor: 'pointer' }}
            />
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
            >
              {['newOrder', 'accepted', 'shipped', 'delivered', 'cancelled', 'returned'].map((option) => (
                <MenuItem
                  key={option}
                  selected={option === status}
                  onClick={() => handleStatusChange(option)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </>
        );
      }
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      size: 100,
      filterVariant: 'select',
      filterSelectOptions: ['cod', 'credit_card'],
      Cell: ({ cell }) => {
        const value = cell.getValue<string>();
        const label = value === 'cod' ? 'Cash on Delivery' : 'Credit Card';
        const color: ChipProps['color'] = value === 'cod' ? 'default' : 'primary';
    
        return (
          <Chip
            label={label}
            color={color}
            size="small"
            variant="outlined"
          />
        );
      }
    },
    {
      accessorKey: 'isPaid',
      header: 'Payment Status',
      size: 100,
      filterVariant: 'checkbox',
      Cell: ({ cell }) => {
        const value = cell.getValue<boolean>();
        const label = value ? 'Paid' : 'Unpaid';
        const color: ChipProps['color'] = value ? 'success' : 'warning';
    
        return (
          <Chip
            label={label}
            color={color}
            size="small"
            variant="outlined"
          />
        );
      }
    },    
      {
        accessorKey: 'totalPrice',
        header: 'Total',
        size: 100,
        filterVariant: 'range-slider',
      muiFilterSliderProps: {
        marks: true,
        max: 10000,
        min: 100,
        step: 100,
        valueLabelFormat: (value) => `${value} EGP`,
      },
      Cell: ({ cell }) => <div>{cell.getValue<number>()} EGP</div>,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      accessorKey: 'shippingAddress.street',
      header: 'Street',
      size: 100,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      accessorKey: 'shippingAddress.city',
      header: 'City',
      size: 100,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      accessorKey: 'country',
      header: 'Country',
      size: 100,
      Cell: ({ row }) => row.original.shippingAddress?.country ?? "N/A",
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    },
  ];
  
  React.useEffect(() => {
    fetchData();
  }, [refreshData, searchQuery, columnFilters, pagination]);

  return (
    <Paper>
      <MaterialReactTable 
        columns={orderColumns} 
        data={orders} 
        enableRowSelection
        enableColumnResizing
        enableGlobalFilter={true}
        enableSorting={true}
        initialState={{
          columnVisibility: {
            email: false,
            country: false,
          }
        }}
        columnFilterDisplayMode='popover'
        state={{
          globalFilter: searchQuery,
          isLoading: loading,
          pagination,
          columnFilters,
        }}
        positionToolbarAlertBanner= 'bottom'
        manualFiltering={true}
        manualPagination={true}
        onColumnFiltersChange={(updaterOrValue) => {
            const newColumnFilters =
            typeof updaterOrValue === "function"
                ? updaterOrValue(columnFilters)
                : updaterOrValue;
            dispatch(setColumnFilters(newColumnFilters));
        }}
        onGlobalFilterChange={(newGlobalFilter: string) => dispatch(setSearchQuery(newGlobalFilter))}        

        onPaginationChange={(updaterOrValue) => {
          const newPagination =
          typeof updaterOrValue === "function"
              ? updaterOrValue(pagination)
              : updaterOrValue;
          dispatch(setPagination(newPagination));
        }}
        rowCount={rowCount}
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
            row.original.items.length > 0 ? (
                <Box className="flex flex-col gap-3">
                    {row.original.items.map((item) => {
                    return(
                        <Box key={item._id} className='grid grid-cols-2 items-center'>
                        <Box className="flex flex-col gap-1">
                            <Typography><strong>Name:</strong> {item.name?.["en"] || item.name?.["ar"]}</Typography>
                            <Typography><strong>Quantity:</strong> {item.quantity}</Typography>
                        </Box>
                        <Box className="flex flex-col gap-1">
                            <Typography><strong>Item price:</strong> {item.itemPrice}</Typography>
                            <Typography><strong>Total Price:</strong> {item.totalPrice}</Typography>
                        </Box>
                        </Box>
                    )
                    })}
                </Box>
            ) : null
        }
        layoutMode='grid'
        renderTopToolbarCustomActions = {({ table }) => (<CustomToolbar table={table} data={orders}/>)}
      />
    </Paper>
  );
}
