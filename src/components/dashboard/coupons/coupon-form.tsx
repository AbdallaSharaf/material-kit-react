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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
// import your handler
import { useCouponHandlers } from "@/controllers/couponsController"; // update this path accordingly
import { CouponIn, CouponOut } from "@/interfaces/couponInterface"; // define this interface
import { RootState } from "@/redux/store/store";
import { useSelector } from "react-redux";
import { useCategoryHandlers } from "@/controllers/categoriesController";
import { useProductHandlers } from "@/controllers/productsController";
import { useLocale, useTranslations } from "next-intl";

interface CouponFormProps {
  coupon?: CouponIn;
}

const CouponForm = ({ coupon }: CouponFormProps) => {
  const t = useTranslations('common');
  const locale = useLocale() as "en" | "ar";
  const { fetchOptions } = useCouponHandlers();
  const { handleCreateCoupon, handleUpdateCoupon } = useCouponHandlers(); // implement this logic
    // Get categories, products, and refresh flags from Redux
    const { categories, loading: categoriesLoading, refreshData: refreshDataCategories } = useSelector(
      (state: RootState) => state.categories
    );
    
    const { products, loading: productsLoading, refreshData: refreshDataProducts } = useSelector(
      (state: RootState) => state.products
    );

  const formik = useFormik({
    initialValues: {
      code: coupon?.code || "",
      type: coupon?.type || "percentage",
      discount: coupon?.discount || 0,
      expiresAt: coupon?.expiresAt || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      minAmount: coupon?.minAmount || "0",
      maxAmount: coupon?.maxAmount || "100000",
      userLimit: coupon
        ? coupon.userLimit === "unlimited"
          ? { mode: "unlimited", value: "" }
          : { mode: "limited", value: coupon.userLimit || "" }
        : { mode: "unlimited", value: "" },
      limit: coupon
        ? coupon.limit === "unlimited"
          ? { mode: "unlimited", value: "" }
          : { mode: "limited", value: coupon.limit || "" }
        : { mode: "unlimited", value: "" },
      validFor: coupon?.validFor || "all",
      appliedOn: coupon?.appliedOn || [],
      isActive: coupon?.isActive ?? true,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      code: Yup.string().required("Coupon code is required"),
      type: Yup.string().oneOf(["percentage", "fixed"]).required("Coupon type is required"),
      discount: Yup.number()
      .moreThan(0, "Discount must be greater than 0")
      .when("type", {
        is: "percentage",
        then: (schema) => schema.max(100, "Percentage discount cannot exceed 100"),
        otherwise: (schema) => schema,
      })
      .required("Discount is required"),
      expiresAt: Yup.string().required("Expiry date is required"),
      minAmount: Yup.string(),
      maxAmount: Yup.string(),
      userLimit: Yup.object({
        mode: Yup.string().oneOf(["unlimited", "limited"]).required(),
        value: Yup.string().when("mode", {
          is: "limited",
          then: (schema) => schema.required("Value is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      }),
      limit: Yup.object({
        mode: Yup.string().oneOf(["unlimited", "limited"]).required(),
        value: Yup.string().when("mode", {
          is: "limited",
          then: (schema) => schema.required("Value is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      }),
      validFor: Yup.string().oneOf(["category", "product", "shipping", "all"]).required(),
      isActive: Yup.boolean(),
      appliedOn: Yup.array().when('validFor', {
        is: (validFor: string) => validFor === 'category' || validFor === 'product',
        then: (schema) => schema.min(1, 'At least one item must be selected').required('This field is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: async (values) => {
      let isSuccess = false;
    
      // Convert discount to string
      const { discount, appliedOn, ...rest } = values;
      const formattedValues: CouponOut = {
        ...rest,
        userLimit: values.userLimit.mode === "unlimited" ? "unlimited" : values.userLimit.value,
        limit: values.limit.mode === "unlimited" ? "unlimited" : values.limit.value,
        discount: String(discount),
      };
    
        // Remove appliedOn if validFor is "all" or "shipping"
      if (values.validFor !== "all" && values.validFor !== "shipping") {
        formattedValues.appliedOn = appliedOn;
      }

      if (coupon) {
        isSuccess = await handleUpdateCoupon({ id: coupon._id, values: formattedValues });
      } else {
        isSuccess = await handleCreateCoupon(formattedValues);
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
        title: "Incomplete Data",
        text: "Please complete all required fields before submitting.",
      });
    }
    formik.handleSubmit();
  };

  React.useEffect(() => {
    if (products.length === 0 || categories.length === 0) {
    fetchOptions()
  }
  }, [refreshDataCategories, refreshDataProducts]);

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            fullWidth
            label={t("code")}
            name="code"
            value={formik.values.code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
          />

          <TextField
            fullWidth
            select
            label={t("type")}
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={formik.touched.type && formik.errors.type}
          >
            <MenuItem value="percentage">{t("percentage")}</MenuItem>
            <MenuItem value="fixed">{t("fixed")}</MenuItem>
          </TextField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            fullWidth
            type="number"
            label={t("discount")}
            name="discount"
            value={formik.values.discount}
            onChange={(e) => {
              const inputValue = e.target.value;
              const numericValue = parseFloat(inputValue);

              if (inputValue === "") {
                formik.setFieldValue("discount", "");
                return;
              }

              if (formik.values.type === "percentage") {
                if (numericValue > 100 || numericValue < 0) return;
              } else {
                if (numericValue < 0) return;
              }

              formik.setFieldValue("discount", inputValue);
            }}
            error={formik.touched.discount && Boolean(formik.errors.discount)}
            helperText={formik.touched.discount && formik.errors.discount}
            inputProps={{
              min: 0,
              max: formik.values.type === "percentage" ? 100 : undefined,
              step: "1",
            }}
          />

          <TextField
            fullWidth
            type="date"
            label={t("expiresAt")}
            name="expiresAt"
            InputLabelProps={{ shrink: true }}
            value={formik.values.expiresAt}
            onChange={formik.handleChange}
            error={formik.touched.expiresAt && Boolean(formik.errors.expiresAt)}
            helperText={formik.touched.expiresAt && formik.errors.expiresAt}
            inputProps={{
              min: new Date(new Date().setHours(0, 0, 0, 0)).toISOString().split("T")[0],
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            fullWidth
            label={t("minAmount")}
            name="minAmount"
            value={formik.values.minAmount}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            label={t("maxAmount")}
            name="maxAmount"
            value={formik.values.maxAmount}
            onChange={formik.handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          select
          fullWidth
          label={t("userLimit")}
          name="userLimit.mode"
          value={formik.values.userLimit.mode}
          onChange={formik.handleChange}
        >
          <MenuItem value="unlimited">{t("unlimited")}</MenuItem>
          <MenuItem value="limited">{t("limited")}</MenuItem>
        </TextField>

        {formik.values.userLimit.mode === "limited" && (
          <TextField
            fullWidth
            type="number"
            label={t("userLimitValue")}
            name="userLimit.value"
            value={formik.values.userLimit.value}
            onChange={formik.handleChange}
            error={formik.touched.userLimit?.value && Boolean(formik.errors.userLimit?.value)}
            helperText={formik.touched.userLimit?.value && formik.errors.userLimit?.value}
            inputProps={{
              min: 1,
              onKeyDown: (e) => {
                if (
                  ["e", "E", "+", "-", "."].includes(e.key) ||
                  (e.key === "0" && e.currentTarget.value.length === 0)
                ) {
                  e.preventDefault();
                }
              },
            }}
          />
        )}
      </div>

      {/* GLOBAL LIMIT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          select
          fullWidth
          label={t("globalLimit")}
          name="limit.mode"
          value={formik.values.limit.mode}
          onChange={formik.handleChange}
        >
          <MenuItem value="unlimited">{t("unlimited")}</MenuItem>
          <MenuItem value="limited">{t("limited")}</MenuItem>
        </TextField>

        {formik.values.limit.mode === "limited" && (
          <TextField
            fullWidth
            type="number"
            label={t("globalLimitValue")}
            name="limit.value"
            value={formik.values.limit.value}
            onChange={formik.handleChange}
            error={formik.touched.limit?.value && Boolean(formik.errors.limit?.value)}
            helperText={formik.touched.limit?.value && formik.errors.limit?.value}
            inputProps={{
              min: 1,
              onKeyDown: (e) => {
                if (
                  ["e", "E", "+", "-", "."].includes(e.key) ||
                  (e.key === "0" && e.currentTarget.value.length === 0)
                ) {
                  e.preventDefault();
                }
              },
            }}
          />
        )}
      </div>

      <TextField
        fullWidth
        select
        label={t("validFor")}
        name="validFor"
        value={formik.values.validFor}
        onChange={formik.handleChange}
        error={formik.touched.validFor && Boolean(formik.errors.validFor)}
        helperText={formik.touched.validFor && formik.errors.validFor}
      >
        <MenuItem value="all">{t("all")}</MenuItem>
        <MenuItem value="category">{t("category")}</MenuItem>
        <MenuItem value="product">{t("product")}</MenuItem>
        <MenuItem value="shipping">{t("shipping")}</MenuItem>
      </TextField>

      {(formik.values.validFor === "category" || formik.values.validFor === "product") && (
        <FormControl fullWidth error={formik.touched.appliedOn && Boolean(formik.errors.appliedOn)}>
          <InputLabel>
            {formik.values.validFor === "category" ? t("categories") : t("products")}
          </InputLabel>

          <Select
            multiple
            label={formik.values.validFor === "category" ? t("categories") : t("products")}
            name="appliedOn"
            value={formik.values.appliedOn}
            onChange={formik.handleChange}
            renderValue={(selected) => (
              <div>
                {selected.map((value) => {
                  const item = (formik.values.validFor === "category" ? categories : products).find(
                    (item) => item._id === value
                  );
                  return item ? (
                    <Chip key={value} label={item.name[locale]} />
                  ) : null;
                })}
              </div>
            )}
          >
            {(categoriesLoading || productsLoading) ? (
              <MenuItem disabled>
                <CircularProgress size={24} />
              </MenuItem>
            ) : (
              (formik.values.validFor === "category" ? categories : products).map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  <Checkbox checked={formik.values.appliedOn.indexOf(item._id) > -1} />
                  {item.name[locale]}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      )}

      <div className="w-full flex justify-end">
        <FormControlLabel
          className="w-fit"
          control={
            <Switch
              checked={formik.values.isActive}
              onChange={formik.handleChange}
              name="isActive"
              color="primary"
            />
          }
          label={t("active")}
          labelPlacement="start"
        />
      </div>


        <div className="flex justify-end">
          <Button type="submit" variant="contained" color="primary" className="w-1/4 ml-auto">
            {t("Submit")}
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default CouponForm;
