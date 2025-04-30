
export type ReviewOut = {
    deleted?: boolean,
  }

export type ReviewIn = {
    user: {
        name: string,
        _id: string,
        phone: string,
    },
    _id: string,
    comment: string,
    deleted: boolean,
    createdAt: string,
    productName: string
  }