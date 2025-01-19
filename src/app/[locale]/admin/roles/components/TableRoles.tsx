'use client';

import { useEffect, useState } from 'react';
import client from '@/lib/mongo/initMongoClient';
import useColumnRoles from './useColumnRoles';
import { useRouter } from 'next/navigation';
import TableFull from '@/components/table/TableFull';
import { toast } from '@/lib/hooks/use-toast';
import CreateRole from './CreateRole';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { IRole } from '@/lib/interfaces/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';

type Props = {
  initialRoles: IRole[];
};
function TableRoles({ initialRoles }: Props) {
  const [data, setData] = useState<IRole[]>(initialRoles);
  const columns = useColumnRoles();
  const router = useRouter();

  const organizationId = useOrganization();

  useEffect(() => {
    if (!organizationId) return;
    client
      .list<IRole>(ENUM_COLLECTIONS.ROLES, {
        organizationId
      })
      .then(({ data, error }) => {
        if (error) {
          toast({
            title: error,
            description: error,
            variant: 'destructive'
          });
          return;
        }
        setData(data || []);
      });
  }, [organizationId]);

  useEffect(() => {
    if (!organizationId) return;
    const unsubscribe = client.onSnapshotList<IRole>(
      ENUM_COLLECTIONS.ROLES,
      {
        organizationId
      },
      (updatedData) => {
        setData(updatedData);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [organizationId]);

  const handleSelectRole = (role: IRole) => {
    router.push(`${ENUM_APP_ROUTES.ADMIN_ROLES}/${role._id}`);
  };
  return (
    <TableFull<IRole>
      data={data}
      withPagination
      columns={columns}
      onSelectRow={handleSelectRole}>
      <CreateRole organizationId={organizationId} />
    </TableFull>
  );
}

export default TableRoles;
