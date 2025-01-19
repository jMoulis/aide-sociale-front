'use client';

import { IRessource } from '@/lib/interfaces/interfaces';
import { ENUM_ACTIONS } from '@/lib/interfaces/enums';
import useColumnRessources from './useColumnPermissionsRessources';
import TableFull from '@/components/table/TableFull';

type Props = {
  ressources: IRessource[];
  error: string | null;
  onSelectPermissions: (
    ressourceName: string,
    action: ENUM_ACTIONS,
    checkState: boolean | 'indeterminate'
  ) => void;
  permissions: Record<string, string[]>;
};
function TablePermissionsRessources({
  ressources,
  error,
  permissions,
  onSelectPermissions
}: Props) {
  const columns = useColumnRessources();

  if (error) return <div>{error}</div>;
  return (
    <TableFull<IRessource>
      data={ressources}
      columns={columns}
      metaCallbacks={{
        permissions,
        onSelectPermissions
      }}
    />
  );
}

export default TablePermissionsRessources;
