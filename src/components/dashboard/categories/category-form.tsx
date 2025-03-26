"use client";

import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { CategoryIn, CategoryOut } from "@/interfaces/categoryInterface";
import Swal from "sweetalert2";
import { useCategoryHandlers } from "@/controllers/categoriesController";

interface CategoryFormProps {
    category?: CategoryIn;
  }
const CategoryForm = ({category}: CategoryFormProps) => {

  const { handleCreateCategory, handleUpdateCategory } = useCategoryHandlers();
    
  const formik = useFormik({
    initialValues: {
      name_ar: category?.name?.ar ||"",
      name_en: category?.name?.en || "",
      description_ar: category?.description?.ar || "",
      description_en: category?.description?.ar ||"",
      available: category?.available || true,
    },
    validationSchema: Yup.object({
      name_ar: Yup.string().required("Arabic name is required"),
      name_en: Yup.string().required("English name is required"),
      description_en: Yup.string().required("English description is required"),
      description_ar: Yup.string().required("Arabic description is required"),
    }),
    onSubmit: async (values) => {
        const { name_ar, name_en, description_ar, description_en, ...rest } = values;

        const formattedData: CategoryOut = {
          ...rest,
          name: {
            ar: name_ar,
            en: name_en,
          },
          description: {
            ar: description_ar,
            en: description_en,
          },
        };
        let isSuccess = false;
        if (category) {
          isSuccess = await handleUpdateCategory({ id: category._id, values: formattedData });
        } else {
          isSuccess = await handleCreateCategory(formattedData);
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
      // Show SweetAlert2 error if there are validation errors
      Swal.fire({
        icon: "warning",
        title: "Incomplete Data",
        text: "Please complete all required fields before submitting.",
      });
    } 
    formik.handleSubmit(); // Trigger Formik's onSubmit
  };
  return (
    <Box component="form" onSubmit={handleSubmit} 
    onKeyDown={(e) => {
        if (e.key === "Enter") {
        e.preventDefault()
        handleSubmit
        }
    }} noValidate>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          fullWidth
          label="Arabic Name"
          name="name_ar"
          value={formik.values.name_ar}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name_ar && Boolean(formik.errors.name_ar)}
          helperText={formik.touched.name_ar && formik.errors.name_ar}
          />

        <TextField
          fullWidth
          label="English Name"
          name="name_en"
          value={formik.values.name_en}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name_en && Boolean(formik.errors.name_en)}
          helperText={formik.touched.name_en && formik.errors.name_en}
          />

        </div>
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

        <FormControlLabel
          control={
              <Switch
              checked={formik.values.available}
              onChange={formik.handleChange}
              name="available"
              color="primary"
              />
            }
            label="Available:"
            labelPlacement="start"
            />
        <div className="flex justify-end">
        <Button type="submit" variant="contained" color="primary" className="w-1/4 ml-auto">
          Submit
        </Button>
        </div>
      </div>
    </Box>
  );
};

export default CategoryForm;
