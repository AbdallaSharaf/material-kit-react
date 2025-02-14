'use client'
import React from 'react';
import { Box, Button, Chip, MenuItem, TextField, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// Define the shape of your form's values, now including an image field
interface ItemFormValues {
  name: string;
  price: number | '';
  tags: string[]; // Updated from category to tags
  description: string;
  stock: number | '';
  unit: 'kg' | 'piece';
  image: string | null; // Updated field type for image upload
}


const validationSchema = Yup.object({
  name: Yup.string().required('Item name is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
    tags: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one tag is required')
    .required('Tags are required'),
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

const ItemForm = ({item}:any) => {

    const initialValues: ItemFormValues = {
        name: item.name || '',
        price: item.price || 0,
        tags: item.tags || [], // Use tags from the item if available
        description: '',
        stock: '',
        unit: item.isPricePerKilo ? 'kg' : 'piece',
        image: item.image || null, // Initial value is null (no file)
      };
  
  const [preview, setPreview] = React.useState<string | null>(item.image || null);
  const handleSubmit = (values: ItemFormValues, { setSubmitting }: any) => {
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
              label="Item Name"
              variant="outlined"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.name && errors.name)}
              helperText={touched.name && errors.name}
            />

            <TextField
            select
            fullWidth
            margin="normal"
            name="tags"
            label="Tags"
            variant="outlined"
            value={values.tags}
            onChange={handleChange}
            onBlur={handleBlur}
            SelectProps={{
                multiple: true,
                renderValue: (selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                    <Chip
                        key={value}
                        label={value}
                    />
                    ))}
                </Box>
                ),
            }}
            error={Boolean(touched.tags && errors.tags)}
            helperText={touched.tags && errors.tags}
            >
            <MenuItem value="citrus">Citrus</MenuItem>
            <MenuItem value="berry">Berry</MenuItem>
            <MenuItem value="tropical">Tropical</MenuItem>
            <MenuItem value="stone">Stone</MenuItem>
            </TextField>


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
                        height: 'auto',
                      }}
                      className='border border-[#21263658] rounded-xl hover:border-[#212636]'
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
            
            <Box sx={{ mt: 4 }} className='col-start-2'>
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

export default ItemForm;
