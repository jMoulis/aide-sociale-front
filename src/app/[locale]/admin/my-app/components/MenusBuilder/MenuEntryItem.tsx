import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import { IMenuEntry, IRole } from '@/lib/interfaces/interfaces';
import {
  faArrowDown,
  faArrowUp,
  faEdit,
  faTrash
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import MenuEntryForm from './MenuEntryForm';
import { useTranslations } from 'next-intl';

type Props = {
  entry: IMenuEntry;
  onReorder: (entryId: number, direction: 'up' | 'down') => void;
  entryIndex: number;
  entriesLength: number;
  onChangeEntry: (entryId: number, entry: IMenuEntry) => void;
  onDeleteEntry: (entryIndex: number) => void;
  roles: IRole[];
  ressources: { name: string; route: string }[];
};
function MenuEntryItem({
  entry,
  onReorder,
  entryIndex,
  entriesLength,
  onChangeEntry,
  onDeleteEntry,
  roles,
  ressources
}: Props) {
  const t = useTranslations('RoleSection.ressource.menu.menuEntries');
  const [open, setOpen] = useState(false);

  const handleEditEntry = (entry: IMenuEntry) => {
    onChangeEntry(entryIndex, entry);
    setOpen(false);
  };
  return (
    <li className='flex justify-between'>
      <span>{entry.label}</span>
      <div className='flex items-center'>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title={t('edit.title')}
          Trigger={
            <Button>
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          }>
          <MenuEntryForm
            roles={roles}
            initEntry={entry}
            onSubmit={handleEditEntry}
            onCancel={() => setOpen(false)}
            ressources={ressources}
          />
        </Dialog>
        <Button
          onClick={() => onReorder(entryIndex, 'up')}
          disabled={entryIndex === 0}>
          <FontAwesomeIcon icon={faArrowUp} />
        </Button>
        <Button
          onClick={() => onReorder(entryIndex, 'down')}
          disabled={entryIndex === entriesLength}>
          <FontAwesomeIcon icon={faArrowDown} />
        </Button>
        <Button onClick={() => onDeleteEntry(entryIndex)}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </div>
    </li>
  );
}
export default MenuEntryItem;
