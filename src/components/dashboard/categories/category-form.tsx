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
import { useTranslations } from "next-intl";
import Link from "next/link";

interface CategoryFormProps {
  category?: CategoryIn;
}

const CategoryForm = ({ category }: CategoryFormProps) => {
  const t = useTranslations("common");
  const { handleCreateCategory, handleUpdateCategory } = useCategoryHandlers();

  const formik = useFormik({
    initialValues: {
      name_ar: category?.name?.ar || "",
      name_en: category?.name?.en || "",
      available: category?.available || true,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name_ar: Yup.string()
        .trim()
        .required(t("Arabic name is required"))
        .min(2, t("Too short category name")),
      name_en: Yup.string()
        .trim()
        .required(t("English name is required"))
        .min(2, t("Too short category name")),
      available: Yup.boolean().required(t("Availability status is required")),
    }),
    onSubmit: async (values) => {
      const { name_ar, name_en, ...rest } = values;

      const formattedData: CategoryOut = {
        ...rest,
        name: {
          ar: name_ar,
          en: name_en,
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
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      Swal.fire({
        icon: "warning",
        title: t("Incomplete Data"),
        text: t("Please complete all required fields before submitting"),
      });
    }
    formik.handleSubmit();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSubmit(e);
        }
      }}
      noValidate
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            fullWidth
            label={t("Arabic Name")}
            name="name_ar"
            value={formik.values.name_ar}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name_ar && Boolean(formik.errors.name_ar)}
            helperText={formik.touched.name_ar && formik.errors.name_ar}
          />

          <TextField
            fullWidth
            label={t("English Name")}
            name="name_en"
            value={formik.values.name_en}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name_en && Boolean(formik.errors.name_en)}
            helperText={formik.touched.name_en && formik.errors.name_en}
          />
        </div>

        <FormControlLabel
          control={
            <Switch
              checked={formik.values.available}
              onChange={formik.handleChange}
              name="available"
              color="primary"
            />
          }
          label={t("Available")}
          labelPlacement="start"
        />

        <div className='grid grid-cols-2'>
            <Box sx={{ mt: 4 }} className='w-1/2 me-auto'>
              <Button type="button" variant='outlined' className="ml-auto w-full">
                <Link href="/dashboard/categories">{t("Cancel")}</Link>
              </Button>
            </Box>
            <Box sx={{ mt: 4 }} className='col-start-2 w-1/2 ms-auto'>
              <Button type="submit" variant="contained" color="primary" className="ml-auto w-full">
                {t("Submit")}
              </Button>
            </Box>
            </div>
      </div>
    </Box>
  );
};

export default CategoryForm;
