import {
  faCalendar,
  faCalendarRange,
  faCalendarTime,
  faCheckSquare,
  faClock,
  faEnvelope,
  faFile,
  faInputNumeric,
  faInputText,
  faListDropdown,
  faListRadio,
  faStar,
  faText,
  faToggleOn
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { ENUM_FIELD_TYPE } from './interfaces';
export const fieldTypes = [
  {
    icon: faInputText,
    value: ENUM_FIELD_TYPE.INPUT,
    label: 'Text'
  },
  {
    icon: faText,
    value: ENUM_FIELD_TYPE.TEXTAREA,
    label: 'Textarea'
  },
  {
    icon: faInputNumeric,
    value: ENUM_FIELD_TYPE.NUMBER,
    label: 'Number'
  },
  {
    icon: faCalendar,
    value: ENUM_FIELD_TYPE.DATE,
    label: 'Date'
  },
  {
    icon: faListDropdown,
    value: ENUM_FIELD_TYPE.SELECT,
    label: 'Select'
  },
  {
    icon: faListRadio,
    value: ENUM_FIELD_TYPE.RADIO,
    label: 'Radio'
  },
  {
    icon: faCheckSquare,
    value: ENUM_FIELD_TYPE.CHECKBOX,
    label: 'Checkbox'
  },
  {
    icon: faText,
    value: ENUM_FIELD_TYPE.TEXT,
    label: 'Text'
  },
  {
    icon: faStar,
    value: ENUM_FIELD_TYPE.RATING,
    label: 'Rating'
  },
  {
    icon: faEnvelope,
    value: ENUM_FIELD_TYPE.EMAIL,
    label: 'Email'
  },
  {
    icon: faFile,
    value: ENUM_FIELD_TYPE.FILE,
    label: 'File'
  },
  {
    icon: faToggleOn,
    value: ENUM_FIELD_TYPE.TOGGLE,
    label: 'Toggle'
  },
  {
    icon: faListDropdown,
    value: ENUM_FIELD_TYPE.MULTISELECT,
    label: 'Multiselect'
  },
  {
    icon: faListDropdown,
    value: ENUM_FIELD_TYPE.COLOR,
    label: 'Color'
  },
  {
    icon: faCalendarTime,
    value: ENUM_FIELD_TYPE.DATETIME,
    label: 'Datetime'
  },
  {
    icon: faCalendarRange,
    value: ENUM_FIELD_TYPE.DATERANGE,
    label: 'Daterange'
  },
  {
    icon: faInputNumeric,
    value: ENUM_FIELD_TYPE.RANGE,
    label: 'Range'
  },
  {
    icon: faClock,
    value: ENUM_FIELD_TYPE.TIME,
    label: 'Time'
  }
];
