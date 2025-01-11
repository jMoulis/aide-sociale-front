'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import client from '../initMongoClient';

import { IUser } from '@/lib/interfaces/interfaces';
import { ENUM_COLLECTIONS } from '../interfaces';
import { mergePermissions } from '@/lib/utils/auth/utils';

type MongoUserContextType = {
  user: IUser | null;
};

export const defaultSearchContextProps = {
  user: null
};
export const MongoUserContext = createContext<MongoUserContextType>(
  defaultSearchContextProps
);

type Props = {
  children: React.ReactNode;
};
function MongoUserProvider({ children }: Props) {
  const { userId } = useAuth();
  const { signOut } = useClerk();

  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (userId) {
      client
        .get<IUser>(ENUM_COLLECTIONS.USERS, { authId: userId })
        .then(({ data }) => {
          setUser(data);
        })
        .catch((_error) => {
          signOut({
            redirectUrl: '/sign-in'
          });
        });
      // setUser(user.data);
    }
    // setUser();
  }, [signOut, userId]);

  return (
    <MongoUserContext.Provider value={{ user }}>
      {children}
    </MongoUserContext.Provider>
  );
}

export const useMongoUser: () => IUser | null = () => {
  const context = useContext(MongoUserContext);
  if (context === undefined) {
    throw new Error('useMongoUser must be used within a MongoSearchProvider');
  }
  return context.user;
};
export const useUserPermissions = () => {
  const context = useContext(MongoUserContext);
  if (context === undefined) {
    throw new Error(
      'useUserPermissions must be used within a MongoSearchProvider'
    );
  }
  if (!context.user) return {};
  return mergePermissions(context.user.roles) || {};
};
export default MongoUserProvider;
