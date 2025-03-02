import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import { useEffect, useState } from 'react';
import Button from '@/components/buttons/Button';
import Selectbox, { SelectboxOption } from '@/components/form/Selectbox';
import { buildOptions } from '../utils';
import { useFormContext } from '../FormContext';

const Multichoices = ({ props, context }: PropsWithChildrenAndContext) => {
  const { className, ...rest } = props || {};
  const { onUpdateForm, getFormFieldValue, asyncData } = useFormContext();
  const [options, setOptions] = useState<SelectboxOption[]>(
    buildOptions(asyncData, context)
  );
  const value = getFormFieldValue(context);
  const [selectedChoices, setSelectedChoices] = useState<string[]>(
    (value as any[]) || []
  );

  useEffect(() => {
    setOptions(buildOptions(asyncData, context));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.dataset]);

  const update = (choices: string[]) => {
    const storeId = context.dataset?.connexion?.input?.storeId;
    const fieldName = context.dataset?.connexion?.input?.field;
    if (!storeId || !fieldName) return;
    onUpdateForm(context, storeId, fieldName, choices);
  };
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const updatedChoices = [...selectedChoices, value];
    setSelectedChoices(updatedChoices);
    update(updatedChoices);
  };
  const handleDeleteChoice = (index: number) => {
    const newChoices = selectedChoices.filter((_, i) => i !== index);
    setSelectedChoices(newChoices);
    update(newChoices);
  };

  return (
    <div className={cn('p-1', className)} {...rest}>
      <Selectbox
        {...props}
        multiple
        onClick={props.onClick}
        disabled={props.disabled || context.isBuilderMode}
        options={options}
        name={context.dataset?.connexion?.input?.field}
        value={value || []}
        data-store={context.dataset?.connexion?.input?.storeId}
        data-listindex={context.listIndex}
        backdrop={context.isBuilderMode}
        onChange={handleSelect}
      />
      <div>
        {selectedChoices.map((choice, index) => (
          <Button onClick={() => handleDeleteChoice(index)} key={index}>
            {choice}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Multichoices;
