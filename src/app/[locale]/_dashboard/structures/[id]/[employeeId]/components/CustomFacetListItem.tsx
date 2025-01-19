import FormLabel from '@/components/form/FormLabel';
import { Checkbox } from '@/components/ui/checkbox';
import { IBucket } from '@/lib/mongo/interfaces';
import { useMongoSearch } from '@/lib/mongo/MongoSearchContext/MongoSearchContext';
import { CheckedState } from '@radix-ui/react-checkbox';
import { memo, useId, useMemo } from 'react';

type Props = {
  bucket: IBucket;
  name: string;
};
const CustomFacetListItem = memo(({ bucket, name }: Props) => {
  const { onFacetFilter, filters } = useMongoSearch();
  const parsedName = useMemo(() => name.replace('Facet', ''), [name]);
  const id = useId();
  const handleCheckboxChange = (status: CheckedState) => {
    if (typeof status === 'boolean') {
      onFacetFilter({ target: { name, value: bucket._id, checked: status } });
    }
  };
  return (
    <FormLabel htmlFor={id} className='flex items-center space-x-1'>
      <Checkbox
        id={id}
        name={name}
        onCheckedChange={handleCheckboxChange}
        value={bucket._id}
        checked={
          filters[parsedName]?.some((filter) => filter === bucket._id) ?? false
        }
      />
      <span className='text-sm whitespace-nowrap'>
        {bucket._id} - {bucket.count}
      </span>
    </FormLabel>
  );
});
CustomFacetListItem.displayName = 'CustomFacetListItem';
export default CustomFacetListItem;
