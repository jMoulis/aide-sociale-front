import { ENUM_TABLE_COMPONENTS } from '@/lib/interfaces/interfaces';
import { JSX } from 'react';
import DateRangeCell from './renderComponents/DateRangeCell';
import { CustomCellRendererProps } from 'ag-grid-react';
import LinkCell from './renderComponents/LinkCell';

export const cellRender: {
  [key: string]: (params: CustomCellRendererProps) => JSX.Element;
} = {
  [ENUM_TABLE_COMPONENTS.DATE_RANGE]: DateRangeCell,
  [ENUM_TABLE_COMPONENTS.LINK]: LinkCell
};
