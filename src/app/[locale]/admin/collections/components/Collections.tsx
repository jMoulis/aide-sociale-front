'use client';

import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';
import { ICollection, IUserSummary } from '@/lib/interfaces/interfaces';
import Link from 'next/link';
import CollectionForm from './CollectionForm';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = {
  initialCollections: ICollection[];
  organizationId: string;
  user: IUserSummary;
};
function Collections({ initialCollections, organizationId, user }: Props) {
  const [collections, setCollections] =
    useState<ICollection[]>(initialCollections);
  const [open, setOpen] = useState(false);

  const t = useTranslations('CollectionSection');
  const handleSubmit = (collection: ICollection, create: boolean) => {
    if (create) {
      setCollections((prev) => [...prev, collection]);
    } else {
      setCollections((prev) =>
        prev.map((prevCollection) =>
          prevCollection._id === collection._id ? collection : prevCollection
        )
      );
    }
    setOpen(false);
  };
  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        Trigger={<Button>{t('create.action')}</Button>}>
        <CollectionForm
          organizationId={organizationId}
          user={user}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </Dialog>
      <ul>
        {collections.map((collection) => (
          <li key={collection._id}>
            <Link href={`${ENUM_APP_ROUTES.COLLECTIONS}/${collection._id}`}>
              {collection.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Collections;
