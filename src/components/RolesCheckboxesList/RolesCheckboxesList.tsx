import { IRole } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { useEffect, useState } from 'react';
import FormField from '../form/FormField';
import { Checkbox } from '../ui/checkbox';
import FormLabel from '../form/FormLabel';
import ActionsPopup from './ActionsPopup';

type Props = {
  organizationId: string | null;
  prevRoles: string[];
  onSelectRole: (role: IRole) => void;
  shouldFetch: boolean;
  filter?: string;
};
function RolesCheckboxesList({
  organizationId,
  prevRoles,
  onSelectRole,
  shouldFetch,
  filter
}: Props) {
  const [roles, setRoles] = useState<IRole[]>([]);
  useEffect(() => {
    if (!organizationId || !shouldFetch) return;
    client
      .list<IRole>(ENUM_COLLECTIONS.ROLES, {
        organizationId
      })
      .then(({ data }) => {
        setRoles(data || []);
      });
  }, [organizationId, shouldFetch]);

  return (
    <ul>
      {roles.map((role, i) => (
        <li key={role._id}>
          <FormField className='flex-row items-center'>
            <Checkbox
              id={`${role._id}-${i}`}
              checked={prevRoles.includes(role._id)}
              onCheckedChange={() => onSelectRole(role)}
            />
            <FormLabel htmlFor={`${role._id}-${i}`} className='m-0 ml-2 mr-2'>
              {role.name}
            </FormLabel>
            <ActionsPopup
              permissions={role.permissions || {}}
              filter={filter}
            />
          </FormField>
        </li>
      ))}
    </ul>
  );
}
export default RolesCheckboxesList;
