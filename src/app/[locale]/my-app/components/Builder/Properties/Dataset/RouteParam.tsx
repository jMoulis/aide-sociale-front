import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Selectbox from '@/components/form/Selectbox';
import { useTranslations } from 'next-intl';
import { ChangeEvent } from 'react';
import SystemParams from './SystemParams';

type Props = {
  onValueChange: (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
  value: string;
  pageParams: { label: string; value: string }[];
};
function RouteParam({ onValueChange, value, pageParams }: Props) {
  const t = useTranslations('CollectionSection');

  return (
    <div>
      <FormLabel>Parameter to filter</FormLabel>
      <FormField>
        <FormLabel className='text-gray-700'>{t('routeParam')}</FormLabel>
        <Selectbox
          name='routeParam'
          options={pageParams}
          onChange={onValueChange}
          value={value}
        />
      </FormField>
      <SystemParams onValueChange={onValueChange} value={value} />
    </div>
  );
}
export default RouteParam;
