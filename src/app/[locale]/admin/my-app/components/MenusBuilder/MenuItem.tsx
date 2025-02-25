import { IMenu } from '@/lib/interfaces/interfaces';
import Dialog from '@/components/dialog/Dialog';
import Button from '@/components/buttons/Button';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import MenuForm from './MenuForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

type Props = {
  menu: IMenu;
  onUpdateMenu: (menu: IMenu) => void;
  ressources: { name: string; route: string }[];
};
function MenuItem({ menu, onUpdateMenu, ressources }: Props) {
  const t = useTranslations('RoleSection.ressource.menu');
  const [open, setOpen] = useState(false);

  const handleSubmit = useCallback(
    (menu: IMenu) => {
      onUpdateMenu(menu);
      setOpen(false);
    },
    [onUpdateMenu]
  );
  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);
  return (
    <li>
      <div className='flex items-center justify-between'>
        <span className='mr-2 text-sm'>{menu.title}</span>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title={t('create.title')}
          Trigger={
            <Button className='w-6 h-6 flex items-center justify-center'>
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          }>
          <MenuForm
            menu={menu}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            ressources={ressources}
          />
        </Dialog>
      </div>
      <ul className='ml-2'>
        {menu.entries.map((entry, key) => (
          <li key={key}>
            <span className='text-sm'>{entry.label}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}
export default MenuItem;
