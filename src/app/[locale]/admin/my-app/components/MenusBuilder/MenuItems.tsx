import { IMenu } from '@/lib/interfaces/interfaces';
import MenuItem from './MenuItem';
import { useCallback } from 'react';

type Props = {
  initialMenus: IMenu[];
  onUpdateMenus: (updatedMenus: IMenu[]) => void;

  ressources: { name: string; route: string }[];
};
function MenuItems({ initialMenus, onUpdateMenus, ressources }: Props) {
  const handleUpdateMenu = useCallback(
    (menu: IMenu) => {
      const updatedMenus = initialMenus.map((m) => {
        if (menu._id === m._id) {
          return menu;
        }
        return m;
      });
      onUpdateMenus(updatedMenus);
    },
    [initialMenus, onUpdateMenus]
  );

  return (
    <ul>
      {initialMenus.map((menu) => (
        <MenuItem
          menu={menu}
          key={menu._id}
          onUpdateMenu={handleUpdateMenu}
          ressources={ressources}
        />
      ))}
    </ul>
  );
}
export default MenuItems;
