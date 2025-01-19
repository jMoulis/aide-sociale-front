import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { UserExcerpt } from '@/lib/interfaces/interfaces';

type Props = {
  user: UserExcerpt;
};
function UserTable({ user }: Props) {
  return (
    <div className='grid items-center grid-cols-[40px_1fr]'>
      {user.imageUrl ? (
        <Image
          src={user.imageUrl}
          alt={`${user.firstName} ${user.lastName}`}
          className='rounded-full'
          width={32}
          height={32}
        />
      ) : null}
      <div className='flex flex-col'>
        <div>
          <span className='mr-1'>
            {user.firstName} {user.lastName}
          </span>
          {user.isBanned ? (
            <FontAwesomeIcon icon={faBan} className='text-red-500' />
          ) : null}
        </div>
        <span className='text-xs text-slate-400'>{user.email}</span>
      </div>
    </div>
  );
}

export default UserTable;
