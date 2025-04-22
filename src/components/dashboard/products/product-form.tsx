'use client'
import React, { useRef, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Formik, Form, FieldArray, useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useCategoryHandlers } from '@/controllers/categoriesController';
import { RootState } from '@/redux/store/store';
import { ProductIn, ProductOut } from '@/interfaces/productInterface';
import Swal from 'sweetalert2';
import { useProductHandlers } from '@/controllers/productsController';
import { CategoryIn } from '@/interfaces/categoryInterface';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from 'next/navigation';
import { ImageGalleryUploader } from './image-gallery-uploader';
import Link from 'next/link';
import dayjs from 'dayjs';

// Validation Schema

const ProductForm = ({ product }: { product?: ProductIn }) => {
  const { fetchData } = useCategoryHandlers();
  const router = useRouter();
  const { handleCreateProduct, handleUpdateProduct } = useProductHandlers();
  const { categories, refreshData } = useSelector((state: RootState) => state.categories);
  const [thumbnail, setThumbnail] = useState<string>(product?.imgCover || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    fetchData();
  }, [refreshData]);
  // console.log(product)
  const formik = useFormik({
    initialValues: {
      name_ar: product?.name?.ar ||"",
      name_en: product?.name?.en || "",
      description_ar: product?.description?.ar ||"",
      description_en: product?.description?.en || "",
      shortDesc_ar: product?.shortDesc?.ar ||"",
      shortDesc_en: product?.shortDesc?.en || "",
      metaTags: product?.metaTags || [] as string[],
      category: product?.category?.map(cat => ({
        category: cat.category._id || '', // Mapping `_id` to `category`
        order: cat.order || 1// Keeping order as is
      })) || [],
      available: product?.available ?? true,
      price: product?.price || 0,
      SKU: product?.SKU || 0,
      stock: product?.stock || undefined,
      priceAfterExpiresAt: product?.priceAfterExpiresAt || undefined,
      priceAfterDiscount: product?.priceAfterDiscount || undefined,
      trackQty: product?.trackQty ?? false,
      lowStockQty: product?.lowStockQty || undefined,
      imgCover: product?.imgCover || undefined,  // Add image field
      images: product?.images || [] as string[],  // Add image field
    },
    validateOnBlur: true,      // ✅ Validate when user leaves the field
    validateOnChange: false, // ✅ Optional: Don't validate on typing
    validateOnMount: false,    // ✅ Prevent validation when modal opens
    enableReinitialize: true,
    validationSchema: Yup.object({
      name_ar: Yup.string().required("Arabic name is required"),
      name_en: Yup.string().required("English name is required"),
      metaTags: Yup.array().of(Yup.string().required('Meta tag is required')),
      category: Yup.array()
        .of(
          Yup.object().shape({
            category: Yup.string().required('Please select a category'),
            order: Yup.number().min(1, 'Order must be at least 1').required('Order is required'),
          })
        ),
      available: Yup.boolean(),
      price: Yup.number().positive('Price must be positive').required('Price is required'),
      stock: Yup.number().positive('Stock must be positive'),
      SKU: Yup.number().min(1, 'SKU must be positive').required("SKU is required"),
      lowStockQty: Yup.number()
      .min(1, 'Low Stock Quantity must be positive')
      .when('trackQty', {
        is: true,
        then: schema => schema.required('Low Stock Quantity is required'),
        otherwise: schema => schema.notRequired(),
      }),
      // trackQty: Yup.boolean(),
      imgCover: Yup.mixed()
      .required("Image is required")
      .test("fileSize", "Image must be less than 10MB", (value) => {
        if (!value) return true; // skip validation if empty (required will catch it)
        return (value as File).size <= 10485760;
      }),
    
    images: Yup.array()
      .max(5, "Maximum 5 images allowed")
      .required("Product gallery is required")
      .test(
        "fileSize",
        "Each image must be less than 10MB",
        (files) => {
          if (!files) return true;
          return files.every((file: File) => file.size <= 10485760);
        }
      )
    }),
    onSubmit: async (values) => {
      const { name_ar, name_en, description_ar, description_en, shortDesc_ar, shortDesc_en, ...rest } = values;
    
      const formattedData: ProductOut = {
        ...rest,
        name: {
          ar: name_ar,
          en: name_en,
        },
        description: {
          ar: description_ar,
          en: description_en,
        },
        shortDesc: {
          ar: shortDesc_ar,
          en: shortDesc_en,
        },
      };
    
      if (product) {
        // Compare current values to initialValues and only include changed fields
        const changedFields: Record<string, any> = {};
    
        for (const key in formattedData) {
          const current = formattedData[key as keyof ProductOut];
          const initial = formik.initialValues[key as keyof typeof formik.initialValues];
    
          // Stringify to deeply compare objects/arrays
          if (JSON.stringify(current) !== JSON.stringify(initial)) {
            changedFields[key as keyof ProductOut] = current;
          }
        }
    
        // If name/desc/shortDesc changed, make sure to include them
        if (
          name_ar !== product.name.ar || name_en !== product.name.en
        ) {
          changedFields.name = {
            ar: name_ar,
            en: name_en,
          };
        }
    
        if (
          description_ar !== product.description.ar ||
          description_en !== product.description.en
        ) {
          changedFields.description = {
            ar: description_ar,
            en: description_en,
          };
        }
    
        if (
          shortDesc_ar !== product.shortDesc?.ar ||
          shortDesc_en !== product.shortDesc?.en
        ) {
          changedFields.shortDesc = {
            ar: shortDesc_ar,
            en: shortDesc_en,
          };
        }
    
        const isSuccess = await handleUpdateProduct({
          id: product._id,
          values: changedFields,
        });
    
        if (isSuccess) {
          router.push("/dashboard/products");
          formik.resetForm();
        }
    
      } else {
        // Creating new product
        const isSuccess = await handleCreateProduct(formattedData);
        if (isSuccess) {
          router.push("/dashboard/products");
          formik.resetForm();
        }
      }
    }    
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
        formik.setFieldValue("imgCover", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

   const handleSubmit = async (e: any) => {
     e.preventDefault();
     const errors = await formik.validateForm();
     if (Object.keys(errors).length > 0) {
       // Show SweetAlert2 error if there are validation formik.errors
       Swal.fire({
         icon: "warning",
         title: "Incomplete Data",
         text: "Please complete all required fields before submitting",
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
          <div className=''>

            {/* Left Section */}

            <div className='grid md:grid-cols-2 gap-4'>
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
                </div>

            <div className='grid md:grid-cols-2 gap-4 my-6'>
              <TextField
                fullWidth
                label="Arabic Description"
                name="description_ar"
                multiline
                rows={3}
                value={formik.values.description_ar}
                onChange={formik.handleChange}
                error={formik.touched.description_ar && Boolean(formik.errors.description_ar)}
                helperText={formik.touched.description_ar && formik.errors.description_ar}
                />

              <TextField
                fullWidth
                label="English Description"
                name="description_en"
                multiline
                rows={3}
                value={formik.values.description_en}
                onChange={formik.handleChange}
                error={formik.touched.description_en && Boolean(formik.errors.description_en)}
                helperText={formik.touched.description_en && formik.errors.description_en}
                />
            </div>

            <div className='grid md:grid-cols-2 gap-4 my-6'>
            <TextField
                fullWidth
                label="Arabic Short Description"
                name="shortDesc_ar"
                multiline
                value={formik.values.shortDesc_ar}
                onChange={formik.handleChange}
                error={formik.touched.shortDesc_ar && Boolean(formik.errors.shortDesc_ar)}
                helperText={formik.touched.shortDesc_ar && formik.errors.shortDesc_ar}
                />

              <TextField
                fullWidth
                label="English Short Description"
                name="shortDesc_en"
                multiline
                value={formik.values.shortDesc_en}
                onChange={formik.handleChange}
                error={formik.touched.shortDesc_en && Boolean(formik.errors.shortDesc_en)}
                helperText={formik.touched.shortDesc_en && formik.errors.shortDesc_en}
                />
                </div>
            {/* Right Section */}
            <div className=''>
              <FieldArray name="category">
                {({ push, remove }) => (
                  <>
                  <div className='grid md:grid-cols-2 gap-4 gap-y-6'>
                    {formik.values.category.map((cat, index) => (
                    <div key={index}>
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
                          <IconButton onClick={() => remove(index)} color="error">
                            <CloseIcon />
                          </IconButton>                      
                          </Box>
                            {((formik.errors.category?.[index] as any)?.category as string) !==
                            'At least one category is required' && (
                              <div className="text-red-500 text-sm mt-1">
                              {(formik.errors.category?.[index] as any)?.category}
                            </div>
                          )}
                          </div>
                    ))}
                    </div>
                    <Button onClick={() => push({ category: '', order: 1 })} color="primary">+ Add Category</Button>
                  </>
                )}
              </FieldArray>
              {formik.errors.category &&
                formik.touched.category &&
                (formik.errors.category as string) === 'At least one category is required' && (
                  <div className="text-red-500 text-sm mt-2">{formik.errors.category.toString()}</div>
                )}

              <div className='grid md:grid-cols-2 gap-4 my-6'>
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

              <div className='grid md:grid-cols-2 gap-4 my-6'>
              <TextField
                fullWidth
                margin="normal"
                name="stock"
                label="Stock"
                type="number"
                variant="outlined"
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.stock && formik.errors.stock)}
                helperText={formik.touched.stock && formik.errors.stock}
              />

              {(formik.values.trackQty) && <TextField
                fullWidth
                margin="normal"
                name="lowStockQty"
                label="Low Stock Quantity"
                type="number"
                variant="outlined"
                value={formik.values.lowStockQty}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.lowStockQty && formik.errors.lowStockQty)}
                helperText={formik.touched.lowStockQty && formik.errors.lowStockQty}
              />}
              </div>
              
              <div className='grid md:grid-cols-2 gap-4 my-6'>
              <TextField
                fullWidth
                margin="normal"
                name="priceAfterDiscount"
                label="Price After Discount"
                type="number"
                variant="outlined"
                value={formik.values.priceAfterDiscount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <TextField
                fullWidth
                margin="normal"
                name="priceAfterExpiresAt"
                label="Price After Expires At"
                type="datetime-local"
                variant="outlined"
                value={
                  formik.values.priceAfterExpiresAt
                    ? dayjs(formik.values.priceAfterExpiresAt).format("YYYY-MM-DDTHH:mm")
                    : ''
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                InputLabelProps={{
                  shrink: true, // Ensures the label stays above the input
                }}
              />
              </div>
              <div className='grid md:grid-cols-4 gap-4 my-7'>
                <div className="">
                <div className="relative w-52 h-auto mx-auto">
                  {thumbnail ? (
                    <img
                    src={thumbnail}
                    alt="Product Thumbnail"
                    className="h-auto w-full shadow-lg object-cover rounded-md"
                    />
                  ) : (
                    <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-48 w-full border-dashed border-2 border-gray-300 flex items-center justify-center bg-gray-100 text-gray-500 rounded-md">
                      Click to add a thumbnail
                    </button>
                  )}


                  {thumbnail && (
                    <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -top-3 -right-3 bg-white w-8 h-8 rounded-full shadow-md hover:bg-gray-200 transition"
                    >
                    <EditIcon className="text-gray-500 w-3 h-3" />
                  </button>
                    </>
                  )}
                {formik.touched.imgCover && formik.errors.imgCover && (
                  <div className="text-red-500 text-sm mt-4">{formik.errors.imgCover}</div>
                )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  />

                <p className="font-light text-center text-sm mt-2">
                  Maximum file size is 10MB. Only *.png, *.jpg, and *.jpeg image files are accepted.
                </p>
              </div>
              <div className='col-span-3'>
              <ImageGalleryUploader
                images={formik.values.images} 
                setFieldValue={formik.setFieldValue}
                errors={formik.errors}
                touched={formik.touched}
                />
                </div>
              </div>
              <FieldArray name="metaTags" >
                {({ push, remove }) => (
                  <>
                  <div className='flex flex-wrap gap-6'>
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
                          <IconButton onClick={() => remove(index)} color="error">
                            <CloseIcon />
                          </IconButton>
                      </Box>
                    ))}
                  </div>
                  <Button onClick={() => push('')} color="primary">+ Add Meta Tag</Button>
                </>
                )}
              </FieldArray>
              <div className='grid md:grid-cols-2 gap-4'>
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
            </div>
            {/* Submit Button */}
          </div>
            <div className='grid grid-cols-2'>
            <Box sx={{ mt: 4 }} className='w-1/2 me-auto'>
              <Button type="button" variant='outlined' className="ml-auto w-full">
                <Link href="/dashboard/products">Cancel</Link>
              </Button>
            </Box>
            <Box sx={{ mt: 4 }} className='col-start-2 w-1/2 ms-auto'>
              <Button type="submit" variant="contained" color="primary" className="ml-auto w-full">
                Submit
              </Button>
            </Box>
            </div>
    </Box>
    </FormikProvider>
  );
};

export default ProductForm;
