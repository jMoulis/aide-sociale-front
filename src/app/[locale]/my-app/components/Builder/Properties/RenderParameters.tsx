import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import DefaultParameters from './DefaultParameters';
import { PropertiesComponent } from './PropertiesComponent';

function RenderParameters() {
  const elementConfig = usePageBuilderStore((state) => state.elementConfig);

  if (!elementConfig) return null;
  return (
    <div>
      <DefaultParameters />
      {elementConfig?.parameters &&
        elementConfig.parameters.map((config, key) => {
          const PropertyComponent = PropertiesComponent[config.component];
          if (!PropertyComponent) return null;
          return (
            <div className='my-4' key={key}>
              <PropertyComponent config={config} />
            </div>
          );
        })}
    </div>
  );
}
export default RenderParameters;
