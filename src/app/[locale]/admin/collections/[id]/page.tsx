import { ICollection } from '@/lib/interfaces/interfaces';
import clientMongoServer from '@/lib/mongo/initMongoServer';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import Collection from './components/Collection';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ [key: string]: string }>;
};
export default async function CollectionsPage({ params }: Props) {
  const { id } = await params;
  const { data: collection } = await clientMongoServer.get<ICollection>(
    ENUM_COLLECTIONS.COLLECTIONS,
    {
      _id: id
    }
  );
  if (!collection) {
    notFound();
  }

  return <Collection initialCollection={collection} />;
}
