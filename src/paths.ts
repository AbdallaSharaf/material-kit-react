export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    orders: '/dashboard/orders',
    products: '/dashboard/products',
    categories: '/dashboard/categories',
    ui: '/dashboard/ui',
    offers: '/dashboard/offers',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    reviews: '/dashboard/reviews',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
