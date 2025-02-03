import {
  ElementConfigProps,
  ENUM_PROPERTIES_COMPONENTS
} from '../../interfaces';
import Styling from './Styling/Styling';
import PropertyInput from './PropertyInput';
import AsInput from './AsInput';

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
  }
};
