'use client';

import TableFull from '@/components/table/TableFull';
import { IRessource } from '@/lib/interfaces/interfaces';
import useColumnRessources from './useColumnRessources';
import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/buttons/Button';
import client from '@/lib/mongo/initMongoClient';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { sortArray } from '@/lib/utils/utils';
import { useRouter } from 'next/navigation';

type Props = {
  initialRessources: IRessource[];
};
function Ressources({ initialRessources }: Props) {
  const router = useRouter();
  const organizationId = useOrganization();
  const [ressources, setRessources] = useState<IRessource[]>(initialRessources);
  const columns = useColumnRessources();
  const t = useTranslations('RoleSection.ressource');

  const handleSelectRow = useCallback(
    (ressource: IRessource) => {
      router.push(`${ENUM_COLLECTIONS.RESSOURCES}/${ressource._id}`);
    },
    [router]
  );

  useEffect(() => {
    if (!organizationId) return;
    client.onSnapshotList<IRessource>(
      ENUM_COLLECTIONS.RESSOURCES,
      { organizationId },
      (data) => setRessources(sortArray(data, 'name'))
    );
  }, [organizationId]);

  return (
    <>
      <TableFull<IRessource>
        data={ressources}
        columns={columns}
        withPagination
        onSelectRow={handleSelectRow}>
        <Button
          onClick={() => router.push(`${ENUM_COLLECTIONS.RESSOURCES}/create`)}>
          {t('create.action')}
        </Button>
      </TableFull>
    </>
  );
}

export default Ressources;
