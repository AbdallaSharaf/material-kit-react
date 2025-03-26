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
import { Tag as TagIcon } from "@phosphor-icons/react/dist/ssr/tag";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { X as CloseIcon } from "@phosphor-icons/react/dist/ssr/X";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { CategoryIn } from "@/interfaces/categoryInterface";
import { deleteCategory } from "@/redux/slices/categorySlice";
import { useCategoryHandlers } from "@/controllers/categoriesController";

export default function CategoriesModal(): React.JSX.Element {
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  const { handleDelete } = useCategoryHandlers();
  const { 
    categories, 
  } = useSelector((state: RootState) => state.categories);
  const router = useRouter();

  const handleCategoriesOpen = () => setCategoriesOpen(true);
  const handleCategoriesClose = () => setCategoriesOpen(false);

  const handleDeleteCategory = (categoryToDelete: CategoryIn) => {
    handleDelete(categoryToDelete)
    // TODO: Add delete API call or logic here
  };

  const handleEditCategory = (category: string) => {
    router.push(`/dashboard/categories/edit/${category}`);
  };

  const handleAddCategory = () => {
    router.push("/dashboard/categories/add");
  };

  return (
    <>
      <Button
        startIcon={<TagIcon fontSize="var(--icon-fontSize-md)" />}
        variant="contained"
        onClick={handleCategoriesOpen}
      >
        Categories
      </Button>

      <Dialog open={categoriesOpen} onClose={handleCategoriesClose} fullWidth maxWidth="sm">
        <DialogTitle>Manage Categories</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {/* Render Categories as Chips */}
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {categories?.map((category) => (
                <Chip
                  key={category._id}
                  label={category.name["en"]}
                  onDelete={() => handleDeleteCategory(category)}
                  onClick={() => handleEditCategory(category._id)}
                  color="primary"
                  sx={{ cursor: "pointer" }}
                />
              ))}

              {/* Add New Category Button */}
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
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
