'use client';

import RoleListItem from './RoleListItem';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import Button from '@/components/buttons/Button';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { toast } from '@/lib/hooks/use-toast';
import { useTranslations } from 'next-intl';
import CancelButton from '@/components/buttons/CancelButton';
import client from '@/lib/mongo/initMongoClient';
import { IRole, IUser } from '@/lib/interfaces/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';

type Props = {
  user: IUser;
  roles: IRole[];
};

function RolesList({ user, roles }: Props) {
  const t = useTranslations('RoleSection.addRoleToUser');
  const tGlobal = useTranslations('GlobalSection');
  const [userRoles, setUserRoles] = useState<IRole[]>(user?.roles || []);
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const initUser = useRef<IUser>(user);

  const userRolesIds = useMemo(
    () => userRoles.map((role) => role._id) || [],
    [userRoles]
  );

  useEffect(() => {
    const serverUserRolesIds =
      initUser.current?.roles?.map((role) => role._id) || [];
    if (JSON.stringify(serverUserRolesIds) !== JSON.stringify(userRolesIds)) {
      setDataHasChanged(true);
    } else {
      setDataHasChanged(false);
    }
  }, [userRolesIds]);

  const handleSelectRole = useCallback((role: IRole, status: boolean) => {
    if (status) {
      setUserRoles((prev) => [...prev, role]);
    } else {
      setUserRoles((prev) => prev.filter((r) => r._id !== role._id));
    }
  }, []);

  const handleSubmit = async () => {
    try {
      await client.update(
        ENUM_COLLECTIONS.USERS,
        { _id: user._id },
        {
          $set: {
            roles: userRoles
          }
        }
      );
      setDataHasChanged(false);
      if (initUser.current) {
        initUser.current.roles = userRoles;
      }
      toast({
        title: t('title'),
        description: t('description'),
        variant: 'success'
      });
    } catch (error: any) {
      toast({
        title: tGlobal('error'),
        description: t.rich('error', {
          error: error.message,
          code: (chunks) => <code>{chunks}</code>
        }),
        variant: 'destructive'
      });
    }
  };
  return (
    <div>
      <ul>
        {roles.map((role) => (
          <RoleListItem
            onSelectRole={handleSelectRole}
            isChecked={userRolesIds.includes(role._id)}
            key={role._id}
            role={role}
          />
        ))}
      </ul>
      <FormFooterAction>
        <Button disabled={!dataHasChanged} onClick={handleSubmit} type='button'>
          {t('action')}
        </Button>
        <CancelButton type='reset'>{tGlobal('actions.cancel')}</CancelButton>
      </FormFooterAction>
    </div>
  );
}
export default RolesList;
