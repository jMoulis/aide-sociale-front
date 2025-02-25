import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../FormContext';
import Selectbox, { SelectboxOption } from '@/components/form/Selectbox';
import { useEffect, useState } from 'react';
import { buildOptions } from '../utils';

function SelectComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onInputChange, getFormFieldValue, lists } = useFormContext();
  const [options, setOptions] = useState<SelectboxOption[]>(
    buildOptions(lists, context)
  );
  const value = getFormFieldValue(context);

  useEffect(() => {
    setOptions(buildOptions(lists, context));
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
      data-listindex={context.listIndex}
      backdrop={context.isBuilderMode}
      onChange={onInputChange}
    />
  );
}

export default SelectComponent;
