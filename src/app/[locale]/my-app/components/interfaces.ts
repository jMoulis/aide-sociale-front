import { VDOMContext, VDOMProps } from "@/lib/interfaces/interfaces";


export enum ENUM_COMPONENTS {
  TEXT = 'TEXT',
  INPUT = 'INPUT',
  BLOCK = 'BLOCK',
  FIELD_INPUT = 'FIELD_INPUT',
  FORM = 'FORM',
  BUTTON = 'BUTTON',
  REPEAT = 'REPEAT',
}

export enum ENUM_PROPERTIES_COMPONENTS {
  INPUT = 'INPUT',
  STYLING = 'STYLING',
  AS = 'AS',
  DATASET = 'DATASET',
  GENERIC_INPUT = 'GENERIC_INPUT',
}
export interface IVDOMNode {
  _id: string;
  inline?: boolean;
  type: ENUM_COMPONENTS;
  context: VDOMContext;
  props: VDOMProps
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
  context: boolean;
}
export interface IElementConfig {
  _id: string;
  inline?: boolean;
  label: string;
  type: ENUM_COMPONENTS;
  parameters?: ElementConfigProps[];
  vdom: IVDOMNode;
}

