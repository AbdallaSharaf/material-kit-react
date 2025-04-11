"use client";

import * as React from 'react';
import { MaterialReactTable, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table';
import { IconButton, Paper, Switch, Tooltip } from '@mui/material';
import CustomToolbar from './custom-toolbar';
import { Box } from '@mui/system';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store/store';
import { useCategoryHandlers } from '@/controllers/categoriesController';
import { useProductHandlers } from '@/controllers/productsController';
import { ProductIn } from '@/interfaces/productInterface';
import { setColumnFilters, setPagination, setSearchQuery } from '@/redux/slices/productSlice';
  

const handleSaveRow: MRT_TableOptions<ProductIn>['onEditingRowSave'] = ({
  exitEditingMode,
}) => {
  exitEditingMode();
};

// Define columns outside the component to avoid defining them during render

export function ProductsTable(): React.JSX.Element {

    const { fetchData : fetchDataCategories } = useCategoryHandlers();
    const { fetchData : fetchDataProducts, handleDelete, handleChangeStatus, fetchDataByCategory, handleChangeOrder, handleChangeOrderInCategory } = useProductHandlers();
    const dispatch = useDispatch<AppDispatch>()
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("category"); // Get category ID from params

    const { 
      refreshData : refreshDataCategories,
      categories
    } = useSelector((state: RootState) => state.categories);

    const { 
      refreshData : refreshDataProducts,
      products,
      productsByCategory,
      columnFilters,
      pagination,
      rowCount,
      searchQuery,
      loading
    } = useSelector((state: RootState) => state.products);

    const getColumns = (hasCategoryId: boolean): MRT_ColumnDef<ProductIn>[] => {
      const baseColumns: MRT_ColumnDef<ProductIn>[] = [
        {
          accessorKey: 'SKU',
          header: 'SKU',
          grow: true,
          size: 70,
          enableColumnActions: false,
          enableSorting: false,
        },
        {
          accessorKey: 'images',
          header: 'Image',
          enableColumnActions: false,
          enableSorting: false,
          enableColumnFilter: false,
          size: 60,
          Cell: ({ row }) => (
            <img
              src={row.original.images?.[0]}
              alt="product image"
              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
            />
          ),
        },
        {
          accessorKey: 'name',
          header: 'Name',
          grow: true,
          size: 140,
          enableColumnActions: false,
          enableColumnFilter: false,
          Cell: ({ row }) => row.original.name?.['en'] ?? row.original.name?.['ar'],
        },
        {
          accessorKey: 'price',
          header: 'Price',
          size: 100,
          filterVariant: 'range-slider',
          muiFilterSliderProps: {
            marks: true,
            max: 10000,
            min: 100,
            step: 100,
            valueLabelFormat: (value) =>
              value.toLocaleString('en-US', {
                style: 'currency',
                currency: 'SAR',
              }),
          },
          enableColumnActions: false,
          enableColumnFilter: false,
          Cell: ({ row }) => <div>{row.original.price} SAR</div>,
        },
        {
          accessorKey: 'availability',
          header: 'Availability',
          size: 90,
          enableSorting: false,
          enableColumnFilter: false,
          enableColumnActions: false,
          filterVariant: 'select',
          filterSelectOptions: [
            { label: 'Active', value: 'true' },
            { label: 'Inactive', value: 'false' },
          ],
          filterFn: (row, columnId, filterValue) => {
            if (filterValue === 'true') return row.getValue(columnId) === true;
            if (filterValue === 'false') return row.getValue(columnId) === false;
            return true;
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
    
      const categoryColumn: MRT_ColumnDef<ProductIn> = {
        accessorFn: (row) => row.category?.map((category) => category.category?._id),
        header: 'Categories',
        size: 140,
        filterVariant: 'select',
        filterSelectOptions: categories?.map((category) => ({
          label: category.name?.['en'],
          value: category?._id,
        })),
        Cell: ({ row }) => (
          <div>
            {row.original.category?.map((category, index: number) => (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  marginRight: '4px',
                  fontSize: '12px',
                }}
              >
                {category.category?.name?.['en']}
              </span>
            ))}
          </div>
        ),
      };
      const orderInCatColumn: MRT_ColumnDef<ProductIn> = {
        accessorFn: (row) => row.category?.map((category) => category.order),
        header: 'Order in Category',
        enableColumnFilter: false,
        size: 140,
      };

      const orderColumn: MRT_ColumnDef<ProductIn> = {
        accessorKey: 'order',
        header: 'Order',
        enableColumnFilter: false,
        size: 140,
      };
    
      // Conditionally include the Categories column
      return !hasCategoryId ? [...baseColumns.slice(0, 3), categoryColumn, orderColumn, ...baseColumns.slice(3)] : [...baseColumns.slice(0, 3), orderInCatColumn, ...baseColumns.slice(3)];
    };
    
    // Usage example:
    const columns = getColumns(!!categoryId);
    

    React.useEffect(() => {
      fetchDataCategories();
    }, [refreshDataCategories]);
  
    React.useEffect(() => {
      if (categoryId) {
        fetchDataByCategory(categoryId); // Fetch products by category
      } else {
        fetchDataProducts(); // Fetch all products
      }
    }, [refreshDataProducts, searchQuery, columnFilters, categoryId, pagination]);

    const router = useRouter()
  return (
    <Paper>
      <MaterialReactTable 
        columns={columns} 
        data={categoryId ? productsByCategory : products} 
        // enableRowSelection
        enableRowActions
        enableColumnResizing
        enableGlobalFilter={false}
        onEditingRowSave={handleSaveRow} 
        enableRowOrdering= {true}
        columnFilterDisplayMode = 'popover'
        positionToolbarAlertBanner= 'bottom'
        getRowId = {(row) => row._id}
        positionActionsColumn="last" 
        enableSorting = {false}
        enableExpandAll= {false} //disable expand all button
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
        muiDetailPanelProps= {() => ({
          sx: (theme) => ({
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,210,244,0.1)'
                : 'rgba(0,0,0,0.1)',
          }),
        })}
        onPaginationChange={(updaterOrValue) => {
          const newPagination =
          typeof updaterOrValue === "function"
              ? updaterOrValue(pagination)
              : updaterOrValue;
          dispatch(setPagination(newPagination));
      }}
      rowCount={rowCount}
      muiRowDragHandleProps={({ table }) => ({
        onDragEnd: () => {
          const { draggingRow, hoveredRow } = table.getState();
          
          if (!draggingRow || !hoveredRow) return;
    
          // Get the dragged product ID
          const draggedProduct = categoryId ? productsByCategory[draggingRow.index] : products[draggingRow.index];
    
          // Get the new order (index of the hovered row)
          const order = hoveredRow.index ?? 0;
          const newOrder = order +1
          // Call handleUpdate with the dragged product ID and new order
          categoryId ? handleChangeOrderInCategory({id: draggedProduct?._id, newOrder, category: categoryId}) :
          handleChangeOrder({id: draggedProduct?._id, newOrder});
        },
      })}
      state={{
          globalFilter: searchQuery,
          isLoading: loading,
          pagination,
          columnFilters,
      }}
        layoutMode='grid'
        renderTopToolbarCustomActions = {({ table }) => (<CustomToolbar table={table} data={products}/>)}
        renderRowActions= {({ row }) => (
          <Box sx={{ display: 'flex', gap: '4px'}}>
            <Tooltip title="Edit">
              <IconButton onClick={() => router.push(`products/edit/${row.original._id}`)}>
                <i
                  className="fa fa-pencil !text-sm text-yellow-500 hover:text-yellow-600 cursor-pointer"
                ></i>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => handleDelete(row.original)}>
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
      />
    </Paper>
  );
}
