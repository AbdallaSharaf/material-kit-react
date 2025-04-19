import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import CouponForm from "@/components/dashboard/coupons/coupon-form";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: { id: string };
}

const getCouponById = async (id: string) => {
  try {
    const res = await fetch(`https://fruits-heaven-api.vercel.app/api/v1/coupon/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch coupon: ${res.status}`);

    const data = await res.json();
    return data.coupon;
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return null;
  }
};

const CouponPage = async ({ params }: PageProps) => {
  const { id } = params;
  const t = await getTranslations("common");

  if (!id) throw new Error("No coupon ID provided");

  const coupon = await getCouponById(id);

  if (!coupon) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4">{t("CouponNotFound")}</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">
            {t("Edit")} {coupon.code}
          </Typography>
        </div>
      </Stack>

      <CouponForm coupon={coupon} />
    </Stack>
  );
};

export default CouponPage;
