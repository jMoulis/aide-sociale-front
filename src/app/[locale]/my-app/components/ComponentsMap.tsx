import Input from '@/components/form/Input';
import { ENUM_COMPONENTS, IVDOMNode } from './interfaces';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import { RenderElement } from './RenderElement';

export const ComponentsMap: {
  [key: string]: React.FC<{
    onClick: (event: any) => void;
    baseClass?: string;
    selectedClass?: string;
    gridDisplayClass?: string;
    node: IVDOMNode;
    isSelected?: boolean;
  }>;
} = {
  [ENUM_COMPONENTS.TEXT]: ({
    onClick,
    baseClass,
    selectedClass,
    gridDisplayClass,
    node
  }) => (
    <p
      onClick={onClick}
      className={`${baseClass} ${selectedClass} ${gridDisplayClass}`}>
      {node.props?.textContent || 'Text'}
    </p>
  ),
  [ENUM_COMPONENTS.INPUT]: ({
    onClick,
    baseClass,
    selectedClass,
    gridDisplayClass,
    node
  }) => (
    <Input
      onClick={onClick}
      className={`${node.component} ${baseClass} ${selectedClass} ${gridDisplayClass}`}
      placeholder={node.props?.placeholder}
      // disabled={designMode}
    />
  ),
  [ENUM_COMPONENTS.BLOCK]: ({
    onClick,
    baseClass,
    selectedClass,
    gridDisplayClass,
    node
  }) => {
    return (
      <div
        onClick={onClick}
        className={`${baseClass} ${selectedClass} ${gridDisplayClass} p-1`}>
        {!node.children?.length ? (
          <span className='text-gray-400 text-sm italic'>Block</span>
        ) : (
          (node.children || []).map((child) => (
            <RenderElement key={child._id} node={child} />
          ))
        )}
      </div>
    );
  },
  [ENUM_COMPONENTS.FIELD_INPUT]: ({
    onClick,
    baseClass,
    selectedClass,
    gridDisplayClass,
    node,
    isSelected
  }) => (
    <FormField
      onClick={onClick}
      className={`${isSelected ? 'p-1' : ''} ${
        node.component
      } ${baseClass} ${selectedClass} ${gridDisplayClass}`}>
      <FormLabel>{node.props?.textContent}</FormLabel>
      <Input
        className={`${node.component}`}
        placeholder={node.props?.placeholder}
        // disabled={designMode}
      />
    </FormField>
  )
};
