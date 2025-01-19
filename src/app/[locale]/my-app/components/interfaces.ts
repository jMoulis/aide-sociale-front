export enum ENUM_COMPONENTS {
  TEXT = 'TEXT',
  INPUT = 'INPUT',
  BLOCK = 'BLOCK',
  FIELD_INPUT = 'FIELD_INPUT'
}
export enum ENUM_COMPONENTS_TYPE {
  BLOCK = 'block',
  INLINE = 'inline'
}
export enum ENUM_PROPERTIES_COMPONENTS {
  INPUT = 'INPUT',
  STYLING = 'STYLING'
}
export interface IVDOMNode {
  _id: string;
  type: ENUM_COMPONENTS_TYPE;
  component: ENUM_COMPONENTS;
  props?: {
    [key: string]: any; // e.g. textContent, placeholder, className, etc.
  };
  children?: IVDOMNode[];
}
export interface RenderElementProps {
  node: IVDOMNode;
  designMode: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  gridDisplay: boolean;
}

export type ElementConfigProps = {
  label: string;
  propKey: string;
  component: ENUM_PROPERTIES_COMPONENTS;
}
export interface IElementConfig {
  _id: string;
  component: ENUM_COMPONENTS;
  type: ENUM_COMPONENTS_TYPE;
  props?: ElementConfigProps[];
}

