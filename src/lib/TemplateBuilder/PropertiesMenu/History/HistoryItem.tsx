import Avatar from '@/components/Avatar';
import { IUserSummary } from '@/lib/interfaces/interfaces';
import { format } from 'date-fns';

type Props = {
  user?: IUserSummary | null;
  message?: string;
  date?: Date;
};
function HistoryItem({ user, message, date }: Props) {
  return (
    <div className='flex items-center mb-2'>
      <Avatar src={user?.imageUrl} alt={user?.firstName || 'User'} size={20} />
      <div className='flex flex-col ml-2'>
        <span className='text-xs'>{message}</span>
        <span className='text-xs text-slate-500'>
          {format(date || new Date(), 'dd/MM/yyyy HH:mm')}
        </span>
      </div>
    </div>
  );
}
export default HistoryItem;
