import { ActionKey } from '@/lib/interfaces/enums';
import ActionKeyListItem from './ActionKeyListItem';

type Props = {
  actions: ActionKey[];
};
function ActionKeyList({ actions }: Props) {
  if (actions.length === 0) {
    return <span className='text-gray-400 text-xs'>None</span>;
  }
  return (
    <ul className='flex items-center space-x-2'>
      {actions.map((actionKey) => (
        <ActionKeyListItem key={actionKey} actionKey={actionKey} />
      ))}
    </ul>
  );
}
export default ActionKeyList;
