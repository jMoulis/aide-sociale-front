import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import Popup from '../popup/Popup';
import ActionKeyList from './ActionKeyList';
import { ActionKey } from '@/lib/interfaces/enums';

type Props = {
  permissions: Record<string, ActionKey[]>;
  filter?: string;
};

function ActionsPopup({ permissions, filter }: Props) {
  return (
    <Popup icon={<FontAwesomeIcon icon={faInfoCircle} />} trigger={<span />}>
      <ul className='max-h-64 overflow-auto px-2 py-1'>
        <>
          {filter ? (
            <li>
              <ActionKeyList actions={permissions[filter] || []} />
            </li>
          ) : null}
        </>
        {!filter
          ? Object.keys(permissions || {}).map((permissionKey) => {
              return (
                <li key={permissionKey}>
                  <ActionKeyList actions={permissions[permissionKey] || []} />
                </li>
              );
            })
          : null}
      </ul>
    </Popup>
  );
}
export default ActionsPopup;
