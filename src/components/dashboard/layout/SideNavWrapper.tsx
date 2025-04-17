import { getNavItems } from './config';
import { SideNav } from './side-nav';

export default async function SideNavWrapper() {
  const navItems = await getNavItems();

  return <SideNav navItems={navItems} />;
}
