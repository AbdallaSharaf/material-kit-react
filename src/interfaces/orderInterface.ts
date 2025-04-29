import { CouponIn } from "./couponInterface";

export interface OrderIn {
    shippingAddress: {
      city: string;
      street: string;
      country: string;
      zipCode: string;
      phone: string;
      name: string;
      email: string;
    };
    user?: {
        name: string;
    }
    _id: string;
    items: Array<{
      name: {
        ar: string;
        en: string;
      };
      productId: string;
      imgCover: any[]; // You might want to replace 'any' with a more specific type for images
      price: number;
      available: boolean;
      quantity: number;
      itemPrice: number;
      totalPrice: number;
      _id: string;
      category: any[]; // You might want to replace 'any' with a specific category type
    }>;
    totalQuantity: number;
    totalPrice: number;
    invoiceId: string;
    subTotal: number;
    notes: string;
    shippingFee: number;
    paymentMethod: string;
    isPaid: boolean;
    isDelivered: boolean;
    status: string;
    isRefunded: boolean;
    statusHistory: any[]; // You might want to replace 'any' with a specific type
    adminNotes: any[]; // You might want to replace 'any' with a specific type
    changeLog: any[]; // You might want to replace 'any' with a specific type
    createdAt: string;
    updatedAt: string;
    coupon: null | CouponIn; // You might want to replace 'any' with a specific coupon type
    __v: number;
  }

export interface OrderOut {
    _id: string;
    status: string;
  }