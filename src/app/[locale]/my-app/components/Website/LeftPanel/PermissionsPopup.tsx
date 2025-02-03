import Button from '@/components/buttons/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { IRole } from '@/lib/interfaces/interfaces';

type Props = {
  role: IRole;
};
export function PermissionsPopover({ role }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>{role.name}</Button>
      </PopoverTrigger>
      <PopoverContent className='w-100'>
        <div>
          <span>Description</span>
          <p className='whitespace-pre text-sm'>{role.description}</p>
          <ul className='max-h-60 overflow-auto'>
            {Object.entries(role.permissions || {}).map(([key, value]) => (
              <li key={key}>
                <span className='text-sm'>{key}</span>
                <ul className='grid grid-cols-[repeat(3,_70px)] gap-1 mb-1'>
                  {value.map((value) => (
                    <li key={value}>
                      <span className='bg-slate-100 mx-1 p-1 px-1 rounded text-[10px] flex justify-center'>
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
