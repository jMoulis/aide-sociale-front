import Button from '@/components/buttons/Button';
import CancelButton from '@/components/buttons/CancelButton';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Input from '@/components/form/Input';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';
import { IMenuEntry, IRole } from '@/lib/interfaces/interfaces';
import { sortArray } from '@/lib/utils/utils';
import { useTranslations } from 'next-intl';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import Selectbox from '@/components/form/Selectbox';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Form from '@/components/form/Form';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';

type Props = {
  initEntry?: IMenuEntry;
  onSubmit: (entry: IMenuEntry) => void;
  onCancel: () => void;
  roles: IRole[];
};
function MenuEntryForm({ initEntry, onSubmit, onCancel, roles }: Props) {
  const defaultEntry: IMenuEntry = {
    label: '',
    uri: '',
    roles: []
  };
  const routes = useRef<{ label: string; value: string }[]>(
    sortArray(
      Object.entries(ENUM_APP_ROUTES).map(([key, value]) => ({
        label: key,
        value
      })),
      'label'
    )
  );
  const [entry, setEntry] = useState<IMenuEntry>(initEntry || defaultEntry);
  const t = useTranslations('GlobalSection.actions');
  const tMenu = useTranslations('RoleSection.ressource.menu');
  const handleInputChange = (
    event:
      | ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;
    setEntry((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(entry);
  };
  const handleChangeRole = (state: CheckedState, roleId: string) => {
    if (typeof state !== 'boolean') return;
    setEntry((prev) => {
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
  return (
    <Form onSubmit={handleSubmit}>
      <FormField>
        <FormLabel required>{tMenu('labels.name')}</FormLabel>
        <Input
          required
          value={entry?.label}
          name='label'
          onChange={handleInputChange}
        />
      </FormField>
      <FormField>
        <FormLabel required>{tMenu('labels.uri')}</FormLabel>
        <Selectbox
          name='uri'
          required
          options={routes.current}
          value={entry.uri}
          onChange={handleInputChange}
        />
      </FormField>
      <FormField>
        <FormLabel required>{tMenu('labels.roles')}</FormLabel>
        <ul>
          {roles.map((role) => (
            <li key={role._id}>
              <FormField className='flex-row items-center'>
                <Checkbox
                  onCheckedChange={(state) => handleChangeRole(state, role._id)}
                  value={role._id}
                  checked={entry.roles.includes(role._id)}
                />
                <FormLabel className='mb-0'>{role.name}</FormLabel>
              </FormField>
            </li>
          ))}
        </ul>
      </FormField>
      <FormFooterAction>
        <Button type='submit'>{t('save')}</Button>
        <CancelButton onClick={onCancel}>{t('cancel')}</CancelButton>
      </FormFooterAction>
    </Form>
  );
}
export default MenuEntryForm;
