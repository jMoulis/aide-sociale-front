import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { IRole } from '@/lib/interfaces/interfaces';
import { faInfoCircle } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  role: IRole;
  isChecked?: boolean;
  onSelectRole: (role: IRole, status: boolean) => void;
};

function RoleListItem({ role, isChecked, onSelectRole }: Props) {
  return (
    <li key={role._id} className='mb-1'>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <div className='flex items-center cursor-pointer'>
            <Checkbox
              onCheckedChange={(checked) =>
                onSelectRole(
                  role,
                  typeof checked === 'boolean' ? checked : false
                )
              }
              onClick={(e) => e.stopPropagation()}
              checked={isChecked}
            />
            <div className='ml-2 flex items-center'>
              <span className='text-sm'>{role.name}</span>
              <FontAwesomeIcon icon={faInfoCircle} className='ml-2' />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className='p-2 rounded'>
          <div className='flex flex-col'>
            <span className='text-sm'>Description</span>
            <p className='whitespace-pre text-sm'>{role.description}</p>
          </div>
          {Object.keys(role.permissions || {}).map((ressourceName) => {
            if (!(role.permissions || {})[ressourceName]?.length) return null;
            return (
              <div
                className='p-1 my-1 rounded bg-slate-50 grid grid-cols-[100px_1fr] items-center'
                key={ressourceName}>
                <span className='text-sm'>{ressourceName}</span>
                <ul className='flex'>
                  {(role.permissions || {})[ressourceName].map((permission) => (
                    <li key={permission}>
                      <span className='bg-slate-200 mx-1 p-1 px-2 rounded text-xs flex justify-center'>
                        {permission}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}
export default RoleListItem;
