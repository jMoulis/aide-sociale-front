'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import UserTable from './UserTable';
import TimestampTable from './TimestampTable';
import { UserExcerpt } from '@/lib/interfaces/interfaces';

function useColumns() {
  const t = useTranslations('ProfileSection');
  const tUsers = useTranslations('UserSection');
  const columnUsers: ColumnDef<UserExcerpt>[] = useMemo(
    () => [
      {
        id: 'user',
        header: tUsers('user'),
        accessorKey: 'firstName',
        enableGlobalFilter: true,
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => <UserTable user={row.original} />
      },
      {
        id: 'lastSignedIn',
        header: t('lastSignedInWord'),
        cell: ({ row }) => (
          <TimestampTable timestamp={row.original.lastSignInAt || 0} />
        ),
        accessorKey: 'lastSignedInAt',
        enableSorting: false
      },
      {
        id: 'joinedAt',
        header: t('joinedAtWord'),
        cell: ({ row }) => (
          <TimestampTable timestamp={row.original.joinedAt || 0} />
        ),
        accessorKey: 'joinedAt',
        enableSorting: false
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return columnUsers;
}

export default useColumns;
