import { IMenu } from '@/lib/interfaces/interfaces';
import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import Dialog from '@/components/dialog/Dialog';
import MenuForm from './MenuForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

type Props = {
  menus: IMenu[];
  onUpdateMenus: (updatedMenus: IMenu[]) => void;
  ressources: { name: string; route: string }[];
};
function MenusBuilder({ menus, onUpdateMenus, ressources }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('RoleSection.ressource.menu');

  const handleCreateMenu = useCallback(
    (menu: IMenu) => {
      const newMenus = [...menus, menu];
      onUpdateMenus(newMenus);
      setOpen(false);
    },
    [menus, onUpdateMenus]
  );
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title={t('create.title')}
      Trigger={
        <button className='flex items-center justify-center'>
          <FontAwesomeIcon icon={faAdd} />
        </button>
      }>
      <MenuForm
        ressources={ressources}
        onSubmit={handleCreateMenu}
        onCancel={() => setOpen(false)}
      />
    </Dialog>
  );
}
export default MenusBuilder;
