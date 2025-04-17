import { useEffect, useState } from 'react';
import { getNavItems } from './config';
import { MobileNav } from './mobile-nav';

export default function MobileNavWrapper({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [navItems, setNavItems] = useState<any[]>([]); // State to store nav items

  useEffect(() => {
    // Fetch nav items when the component is mounted
    const fetchNavItems = async () => {
      try {
        const items = await getNavItems();
        setNavItems(items);
      } catch (error) {
        console.error('Error fetching nav items:', error);
      }
    };

    fetchNavItems();
  }, []); // Empty dependency array means this effect runs only once (on mount)

  // Return the MobileNav component after the nav items are fetched
  return <MobileNav open={open} onClose={onClose} items={navItems} />;
}
