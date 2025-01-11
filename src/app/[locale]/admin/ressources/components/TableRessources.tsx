'use client';

import TableFull from '@/components/table/TableFull';
import { IRessource } from '@/lib/interfaces/interfaces';
import useColumnRessources from './useColumnRessources';
import { useCallback, useEffect, useState } from 'react';
import Dialog from '@/components/dialog/Dialog';
import RessourceForm from './RessourceForm';
import { useTranslations } from 'next-intl';
import Button from '@/components/buttons/Button';
import client from '@/lib/mongo/initMongoClient';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { sortArray } from '@/lib/utils/utils';

type Props = {
  initialRessources: IRessource[];
};
function Ressources({ initialRessources }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedRessource, setSelectedRessource] = useState<IRessource | null>(
    null
  );
  const organizationId = useOrganization();
  const [ressources, setRessources] = useState<IRessource[]>(initialRessources);
  const columns = useColumnRessources();
  const t = useTranslations('RoleSection.ressource');

  const handleSelectRow = useCallback((ressource: IRessource) => {
    setOpen(true);
    setSelectedRessource(ressource);
  }, []);

  const handleCancel = () => {
    setOpen(false);
    setSelectedRessource(null);
  };
  const handleSuccess = () => {
    setOpen(false);
    setSelectedRessource(null);
  };
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
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title={t('create.title')}
          Trigger={<Button>{t('create.action')}</Button>}>
          <RessourceForm
            onSuccess={handleSuccess}
            initialRessource={selectedRessource}
            onCancel={handleCancel}
          />
        </Dialog>
      </TableFull>
    </>
  );
}

export default Ressources;
