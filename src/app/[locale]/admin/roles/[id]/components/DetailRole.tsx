'use client';

import { useState } from 'react';
import { IPage, IRoleInput } from '@/lib/interfaces/interfaces';
import { ENUM_ACTIONS, ENUM_APP_ROUTES } from '@/lib/interfaces/enums';
import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { useTranslations } from 'next-intl';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Button from '@/components/buttons/Button';
import { toast } from '@/lib/hooks/use-toast';
import Textarea from '@/components/form/Textarea';
import DeleteButtonWithConfirmation from '@/components/buttons/DeleteButtonWithConfirmation';

import { useRouter } from 'next/navigation';
import {
  deleteRoleAction,
  updateRoleAction
} from '../../actions/updateUsersRoles';

import { useOrganization } from '@/lib/hooks/useOrganization';
import { nanoid } from 'nanoid';
import {
  buildPageTree,
  removeObjectFields,
  slugifyFunction
} from '@/lib/utils/utils';
import TablePermissionsPages from './TablePermissionsPages';

type Props = {
  role: IRoleInput | null;
  pages: IPage[];
  error: string | null;
  roleId: string | null;
  onSubmit?: () => void;
};
function DetailRole({
  role: incomingRole,
  error,
  roleId,
  onSubmit,
  pages
}: Props) {
  const tree = buildPageTree(pages || []);
  const organizationId = useOrganization();
  const defaultRole = {
    _id: nanoid(),
    name: '',
    description: '',
    permissions: {},
    key: '',
    organizationId: organizationId || ''
  };
  const [role, setRole] = useState<IRoleInput>(incomingRole || defaultRole);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const [permissions, setPermissions] = useState<
    Record<string, ENUM_ACTIONS[]>
  >(role.permissions ?? {});
  const t = useTranslations('RoleSection');
  const tGlobal = useTranslations('GlobalSection');

  const handleSelectPermissions = (
    ressourceName: string,
    action: ENUM_ACTIONS,
    checked: boolean | 'indeterminate'
  ) => {
    if (checked === 'indeterminate') {
      return;
    }
    setPermissions((prev) => {
      const current = prev[ressourceName] ?? [];
      return {
        ...prev,
        [ressourceName]: checked
          ? Array.from(new Set([...current, action]))
          : current.filter((item) => item !== action)
      };
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    if (name === 'name') {
      setRole((prev) => ({
        ...prev,
        [name]: value,
        key: slugifyFunction(value)
      }));
    } else {
      setRole((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!organizationId) {
      toast({
        title: t('edit.action'),
        description: tGlobal('errorOrganization'),
        variant: 'destructive'
      });
      return;
    }
    try {
      const updatedRoleInput = removeObjectFields(
        {
          ...role,
          permissions,
          organizationId
        },
        ['_id']
      );
      await updateRoleAction(role._id, updatedRoleInput);
      toast({
        title: t('edit.action'),
        description: t('edit.success'),
        variant: 'success'
      });
      onSubmit?.();
    } catch (error: any) {
      toast({
        title: t('edit.action'),
        description: t.rich('edit.error', {
          error: error.message,
          code: (chunks) => <code>{chunks}</code>
        }),
        variant: 'destructive'
      });
    }
    setRole((prev) => ({
      ...prev,
      permissions
    }));
  };

  const handleDelete = async (roleId: string) => {
    try {
      router.prefetch(ENUM_APP_ROUTES.ADMIN_ROLES);
      setDeleting(true);
      await deleteRoleAction(roleId);
      router.push(ENUM_APP_ROUTES.ADMIN_ROLES);
      setDeleting(false);
    } catch (error: any) {
      setDeleting(false);
      toast({
        title: t('delete.action'),
        description: t.rich('delete.error', {
          error: error.message,
          code: (chunks) => <code>{chunks}</code>
        }),
        variant: 'destructive'
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit} className='m-2'>
      <FormField>
        <FormLabel required htmlFor='name'>
          {t('name')}
        </FormLabel>
        <Input
          required
          name='name'
          value={role.name}
          onChange={handleInputChange}
        />
      </FormField>
      <FormField>
        <FormLabel required htmlFor='key'>
          {t('key')}
        </FormLabel>
        <Input
          required
          name='key'
          value={role.key}
          onChange={handleInputChange}
        />
      </FormField>
      <FormField>
        <FormLabel htmlFor='name'>{t('description')}</FormLabel>
        <Textarea
          name='description'
          value={role.description}
          onChange={handleInputChange}
        />
      </FormField>
      <TablePermissionsPages
        pages={tree}
        permissions={permissions}
        error={error}
        onSelectPermissions={handleSelectPermissions}
      />
      {/* <TableRessources
        ressources={ressources}
        error={error}
        permissions={permissions}
        onSelectPermissions={handleSelectPermissions}
      /> */}
      <FormFooterAction>
        <Button type='submit'>
          {roleId ? t('edit.action') : t('create.action')}
        </Button>
        {roleId ? (
          <DeleteButtonWithConfirmation
            onDelete={() => handleDelete(roleId)}
            title={t('delete.title')}
            buttonActionText={t('delete.action')}
            deleteActionText={t('delete.action')}
            deleteDescription={t('delete.description')}
            deleting={deleting}
          />
        ) : null}
      </FormFooterAction>
    </Form>
  );
}
export default DetailRole;
