import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Selectbox from '@/components/form/Selectbox';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useEffect, useState } from 'react';

type Props = {
  onValueChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  value: string;
};
function SystemParams({ onValueChange, value }: Props) {
  const [systemParams, setSystemParams] = useState<
    { label: string; value: string }[]
  >([]);
  const t = useTranslations('CollectionSection');

  useEffect(() => {
    client
      .list<{ label: string; value: string }>(ENUM_COLLECTIONS.SYSTEM_PARAMS)
      .then(({ data }) => {
        setSystemParams(data || []);
      });
  }, []);

  return (
    <FormField>
      <FormLabel>Params system</FormLabel>
      <Selectbox
        name='routeParam'
        options={systemParams}
        onChange={onValueChange}
        value={value}
      />
    </FormField>
  );
}
export default SystemParams;
