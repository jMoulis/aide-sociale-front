import CancelButton from '@/components/buttons/CancelButton';
import FormLabel from '@/components/form/FormLabel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select';
import { IPage } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';
import { faTimes } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';

type Props = {
  disabled?: boolean;
  onValueChange: (value: IPage) => void;
  defaultValue?: string;
  value?: { slug: string; route: string; name: string };
  onDelete: () => void;
};

function SelectPages({
  value,
  defaultValue,
  disabled,
  onValueChange,
  onDelete
}: Props) {
  const [pages, setPages] = useState<IPage[]>([]);
  const user = useMongoUser();
  const website = usePageBuilderStore((state) => state.website);

  useEffect(() => {
    if (!user || !user.organizationId || !website?._id) return;
    (async () => {
      const { data: pages } = await client.list<IPage>(ENUM_COLLECTIONS.PAGES, {
        organizationId: user.organizationId,
        websiteId: website._id
      });
      if (pages) {
        setPages(pages);
      }
    })();
  }, [user, website?._id]);

  const handleSelect = (value: string) => {
    const page = pages.find((page) => page.route === value);
    if (page) {
      onValueChange(page);
    }
  };

  return (
    <div>
      <FormLabel>Ou Sélectionnez une page</FormLabel>
      <div className='flex space-x-2'>
        <Select
          disabled={disabled}
          onValueChange={handleSelect}
          defaultValue={defaultValue}
          value={value?.route}>
          <SelectTrigger className='w-[180px]'>
            <span style={{ textAlign: 'left' }}>
              {value?.name || 'Select page'}
            </span>
          </SelectTrigger>
          <SelectContent>
            {pages.map((page, key) => (
              <SelectItem
                className='flex flex-col items-start'
                key={key}
                value={page.route}>
                <span>{page.name}</span>
                <span className='text-[10px] text-gray-600'>{page.route}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <CancelButton onClick={onDelete} disabled={disabled}>
          <FontAwesomeIcon icon={faTimes} />
        </CancelButton>
      </div>
    </div>
  );
}
export default SelectPages;
