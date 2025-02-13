import { ActionKey, ENUM_ACTIONS } from '@/lib/interfaces/enums';
import {
  faEdit,
  faEye,
  faTrash
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const actionKeyMap: Record<ActionKey, IconDefinition> = {
  [ENUM_ACTIONS.READ]: faEye,
  [ENUM_ACTIONS.WRITE]: faEdit,
  [ENUM_ACTIONS.DELETE]: faTrash
};
type Props = {
  actionKey: ActionKey;
};
function ActionKeyListItem({ actionKey }: Props) {
  return (
    <li>
      <FontAwesomeIcon icon={actionKeyMap[actionKey]} />
    </li>
  );
}
export default ActionKeyListItem;
