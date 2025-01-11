'use client';

import { ChangeEvent, FormEvent, useCallback, useState } from 'react';

import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { useTranslations } from 'next-intl';
import Textarea from '@/components/form/Textarea';
import Actions from './Actions';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Button from '@/components/buttons/Button';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { toast } from '@/lib/hooks/use-toast';
import CancelButton from '@/components/buttons/CancelButton';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { v4 } from 'uuid';
import { IMenu, IRessource } from '@/lib/interfaces/interfaces';
import { ActionKey, ENUM_ACTIONS } from '@/lib/interfaces/enums';
import { isValidJSON } from '@/lib/utils/utils';
import MenusBuilder from './MenusBuilder/MenusBuilder';

type Props = {
  initialRessource: IRessource | null;
  onCancel: () => void;
  onSuccess: () => void;
};
function RessourceForm({ initialRessource, onCancel, onSuccess }: Props) {
  const defaultRessource: IRessource = {
    _id: v4(),
    name: '',
    description: '',
    mandatoryPermissions: [],
    menus: []
  };
  const [ressource, setRessource] = useState<IRessource>(
    initialRessource || defaultRessource
  );
  const organizationId = useOrganization();

  const t = useTranslations('RoleSection');
  const tGlobal = useTranslations('GlobalSection');

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setRessource((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectAction = (action: ActionKey, checked: boolean) => {
    if (action === ENUM_ACTIONS.ALL) {
      return setRessource((prev) => {
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
    setRessource((prev) => {
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
  const handleSave = useCallback(
    async (updatedRessource: IRessource, withClose = false) => {
      try {
        if (!organizationId) return;
        if (initialRessource) {
          await client.update<IRessource>(
            ENUM_COLLECTIONS.RESSOURCES,
            { _id: updatedRessource._id },
            { $set: updatedRessource }
          );
        } else {
          await client.create<IRessource>(ENUM_COLLECTIONS.RESSOURCES, {
            ...updatedRessource,
            organizationId
          });
        }
        toast({
          title: t('ressource.create.action'),
          description: t('ressource.create.success'),
          variant: 'success'
        });
        if (withClose) {
          onSuccess();
        }
      } catch (err: any) {
        let message = err.message;
        if (isValidJSON(err)) {
          const error = JSON.parse(err);
          message = error.error;
        }
        toast({
          title: t('ressource.create.action'),
          description: t.rich('ressource.create.error', {
            error: message,
            code: (chunks) => <code>{chunks}</code>
          }),
          variant: 'destructive'
        });
      }
    },
    [organizationId, initialRessource, onSuccess, t]
  );
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    if (target.id !== 'ressource-form') return;
    await handleSave(ressource, true);
  };

  const handleUpdateMenus = useCallback(
    (updatedMenus: IMenu[]) => {
      const updatedRessource = { ...ressource, menus: updatedMenus };
      setRessource(updatedRessource);
      handleSave(updatedRessource, false);
    },
    [handleSave, ressource]
  );

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
        <MenusBuilder
          menus={ressource.menus}
          onUpdateMenus={handleUpdateMenus}
        />
      </div>
      <FormFooterAction>
        <Button type='submit'>
          {t(
            ressource._id ? 'ressource.edit.action' : 'ressource.create.action'
          )}
        </Button>
        <CancelButton type='reset' onClick={onCancel}>
          {tGlobal('actions.cancel')}
        </CancelButton>
      </FormFooterAction>
    </Form>
  );
}
export default RessourceForm;
