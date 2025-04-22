export interface CouponOut {
    code?: string; // unique coupon code
    type?: "percentage" | "fixed"; // type of discount
    discount?: string; // value of discount (e.g., 10%)
    limit?: string; // max string of times it can be used
    userLimit?: string;
    isActive?: boolean; // active/inactive status
    expiresAt?: string; // ISO string
    validFor?: "category" | "product" | "shipping" | "all";
    appliedOn?: string[]; // e.g., array of service or category IDs
    minAmount?: string; // minimum order amount
    activeFromHour?: number; // minimum order amount
    activeToHour?: number; // minimum order amount
    maxAmount?: string; // maximum order amount
    }
  
  export interface CouponIn {
    _id: string,
    code: string,
    type: "percentage" | "fixed",
    discount: number,
    expiresAt: string,
    minAmount: string,
    maxAmount: string,
    userLimit: string,
    limit: string,
    validFor: "category" | "product" | "shipping" | "all",
    appliedOn: string[],
    isActive: boolean,
    deleted: boolean,
    activeFromHour: number,
    activeToHour: number,
    count: number,
    disableFractionalQuantity: boolean,
    createdAt: string,
    updatedAt: string,
    __v: 0
  }
  