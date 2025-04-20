// config.ts
'use server';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { getTranslations } from 'next-intl/server';

export async function getNavItems(): Promise<NavItemConfig[]> {
  const t = await getTranslations('common');
  return [
    { key: 'overview', title: t('Overview'), href: paths.dashboard.overview, icon: 'chart-pie' },
    { key: 'account', title: t('Account'), href: paths.dashboard.account, icon: 'user' },
    { key: 'reports', title: t('Reports'), href: paths.dashboard.reports, icon: 'reports' },
    { key: 'orders', title: t('Orders'), href: paths.dashboard.orders, icon: 'orders' },
    { key: 'customers', title: t('Customers'), href: paths.dashboard.customers, icon: 'users' },
    { key: 'categories', title: t('Categories'), href: paths.dashboard.categories, icon: 'categories' },
    { key: 'products', title: t('products'), href: paths.dashboard.products, icon: 'products' },
    { key: 'offers', title: t('Offers'), href: paths.dashboard.offers, icon: 'offers' },
    { key: 'ui', title: t('Ui'), href: paths.dashboard.ui, icon: 'ui' },
    { key: 'reviews', title: t('Reviews'), href: paths.dashboard.reviews, icon: 'star' },
    { key: 'settings', title: t('Settings'), href: paths.dashboard.settings, icon: 'gear-six' },
  ];
}
