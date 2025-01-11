import React from 'react';
import { IFormField, ENUM_FIELD_TYPE, IFormData } from './interfaces';
import Input from '@/components/form/Input';
import Textarea from '@/components/form/Textarea';
import FormLabel from '@/components/form/FormLabel';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/form/Date/DatePicker';
import { DateRangePicker } from '@/components/form/Date/DateRangePicker';
import { DateTimePicker } from '@/components/form/Date/DateTimePicker';
import Selectbox from '@/components/form/Selectbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { TimePicker } from '@/components/form/Date/TimePicker/TimePicker';

interface RenderFieldParams {
  field: IFormField;
  formData?: {
    data: Record<string, any>;
    archivedData?: Record<string, any>;
  };
  readOnly?: boolean; // default false
  onChange?: (fieldName: string, value: any) => void;
  setFormData?: React.Dispatch<React.SetStateAction<IFormData>>; // if needed for checkboxes
}

export function renderField({
  field,
  formData,
  readOnly = false,
  onChange,
  setFormData
}: RenderFieldParams) {
  // 1. If the field is archived, just show the old data + message
  if (formData?.archivedData?.[field.name]) {
    return (
      <div className='bg-gray-100 p-2 text-gray-600'>
        <p className='text-sm italic'>
          {String(formData.archivedData[field.name])}
        </p>
        <p className='text-xs text-red-500'>
          {`This field was archived (the new template no longer contains it).`}
        </p>
      </div>
    );
  }

  // 2. Otherwise, render based on field.type
  //    If readOnly === true, we disable interactions or omit onChange
  const value = formData?.data[field.name] || '';
  const disabledClasses = readOnly ? 'pointer-events-none' : '';
  const handleFieldChange = (val: any) => {
    if (!readOnly && onChange) {
      onChange(field.name, val);
    }
  };

  switch (field.type) {
    case ENUM_FIELD_TYPE.TEXT:
      return <span>{value}</span>;

    case ENUM_FIELD_TYPE.INPUT:
      return (
        <>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          <Input
            type='text'
            className={`border p-2 w-full ${disabledClasses}`}
            required={field.required}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(e.target.value)}
            disabled={readOnly}
          />
        </>
      );

    case ENUM_FIELD_TYPE.NUMBER:
      return (
        <>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          <Input
            type='number'
            className={`border p-2 w-full ${disabledClasses}`}
            required={field.required}
            placeholder={field.description}
            value={value}
            onChange={(e) => handleFieldChange(e.target.value)}
            disabled={readOnly}
          />
        </>
      );

    case ENUM_FIELD_TYPE.DATE:
      return (
        <>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          <DatePicker
            required={field.required}
            date={value}
            onChange={handleFieldChange}
            disabled={readOnly}
          />
        </>
      );
    case ENUM_FIELD_TYPE.DATETIME: {
      return (
        <>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          <DateTimePicker
            required={field.required}
            date={value}
            onChange={handleFieldChange}
            disabled={readOnly}
          />
        </>
      );
    }
    case ENUM_FIELD_TYPE.DATERANGE: {
      const rangeDate =
        value?.from || value?.to ? value : { from: undefined, to: undefined };
      return (
        <>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          <DateRangePicker
            date={rangeDate}
            required={field.required}
            disabled={readOnly}
            onChange={(val) => {
              if (!readOnly && handleFieldChange) {
                handleFieldChange(val);
              }
            }}
          />
        </>
      );
    }
    case ENUM_FIELD_TYPE.TIME:
      return (
        <>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          <TimePicker
            required={field.required}
            time={value}
            onChange={(time) => handleFieldChange(time)}
            disabled={readOnly}
          />
        </>
      );

    case ENUM_FIELD_TYPE.TEXTAREA:
      return (
        <>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          <Textarea
            className={`border p-2 w-full ${disabledClasses}`}
            required={field.required}
            placeholder={field.description}
            value={value}
            onChange={(e) => handleFieldChange(e.target.value)}
            disabled={readOnly}
          />
        </>
      );

    case ENUM_FIELD_TYPE.SELECT: {
      const options =
        field.optionsSourceType === 'database'
          ? (field as any).resolvedOptions || []
          : field.options?.map((opt) => ({ label: opt, value: opt })) || [];

      return (
        <>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          <Selectbox
            name={field.name}
            options={options}
            disabled={readOnly}
            required={field.required}
            className={disabledClasses}
            value={value}
            onChange={(e) => handleFieldChange(e.target.value)}
          />
        </>
      );
    }

    case ENUM_FIELD_TYPE.RADIO: {
      const options =
        field.optionsSourceType === 'database'
          ? (field as any).resolvedOptions || []
          : field.options?.map((opt) => ({ label: opt, value: opt })) || [];
      return (
        <>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          <RadioGroup
            name={field.name}
            defaultValue={value}
            onValueChange={(v) => handleFieldChange(v)}>
            {options.map((opt: { label: string; value: string }, i: number) => (
              <div key={i} className='flex items-center space-x-2'>
                <RadioGroupItem value={opt.value} id={`${i}-${field.name}`} />
                <FormLabel className='mb-0' htmlFor={`${i}-${field.name}`}>
                  {opt.label}
                </FormLabel>
              </div>
            ))}
          </RadioGroup>
        </>
      );
    }

    case ENUM_FIELD_TYPE.CHECKBOX: {
      // Possibly need the `setFormData` if you want to do advanced logic
      const options =
        field.optionsSourceType === 'database'
          ? (field as any).resolvedOptions || []
          : field.options?.map((opt) => ({ label: opt, value: opt })) || [];

      const checkedValues = Array.isArray(value) ? value : [];

      return (
        <div>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          {options.map((opt: { label: string; value: string }, i: number) => (
            <label key={i} className='flex items-center mr-2'>
              <Checkbox
                name={field.name}
                className={disabledClasses}
                disabled={readOnly}
                value={opt.value}
                checked={checkedValues.includes(opt.value)}
                onCheckedChange={(checkState) => {
                  if (!readOnly && setFormData) {
                    if (checkState) {
                      setFormData((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          [field.name]: [...checkedValues, opt.value]
                        }
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          [field.name]: checkedValues.filter(
                            (val: string) => val !== opt.value
                          )
                        }
                      }));
                    }
                  }
                }}
              />
              <span className='ml-2 text-sm'>{opt.label}</span>
            </label>
          ))}
        </div>
      );
    }
    case ENUM_FIELD_TYPE.EMAIL: {
      return (
        <>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          <Input
            type='email'
            value={value}
            placeholder={field.description}
            disabled={readOnly}
            onChange={(e) => handleFieldChange(e.target.value)}
          />
        </>
      );
    }
    case ENUM_FIELD_TYPE.FILE: {
      // Basic <input type="file">. Real usage might store file object in state,
      // upload to server, etc.
      return (
        <>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          <Input
            type='file'
            disabled={readOnly}
            onChange={(e) => {
              if (!readOnly && onChange) {
                // Single file example
                const file = e.target.files?.[0] ?? null;
                handleFieldChange(file);
              }
            }}
          />
        </>
      );
    }
    case ENUM_FIELD_TYPE.RANGE: {
      const numericValue = Number(value) || 0;
      return (
        <>
          <FormLabel required={field.required}>
            {field.label}({numericValue})
          </FormLabel>
          <Slider
            value={[numericValue]}
            onValueChange={(val) => handleFieldChange(val[0])}
            disabled={readOnly}
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
          />
        </>
      );
    }
    case ENUM_FIELD_TYPE.TOGGLE: {
      const boolVal = !!value;
      return (
        <>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          <Switch
            checked={boolVal}
            onCheckedChange={(checked) => handleFieldChange(checked)}
            disabled={readOnly}
            required={field.required}
          />
        </>
      );
    }
    case ENUM_FIELD_TYPE.MULTISELECT: {
      const options = field.options ?? []; // or resolved from DB
      const selected: string[] = Array.isArray(value) ? value : [];

      return (
        <>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          {options.map((opt) => {
            const isChecked = selected.includes(opt);
            return (
              <div key={opt} className='flex items-center space-x-1'>
                <input
                  type='checkbox'
                  checked={isChecked}
                  disabled={readOnly}
                  onChange={(e) => {
                    if (!readOnly && onChange) {
                      if (e.target.checked) {
                        handleFieldChange([...selected, opt]);
                      } else {
                        handleFieldChange(selected.filter((x) => x !== opt));
                      }
                    }
                  }}
                />
                <span className='text-sm'>{opt}</span>
              </div>
            );
          })}
        </>
      );
    }
    case ENUM_FIELD_TYPE.COLOR: {
      // Basic <input type="color"> or a custom color picker from shadcn
      return (
        <>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          <Input
            type='color'
            value={value || '#ffffff'}
            disabled={readOnly}
            onChange={(e) => handleFieldChange(e.target.value)}
          />
        </>
      );
    }

    case ENUM_FIELD_TYPE.RATING: {
      // A star rating. Could do a simpler approach or use a library
      // We'll do a quick example with a row of 5 clickable stars
      const ratingVal = Number(value) || 0;
      const maxStars = field.max ?? 5;

      return (
        <>
          <FormLabel required={field.required}>{field.label}</FormLabel>
          <div className='flex space-x-1'>
            {[...Array(maxStars)].map((_, i) => {
              const starIndex = i + 1;
              const filled = starIndex <= ratingVal;
              return (
                <button
                  key={i}
                  type='button'
                  disabled={readOnly}
                  onClick={() => handleFieldChange(starIndex)}>
                  <span
                    className={filled ? 'text-yellow-400' : 'text-gray-400'}>
                    ★
                  </span>
                </button>
              );
            })}
          </div>
        </>
      );
    }
    default:
      return null;
  }
}
