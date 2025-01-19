import { IMenu } from '@/lib/interfaces/interfaces';
import { useCallback, useState } from 'react';
import MenuItem from './MenuItem';
import { useTranslations } from 'next-intl';
import Dialog from '@/components/dialog/Dialog';
import Button from '@/components/buttons/Button';
import MenuForm from './MenuForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

type Props = {
  menus: IMenu[];
  onUpdateMenus: (updatedMenus: IMenu[]) => void;
};
function MenusBuilder({ menus, onUpdateMenus }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('RoleSection.ressource.menu');

  const handleUpdateMenu = useCallback(
    (menu: IMenu) => {
      const updatedMenus = menus.map((m) => {
        if (menu._id === m._id) {
          return menu;
        }
        return m;
      });
      onUpdateMenus(updatedMenus);
    },
    [menus, onUpdateMenus]
  );

  const handleCreateMenu = useCallback(
    (menu: IMenu) => {
      const newMenus = [...menus, menu];
      onUpdateMenus(newMenus);
      setOpen(false);
    },
    [menus, onUpdateMenus]
  );
  return (
    <div className='m-2'>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-sm'>{t('menuManagement')}</span>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title={t('create.title')}
          Trigger={
            <Button className='w-8 h-8 flex items-center justify-center'>
              <FontAwesomeIcon icon={faAdd} />
            </Button>
          }>
          <MenuForm
            onSubmit={handleCreateMenu}
            onCancel={() => setOpen(false)}
          />
        </Dialog>
      </div>
      <ul>
        {menus.map((menu) => (
          <MenuItem
            menu={menu}
            key={menu._id}
            onUpdateMenu={handleUpdateMenu}
          />
        ))}
      </ul>
    </div>
  );
}
export default MenusBuilder;
