import { ITeam } from '@/lib/interfaces/interfaces';
import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';
import { getUserSummary } from '@/lib/utils/utils';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import Dialog from '../dialog/Dialog';
import Button from '../buttons/Button';
import TeamForm from './TeamForm';
import SquareButton from '../buttons/SquareButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { useTranslations } from 'next-intl';
import Avatar from '../Avatar';

type Props = {
  prevTeams: ITeam[];
  organizationId: string;
};
function Teams({ prevTeams, organizationId }: Props) {
  const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);
  const [teams, setTeams] = useState<ITeam[]>(prevTeams);

  const user = useMongoUser();
  const t = useTranslations('TeamSection');

  const handleAddNewTeam = () => {
    const defaultTeam: ITeam = {
      _id: nanoid(),
      name: '',
      members: [],
      organizationId,
      createdAt: new Date(),
      projects: [],
      description: '',
      createdBy: user ? getUserSummary(user) : undefined
    };
    setSelectedTeam(defaultTeam);
    setTeams([...teams, defaultTeam]);
  };

  const handleDialogToggle = (status: boolean) => {
    if (!status) {
      setSelectedTeam(null);
    }
  };

  const handleUpdateTeam = (team: ITeam) => {
    const isNewTeam = !teams.find((a) => a._id === team._id);
    const updatedTeams = isNewTeam
      ? [...teams, team]
      : teams.map((a) => {
          if (a._id === team._id) {
            return team;
          }
          return a;
        });
    setTeams(updatedTeams);
    setSelectedTeam(null);
  };

  const handleDeleteTeam = (team: ITeam) => {
    const updatedTeams = teams.filter((a) => a._id !== team._id);
    setTeams(updatedTeams);
    setSelectedTeam(null);
  };

  return (
    <div>
      <Dialog
        open={!!selectedTeam}
        onOpenChange={handleDialogToggle}
        Trigger={<Button onClick={handleAddNewTeam}>{t('createTeam')}</Button>}>
        {selectedTeam ? (
          <TeamForm
            prevTeam={selectedTeam}
            onSubmit={handleUpdateTeam}
            onDelete={handleDeleteTeam}
            organizationId={organizationId}
          />
        ) : null}
      </Dialog>
      {teams.map((team) => (
        <div key={team._id} className='flex  items-center'>
          <div>
            <p>{team.name}</p>
            <ul className='relative h-9'>
              {team.members.map((member, index) => (
                <div
                  key={member._id}
                  className={`absolute top-1`}
                  style={{
                    left: `${index * 15}px`
                  }}>
                  <Avatar
                    size={25}
                    alt={member.firstName}
                    src={member.imageUrl}
                  />{' '}
                </div>
              ))}
            </ul>
          </div>
          <SquareButton onClick={() => setSelectedTeam(team)}>
            <FontAwesomeIcon icon={faEdit} />
          </SquareButton>
        </div>
      ))}
    </div>
  );
}
export default Teams;
