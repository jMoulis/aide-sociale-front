import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../FormContext';
import Selectbox, { SelectboxOption } from '@/components/form/Selectbox';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { buildOptions } from '../utils';

function SelectComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue, asyncData } = useFormContext();
  const [options, setOptions] = useState<SelectboxOption[]>(
    buildOptions(asyncData, context)
  );
  const value = getFormFieldValue(context);

  useEffect(() => {
    setOptions(buildOptions(asyncData, context));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.dataset]);

  const handleChangeValue = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      const storeId = context.dataset?.connexion?.input?.storeId;
      const filedName = context.dataset?.connexion?.input?.field;
      if (!storeId || !filedName) return;
      onUpdateForm(context, storeId, filedName, value);
    },
    [context, onUpdateForm]
  );

  return (
    <Selectbox
      {...props}
      onClick={props.onClick}
      disabled={props.disabled || context.isBuilderMode}
      options={options}
      name={context.dataset?.connexion?.input?.field}
      value={value}
      data-store={context.dataset?.connexion?.input?.storeId}
      data-listindex={context.listIndex}
      backdrop={context.isBuilderMode}
      onChange={handleChangeValue}
    />
  );
}

export default SelectComponent;
