import React from 'react';
import { DialogTitle, DialogContent, DialogActions, TextField, Typography, Box, Autocomplete } from '@mui/material';
import { MRT_EditActionButtons, MRT_Row } from 'material-react-table';
import { Order } from './orders-table';
import { Product } from '../products/products-table';

// Define the order item type
interface OrderItem {
  id: string;
  quantity: number;
}

// Define the component props
interface EditOrderDialogProps {
  table: any;
  row: MRT_Row<Order>;
  isEditing?: boolean;
  internalEditComponents: React.ReactNode[];
  products: any[];
}

const EditOrderDialog: React.FC<EditOrderDialogProps> = ({ table, row, internalEditComponents, products, isEditing }) => {
  const [selectedItems, setSelectedItems] = React.useState<OrderItem[]>(
    row.original.items?.map((item) => ({ ...item, quantity: item.quantity || 1 })) || []
  );
  const [discount, setDiscount] = React.useState<number>(0);

  // Function to calculate total amount based on items and discount
  const calculateTotal = (): number => {
    const total = selectedItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.id);
      return product ? sum + product.price * item.quantity : sum;
    }, 0);
    return Math.max(total - discount, 0);
  };

  // Function to update quantity of an item
  const handleQuantityChange = (id: string, newQuantity: number) => {
    setSelectedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  return (
    <>
      <DialogTitle variant="h3">{isEditing ? "Edit Order" : "Add Order"}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Filter out amount field */}
        {internalEditComponents.filter(
          (component) =>
            React.isValidElement(component) &&
            component.key !== `${row.id}_amount` &&
            (isEditing || (component.key !== `${row.id}_id` && component.key !== `${row.id}_createdAt`))
        )}

        {/* Multi-Select for Items */}
        <Autocomplete
          multiple
          options={products}
          getOptionLabel={(option) => option.name}
          value={selectedItems.map((item) => products.find((p) => p.id === item.id) || { id: '', name: '' })}
          onChange={(_, newValue) =>
            setSelectedItems(newValue.map((product) => ({ id: product.id, quantity: 1 })))
          }
          renderInput={(params) => <TextField {...params} variant="standard" label="Items" />}
        />

        {/* Render Selected Items with Quantity */}
        {selectedItems.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {selectedItems.map((item) => {
              const product = products.find((p) => p.id === item.id);
              return product ? (
                <Box key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img src={product.image} alt={product.name} width={50} height={50} />
                    <Typography>{product.name}</Typography>
                  </div>
                  <TextField
                    type="number"
                    label="Quantity (Kg)"
                    variant="standard"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, Math.max(Number(e.target.value), 1))}
                    sx={{ width: '80px' }}
                  />
                </Box>
              ) : null;
            })}
          </Box>
        )}

        {/* Discount Field */}
        <TextField
          label="Discount"
          type="number"
          fullWidth
          variant="standard"
          value={discount}
          onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
        />

        {/* Amount (After Discount) */}
        <Typography variant="h6">Total Amount: {calculateTotal().toFixed(2)} SAR</Typography>
      </DialogContent>
      <DialogActions>
        <MRT_EditActionButtons variant="text" table={table} row={row} />
      </DialogActions>
    </>
  );
};

export default EditOrderDialog;
