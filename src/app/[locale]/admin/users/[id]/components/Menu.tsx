'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import DeleteUser from './DeleteUser';
import ResetPassword from './ResetPassword';
import BanUser from './BanUser';

import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import { UserExcerpt } from '@/lib/interfaces/interfaces';

type Props = {
  user: UserExcerpt;
  onUpdateUser: Dispatch<SetStateAction<UserExcerpt>>;
};
function Menu({ user, onUpdateUser }: Props) {
  const t = useTranslations('ProfileSection');
  const tSecurity = useTranslations('SecuritySection');

  const translationParams = t('lastSignedIn', {
    date: user.lastSignInAt
      ? formatDistanceToNow(user.lastSignInAt)
      : t('never')
  });

  const updateBanned = (banned: boolean) => {
    onUpdateUser((prev) => ({ ...prev, isBanned: banned }));
  };

  return (
    <div className='mt-5'>
      {user.imageUrl ? (
        <Image
          className='rounded-full mb-3'
          alt='Profile'
          src={user.imageUrl}
          width={70}
          height={70}
          sizes='70px'
        />
      ) : null}
      <div className='flex flex-col'>
        <div className='flex items-center'>
          <span className='mr-3'>{`${user.firstName} ${user.lastName}`}</span>

          {user.isBanned ? (
            <span className='text-red-700 rounded px-2 text-xs bg-red-100'>
              {tSecurity('banUser.banned')}
            </span>
          ) : null}
        </div>
        <span className='text-sm text-slate-400'>{user.organizationId}</span>
        <span className='text-xs text-slate-400'>{`${translationParams}`}</span>
        <ul className='mt-3'>
          <li className='my-1'>
            <ResetPassword userId={user.id} />
          </li>
          <li className='my-1'>
            <BanUser
              onUpdate={(newStatus) => updateBanned(newStatus)}
              userId={user.id}
              userEmail={user.email}
              isBanned={user.isBanned}
            />
          </li>
          <li className='my-1'>
            <DeleteUser userId={user.id} userEmail={user.email} />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Menu;
