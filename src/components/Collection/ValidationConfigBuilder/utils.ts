import { SchemaType } from "@/lib/interfaces/interfaces";

export const propertiesOptions: { label: string; value: SchemaType }[] = [
  {
    label: 'string',
    value: 'string'
  },
  {
    label: 'number',
    value: 'number'
  },
  {
    label: 'boolean',
    value: 'boolean'
  },
  {
    label: 'object',
    value: 'object'
  },
  {
    label: 'array',
    value: 'array'
  },
  {
    label: 'date',
    value: 'date'
  }
];
