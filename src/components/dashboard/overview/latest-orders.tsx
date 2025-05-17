'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';


export interface LatestOrdersProps {
  sx?: SxProps;
}


import {
  ChipProps,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material';
import { MaterialReactTable, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table';

import '@fortawesome/fontawesome-free/css/all.min.css';
import { useOrderHandlers } from '@/controllers/ordersController';
import { OrderIn } from '@/interfaces/orderInterface';
import { RootState } from '@/redux/store/store';
import { useSelector } from 'react-redux';
import {useLocale, useTranslations } from 'next-intl';
import { MRT_Localization_AR } from 'material-react-table/locales/ar';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// Define columns outside the component to avoid defining them during render

export function LatestOrders({ sx }: LatestOrdersProps): React.JSX.Element {
  const t = useTranslations("common")
  const { fetchData, handleChangeStatus } = useOrderHandlers();
  const router = useRouter();
  const locale = useLocale() as "en" | "ar"
  const { refreshData, loading, orders } = useSelector(
    (state: RootState) => state.orders
  );

  const orderColumns: MRT_ColumnDef<OrderIn>[] = [
    {
      accessorKey: 'name',
      header: t('Name'),
      size: 140,
      accessorFn: (row) => row.shippingAddress?.name ?? row.user?.name ?? 'N/A',
      Cell: ({ row }) => row.original.shippingAddress?.name ?? row.original.user?.name ?? 'N/A',
      enableColumnFilter: true,
      enableSorting: false,
      filterFn: 'includes',
    },
    {
      accessorKey: 'shippingAddress.phone',
      header: t('Phone'),
      size: 110,
      enableColumnFilter: true,
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: t('Date'),
      filterVariant: 'datetime-range',
      size: 160,
      Cell: ({ cell }) => <div>{dayjs(cell.getValue<string>()).format('MMMM D, YYYY, h:mm A')}</div>,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      accessorKey: 'status',
      header: t('Status'),
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
          status === 'newOrder'
            ? 'default'
            : status === 'accepted'
              ? 'primary'
              : status === 'processing'
                ? 'secondary'
                : status === 'onDelivery'
                  ? 'info'
                  : status === 'delivered'
                    ? 'success'
                    : status === 'canceled'
                      ? 'error'
                      : status === 'returned'
                        ? 'warning'
                        : 'default';
    
        return (
          <>
            <Chip
              label={t(status)}
              color={color}
              size="small"
              onDoubleClick={handleOpenMenu}
              sx={{ cursor: 'pointer' }}
            />
            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
              {[
                'newOrder',
                'accepted',
                'processing',
                'onDelivery',
                'delivered',
                'canceled',
                'returned',
              ].map((option) => (
                <MenuItem
                  key={option}
                  selected={option === status}
                  onClick={() => handleStatusChange(option)}
                >
                  {t(option)}
                </MenuItem>
              ))}
            </Menu>
          </>
        );
      },
    },    
    {
      accessorKey: 'paymentMethod',
      header: t('Payment Method'),
      size: 166,
      filterVariant: 'select',
      filterSelectOptions: [t('COD'), t('CC')],
      Cell: ({ cell }) => {
        const value = cell.getValue<string>();
        const label = value === 'cod' ? t('COD') : t('CC');
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
      accessorKey: 'totalPrice',
      header: t('Total'),
      size: 100,
      filterVariant: 'range-slider',
      muiFilterSliderProps: {
        marks: true,
        max: 10000,
        min: 100,
        step: 100,
        valueLabelFormat: (value) => `${value} SAR`,
      },
      Cell: ({ cell }) => <div style={{ display: 'flex', alignItems: 'center' }}>{cell.getValue<number>()} <svg 
            id="Layer_1" 
            data-name="Layer 1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1124.14 1256.39" 
            width="16" 
            height="16" 
            style={{ marginLeft: 4 }}
          >
            <path fill="#231f20" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/>
            <path fill="#231f20" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/>
          </svg></div>,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    }
  ];

  React.useEffect(() => {
    fetchData();
  }, [refreshData]);


  return (
    <Card sx={sx}>
      <CardHeader title={t("Latest orders")} />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
      <Paper>
      <MaterialReactTable
        columns={orderColumns}
        data={orders}
        columnResizeDirection= {locale ==='ar' ? 'rtl' : 'ltr'}
        enableColumnResizing
        enableHiding={false}
        enableGlobalFilter={true}
        enableColumnActions={false}
        enableColumnFilters={false}
        enableSorting={false}
        localization={locale === 'ar' ? MRT_Localization_AR : MRT_Localization_EN}
        initialState={{
          density: 'compact'
        }}
        columnFilterDisplayMode="popover"
        state={{
          isLoading: loading,
        }}
        positionToolbarAlertBanner="bottom"
        muiDetailPanelProps={() => ({
          sx: (theme) => ({
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,210,244,0.1)' : 'rgba(0,0,0,0.1)',
          }),
        })}
        layoutMode="grid"
        muiTableHeadRowProps={{
          sx: {
            height: '50px', // increase header row height
            
          },
        }}
        enableBottomToolbar={false}
        muiTableHeadCellProps={{
          sx: {
            '& .Mui-TableHeadCell-Content-Wrapper': {
              overflow: 'visible !important', // override overflow
            },
            '& .Mui-TableHeadCell-Content': {
              height: '100%',
            },
            '& .Mui-TableHeadCell-Content-Labels': {
              height: '100%',
            },
          },
        }}

      />
    </Paper>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          size="small"
          variant="text"
          onClick={() => router.push('/dashboard/orders')}
        >
          {t("View all")}
        </Button>
      </CardActions>
    </Card>
  );
}
