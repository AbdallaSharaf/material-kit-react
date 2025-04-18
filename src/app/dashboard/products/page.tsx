import * as React from "react";
import { ProductsTable } from "@/components/dashboard/products/products-table";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TagsModal from "@/components/dashboard/categories/tags-modal";
import { getLocale, getTranslations } from "next-intl/server";

interface PageProps {
  searchParams: { category?: string }; // Use searchParams instead of params
}

const getCategoryById = async (id: string) => {
  try {
    console.log("Fetching category with ID:", id);
    const res = await fetch(`https://fruits-heaven-api.vercel.app/api/v1/category/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch category: ${res.status}`);

    const data = await res.json();
    console.log("Fetched category data:", data);
    return data.Category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
};

export default async function Page({ searchParams }: PageProps) {
  const categoryId = searchParams.category || ""; // Get category from query params
  const t = await getTranslations("common")
  const locale = await getLocale()
  const categoryData = categoryId ? await getCategoryById(categoryId) : null;

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">
            {categoryData ? `Products of ${categoryData.name[locale]}` : t("products")}
          </Typography>
          {!categoryId && <TagsModal />}
        </div>
      </Stack>

      <ProductsTable />
    </Stack>
  );
}
