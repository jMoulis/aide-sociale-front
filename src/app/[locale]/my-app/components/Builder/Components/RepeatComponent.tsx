import { Link } from '@/i18n/routing';
import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import { useEffect, useState } from 'react';
import { FormType } from './FormContext';

function RepeatComponent({
  props,
  children,
  context
}: PropsWithChildrenAndContext) {
  const [items, setItems] = useState<FormType[]>([]);

  useEffect(() => {
    if (context.isBuilderMode) return;
    if (!context.dataset?.collectionSlug) return;
    client
      .list<FormType>(context.dataset.collectionSlug as ENUM_COLLECTIONS)
      .then(({ data }) => {
        if (data) {
          setItems(data);
        }
      });
  }, [context.dataset?.collectionSlug, context.isBuilderMode]);
  return (
    <div {...props} className={cn('p-1', props.className)}>
      {items.map((item, index) => (
        <Link href={`/app/detail/${item._id}`} key={index}>
          {item.data.firstname}
        </Link>
      ))}
    </div>
  );
}
export default RepeatComponent;
