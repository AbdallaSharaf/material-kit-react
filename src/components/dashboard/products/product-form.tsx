'use client'
import React from 'react';
import { Box, Button, Checkbox, FormControlLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Formik, Form, FieldArray, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useCategoryHandlers } from '@/controllers/categoriesController';
import { RootState } from '@/redux/store/store';
import { ProductIn, ProductOut } from '@/interfaces/productInterface';
import Swal from 'sweetalert2';
import { useProductHandlers } from '@/controllers/productsController';
import { CategoryIn } from '@/interfaces/categoryInterface';


// Validation Schema

const ProductForm = ({ product }: { product?: ProductIn }) => {
  const { fetchData } = useCategoryHandlers();
  const { handleCreateProduct, handleUpdateProduct } = useProductHandlers();
  const { categories, refreshData } = useSelector((state: RootState) => state.categories);

  React.useEffect(() => {
    fetchData();
  }, [refreshData]);

  const formik = useFormik({
    initialValues: {
      name_ar: product?.name?.ar ||"",
      name_en: product?.name?.en || "",
      metaTags: product?.metaTags || [] as string[],
      category: product?.category?.map(cat => ({
        category: cat.category._id || '', // Mapping `_id` to `category`
        order: cat.order || 1// Keeping order as is
      })) || [],
      available: product?.available ?? true,
      price: product?.price || 0,
      SKU: product?.SKU || 0,
      trackQty: product?.trackQty ?? true,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name_ar: Yup.string()
        .trim()
        .required("Arabic name is required")
        .min(2, "Too short product name"),
    
      name_en: Yup.string()
        .trim()
        .required("English name is required")
        .min(2, "Too short product name"),
    
      slug: Yup.string()
        .trim()
        .matches(/^[a-z0-9-]+$/, "Slug must be lowercase and contain only letters, numbers, and dashes")
        .nullable(),
    
      description_ar: Yup.string().trim().nullable(),
      description_en: Yup.string().trim().nullable(),
    
      shortDesc_ar: Yup.string().trim().nullable(),
      shortDesc_en: Yup.string().trim().nullable(),
    
      metaTags: Yup.array().of(Yup.string().trim().required("Meta tag is required")),
    
      category: Yup.array().of(
        Yup.object({
          category: Yup.string().required("Please select a category"),
          order: Yup.number()
            .integer("Order must be an integer")
            .min(1, "Order must be at least 1")
            .required("Order is required"),
        })
      ),
    
      stock: Yup.string().trim().nullable(),
    
      available: Yup.boolean().required("Availability status is required"),
      parentAvailable: Yup.boolean().required("Parent availability status is required"),
    
      price: Yup.number()
        .positive("Price must be a positive number")
        .required("Price is required"),
    
      priceAfterDiscount: Yup.number()
        .min(0, "Discounted price must be 0 or higher")
        .nullable(),
    
      priceAfterExpiresAt: Yup.date().nullable(),
    
      imgCover: Yup.array().of(
        Yup.object({
          url: Yup.string().url("Invalid image URL").required("Image URL is required"),
          size: Yup.string().trim().nullable(),
        })
      ),
    
      images: Yup.array().of(Yup.string().url("Invalid image URL")),
    
      showWeight: Yup.boolean().required(),
    
      minQty: Yup.number().integer().min(0, "Minimum quantity must be 0 or higher").required(),
    
      trackQty: Yup.boolean().required(),
    
      lowStockQty: Yup.number()
        .integer()
        .min(0, "Low stock quantity must be 0 or higher")
        .nullable(),
    
      Length: Yup.string().trim().nullable(),
      width: Yup.string().trim().nullable(),
      height: Yup.string().trim().nullable(),
      Weight: Yup.string().trim().nullable(),
    
      rewardPoint: Yup.string().trim().nullable(),
    
      sold: Yup.number()
        .integer()
        .min(0, "Sold quantity must be 0 or higher")
        .default(0),
    
      deleted: Yup.boolean().default(false),
    
      order: Yup.number()
        .integer()
        .min(1, "Order must be at least 1")
        .nullable(),
    
      SKU: Yup.string()
        .trim()
        .matches(/^[a-zA-Z0-9_-]*$/, "SKU must contain only letters, numbers, underscores, or dashes")
        .nullable(),
    }),
    onSubmit: async (values) => {
        const { name_ar, name_en, ...rest } = values;

        const formattedData: ProductOut = {
          ...rest,
          name: {
            ar: name_ar,
            en: name_en,
          },
        };
        let isSuccess = false;
        if (product) {
          isSuccess = await handleUpdateProduct({ id: product._id, values: formattedData });
        } else {
          isSuccess = await handleCreateProduct(formattedData);
        }
        if (isSuccess) {
          formik.resetForm();
        }
        // console.log(formattedData);
      },
  });

   const handleSubmit = async (e: any) => {
     e.preventDefault();
     const errors = await formik.validateForm();
     if (Object.keys(errors).length > 0) {
       // Show SweetAlert2 error if there are validation formik.errors
       Swal.fire({
         icon: "warning",
         title: "Incomplete Data",
         text: "Please complete all required fields before submitting.",
       });
     } 
     formik.handleSubmit(); // Trigger Formik's onSubmit
   };

  return (
    <FormikProvider value={formik}>
    <Box className='p-2'
     component="form" onSubmit={handleSubmit} 
      onKeyDown={(e) => {
        if (e.key === "Enter") {
        e.preventDefault()
        handleSubmit
        }
      }} noValidate>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10'>

            {/* Left Section */}
            <div className='grid gap-4'>
              <TextField
                fullWidth
                margin="normal"
                name="name_ar"
                label="Arabic Name"
                variant="outlined"
                value={formik.values.name_ar}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.name_ar && formik.errors.name_ar)}
                helperText={formik.touched.name_ar && formik.errors.name_ar}
              />

              <TextField
                fullWidth
                margin="normal"
                name="name_en"
                label="English Name"
                variant="outlined"
                value={formik.values.name_en}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.name_en && formik.errors.name_en)}
                helperText={formik.touched.name_en && formik.errors.name_en}
              />

              <FieldArray name="metaTags">
                {({ push, remove }) => (
                  <>
                    {formik.values.metaTags.map((tag, index) => (
                      <Box key={index} className="flex items-center gap-2">
                        <TextField
                          fullWidth
                          name={`metaTags.${index}`}
                          label={`Meta Tag ${index + 1}`}
                          variant="outlined"
                          value={tag}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={Boolean((formik.touched.metaTags as any)?.[index] && formik.errors.metaTags?.[index])}
                          helperText={(formik.touched.metaTags as any)?.[index] && formik.errors.metaTags?.[index]}
                        />
                        <Button onClick={() => remove(index)} color="error">X</Button>
                      </Box>
                    ))}
                    <Button onClick={() => push('')} color="primary">+ Add Meta Tag</Button>
                  </>
                )}
              </FieldArray>

              <TextField
                fullWidth
                margin="normal"
                name="price"
                label="Price"
                type="number"
                variant="outlined"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.price && formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />

              <TextField
                fullWidth
                margin="normal"
                name="SKU"
                label="SKU"
                type="number"
                variant="outlined"
                value={formik.values.SKU}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.SKU && formik.errors.SKU)}
                helperText={formik.touched.SKU && formik.errors.SKU}
              />
            </div>

            {/* Right Section */}
            <div className='grid gap-4'>
              <FieldArray name="category">
                {({ push, remove }) => (
                  <>
                    {formik.values.category.map((cat, index) => (<>
                      <Box key={index} className="flex items-center gap-2">
                        <Select
                          fullWidth
                          name={`category.${index}.category`}
                          value={cat.category}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={Boolean(formik.touched.category?.[index]?.category && (formik.errors.category?.[index] as any)?.category)}
                          
                          >
                          {categories?.map((cat) => (
                            <MenuItem key={cat._id} value={cat._id}>
                              {cat.name.en}
                            </MenuItem>
                          ))}
                        </Select>

                        <TextField
                          type="number"
                          name={`category.${index}.order`}
                          label="Order"
                          value={cat.order}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={Boolean(formik.touched.category?.[index]?.order && (formik.errors.category?.[index] as any)?.order)}
                          helperText={formik.touched.category?.[index]?.order && (formik.errors.category?.[index] as any)?.order}
                          />

                        <Button onClick={() => remove(index)} color="error">X</Button>
                      </Box>
                      {((formik.errors.category?.[index] as any)?.category as string) !==
                      'At least one category is required' && (
                        <div className="text-red-500 text-sm mt-1">
                        {(formik.errors.category?.[index] as any)?.category}
                      </div>
                    )}
                    </>
                    ))}
                    <Button onClick={() => push({ category: '', order: 1 })} color="primary">+ Add Category</Button>
                  </>
                )}
              </FieldArray>
              {formik.errors.category &&
                formik.touched.category &&
                (formik.errors.category as string) === 'At least one category is required' && (
                  <div className="text-red-500 text-sm mt-2">{formik.errors.category.toString()}</div>
                )}
              <FormControlLabel
                control={
                  <Checkbox
                    name="available"
                    checked={formik.values.available}
                    onChange={formik.handleChange}
                  />
                }
                label="Available"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="trackQty"
                    checked={formik.values.trackQty}
                    onChange={formik.handleChange}
                  />
                }
                label="Track Quantity"
              />
            </div>

            {/* Submit Button */}
            <Box sx={{ mt: 4 }} className='col-start-2 w-1/4 ms-auto'>
              <Button type="submit" variant="contained" color="primary" className="w-1/4 ml-auto">
                Submit
              </Button>
            </Box>
          </div>
    </Box>
    </FormikProvider>
  );
};

export default ProductForm;
