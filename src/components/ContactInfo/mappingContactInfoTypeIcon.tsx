import {
  faEnvelope,
  faGlobe,
  faNetworkWired,
  faPhone
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export const mappingContactInfoTypeIcon: {
  [key: string]: IconDefinition;
} = {
  phone: faPhone,
  email: faEnvelope,
  website: faGlobe,
  social: faNetworkWired
};
