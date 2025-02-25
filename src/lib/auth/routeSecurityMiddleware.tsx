// routeSecurityMiddleware.tsx
'use server';

import { unauthorized } from 'next/navigation';
import clientMongoServer from '../mongo/initMongoServer';
import React, { JSX } from 'react';
import { mergePermissions } from '../utils/auth/utils';
import { ENUM_ACTIONS, ENUM_RESSOURCES } from '../interfaces/enums';
import { getMongoUser, hasPermissions } from '../utils/auth/serverUtils';
import { ENUM_COLLECTIONS } from '../mongo/interfaces';
import { IMenu, IRessource, IRole } from '../interfaces/interfaces';

const filterAuthorizedMenu = (menus: IMenu[], roles: IRole[]): IMenu[] => {
  return menus.reduce((acc: IMenu[], menu) => {
    if (menu.roles.length === 0) {
      return [
        ...acc,
        {
          ...menu,
          entries: menu.entries
        }
      ];
    }
    if (menu.roles.some((role) => roles.some((r) => r._id === role))) {
      return [
        ...acc,
        {
          ...menu,
          entries: menu.entries.filter((entry) => {
            if (entry.roles.length === 0) {
              return true;
            }
            return entry.roles.some((role) => {
              return roles.some((r) => r._id === role);
            });
          })
        }
      ];
    }
    return acc;
  }, [] as IMenu[]);
};
export const routeSecurityMiddleware = async (
  route: ENUM_RESSOURCES,
  exclusive: boolean = true,
  onAuthorized: (params: {
    permissions: ENUM_ACTIONS[];
    isSuperAdmin: boolean;
    menus: IMenu[];
  }) => JSX.Element | React.ReactNode
) => {
  const mongoUser = await getMongoUser();
  const permissions = mergePermissions(mongoUser?.roles || []);

  const { data } = await clientMongoServer.get<IRessource>(
    ENUM_COLLECTIONS.RESSOURCES,
    {
      name: route
    }
  );
  const routePermissions = permissions[route];

  const isAllowed = await hasPermissions(
    permissions[route],
    data?.mandatoryPermissions || [],
    exclusive
  );

  if (!isAllowed && !mongoUser.super_admin) {
    unauthorized();
  }
  const authorizedMenus = filterAuthorizedMenu(
    data?.menus || [],
    mongoUser?.roles || []
  );

  return onAuthorized({
    permissions: routePermissions,
    isSuperAdmin: mongoUser.super_admin || false,
    menus: authorizedMenus
  });
};
