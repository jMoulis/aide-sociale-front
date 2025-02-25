import { ElementConfigProps } from '../../interfaces';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import { useProperties } from './useProperties';
import Form from '@/components/form/Form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select';
import { ChangeEvent, FormEvent, useState } from 'react';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import SaveButton from '@/components/buttons/SaveButton';
import { Checkbox } from '@/components/ui/checkbox';
import { sortArray } from '@/lib/utils/utils';

const inputDomParamaters = [
  {
    label: 'Type',
    value: 'type',
    type: 'string',
    description:
      'Specifies the type of input (e.g., text, password, email, number, etc.).'
  },
  {
    label: 'Name',
    value: 'name',
    type: 'string',
    description:
      'Specifies the name of the input field, used for form submission.'
  },
  {
    label: 'Placeholder',
    value: 'placeholder',
    type: 'string',
    description:
      'Provides a hint to the user about what to enter in the input field.'
  },
  {
    label: 'Required',
    value: 'required',
    type: 'boolean',
    description:
      'Indicates that the input field must be filled out before submitting the form.'
  },
  {
    label: 'Disabled',
    value: 'disabled',
    type: 'boolean',
    description: 'Disables the input field, preventing user interaction.'
  },
  {
    label: 'Read-only',
    value: 'readOnly',
    type: 'boolean',
    description:
      'Makes the input field read-only, allowing selection but not modification.'
  },
  {
    label: 'Max Length',
    value: 'maxLength',
    type: 'number',
    description:
      'Defines the maximum number of characters allowed in the input field.'
  },
  {
    label: 'Min Length',
    value: 'minLength',
    type: 'number',
    description:
      'Defines the minimum number of characters required in the input field.'
  },
  {
    label: 'Min',
    value: 'min',
    type: 'number',
    description:
      'Specifies the minimum acceptable value for numeric or date inputs.'
  },
  {
    label: 'Max',
    value: 'max',
    type: 'number',
    description:
      'Specifies the maximum acceptable value for numeric or date inputs.'
  },
  {
    label: 'Step',
    value: 'step',
    type: 'number',
    description:
      'Defines the interval between valid values for numeric or date inputs.'
  },
  {
    label: 'Pattern',
    value: 'pattern',
    type: 'string',
    description: 'Defines a regular expression that the input value must match.'
  },
  {
    label: 'Autofocus',
    value: 'autoFocus',
    type: 'boolean',
    description: 'Automatically focuses the input field when the page loads.'
  },
  {
    label: 'Autocomplete',
    value: 'autoComplete',
    type: 'string',
    description:
      'Specifies whether the browser should suggest previously entered values.'
  },
  {
    label: 'Multiple',
    value: 'multiple',
    type: 'boolean',
    description:
      'Allows selecting multiple values (used with file and email inputs).'
  },
  {
    label: 'Size',
    value: 'size',
    type: 'number',
    description:
      'Specifies the width of the input field in characters (applies to text-based inputs).'
  },
  {
    label: 'Accept',
    value: 'accept',
    type: 'string',
    description: 'Defines the types of files allowed for file input fields.'
  },
  {
    label: 'Checked',
    value: 'checked',
    type: 'boolean',
    description:
      'Specifies that a checkbox or radio button should be selected by default.'
  },
  {
    label: 'List',
    value: 'list',
    type: 'string',
    description:
      'Links the input field to a `<datalist>` element for predefined suggestions.'
  }
].reduce((acc: Record<string, any>, param) => {
  acc[param.value] = param;
  return acc;
}, {});

const renderParamsComponent: Record<string, any> = {
  string: (
    param: { value: string | boolean | number; key: string },
    handleTextContent: (e: ChangeEvent<HTMLInputElement>, type?: string) => void
  ) => (
    <Input
      name={param.key}
      value={param.value as string}
      onChange={handleTextContent}
    />
  ),
  boolean: (param: any, handleTextContent: any) => (
    <Checkbox
      name={param.key}
      checked={param.value}
      onCheckedChange={(check) =>
        handleTextContent(
          { target: { name: param.key, checked: check } },
          'boolean'
        )
      }
    />
  ),
  number: (param: any, handleTextContent: any) => (
    <Input
      type='number'
      name={param.key}
      value={param.value}
      onChange={(e) => handleTextContent(e, 'number')}
    />
  )
};
type Props = {
  config: ElementConfigProps;
};
function PropertyInput({ config }: Props) {
  const { value } = useProperties({ config });
  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );

  const [params, setParams] = useState<Record<string, any>>(value || {});

  const handleTextContent = (
    e: React.ChangeEvent<HTMLInputElement>,
    inputType?: 'number' | 'string' | 'boolean'
  ) => {
    // onUpdateNodeProperty(config.propKey, e.target.value, config.context);
    const { name, value, checked } = e.target;
    const valueToSave =
      inputType === 'number'
        ? +value
        : inputType === 'boolean'
        ? checked
        : value;

    setParams((prev) => ({
      ...prev,
      [name]: valueToSave
    }));
  };
  const handleSelectParameter = (value?: string) => {
    if (!value) return;
    const param = inputDomParamaters[value];
    if (!param) return;
    setParams((prev) => ({
      ...prev,
      [param?.value]: ''
    }));
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdateNodeProperty({ input: params }, config.context);
  };

  return (
    <div>
      <FormLabel>Paramètres input</FormLabel>
      <Select onValueChange={handleSelectParameter}>
        <SelectTrigger>
          <div>
            <span style={{ textAlign: 'left' }}>Select parameter</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {sortArray(
            Object.values(inputDomParamaters).map((param) => (
              <SelectItem key={param.value} value={param.value}>
                <div className='flex flex-col'>
                  <span>{param.label}</span>
                  <span>{param.description}</span>
                </div>
              </SelectItem>
            )),
            'key'
          )}
        </SelectContent>
      </Select>
      <Form onSubmit={handleSubmit} className='mt-4 ml-2 mr-2'>
        {Object.entries(params).map(([key, value]) => {
          const paramConfig = inputDomParamaters[key];
          if (!paramConfig) return null;
          const renderComponent = renderParamsComponent[paramConfig.type];
          return (
            <FormField key={key}>
              <FormLabel>{paramConfig.label}</FormLabel>
              {renderComponent({ value, key }, handleTextContent)}
            </FormField>
          );
        })}
        <FormFooterAction>
          <SaveButton />
        </FormFooterAction>
      </Form>
    </div>
  );
}
export default PropertyInput;
