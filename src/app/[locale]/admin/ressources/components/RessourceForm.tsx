'use client';

import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { useTranslations } from 'next-intl';
import Textarea from '@/components/form/Textarea';
import Actions from './Actions';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Button from '@/components/buttons/Button';
import { IRessource } from '@/lib/interfaces/interfaces';
import { ActionKey, ENUM_ACTIONS } from '@/lib/interfaces/enums';

type Props = {
  ressource: IRessource;
  onUpdateRessource: Dispatch<SetStateAction<IRessource>>;
  onSave: (ressource: IRessource) => Promise<void>;
};
function RessourceForm({ ressource, onSave, onUpdateRessource }: Props) {
  const t = useTranslations('RoleSection');

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    onUpdateRessource((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectAction = (action: ActionKey, checked: boolean) => {
    if (action === ENUM_ACTIONS.ALL) {
      return onUpdateRessource((prev) => {
        if (checked) {
          return {
            ...prev,
            mandatoryPermissions: Object.values(ENUM_ACTIONS).filter(
              (enumAction) => enumAction !== ENUM_ACTIONS.ALL
            )
          };
        }
        return {
          ...prev,
          mandatoryPermissions: []
        };
      });
    }
    onUpdateRessource((prev) => {
      if (checked) {
        return {
          ...prev,
          mandatoryPermissions: [...(prev.mandatoryPermissions || []), action]
        };
      }
      return {
        ...prev,
        mandatoryPermissions: (prev.mandatoryPermissions || []).filter(
          (perm) => perm !== action
        )
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    if (target.id !== 'ressource-form') return;
    await onSave(ressource);
  };

  return (
    <Form onSubmit={handleSubmit} id='ressource-form'>
      <div className='flex'>
        <div>
          <FormField>
            <FormLabel htmlFor='name'>{t('name')}</FormLabel>
            <Input
              value={ressource.name}
              id='name'
              onChange={handleInputChange}
              name='name'
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor='name'>{t('ressource.route')}</FormLabel>
            <Input
              value={ressource.route}
              id='route'
              onChange={handleInputChange}
              name='route'
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor='description'>{t('description')}</FormLabel>
            <Textarea
              value={ressource.description}
              id='description'
              onChange={handleInputChange}
              name='description'
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor='name'>{t('permissions')}</FormLabel>
            <Actions
              onSelectAction={handleSelectAction}
              selectedPermissions={ressource.mandatoryPermissions || []}
            />
          </FormField>
        </div>
      </div>
      <FormFooterAction>
        <Button type='submit'>
          {t(
            ressource._id ? 'ressource.edit.action' : 'ressource.create.action'
          )}
        </Button>
      </FormFooterAction>
    </Form>
  );
}
export default RessourceForm;
