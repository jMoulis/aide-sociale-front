'use client';

import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import TableSortHeader from '@/components/table/TableSortHeader';
import { useTranslations } from 'next-intl';
import DebouncedInput from '../form/DebounceInput';
import Button from '../buttons/Button';
import React, { useCallback, useState } from 'react';
import Pagination from './Pagination';

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  children?: React.ReactNode;
  metaCallbacks?: Record<string, any>;
  onSelectRow?: (row: T) => void;
  withPagination?: boolean;
};

function TableFull<T>({
  data,
  columns,
  children,
  metaCallbacks,
  onSelectRow,
  withPagination
}: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const tTable = useTranslations('TableSection');
  const handleFilter = useCallback((filter: string) => {
    setGlobalFilter(filter);
  }, []);
  const table = useReactTable({
    data,
    columns,
    enableGlobalFilter: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    autoResetPageIndex: false,
    meta: metaCallbacks,
    state: {
      sorting,
      globalFilter
    }
  });

  return (
    <div className='rounded-md border'>
      <div className='flex items-center justify-between m-4'>
        <div className='flex items-center'>
          <DebouncedInput
            value={globalFilter || ''}
            onChange={handleFilter}
            placeholder={tTable('filterPlaceholder')}
          />
          <Button
            className='ml-2 whitespace-nowrap'
            onClick={() => handleFilter('')}
            type='button'>
            {tTable('clearFilter')}
          </Button>
        </div>
        {children}
      </div>
      <TableComponent>
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
                        <TableSortHeader header={header} />
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
                className='cursor-pointer'>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      key={cell.id}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        if (cell.column.id !== 'actions') {
                          onSelectRow?.(row.original);
                        }
                      }}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
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
      </TableComponent>
      {withPagination ? (
        <Pagination
          onNext={() => table.nextPage()}
          onPrevious={() => table.previousPage()}
          canNext={table.getCanNextPage()}
          canPrevious={table.getCanPreviousPage()}
        />
      ) : null}
    </div>
  );
}
export default TableFull;
