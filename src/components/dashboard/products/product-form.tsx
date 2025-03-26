'use client'
import React from 'react';
import { Box, Button, Checkbox, Chip, InputLabel, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Product } from './products-table';
import { useSelector } from 'react-redux';
import { useCategoryHandlers } from '@/controllers/categoriesController';
import { RootState } from '@/redux/store/store';

// Define the shape of your form's values, now including an image field
interface ProductFormValues {
  name: string;
  price: number | '';
  categories: string[]; // Updated from category to categories
  description: string;
  stock: number | '';
  unit: 'kg' | 'piece';
  image: string | null; // Updated field type for image upload
}


const validationSchema = Yup.object({
  name: Yup.string().required('Product name is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
    categories: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one tag is required')
    .required('Categories are required'),
    stock: Yup.number()
    .typeError('Stock must be a number')
    .min(0, 'Stock cannot be negative')
    .required('Stock is required'),
  // Validate the image field as a URL. Adjust as needed (e.g., to allow empty values).
  image: Yup.string()
    .url('Must be a valid URL')
    .required('Image URL is required'),
  // description and  can be optional
});

const ProductForm = ({product}:any) => {

    const { fetchData } = useCategoryHandlers();

    const { 
      categories,
      refreshData 
    } = useSelector((state: RootState) => state.categories);
    React.useEffect(() => {
      fetchData();
    }, [refreshData]);

    const initialValues: ProductFormValues = {
        name: product?.name || '',
        price: product?.price || 0,
        categories: product?.categories || [], // Use categories from the product if available
        description: '',
        stock: '',
        unit: product?.isPricePerKilo ? 'kg' : 'piece',
        image: product?.image || null, // Initial value is null (no file)
      };
  
  const [preview, setPreview] = React.useState<string | null>(product?.image || null);
  const handleSubmit = (values: ProductFormValues, { setSubmitting }: any) => {
    // You can send the form values to an API here
    console.log('Form values:', values);
    setSubmitting(false);
  };

  return (
    <Box className='p-2' >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
          setFieldValue
        }) => (
          <Form className='grid grid-cols-1 md:grid-cols-2 gap-x-10'>
            <div className='grid grid-rows-5'>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Product Name"
              variant="outlined"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.name && errors.name)}
              helperText={touched.name && errors.name}
            />

            <Select
            fullWidth
            name="categories"
            label="Categories"
            variant="outlined"
            value={values.categories}
            onChange={handleChange}
            onBlur={handleBlur}
            multiple
            renderValue= {(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as string[]).map((selectedId) => {
                const category = categories?.find((cat) => cat._id === selectedId);
                return category ? <Chip key={category._id} label={category.name.en} /> : null;
              })}
            </Box>
            )}
            error={Boolean(touched.categories && errors.categories)}
            >
              {categories?.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    <Checkbox checked={values.categories.includes(cat._id)} />
                    <ListItemText primary={cat.name["en"]} />
                  </MenuItem>
                ))}
            </Select>


            <TextField
              fullWidth
              margin="normal"
              name="price"
              label="Price"
              type="number"
              variant="outlined"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.price && errors.price)}
              helperText={touched.price && errors.price}
            />
            <TextField
              select
              fullWidth
              margin="normal"
              name="unit"
              label="Unit"
              variant="outlined"
              value={values.unit}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <MenuItem value="kg">Kilogram</MenuItem>
              <MenuItem value="piece">Piece</MenuItem>
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              name="stock"
              label="Stock"
              type="number"
              variant="outlined"
              value={values.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.stock && errors.stock)}
              helperText={touched.stock && errors.stock}
            />

            </div>

            <div className="grid grid-rows-5">
              <div className="row-span-4">
                {/* Clickable image upload area */}
                <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                  {preview ? (
                    <Box sx={{ mt: 2 }}>
                      <Box
                        component="img"
                        src={preview}
                        alt="Image Preview"
                        sx={{ maxWidth: '100%', height: 'auto', mt: 1, width:'60%' }}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        mt: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                      }}
                      className='border h-40 border-[#21263658] rounded-xl hover:border-[#212636]'
                    >
                      <Typography variant="body1">Click to upload image</Typography>
                    </Box>
                  )}
                </label>
                {/* Hidden file input */}
                <input
                  accept="image/*"
                  id="image-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(event) => {
                    if (event.currentTarget.files && event.currentTarget.files[0]) {
                      const file = event.currentTarget.files[0];
                      setFieldValue('image', file);
                      // Generate a preview URL for the uploaded image
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                {touched.image && errors.image && (
                  <Typography color="error" variant="body2">
                    {errors.image as string}
                  </Typography>
                )}
              </div>

            <TextField
                
                fullWidth
                margin="normal"
                name="description"
                label="Description"
                variant="outlined"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                multiline
            />

            </div>
            
            <Box sx={{ mt: 4 }} className='col-start-2 w-1/4 ms-auto'>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
              >
                Submit
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ProductForm;
