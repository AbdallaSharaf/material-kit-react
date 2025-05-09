"use client";

import * as React from 'react';
import { MaterialReactTable, MRT_Cell, MRT_ColumnDef, MRT_Row, MRT_TableOptions } from 'material-react-table';
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
import { useLocale, useTranslations } from 'next-intl';
import { MRT_Localization_AR } from 'material-react-table/locales/ar';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
  

const handleSaveRow: MRT_TableOptions<ProductIn>['onEditingRowSave'] = ({
  exitEditingMode,
}) => {
  exitEditingMode();
};

// Define columns outside the component to avoid defining them during render

export function ProductsTable(): React.JSX.Element {
    const t = useTranslations("common");
    const locale = useLocale() as "ar" | "en";
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
          accessorKey: "SKU",
          header: t("SKU"),
          grow: true,
          size: 70,
          enableColumnActions: false,
          enableSorting: false,
          enableEditing: false,
        },
        {
          accessorKey: "imgCover",
          header: t("Image"),
          enableColumnActions: false,
          enableSorting: false,
          enableColumnFilter: false,
          enableEditing: false,
          size: 60,
          Cell: ({ row }) => (
            <img
              src={row.original.imgCover}
              alt="product image"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
          ),
        },
        {
          accessorKey: "keyword",
          header: t("Name"),
          grow: true,
          size: 140,
          enableEditing: false,
          enableColumnActions: false,
          enableColumnFilter: true,
          Cell: ({ row }) =>
            row.original.name?.[locale],
        },
        {
          accessorKey: "price",
          header: t("Price"),
          size: 100,
          enableEditing: false,
          filterVariant: "range-slider",
          muiFilterSliderProps: {
            marks: true,
            max: 10000,
            min: 100,
            step: 100,
            valueLabelFormat: (value) =>
              value.toLocaleString("en-US", {
                style: "currency",
                currency: "SAR",
              }),
            },
            enableColumnActions: false,
            enableColumnFilter: false,
            Cell: ({ row }) => <div>{row.original.price} SAR</div>,
          },
          {
          accessorKey: "availability",
          header: t("Availability"),
          size: 90,
          enableSorting: false,
          enableColumnFilter: false,
          enableEditing: false,
          enableColumnActions: false,
          filterVariant: "select",
          filterSelectOptions: [
            { label: t("Active"), value: "true" },
            { label: t("Inactive"), value: "false" },
          ],
          filterFn: (row, columnId, filterValue) => {
            if (filterValue === "true") return row.getValue(columnId) === true;
            if (filterValue === "false") return row.getValue(columnId) === false;
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
        {
          accessorKey: "sold",
          header: t("Sold"),
          grow: true,
          size: 140,
          enableEditing: false,
          enableColumnActions: false,
          enableColumnFilter: false,
        },
        {
          accessorKey: "stock",
          header: t("Stock"),
          grow: true,
          size: 140,
          enableColumnActions: false,
          enableEditing: false,
          enableColumnFilter: false,
        },
      ];
    
      const categoryColumn: MRT_ColumnDef<ProductIn> = {
        accessorFn: (row) => row.category?.map((category) => category.category?._id),
        header: t("Categories"),
        size: 140,
        filterVariant: "select",
        enableEditing: false,
        filterSelectOptions: categories?.map((category) => ({
          label: category.name?.[locale],
          value: category?._id,
        })),
        Cell: ({ row }) => (
          <div>
            {row.original.category?.map((category, index: number) => (
              category?.category?.name?.[locale] && (
                <span
                  key={index}
                  style={{
                    display: "inline-block",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    marginRight: "4px",
                    fontSize: "12px",
                  }}
                >
                  {category.category.name[locale]}
                </span>
              )
            ))}
          </div>
        ),
      };
    
      const orderInCatColumn: MRT_ColumnDef<ProductIn> = {
        accessorFn: (row) => row.category?.map((category) => category.order),
        header: t("Order in Category"),
        id: "orderInCategory",
        enableColumnFilter: false,
        size: 140,
      };
    
      const orderColumn: MRT_ColumnDef<ProductIn> = {
        accessorKey: "order",
        header: t("Order"),
        enableColumnFilter: false,
        size: 140,
      };
    
      return !hasCategoryId
        ? [
            ...baseColumns.slice(0, 3),
            categoryColumn,
            orderColumn,
            ...baseColumns.slice(3),
          ]
        : [
            ...baseColumns.slice(0, 3),
            orderInCatColumn,
            ...baseColumns.slice(3),
          ];
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
        editDisplayMode="cell" 
        enableEditing
        onEditingRowSave={({ values, row }: { values: any; row: MRT_Row<ProductIn> }) => {
          // Check which columns were actually edited with type safety
          const changedColumns = (Object.keys(row._valuesCache) as Array<keyof ProductIn>).filter(
            (key) => row.original[key] !== values[key]
          );
        
          if (changedColumns.includes('order')) {
            handleChangeOrder({ 
              id: row.original._id, 
              newOrder: Number(values.order) 
            });
          }
          
          if ((changedColumns as any).includes('orderInCategory')) {
            if (!categoryId) {
              console.error('Category ID is required for orderInCategory update');
              return;
            }
            handleChangeOrderInCategory({ 
              id: row.original._id, 
              newOrder: Number(values.orderInCategory), 
              category: categoryId 
            });
          }
        }}
        
        muiEditTextFieldProps={({ cell }: { cell: MRT_Cell<ProductIn> }) => ({
          onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
            // Only handle these specific columns with type guards
            if (cell.column.id === 'order' || cell.column.id === 'orderInCategory') {
              const newValue = Number(event.target.value);
              
              if (isNaN(newValue)) {
                console.error('Invalid number value entered');
                return;
              }
        
              if (cell.column.id === 'order') {
                handleChangeOrder({ 
                  id: cell.row.original._id, 
                  newOrder: newValue 
                });
              } else if (cell.column.id === 'orderInCategory') {
                if (!categoryId) {
                  console.error('Category ID is required for orderInCategory update');
                  return;
                }
                handleChangeOrderInCategory({ 
                  id: cell.row.original._id, 
                  newOrder: newValue, 
                  category: categoryId 
                });
              }
            }
          }
        })}
        enableRowOrdering= {true}
        localization={locale === 'ar' ? MRT_Localization_AR : MRT_Localization_EN}
        columnFilterDisplayMode = 'popover'
        columnResizeDirection= {locale ==='ar' ? 'rtl' : 'ltr'}
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
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: '4px' }}>
            <Tooltip title={t("Edit")}>
              <IconButton
                onClick={() => {
                  let url = `products/edit/${row.original._id}`;
                  if (categoryId) {
                    url += `?category=${categoryId}`;
                  }
                  router.push(url);
                }}
              >
                <i className="fa fa-pencil !text-sm text-yellow-500 hover:text-yellow-600 cursor-pointer"></i>
              </IconButton>
            </Tooltip>
        
            <Tooltip title={t("Delete")}>
              <IconButton color="error" onClick={() => handleDelete(row.original)}>
                <i className="fa fa-trash !text-sm text-red-500 hover:text-red-600 cursor-pointer"></i>
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
