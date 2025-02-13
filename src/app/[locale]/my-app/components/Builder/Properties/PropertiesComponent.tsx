import {
  ElementConfigProps,
  ENUM_PROPERTIES_COMPONENTS
} from '../../interfaces';
import Styling from './Styling/Styling';
import PropertyInput from './PropertyInput';
import AsInput from './AsInput';
import Dataset from './Dataset/Dataset';
import GenericInput from './GenericInput';
import OptionsLink from './OptionsLink/OptionsLink';

export const PropertiesComponent: {
  [key: string]: React.FC<{
    config: ElementConfigProps;
  }>;
} = {
  [ENUM_PROPERTIES_COMPONENTS.INPUT]: (props) => {
    return <PropertyInput {...props} />;
  },
  [ENUM_PROPERTIES_COMPONENTS.STYLING]: (props) => {
    return <Styling {...props} />;
  },
  [ENUM_PROPERTIES_COMPONENTS.AS]: (props) => {
    return <AsInput {...props} />;
  },
  [ENUM_PROPERTIES_COMPONENTS.DATASET]: (props) => {
    return <Dataset {...props} />;
  },
  [ENUM_PROPERTIES_COMPONENTS.GENERIC_INPUT]: (props) => {
    return <GenericInput {...props} />;
  },
  [ENUM_PROPERTIES_COMPONENTS.LINK_OPTIONS]: OptionsLink
};
