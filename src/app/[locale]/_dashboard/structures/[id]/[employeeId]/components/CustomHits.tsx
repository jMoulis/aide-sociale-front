import Avatar from '@/components/Avatar';
import { Link } from '@/i18n/routing';
import { IUser } from '@/lib/interfaces/interfaces';
import { useMongoSearch } from '@/lib/mongo/MongoSearchContext/MongoSearchContext';
import PendingUserList from './Skeleton';

type Props = {
  structureId: string;
};
function CustomHits({ structureId }: Props) {
  const { hits, hitsStatus } = useMongoSearch<IUser>();

  if (hitsStatus?.status) return <PendingUserList />;
  return (
    <ul className='flex flex-wrap'>
      {hits.map((hit, index) => (
        <Link
          href={`${structureId}/${hit._id}`}
          key={index}
          className='space-x-2 m-2'>
          <Avatar src={hit.imageUrl} alt={hit.firstName} size={30} />
          <div className='space-x-1'>
            <span>{hit.firstName}</span>
            <span>{hit.lastName}</span>
          </div>
        </Link>
      ))}
    </ul>
  );
}

export default CustomHits;
