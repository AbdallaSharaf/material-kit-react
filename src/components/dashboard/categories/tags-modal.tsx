"use client";

import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import { Tag as TagIcon } from "@phosphor-icons/react/dist/ssr/Tag";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { CategoryIn } from "@/interfaces/categoryInterface";
import { useCategoryHandlers } from "@/controllers/categoriesController";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

export default function CategoriesModal(): React.JSX.Element {
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  const { handleDelete, fetchData } = useCategoryHandlers();
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("common");

  const {
    categories,
    refreshData,
  } = useSelector((state: RootState) => state.categories);

  const router = useRouter();

  const handleCategoriesOpen = () => setCategoriesOpen(true);
  const handleCategoriesClose = () => setCategoriesOpen(false);

  const handleDeleteCategory = (categoryToDelete: CategoryIn) => {
    handleDelete(categoryToDelete);
  };

  const handleEditCategory = (category: string) => {
    router.push(`/dashboard/categories/edit/${category}`);
  };

  const handleAddCategory = () => {
    router.push("/dashboard/categories/add");
  };

  React.useEffect(() => {
    fetchData();
  }, [refreshData]);

  return (
    <>
      <Button
        variant="contained"
        onClick={handleCategoriesOpen}
        style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        {t("Categories")}
        <TagIcon fontSize="var(--icon-fontSize-md)" />
      </Button>

      <Dialog open={categoriesOpen} onClose={handleCategoriesClose} fullWidth maxWidth="sm" 
              disablePortal // Prevents rendering in a portal
              sx={{
                zIndex: 10, // Default MUI Dialog z-index (adjust if needed)
                '& .swal-override': {
                  zIndex: 1400, // Ensure Swal is above Dialog
                },
              }}>
        <DialogTitle>{t("Manage Categories")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {categories?.map((category) => (
                <Chip
                  key={category._id}
                  label={category.name[locale]}
                  onDelete={() => handleDeleteCategory(category)}
                  onClick={() => handleEditCategory(category._id)}
                  color="primary"
                  sx={{ cursor: "pointer" }}
                />
              ))}

              <IconButton
                size="small"
                color="primary"
                onClick={handleAddCategory}
                sx={{ borderRadius: "50%", border: "1px solid", height: 32, width: 32 }}
              >
                <PlusIcon />
              </IconButton>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCategoriesClose} variant="outlined" color="primary">
            {t("Close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
