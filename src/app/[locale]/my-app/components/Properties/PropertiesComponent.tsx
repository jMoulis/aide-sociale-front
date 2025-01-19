import { ElementConfigProps, ENUM_PROPERTIES_COMPONENTS } from '../interfaces';
import Styling from './Styling';
import PropertyInput from './PropertyInput';

export const PropertiesComponent: {
  [key: string]: React.FC<{
    config: ElementConfigProps;
    organizationId: string;
  }>;
} = {
  [ENUM_PROPERTIES_COMPONENTS.INPUT]: (props) => {
    return <PropertyInput {...props} />;
  },
  [ENUM_PROPERTIES_COMPONENTS.STYLING]: (props) => {
    return <Styling {...props} />;
  }
};
