import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'orders', title: 'Orders', href: paths.dashboard.orders, icon: 'orders' },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  { key: 'categories', title: 'Categories', href: paths.dashboard.categories, icon: 'categories' },
  { key: 'products', title: 'Products', href: paths.dashboard.products, icon: 'products' },
  { key: 'offers', title: 'Offers', href: paths.dashboard.offers, icon: 'offers' },
  { key: 'ui', title: 'Ui', href: paths.dashboard.ui, icon: 'ui' },
  { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'reviews', title: 'Reviews', href: paths.dashboard.reviews, icon: 'star' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
] satisfies NavItemConfig[];
