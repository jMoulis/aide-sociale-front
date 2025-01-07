'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { IPermission } from '@/lib/interfaces/interfaces';

function useColumnPermissions() {
  const t = useTranslations('RoleSection');
  const columnUsers: ColumnDef<IPermission>[] = useMemo(
    () => [
      {
        id: 'name',
        header: t('permission'),
        accessorKey: 'name',
        cell: ({ row }) => <span>{row.original.name}</span>
      },
      {
        id: 'key',
        header: t('key'),
        cell: ({ row }) => <span>{row.original.key}</span>
      },
      {
        id: 'description',
        header: t('description'),
        cell: ({ row }) => <span>{row.original.description}</span>
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return columnUsers;
}

export default useColumnPermissions;
