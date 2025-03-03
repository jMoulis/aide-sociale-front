import {
  fa1,
  faA,
  faCalendar,
  faCheck,
  faList,
  faObjectGroup
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export const mappingFielTypeIcons: { [key: string]: IconDefinition } = {
  object: faObjectGroup,
  date: faCalendar,
  string: faA,
  number: fa1,
  boolean: faCheck,
  array: faList
};
