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
    _id: string,
    slug: string,
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
    deleted: boolean,
    SKU: number,
    imgCover: string[],
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
        category?: 
            {
                category?: string,
                order?: number
            }[],
        available?: boolean,
        price?: number,
        SKU?: number,
        trackQty?:boolean
    }
