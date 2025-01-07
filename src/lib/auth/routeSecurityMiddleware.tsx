// routeSecurityMiddleware.tsx
'use server';

import { redirect, unauthorized } from 'next/navigation';
import clientMongoServer from '../mongo/initMongoServer';
import React, { JSX } from 'react';
import { mergePermissions } from '../utils/auth/utils';
import {
  ENUM_ACTIONS,
  ENUM_APP_ROUTES,
  ENUM_RESSOURCES
} from '../interfaces/enums';
import { getMongoUser, hasPermissions } from '../utils/auth/serverUtils';
import { ENUM_COLLECTIONS } from '../mongo/interfaces';
import { IRessource } from '../interfaces/interfaces';

export const routeSecurityMiddleware = async (
  route: ENUM_RESSOURCES,
  exclusive: boolean = true,
  onAuthorized: (
    permissions: ENUM_ACTIONS[],
    isAdmin: boolean
  ) => JSX.Element | React.ReactNode
) => {
  try {
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

    if (!isAllowed) {
      return unauthorized();
    }

    return onAuthorized(routePermissions, mongoUser.super_admin || false);
  } catch (_error: any) {
    redirect(ENUM_APP_ROUTES.SIGN_IN);
  }
};
