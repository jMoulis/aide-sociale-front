'use client';

import UserPersonalInformation from './UserPersonalInformation';
import CardComponent from './CardComponent';
import BasicInformation from './BasicInformation';
import Menu from './Menu';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import RolesList from './Roles/RolesList';
import { IRole, IUser, UserExcerpt } from '@/lib/interfaces/interfaces';

type Props = {
  userServer: UserExcerpt;
  mongoUser: IUser;
  roles: IRole[];
};
function DetailUser({ userServer, mongoUser, roles }: Props) {
  const [user, setUser] = useState<UserExcerpt>(userServer);

  const t = useTranslations('ProfileSection');
  const tRole = useTranslations('RoleSection');

  return (
    <div className='flex'>
      <div className='w-72'>
        <CardComponent title='' description=''>
          <Menu user={user} onUpdateUser={setUser} />
        </CardComponent>
      </div>
      <div className='flex-1'>
        <CardComponent
          title={t('basicInformation.title')}
          description={t('basicInformation.description')}>
          <BasicInformation user={user} />
        </CardComponent>
        <CardComponent
          title={t('personalInformation.title')}
          description={t('personalInformation.description')}>
          <UserPersonalInformation user={userServer} onUpdateUser={setUser} />
        </CardComponent>
        <CardComponent
          title={tRole('rolesManagment')}
          description={tRole('rolesManagment')}>
          <RolesList user={mongoUser} roles={roles} />
        </CardComponent>
      </div>
    </div>
  );
}

export default DetailUser;
