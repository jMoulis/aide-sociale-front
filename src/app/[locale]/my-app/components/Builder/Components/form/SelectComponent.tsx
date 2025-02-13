import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../FormContext';
import Selectbox, { SelectboxOption } from '@/components/form/Selectbox';
import { useEffect, useState } from 'react';

function SelectComponent({ props, context }: PropsWithChildrenAndContext) {
  const [options, setOptions] = useState<SelectboxOption[]>([]);
  const { onInputChange, getFormFieldValue, getMultichoiceOptions } =
    useFormContext();
  const value = getFormFieldValue(context);

  useEffect(() => {
    getMultichoiceOptions(context.dataset).then((choices) =>
      setOptions(choices)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.dataset]);

  return (
    <Selectbox
      {...props}
      onClick={props.onClick}
      disabled={props.disabled || context.isBuilderMode}
      options={options}
      name={context.dataset?.connexion?.field}
      value={value}
      data-collection={context.dataset?.collectionSlug}
      backdrop={context.isBuilderMode}
      onChange={onInputChange}
    />
  );
}

export default SelectComponent;
