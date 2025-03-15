import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { BagSimple as OrdersIcon } from '@phosphor-icons/react/dist/ssr/BagSimple';
import { Package as ProductsIcon } from '@phosphor-icons/react/dist/ssr/Package';
import { DeviceMobile as UIIcon } from '@phosphor-icons/react/dist/ssr/DeviceMobile';
import { TagSimple as OffersIcon } from '@phosphor-icons/react/dist/ssr/TagSimple';
import { Star as StarIcon } from '@phosphor-icons/react/dist/ssr/Star'; // Added Star icon

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  user: UserIcon,
  users: UsersIcon,
  orders: OrdersIcon,
  products: ProductsIcon,
  ui: UIIcon,
  offers: OffersIcon,
  star: StarIcon, // Added Star icon
} as Record<string, Icon>;
