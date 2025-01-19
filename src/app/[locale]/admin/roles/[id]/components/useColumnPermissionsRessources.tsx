'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { IRessource } from '@/lib/interfaces/interfaces';
import { ENUM_ACTIONS } from '@/lib/interfaces/enums';

function useColumnPermissionsRessources() {
  const t = useTranslations('RoleSection.ressource');
  const columnUsers: ColumnDef<IRessource>[] = useMemo(
    () => [
      {
        id: 'name',
        header: t('title'),
        accessorKey: 'name',
        cell: ({ row }) => <span>{row.original.name}</span>
      },
      {
        id: 'key',
        header: t('read'),
        cell: ({ row, table }) => {
          const ressource = row.original;
          const onSelectPermissions = table.options.meta?.onSelectPermissions;
          const permissions = table.options.meta?.permissions;
          return (
            <Checkbox
              name={row.original.name}
              onCheckedChange={(checkState) =>
                onSelectPermissions?.(
                  ressource.name,
                  ENUM_ACTIONS.READ,
                  checkState
                )
              }
              checked={
                permissions?.[ressource.name]?.includes(ENUM_ACTIONS.READ) ||
                false
              }
            />
          );
        }
      },
      {
        id: 'write',
        header: t('write'),
        cell: ({ row, table }) => {
          const ressource = row.original;
          const onSelectPermissions = table.options.meta?.onSelectPermissions;
          const permissions = table.options.meta?.permissions;
          return (
            <Checkbox
              name={row.original.name}
              onCheckedChange={(checkState) =>
                onSelectPermissions?.(
                  ressource.name,
                  ENUM_ACTIONS.WRITE,
                  checkState
                )
              }
              checked={
                permissions?.[ressource.name]?.includes(ENUM_ACTIONS.WRITE) ||
                false
              }
            />
          );
        }
      },
      {
        id: 'delete',
        header: t('delete.action'),
        cell: ({ row, table }) => {
          const ressource = row.original;
          const onSelectPermissions = table.options.meta?.onSelectPermissions;
          const permissions = table.options.meta?.permissions;
          return (
            <Checkbox
              name={row.original.name}
              onCheckedChange={(checkState) =>
                onSelectPermissions?.(
                  ressource.name,
                  ENUM_ACTIONS.DELETE,
                  checkState
                )
              }
              checked={
                permissions?.[ressource.name]?.includes(ENUM_ACTIONS.DELETE) ||
                false
              }
            />
          );
        }
      },
      {
        id: 'all',
        header: t('all'),
        cell: ({ row, table }) => {
          const ressource = row.original;
          const onSelectPermissions = table.options.meta?.onSelectPermissions;
          const permissions = table.options.meta?.permissions;
          return (
            <Checkbox
              name={row.original.name}
              onCheckedChange={(checkState) =>
                onSelectPermissions?.(
                  ressource.name,
                  ENUM_ACTIONS.ALL,
                  checkState
                )
              }
              checked={permissions?.[ressource.name]?.length === 3 || false}
            />
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return columnUsers;
}

export default useColumnPermissionsRessources;
