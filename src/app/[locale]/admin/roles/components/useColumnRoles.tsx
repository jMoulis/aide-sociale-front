'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { IRole } from '@/lib/interfaces/interfaces';

function useColumnRoles() {
  const t = useTranslations('RoleSection');
  const columnUsers: ColumnDef<IRole>[] = useMemo(
    () => [
      {
        id: 'name',
        header: t('title'),
        accessorKey: 'name',
        cell: ({ row }) => <span>{row.original.name}</span>
      },
      {
        id: 'description',
        header: t('description'),
        cell: ({ row }) => <span>{row.original.description}</span>
      },
      {
        id: 'permissions',
        header: t('permissions'),
        cell: ({ row }) => (
          <ul>
            {Object.keys(row.original.permissions || {})?.map(
              (ressourceName) => {
                const permissions = row.original.permissions?.[ressourceName];

                return (
                  <li
                    key={ressourceName}
                    className='grid grid-cols-[150px,_repeat(3,_70px)] gap-1 mb-1'>
                    <span>{ressourceName}</span>
                    {permissions?.map((permission, key) => (
                      <span
                        key={key}
                        className='bg-slate-100 mx-1 p-1 px-2 rounded text-xs flex justify-center'>
                        {permission}
                      </span>
                    ))}
                  </li>
                );
              }
            )}
          </ul>
        )
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return columnUsers;
}

export default useColumnRoles;
