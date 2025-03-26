
export type CategoryOut = {
    name?: {
        ar?: string,
        en?: string
    },
    description?: {
        ar?: string,
        en?: string
    },
    order?: number,
    available?: boolean,
  }

export type CategoryIn = {
    name: {
        ar: string,
        en: string
    },
    description: {
        ar: string,
        en: string
    },
    showInTopMenu: boolean,
    _id: string,
    slug: string,
    photos: string[],
    order: number,
    available: boolean,
    deleted: boolean,
    createdAt: string,
    updatedAt: string,
    __v: number,
  }
    
  
export type CategoriesModalProps = {
  isOpen: boolean;
  category: CategoryIn | null;
  onClose: () => void;
};
    