'use client';

import {
  ColumnDef,
  Header,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import useColumns from './columnUsers';
import { useCallback, useState } from 'react';
import { getUserList } from '../actions';
import { useTranslations } from 'next-intl';
import CreateUser from './CreateUser';
import { useRouter } from 'next/navigation';

import {
  faSortUp,
  faSortDown,
  faSort
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { UserExcerpt } from '@/lib/interfaces/interfaces';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';
import { Button } from '@/components/ui/button';
import DebouncedInput from '@/components/form/DebounceInput';

interface DataTableProps {
  data: UserExcerpt[];
}

export function TableUsers({ data: serverData }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [users, setUsers] = useState<UserExcerpt[]>(serverData);
  const tTable = useTranslations('TableSection');
  const router = useRouter();

  const refreshList = useCallback(async () => {
    getUserList().then((response) => {
      if (response.data) {
        setUsers(response.data);
      }
    });
  }, []);

  const columns: ColumnDef<UserExcerpt>[] = useColumns();

  const table = useReactTable({
    data: users,
    columns,
    enableGlobalFilter: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    meta: {
      onFetchData: refreshList
    },
    state: {
      sorting,
      globalFilter
    }
  });

  const handleSelectRow = (row: UserExcerpt) => {
    router.push(`${ENUM_APP_ROUTES.ADMIN_USERS}/${row.id}`);
  };
  const sortIcon = useCallback((header: Header<UserExcerpt, unknown>) => {
    if (!header.column.getCanSort()) return null;

    const sort = {
      asc: <FontAwesomeIcon icon={faSortDown} />,
      desc: <FontAwesomeIcon icon={faSortUp} />
    }[header.column.getIsSorted() as string];

    if (!sort) return <FontAwesomeIcon icon={faSort} />;
    return sort;
  }, []);

  return (
    <div className='rounded-md border'>
      <div className='flex items-center justify-between m-4'>
        <div className='flex items-center'>
          <DebouncedInput
            value={globalFilter || ''}
            onChange={setGlobalFilter}
            placeholder={tTable('filterPlaceholder')}
          />
          <Button
            className='whitespace-nowrap'
            onClick={() => setGlobalFilter('')}
            type='button'>
            {tTable('clearFilter')}
          </Button>
        </div>
        <CreateUser onSuccess={refreshList} />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center ${
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === 'asc'
                              ? 'Sort ascending'
                              : header.column.getNextSortingOrder() === 'desc'
                              ? 'Sort descending'
                              : 'Clear sort'
                            : undefined
                        }>
                        <span className='mr-1'>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {sortIcon(header)}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                onClick={() => handleSelectRow(row.original)}
                className='cursor-pointer'>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                {tTable('noResults')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
