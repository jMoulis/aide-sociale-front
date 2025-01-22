'use client';

import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import Link from 'next/link';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';

import { useTranslations } from 'next-intl';
import Button from '@/components/buttons/Button';

function Header() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const t = useTranslations('GlobalSection');

  const handleSignout = async () => {
    await signOut({
      redirectUrl: '/sign-in'
    });
  };
  return (
    <header
      style={{
        gridArea: 'header',
        display: 'flex'
      }}>
      <div className='flex justify-end flex-1 items-center px-2 bg-indigo-300'>
        <SignedIn>
          <Popover>
            <PopoverTrigger className='flex items-center' asChild>
              <button type='button'>
                {user?.imageUrl ? (
                  <Image
                    className='rounded-full'
                    src={user?.imageUrl}
                    alt='profile'
                    width={35}
                    height={35}
                    sizes='35px'
                  />
                ) : null}
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <div className='flex items-center'>
                {user?.imageUrl ? (
                  <Image
                    className='rounded-full m-2'
                    src={user?.imageUrl}
                    alt='profile'
                    width={35}
                    height={35}
                    sizes='35px'
                  />
                ) : null}
                <div className='flex flex-col'>
                  <div>
                    <span className='text-xs font-bold'>{user?.firstName}</span>
                    <span className='text-xs font-bold'>{user?.lastName}</span>
                  </div>
                  <span className='text-xs'>
                    {user?.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
              </div>
              <ul className='mb-3'>
                <li className='mb-2'>
                  <Link href={ENUM_APP_ROUTES.PROFILE}>{t('profile')}</Link>
                </li>
                <li className='mb-2'>
                  <Link href={ENUM_APP_ROUTES.DASHBOARD}>{t('dashboard')}</Link>
                </li>
                <li className='mb-2'>
                  <Link href={ENUM_APP_ROUTES.MY_APP}>{t('myApp')}</Link>
                </li>
                <li>
                  <Link href={ENUM_APP_ROUTES.ADMIN_PAGE}>{t('admin')}</Link>
                </li>
              </ul>
              <Button onClick={handleSignout}>Déconnexion</Button>
            </PopoverContent>
          </Popover>
        </SignedIn>
        <SignedOut>
          <Link href={ENUM_APP_ROUTES.SIGN_IN}>Connexion</Link>
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
