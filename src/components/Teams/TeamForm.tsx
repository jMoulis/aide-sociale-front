import { ITeam, IUserSummary } from '@/lib/interfaces/interfaces';
import { useState } from 'react';
import Form from '../form/Form';
import FormField from '../form/FormField';
import FormLabel from '../form/FormLabel';
import Input from '../form/Input';
import FormFooterAction from '../dialog/FormFooterAction';
import SaveButton from '../buttons/SaveButton';
import DeleteButton from '../buttons/DeleteButton';
import { useTranslations } from 'next-intl';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { toastPromise } from '@/lib/toast/toastPromise';
import { removeObjectFields } from '@/lib/utils/utils';
import Members from './Members/Members';

type Props = {
  prevTeam: ITeam;
  onSubmit: (team: ITeam) => void;
  onDelete: (team: ITeam) => void;
  organizationId: string;
};
function TeamForm({ prevTeam, onSubmit, onDelete, organizationId }: Props) {
  const [team, setTeam] = useState<ITeam>(prevTeam);
  const t = useTranslations('TeamSection');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTeam((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (prevTeam) {
      await toastPromise(
        client.update(
          ENUM_COLLECTIONS.TEAMS,
          { _id: prevTeam._id },
          { $set: removeObjectFields(team, ['_id']) }
        ),
        t,
        'edit'
      );
    } else {
      await toastPromise(
        client.create(ENUM_COLLECTIONS.TEAMS, team),
        t,
        'create'
      );
    }
    onSubmit(team);
  };

  const handleUpdateMembers = (members: IUserSummary[]) => {
    setTeam((prev) => ({ ...prev, members }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormField>
        <FormLabel required>{t('labels.name')}</FormLabel>
        <Input
          required
          name='name'
          value={team.name}
          onChange={handleInputChange}
        />
      </FormField>
      <Members
        members={team.members}
        organizationId={organizationId}
        onUpdateMembers={handleUpdateMembers}
      />
      <FormFooterAction>
        <SaveButton />
        <DeleteButton onClick={() => onDelete(team)} />
      </FormFooterAction>
    </Form>
  );
}
export default TeamForm;
