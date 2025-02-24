import Button from '@/components/buttons/Button';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Selectbox from '@/components/form/Selectbox';
import { ICollection } from '@/lib/interfaces/interfaces';
import SystemParams from './SystemParams';

type Props = {
  selectedCollection: ICollection | null;
  currentParams: string[];
  onSetParams: (param: string[]) => void;
  pageParams: { label: string; value: string }[];
};
function ParametersToSave({ currentParams, onSetParams, pageParams }: Props) {
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (currentParams.includes(value)) return;
    onSetParams([...currentParams, value]);
  };

  const handleDeleteParameter = (index: number) => {
    const newParams = [...currentParams];
    newParams.splice(index, 1);
    onSetParams(newParams);
  };

  return (
    <div>
      <ul>
        {currentParams.map((parameter, key) => (
          <li key={key}>
            <Button onClick={() => handleDeleteParameter(key)}>
              {parameter}
            </Button>
          </li>
        ))}
      </ul>
      <FormField>
        <FormLabel>Parameters to save</FormLabel>
        <FormLabel>Page parameters</FormLabel>
        <Selectbox options={pageParams || []} onChange={handleInputChange} />
        <SystemParams onValueChange={handleInputChange} value='' />
      </FormField>
    </div>
  );
}
export default ParametersToSave;
