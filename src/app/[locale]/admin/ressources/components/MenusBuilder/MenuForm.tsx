import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { IMenu, IMenuEntry, IRole } from '@/lib/interfaces/interfaces';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { useTranslations } from 'next-intl';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Button from '@/components/buttons/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { sortArray } from '@/lib/utils/utils';
import { CheckedState } from '@radix-ui/react-checkbox';
import MenuEntryItem from './MenuEntryItem';
import { v4 } from 'uuid';
import CancelButton from '@/components/buttons/CancelButton';
import Dialog from '@/components/dialog/Dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import MenuEntryForm from './MenuEntryForm';

type Props = {
  menu?: IMenu;
  onSubmit: (menu: IMenu) => void;
  onCancel: () => void;
};
function MenuForm({ menu, onSubmit, onCancel }: Props) {
  const defaultMenu: IMenu = {
    _id: v4(),
    title: '',
    entries: [],
    roles: []
  };
  const [updatedMenu, setUpdatedMenu] = useState<IMenu>(menu || defaultMenu);
  const [roles, setRoles] = useState<IRole[]>([]);
  const organizationId = useOrganization();
  const t = useTranslations('RoleSection.ressource.menu');
  const tGlobal = useTranslations('GlobalSection.actions');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!organizationId) return;
    client
      .list<IRole>(ENUM_COLLECTIONS.ROLES, {
        organizationId
      })
      .then(({ data }) => {
        if (!data) return;
        setRoles(sortArray(data, 'name'));
      });
  }, [organizationId]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUpdatedMenu((prev) => ({ ...prev, [name]: value }));
  };

  const handleReorder = useCallback(
    (entryIdx: number, direction: 'up' | 'down') => {
      setUpdatedMenu((prev) => {
        const entries = [...prev.entries];

        if (direction === 'up' && entryIdx > 0) {
          [entries[entryIdx - 1], entries[entryIdx]] = [
            entries[entryIdx],
            entries[entryIdx - 1]
          ];
        } else if (direction === 'down' && entryIdx < entries.length - 1) {
          [entries[entryIdx + 1], entries[entryIdx]] = [
            entries[entryIdx],
            entries[entryIdx + 1]
          ];
        }
        return {
          ...prev,
          entries
        };
      });
    },
    []
  );

  const handleChangeEntry = useCallback(
    (entryIdx: number, entry: IMenuEntry) => {
      setUpdatedMenu((prev) => {
        const entries = [...prev.entries];
        entries[entryIdx] = entry;
        return {
          ...prev,
          entries
        };
      });
    },
    []
  );
  const handleDeleteEntry = useCallback((entryIdx: number) => {
    setUpdatedMenu((prev) => ({
      ...prev,
      entries: prev.entries.filter((_, index) => index !== entryIdx)
    }));
  }, []);

  const handelCreateEntry = useCallback((entry: IMenuEntry) => {
    setUpdatedMenu((prev) => ({
      ...prev,
      entries: [...prev.entries, entry]
    }));
    setOpen(false);
  }, []);

  const handleChangeRole = (state: CheckedState, roleId: string) => {
    if (typeof state !== 'boolean') return;
    setUpdatedMenu((prev) => {
      const prevRoles = prev.roles || [];
      if (!state) {
        return {
          ...prev,
          roles: prevRoles.filter((role) => role !== roleId)
        };
      }
      return {
        ...prev,
        roles: [...prevRoles, roleId]
      };
    });
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (form.id !== 'menu-form') return;
    onSubmit(updatedMenu);
  };
  return (
    <div>
      <Form onSubmit={handleSubmit} id='menu-form'>
        <div className='flex'>
          <div>
            <FormField>
              <FormLabel required>{t('labels.title')}</FormLabel>
              <Input
                name='title'
                onChange={handleInputChange}
                value={updatedMenu.title}
              />
            </FormField>
            <FormField>
              <FormLabel required>{t('labels.roles')}</FormLabel>
              <ul>
                {roles.map((role) => (
                  <li key={role._id}>
                    <FormField className='flex-row items-center'>
                      <Checkbox
                        id={role._id}
                        onCheckedChange={(state) =>
                          handleChangeRole(state, role._id)
                        }
                        value={role._id}
                        checked={updatedMenu.roles.includes(role._id)}
                      />
                      <FormLabel htmlFor={role._id} className='mb-0'>
                        {role.name}
                      </FormLabel>
                    </FormField>
                  </li>
                ))}
              </ul>
            </FormField>
          </div>
          <div>
            <h1>{t('menuEntries.title')}</h1>
            <Dialog
              open={open}
              onOpenChange={setOpen}
              title={t('edit.title')}
              Trigger={
                <Button className='w-8 h-8 flex items-center justify-center'>
                  <FontAwesomeIcon icon={faAdd} />
                </Button>
              }>
              <MenuEntryForm
                onSubmit={handelCreateEntry}
                onCancel={() => setOpen(false)}
                roles={roles}
              />
            </Dialog>
            <ul>
              {updatedMenu.entries.map((entry, key) => (
                <MenuEntryItem
                  key={key}
                  entry={entry}
                  onReorder={handleReorder}
                  entryIndex={key}
                  entriesLength={updatedMenu.entries.length - 1}
                  onChangeEntry={handleChangeEntry}
                  onDeleteEntry={handleDeleteEntry}
                  roles={roles}
                />
              ))}
            </ul>
          </div>
        </div>
        <FormFooterAction>
          <Button type='submit'>{tGlobal('save')}</Button>
          <CancelButton onClick={onCancel} />
        </FormFooterAction>
      </Form>
    </div>
  );
}
export default MenuForm;
