import { Checkbox } from '@/components/ui/checkbox';
import { ActionKey, ENUM_ACTIONS } from '@/lib/interfaces/enums';
import { useCallback } from 'react';

type Props = {
  onSelectAction: (action: ActionKey, status: boolean) => void;
  selectedPermissions: ActionKey[];
};
function Actions({ onSelectAction, selectedPermissions }: Props) {
  const checkStatus = useCallback(
    (action: ActionKey) => {
      const enumKeysSize = (Object.keys(ENUM_ACTIONS) as ActionKey[]).filter(
        (key) => key !== ENUM_ACTIONS.ALL
      ).length;
      if (action === ENUM_ACTIONS.ALL) {
        return selectedPermissions.length === enumKeysSize;
      }
      return selectedPermissions.includes(action);
    },
    [selectedPermissions]
  );
  return (
    <ul>
      {Object.keys(ENUM_ACTIONS)
        .filter((key): key is ActionKey => key in ENUM_ACTIONS)
        .map((act) => (
          <li key={act} className='flex items-center'>
            <Checkbox
              id={act}
              checked={checkStatus(act)}
              onCheckedChange={(status) => onSelectAction(act, Boolean(status))}
            />
            <label className='ml-2' htmlFor={act}>
              {act}
            </label>
          </li>
        ))}
    </ul>
  );
}
export default Actions;
