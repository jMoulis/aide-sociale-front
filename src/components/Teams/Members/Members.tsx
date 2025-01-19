import DeleteButton from '@/components/buttons/DeleteButton';
import SaveButton from '@/components/buttons/SaveButton';
import SquareButton from '@/components/buttons/SquareButton';
import Dialog from '@/components/dialog/Dialog';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import { IUser, IUserSummary } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { getUserSummary } from '@/lib/utils/utils';
import { faTrash } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

type Props = {
  members: IUserSummary[];
  organizationId: string;
  onUpdateMembers: (members: IUserSummary[]) => void;
};
function Members({ members, organizationId, onUpdateMembers }: Props) {
  const [selectableMembers, setSelectableMembers] = useState<IUserSummary[]>(
    []
  );
  const [open, setOpen] = useState(false);

  const handleOpen = (state: boolean) => {
    if (state) {
      client
        .list<IUser>(ENUM_COLLECTIONS.USERS, { organizationId })
        .then(({ data: users }) => {
          const usersSummary = (users || []).map((user) =>
            getUserSummary(user)
          );
          setSelectableMembers(usersSummary);
        });
    }
    setOpen(state);
  };
  const handleSelectMember = (member: IUserSummary) => {
    const updateMembers = (
      prev: IUserSummary[],
      incomingMember: IUserSummary
    ) => {
      if (prev.find(({ _id }) => _id === incomingMember._id)) {
        return prev.filter(({ _id }) => _id !== incomingMember._id);
      }
      return [...prev, incomingMember];
    };
    onUpdateMembers(updateMembers(members, member));
  };

  const handleRemoveMember = (member: IUserSummary) => {
    onUpdateMembers(members.filter(({ _id }) => _id !== member._id));
  };
  return (
    <div>
      <h1>members</h1>
      <ul>
        {members.map((member) => (
          <li key={member._id} className='flex items-center mb-2'>
            <DeleteButton
              onClick={() => handleRemoveMember(member)}
              className='mr-2'>
              <FontAwesomeIcon icon={faTrash} />
            </DeleteButton>
            <span className='text-sm'>{member.firstName}</span>
          </li>
        ))}
      </ul>
      <Dialog
        title='Members'
        open={open}
        onOpenChange={handleOpen}
        Trigger={<SquareButton>+</SquareButton>}>
        <h1>members</h1>
        <ul>
          {selectableMembers.map((member) => (
            <li
              key={member._id}
              className={`mb-1 py-1 px-2 rounded ${
                members.some(({ _id }) => _id === member._id)
                  ? 'bg-gray-200'
                  : ''
              }`}>
              <button onClick={() => handleSelectMember(member)} type='button'>
                {member.firstName}
              </button>
            </li>
          ))}
        </ul>
        <FormFooterAction>
          <SaveButton type='button' onClick={() => handleOpen(false)}>
            <span>Close</span>
          </SaveButton>
        </FormFooterAction>
      </Dialog>
    </div>
  );
}
export default Members;
