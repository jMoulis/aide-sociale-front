import Button from '@/components/buttons/Button';
import Dialog from '@/components/dialog/Dialog';
import { ICollection } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { useEffect, useState } from 'react';
import { useTemplateBuilder } from '../../TemplateBuilderContext';

function DataConnexionSelect() {
  const { template, onSelectCollection, selectedCollection } =
    useTemplateBuilder();
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    client.list<ICollection>(ENUM_COLLECTIONS.COLLECTIONS).then(({ data }) => {
      if (data) {
        setCollections(data);
        onSelectCollection(
          data.find((c) => c._id === template.collection) || null
        );
      }
    });
  }, [template.collection, onSelectCollection]);

  const handleSelectCollection = (collection: ICollection) => {
    onSelectCollection(collection);
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      Trigger={<Button>{selectedCollection?.name}</Button>}>
      <ul>
        {collections.map((collection) => (
          <li
            style={{
              cursor: 'pointer',
              backgroundColor:
                collection._id === template.collection ? 'lightgray' : 'white'
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
