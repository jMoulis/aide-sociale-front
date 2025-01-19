import { usePageBuilderStore } from '../usePageBuilderStore';
import { PropertiesComponent } from './PropertiesComponent';

function RenderProperties() {
  const elementConfig = usePageBuilderStore((state) => state.elementConfig);
  const organizationId = usePageBuilderStore((state) => state.organizationId);

  if (!elementConfig || !organizationId) return null;
  return (
    <div>
      {elementConfig?.props &&
        elementConfig.props.map((config, key) => {
          const PropertyComponent = PropertiesComponent[config.component];
          if (!PropertyComponent) return null;
          return (
            <div className='my-4' key={key}>
              <PropertyComponent
                config={config}
                organizationId={organizationId}
              />
            </div>
          );
        })}
    </div>
  );
}
export default RenderProperties;
