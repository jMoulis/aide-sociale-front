
// export const mergePermissions = (userRoles: IRole[]) => {
//   const mergedPermissions: Record<string, ENUM_ACTIONS[]> = {};

//   userRoles.forEach((role) => {
//     for (const [resource, actions] of Object.entries(
//       role.permissions || {}
//     )) {
//       if (!mergedPermissions[resource]) {
//         mergedPermissions[resource] = [];
//       }
//       // Merge actions, ensuring no duplicates
//       mergedPermissions[resource] = Array.from(
//         new Set([...mergedPermissions[resource], ...actions])
//       );
//     }
//   });
//   return mergedPermissions;
// };
export const isClerkErrors = (error: unknown) => {
  const parsedError = JSON.parse(JSON.stringify(error));
  if (parsedError?.clerkError) {
    return { status: true, parsedError };
  }
  return { status: false, parsedError: error };
}

export const COOKIE_SERVER_AUTH = 'x-server-token';
