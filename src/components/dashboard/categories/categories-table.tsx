"use client";

import * as React from 'react';
import { MaterialReactTable, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table';
import { IconButton, Paper, Switch, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { CategoryIn } from '@/interfaces/categoryInterface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { useCategoryHandlers } from '@/controllers/categoriesController';
  
const handleSaveRow: MRT_TableOptions<CategoryIn>['onEditingRowSave'] = ({
  exitEditingMode,
}) => {
  exitEditingMode();
};

// Define columns outside the component to avoid defining them during render

export function CategoriesTable(): React.JSX.Element {

    const { fetchData : fetchDataCategories, handleDelete, handleChangeOrder, handleChangeStatus } = useCategoryHandlers();
    const searchParams = useSearchParams();
    
    const { 
      refreshData : refreshDataCategories,
      categories,
      loading
    } = useSelector((state: RootState) => state.categories);

    const columns: MRT_ColumnDef<CategoryIn>[] = [
      { 
        accessorKey: 'name.en',
        header: 'Name',
        grow: true,
        size: 140,
        Cell: ({ row }) => (
          row.original.name['en']
        ),
      enableColumnActions: true,
      enableColumnFilter: true,
      },
      { 
        accessorKey: 'name.ar',
        header: 'Name',
        grow: true,
        size: 140,
        Cell: ({ row }) => (
          row.original.name['ar']
        ),
      enableColumnActions: true,
      enableColumnFilter: true,
      },
      { 
        accessorKey: 'order',
        header: 'Order',
        grow: true,
        size: 140,
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'availability',
        header: 'Availability',
        size: 90,
        enableSorting: false,
        enableColumnFilter: false,
        enableColumnActions: false,
        filterVariant: 'select', // Enable dropdown filter
        filterSelectOptions: [
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' },
        ],
        filterFn: (row, columnId, filterValue) => {
          if (filterValue === 'true') return row.getValue(columnId) === true;
          if (filterValue === 'false') return row.getValue(columnId) === false;
          return true; // Show all if no filter is selected
        },
        Cell: ({ row }) => (
          <Switch
            checked={row.original.available}
            onChange={() => handleChangeStatus(row.original)}
            color="primary"
          />
        ),
      },    
    ];

    React.useEffect(() => {
      fetchDataCategories();
    }, [refreshDataCategories]);

    const router = useRouter()
  return (
    <Paper>
      <MaterialReactTable 
        columns={columns} 
        data={categories} 
        enableRowActions
        enableColumnResizing
        enableGlobalFilter={false}
        onEditingRowSave={handleSaveRow} 
        enableRowOrdering= {true}
        columnFilterDisplayMode = 'popover'
        positionToolbarAlertBanner= 'bottom'
        getRowId = {(row) => row._id}
        positionActionsColumn="last" 
        enableSorting = {true}
        enableExpandAll= {false} //disable expand all button
        muiDetailPanelProps= {() => ({
          sx: (theme) => ({
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,210,244,0.1)'
                : 'rgba(0,0,0,0.1)',
          }),
        })}
      muiRowDragHandleProps={({ table }) => ({
        onDragEnd: () => {
          const { draggingRow, hoveredRow } = table.getState();
          
          if (!draggingRow || !hoveredRow) return;
    
          // Get the dragged product ID
          const draggedProduct = categories[draggingRow.index];
    
          // Get the new order (index of the hovered row)
          const order = hoveredRow.index ?? 0;
          const newOrder = order +1
          // Call handleUpdate with the dragged product ID and new order
          handleChangeOrder({id: draggedProduct._id, newOrder});
        },
      })}
      state={{
          isLoading: loading,
      }}
        layoutMode='grid'
        renderRowActions= {({ row }) => (
          <Box sx={{ display: 'flex', gap: '4px'}}>
            <Tooltip title="Edit">
              <IconButton onClick={(e) =>{
                  e.stopPropagation();
                  router.push(`categories/edit/${row.original._id}`)
                }
                }>
                <i
                  className="fa fa-pencil !text-sm text-yellow-500 hover:text-yellow-600 cursor-pointer"
                ></i>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={(e) => {
                e.stopPropagation();
                handleDelete(row.original)
                }}>
                <i
                  className="fa fa-trash !text-sm text-red-500 hover:text-red-600 cursor-pointer"
                ></i>
              </IconButton>
            </Tooltip>
          </Box>
        )}
        muiTableHeadCellProps={{
          sx: {
            '& .Mui-TableHeadCell-Content-Wrapper': {
              height: 18,
            },
            '& .Mui-TableHeadCell-Content-Labels': {
              height: 18,
            },
          },
        }}
        muiTableBodyRowProps={({ row }) => ({
            onClick: () => {
              const params = new URLSearchParams(searchParams);
              params.set('category', row.original._id); // Set category filter
              router.push(`products?${params.toString()}`);
            },
            sx: { cursor: 'pointer' },
          })}
      />
    </Paper>
  );
}
