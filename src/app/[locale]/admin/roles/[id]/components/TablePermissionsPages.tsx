'use client';

import { ITreePage } from '@/lib/interfaces/interfaces';
import { ENUM_ACTIONS } from '@/lib/interfaces/enums';
import { Checkbox } from '@/components/ui/checkbox';
import FormField from '@/components/form/FormField';

const Row = ({
  page,
  permissions,
  onSelectPermissions
}: {
  permissions: Record<string, string[]>;
  page: ITreePage;
  onSelectPermissions: (
    ressourceName: string,
    action: ENUM_ACTIONS,
    checkState: boolean | 'indeterminate'
  ) => void;
}) => {
  return (
    <div className='grid grid-cols-[repeat(5,1fr)] border-b border-gray-200'>
      <div className='flex flex-col'>
        <span className='text-sm'>{page.name}</span>
        <div>
          <span className='text-xs'>{page.slug}</span>
          <span className='text-xs'>{page.route}</span>
        </div>
      </div>

      {Object.values(ENUM_ACTIONS).map((action) => {
        return (
          <FormField key={action} className='flex items-center justify-center'>
            <Checkbox
              checked={
                (permissions[page.slug]?.includes(action) ||
                  permissions?.[page.slug]?.length === 3) ??
                false
              }
              onCheckedChange={(e) => onSelectPermissions(page.slug, action, e)}
            />
          </FormField>
        );
      })}
    </div>
  );
};
type Props = {
  pages: ITreePage[];
  error: string | null;
  onSelectPermissions: (
    ressourceName: string,
    action: ENUM_ACTIONS,
    checkState: boolean | 'indeterminate'
  ) => void;
  permissions: Record<string, string[]>;
};
function TablePermissionsPages({
  pages,
  permissions,
  onSelectPermissions
}: Props) {
  return (
    <div>
      <ul className='grid grid-cols-[repeat(5,1fr)]'>
        <li>
          <span className='text-sm'>Page</span>
        </li>
        {Object.values(ENUM_ACTIONS).map((action, key) => (
          <li key={key} className='flex items-center justify-center'>
            <span className='text-sm'>{action}</span>
          </li>
        ))}
      </ul>
      <ul>
        {pages.map((page) => (
          <li key={page._id}>
            <Row
              page={page}
              permissions={permissions}
              onSelectPermissions={onSelectPermissions}
            />
            <ul className='ml-4'>
              {page.children.map((child) => (
                <li key={child._id}>
                  <Row
                    page={child}
                    permissions={permissions}
                    onSelectPermissions={onSelectPermissions}
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TablePermissionsPages;
