export type CustomerIn = {
    name: string,
    email: string,
    phone: string,
    _id: string,
    createdAt: string,
    lastLogin: string,
    numberOfOrders: number,
    ordersSum: number,
    address: {
        country: string,
        city: string,
        street: string,
    }[],
  }
    