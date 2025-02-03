import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  faChevronDown,
  faChevronRight,
  faEdit
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';
import client from '@/lib/mongo/initMongoClient';
import { IRole } from '@/lib/interfaces/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { Link } from '@/i18n/routing';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';
import { PermissionsPopover } from './LeftPanel/PermissionsPopup';

const RolesBlock = () => {
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState<IRole[]>([]);
  const selectedPage = usePageBuilderStore((state) => state.selectedPage);

  useEffect(() => {
    if (selectedPage?._id) {
      client
        .list<IRole>(ENUM_COLLECTIONS.ROLES, {
          organizationId: selectedPage.organizationId,
          [`permissions.${selectedPage.slug}`]: { $exists: true }
        })
        .then(({ data }) => {
          setRoles(data || []);
        });
    }
  }, [selectedPage?._id, selectedPage?.organizationId, selectedPage?.slug]);

  return (
    <Collapsible className='mt-1' open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <div className='flex items-center justify-between border disabled:cursor-not-allowed w-full disabled:opacity-50 shadow-sm border-input rounded-md px-3 py-1 md:text-sm text-lg'>
          <button className='grid grid-cols-[20px_1fr] items-center'>
            <FontAwesomeIcon icon={open ? faChevronDown : faChevronRight} />
            <span className='text-sm'>Roles</span>
          </button>
          <Link href={ENUM_APP_ROUTES.ADMIN_ROLES} target='_blank'>
            <FontAwesomeIcon icon={faEdit} />
          </Link>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className='rounded'>
        <ul className='ml-2 mt-2'>
          {roles.map((role) => {
            return (
              <li key={role._id}>
                <PermissionsPopover role={role} />
              </li>
            );
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};
export default RolesBlock;
