import { useEffect, useMemo, useState } from 'react';
import {
  ITableField,
  PropsWithChildrenAndContext
} from '@/lib/interfaces/interfaces';
import { useFormContext } from '../FormContext';
import {
  ModuleRegistry,
  AllCommunityModule,
  ColDef,
  DataTypeDefinition
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { format } from 'date-fns';
import { cellRender } from './CellRenderer';

ModuleRegistry.registerModules([AllCommunityModule]);

function TableComponent({ props, context }: PropsWithChildrenAndContext) {
  const { asyncData } = useFormContext();

  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColDef<any>[]>([]);

  useEffect(() => {
    const query = context.dataset?.connexion?.input?.query;

    if (!query) return;
    const storeSlug = context.dataset?.connexion?.input?.storeSlug;
    if (!storeSlug) return;
    const store = asyncData[storeSlug]?.store;
    if (!store) return;

    const fields: ITableField[] = context.table?.fields || [];

    const types: { [key: string]: string } = {
      string: 'text',
      number: 'number',
      date: 'date',
      boolean: 'boolean'
    };

    const columns: ColDef<any>[] = fields.map((field) => ({
      field: field.key,
      headerName: field.label,
      cellDataType: types[field.type] || 'text',
      cellRenderer: cellRender[field.component] || undefined,
      cellRendererParams: {
        context,
        field
      } as any
    }));

    setColumns(columns);
    const parsedData = Array.isArray(asyncData[storeSlug]?.data)
      ? asyncData[storeSlug]?.data.map((item) => item.data)
      : [];
    setData(parsedData);
  }, [
    asyncData,
    context,
    context.dataset?.connexion?.input?.query,
    context.dataset?.connexion?.input?.storeSlug,
    context.table?.fields
  ]);

  const dataTypeDefinitions = useMemo<{
    [cellDataType: string]: DataTypeDefinition;
  }>(() => {
    return {
      date: {
        baseDataType: 'date',
        extendsDataType: 'date',
        valueParser: (params) => {
          if (params.newValue == null) {
            return null;
          }
          // convert from `dd/mm/yyyy`
          const dateParts = params.newValue.split('/');
          return dateParts.length === 3
            ? new Date(
                parseInt(dateParts[2]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[0])
              )
            : null;
        },
        valueFormatter: (params) => {
          return params.value == null ? '' : format(params.value, 'dd/MM/yyyy');
        }
      }
    };
  }, []);

  return (
    <div {...props} style={{ height: 500, ...props.style }}>
      <AgGridReact
        rowData={data}
        columnDefs={columns as any}
        dataTypeDefinitions={dataTypeDefinitions}
      />
    </div>
  );
}
export default TableComponent;
