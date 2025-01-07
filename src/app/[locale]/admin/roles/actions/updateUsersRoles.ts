'use server';

import { IRole } from "@/lib/interfaces/interfaces";
import clientMongoServer from "@/lib/mongo/initMongoServer";
import { ENUM_COLLECTIONS } from "@/lib/mongo/interfaces";

export async function updateUsersRoles(role: Partial<IRole>, action: 'UPDATE' | 'DELETE') {
  try {
    if (action === 'UPDATE') {
      const { data } = await clientMongoServer
        .updateMany<{ _id: string, roles: IRole[], authId: string }>(ENUM_COLLECTIONS.USERS,
          {},
          {
            $set: { 'roles.$[elem]': role }
          }, {
          arrayFilters: [{ 'elem._id': role._id }]
        }
        );
      if (!data) {
        return { status: 404, message: 'No users found to update' }
      }

      return { status: 200, message: data, };
    } else {
      const { data } = await clientMongoServer
        .updateMany<{ _id: string, roles: IRole[], authId: string }>(ENUM_COLLECTIONS.USERS,
          { "roles._id": role._id },
          {
            $pull: {
              roles: {
                _id: role._id
              }
            }
          });
      if (!data) {
        return { status: 404, message: 'No users found to update' }
      }
      return { status: 200, message: data, };
    }
  } catch (error: any) {
    return {
      message: 'Webhook unknown error',
      error
    }
  }
}

export async function deleteRoleAction(roleId: string) {
  await clientMongoServer.delete(ENUM_COLLECTIONS.ROLES, roleId);
  await updateUsersRoles({ _id: roleId }, 'DELETE');
}
export async function updateRoleAction(roleId: string, updatedRole: Partial<IRole>) {
  await clientMongoServer.update(ENUM_COLLECTIONS.ROLES,
    { _id: roleId },
    { $set: { ...updatedRole, updatedAt: new Date() } },
  );
  await updateUsersRoles(updatedRole, 'UPDATE');
}