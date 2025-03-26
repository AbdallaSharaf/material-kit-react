import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import CategoryForm from "@/components/dashboard/categories/category-form";

interface PageProps {
  params: { id: string };
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
    const category = data.Category;
    console.log("Fetched category data:", data);
    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
};

const categoryPage = async ({ params }: PageProps) => {
  const { id } = params;

  if (!id) throw new Error("No category ID provided");

  const category = await getCategoryById(id);

  if (!category) return <p>Loading category data...</p>;

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">Update Category</Typography>
        </div>
      </Stack>

      <CategoryForm category={category} />
    </Stack>
  );
};

export default categoryPage;
