'use client';

import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import DetailRole from '../[id]/components/DetailRole';
import client from '@/lib/mongo/initMongoClient';
import { IPage } from '@/lib/interfaces/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';

type Props = {
  organizationId: string | null;
};
function CreateRole({ organizationId }: Props) {
  const t = useTranslations('RoleSection');
  const [open, setOpen] = useState(false);
  const [pages, setPages] = useState<IPage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && organizationId) {
      client
        .list<IPage>(ENUM_COLLECTIONS.PAGES, {
          organizationId
        })
        .then(({ data, error: fetchError }) => {
          if (fetchError) {
            setError(fetchError);
            return;
          }
          setPages(data || []);
        });
    }
  }, [open, organizationId]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title={t('create.title')}
      Trigger={<Button>{t('create.action')}</Button>}>
      <DetailRole
        role={null}
        pages={pages}
        error={error}
        roleId={null}
        onSubmit={() => setOpen(false)}
      />
    </Dialog>
  );
}

export default CreateRole;
