import {
  ElementConfigProps,
  ENUM_PROPERTIES_COMPONENTS
} from '../../interfaces';
import Styling from './Styling/Styling';
import PropertyInput from './PropertyInput';
import AsInput from './AsInput';
import GenericInput from './GenericInput';
import OptionsLink from './OptionsLink/OptionsLink';
import AiFormPrompt from './AiFormPrompt/AiFormPrompt';
import { aiFormInitialMessage } from '@/lib/TemplateBuilder/AiPromptTemplate/aiFormInstructions';
import Datasets from './Dataset/Datasets';

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
    return <Datasets {...props} />;
  },
  [ENUM_PROPERTIES_COMPONENTS.GENERIC_INPUT]: (props) => {
    return <GenericInput {...props} />;
  },
  [ENUM_PROPERTIES_COMPONENTS.LINK_OPTIONS]: OptionsLink,
  [ENUM_PROPERTIES_COMPONENTS.AI_FORM]: (props) => (
    <AiFormPrompt {...props} aiInitMessage={aiFormInitialMessage} />
  )
};
