import { VDOMContext, VDOMProps } from "@/lib/interfaces/interfaces";


export enum ENUM_COMPONENTS {
  BLOCK = 'BLOCK',
  BUTTON = 'BUTTON',
  CHECKBOX = 'CHECKBOX',
  COLOR = 'COLOR',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  DATERANGE = 'DATERANGE',
  EMAIL = 'EMAIL',
  FILE = 'FILE',
  FORM = 'FORM',
  INPUT = 'INPUT',
  NUMERIC = 'NUMERIC',
  RADIO = 'RADIO',
  RANGE = 'RANGE',
  RATING = 'RATING',
  REPEAT = 'REPEAT',
  SELECT = 'SELECT',
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  TIME = 'TIME',
  TOGGLE = 'TOGGLE',

  // temp
  ROW = 'ROW',
  COLUMN = 'COLUMN',
  COMPONENT = 'COMPONENT',
  SIDEBAR_ITEM = 'SIDEBAR_ITEM',

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
  path?: string[];
  children: IVDOMNode[];
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
  options?: ('SELECT_COLLECTION' | 'FIELDS' | 'CREATE' | 'ROUTE_PARAM')[];
}
export interface IElementConfig {
  _id: string;
  inline?: boolean;
  label: string;
  type: ENUM_COMPONENTS;
  parameters?: ElementConfigProps[];
  vdom: IVDOMNode;
}

