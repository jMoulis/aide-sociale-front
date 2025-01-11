'use client';

import { IFormField } from './interfaces';
import FormField from '@/components/form/FormField';
import Button from '@/components/buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowUp
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { useTemplateBuilder } from './TemplateBuilderContext';
import { renderField } from './RenderFieldParams';

interface PreviewFieldProps {
  field: IFormField;
  isFieldSelected: boolean;
  blockId: string;
  fieldIndex: number;
  isLastField: boolean;
}

export function PreviewField({
  field,
  isFieldSelected,
  blockId,
  fieldIndex,
  isLastField
}: PreviewFieldProps) {
  const { selectField, reorderField, isEditable } = useTemplateBuilder();

  return (
    <FormField
      key={field.id}
      onClick={(e) => {
        e.stopPropagation();
        selectField(blockId, field.id);
      }}
      className={`border cursor-pointer relative group rounded m-1 ${
        isFieldSelected ? 'border-green-500 bg-green-50' : 'border-transparent'
      }`}>
      {isEditable ? (
        <div className='toolbar absolute z-10 right-2 top-2 hidden group-hover:flex'>
          <Button
            className='bg-gray-200 w-6 h-6 mr-1 flex items-center justify-center'
            onClick={() => reorderField(blockId, field.id, 'up')}
            disabled={fieldIndex === 0}>
            <FontAwesomeIcon icon={faArrowUp} />
          </Button>
          <Button
            className='bg-gray-200 w-6 h-6 flex items-center justify-center'
            onClick={() => reorderField(blockId, field.id, 'down')}
            disabled={isLastField}>
            <FontAwesomeIcon icon={faArrowDown} />
          </Button>
        </div>
      ) : null}

      {renderField({ field, readOnly: true })}
    </FormField>
  );
}
