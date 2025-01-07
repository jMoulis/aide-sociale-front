'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import ActionPanel from '@/components/table/ActionPanel';
import DeleteRessource from './DeleteRessource';
import { IRessource } from '@/lib/interfaces/interfaces';

function useColumnRessources() {
  const t = useTranslations('RoleSection');
  const columnUsers: ColumnDef<IRessource>[] = useMemo(
    () => [
      {
        id: 'name',
        header: t('name'),
        accessorKey: 'name',
        cell: ({ row }) => <span>{row.original.name}</span>
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: t('description'),
        cell: ({ row }) => <span>{row.original.description}</span>
      },
      {
        id: 'mandatoryPermissions',
        header: t('ressource.mandatoryPermissions'),
        cell: ({ row }) => (
          <div className='flex flex-wrap'>
            {(row.original.mandatoryPermissions || [])?.map((permission) => {
              return (
                <span
                  key={permission}
                  className='bg-slate-100 mx-1 p-1 px-2 rounded text-xs'>
                  {permission}
                </span>
              );
            })}
          </div>
        )
      },
      {
        id: 'actions',
        accessorKey: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <ActionPanel<IRessource>
              actions={[
                <DeleteRessource
                  key={row.original._id}
                  ressource={row.original}
                />
              ]}
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

export default useColumnRessources;
