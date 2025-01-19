import {
  faExclamationCircle,
  faInfoCircle
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import colors from 'tailwindcss/colors';
import { CustomDiffResult } from '../../interfaces';

type Props = {
  groupName: 'added' | 'changed' | 'removed';
  field: CustomDiffResult;
};

function DiffListItem({ groupName, field }: Props) {
  const renderIcon = (groupName: 'added' | 'changed' | 'removed') => {
    switch (groupName) {
      case 'removed':
        return { icon: faExclamationCircle, color: colors.red[500] };
      default:
        return { icon: faInfoCircle, color: colors.blue[500] };
    }
  };
  const icon = renderIcon(groupName as any);
  return (
    <li className='ml-2 flex items-center mb-1'>
      <FontAwesomeIcon
        icon={icon.icon}
        style={{
          color: icon.color
        }}
        className='mr-2'
      />
      <span className='text-xs'>
        {field.label || 'N/A'} ({field.name || 'N/A'})
      </span>
      <span className='text-xs'>
        {field.description ? <p>{field.description}</p> : null}
      </span>
    </li>
  );
}
export default DiffListItem;
