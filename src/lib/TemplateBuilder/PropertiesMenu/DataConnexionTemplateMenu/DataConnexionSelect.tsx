import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import { ICollection } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type Props = {
  onSelectCollection: (collection: ICollection | null) => void;
  selectedCollection?: ICollection | null;
};
function DataConnexionSelect({
  onSelectCollection,
  selectedCollection
}: Props) {
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [open, setOpen] = useState(false);

  const t = useTranslations('TemplateSection');

  useEffect(() => {
    client.list<ICollection>(ENUM_COLLECTIONS.COLLECTIONS).then(({ data }) => {
      if (data) {
        setCollections(data);
      }
    });
  }, []);

  const handleSelectCollection = (collection: ICollection) => {
    onSelectCollection(collection);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      Trigger={
        <Button>{selectedCollection?.name || t('selectCollection')}</Button>
      }>
      <ul>
        {collections.map((collection) => (
          <li
            style={{
              cursor: 'pointer',
              backgroundColor:
                collection._id === selectedCollection?._id
                  ? 'lightgray'
                  : 'white'
            }}
            key={collection._id}
            onClick={() => handleSelectCollection(collection)}>
            {collection.name}
          </li>
        ))}
      </ul>
      <Button onClick={() => setOpen(false)}>Close</Button>
    </Dialog>
  );
}
export default DataConnexionSelect;
