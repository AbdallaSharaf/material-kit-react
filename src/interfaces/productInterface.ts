import { CategoryIn } from "./categoryInterface"

export type ProductIn = {
    name: {
        ar: string,
        en: string
    },
    description: {
        ar: string,
        en: string
    },
    shortDesc: {
        ar: string,
        en: string
    },
    _id: string,
    slug: string,
    stock: number,
    isTopProduct: boolean,
    metaTags: string[],
    category: {category: CategoryIn, order: number, _id: string}[],
    available: boolean,
    parentAvailable: boolean,
    price: number,
    images: string[],
    showWeight: boolean,
    minQty: number,
    trackQty: boolean,
    sold: number,
    priceAfterExpiresAt: string,
    priceAfterDiscount: number,
    deleted: boolean,
    SKU: number,
    order: number,
    lowStockQty: number,
    imgCover: string,
    createdAt: string,
    updatedAt: string,
    __v: number,
    id: string
}


export type ProductOut = {
        name?: {
            ar?: string
            en?: string
        },
        metaTags?: string[],
        images?: string[],
        imgCover?: string,
        category?: 
            {
                category?: string,
                order?: number
            }[],
        available?: boolean,
        price?: number,
        stock?: number,
        lowStockQty?: number,
        priceAfterExpiresAt?: string,
        priceAfterDiscount?: number,
        isTopProduct?: boolean,
        SKU?: number,
        order?: number,
        description?: {
            ar?: string,
            en?: string
        },
        shortDesc?: {
            ar?: string,
            en?: string
        },
        trackQty?:boolean
    }
