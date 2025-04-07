import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import CouponForm from "@/components/dashboard/coupons/coupon-form";

interface PageProps {
  params: { id: string };
}

const getCouponById = async (id: string) => {
  try {
    console.log("Fetching coupon with ID:", id);
    const res = await fetch(`https://fruits-heaven-api.vercel.app/api/v1/coupon/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch coupon: ${res.status}`);

    const data = await res.json();
    const coupon = data.coupon;
    console.log("Fetched coupon data:", data.coupon);
    return coupon;
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return null;
  }
};

const couponPage = async ({ params }: PageProps) => {
  const { id } = params;

  if (!id) throw new Error("No coupon ID provided");

  const coupon = await getCouponById(id);
    console.log("coupon", coupon)
  if (!coupon) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4">Coupon Not Found</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">
            {coupon && `Edit ${coupon.code}`}
          </Typography>
        </div>
      </Stack>

      {coupon &&  <CouponForm coupon={coupon} />}
    </Stack>
  );
};

export default couponPage;
