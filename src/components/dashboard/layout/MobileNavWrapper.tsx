import { getNavItems } from './config';
import { MobileNav } from './mobile-nav';

export default async function MobileNavWrapper({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navItems = await getNavItems(); 

  return <MobileNav open={open} onClose={onClose} items={navItems} />;
}
