import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import CategoryForm from "@/components/dashboard/categories/category-form";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: { id: string };
}

const getCategoryById = async (id: string) => {
  try {
    const res = await fetch(`https://fruits-heaven-api.vercel.app/api/v1/category/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch category: ${res.status}`);

    const data = await res.json();
    return data.Category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
};

const categoryPage = async ({ params }: PageProps) => {
  const t = await getTranslations("common");
  const { id } = params;

  if (!id) throw new Error("No category ID provided");

  const category = await getCategoryById(id);

  if (!category) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4">{t("Category Not Found")}</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">
            {`${t("Edit")} ${category.name["en"]}`}
          </Typography>
        </div>
      </Stack>

      <CategoryForm category={category} />
    </Stack>
  );
};

export default categoryPage;
