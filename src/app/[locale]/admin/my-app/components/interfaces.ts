import { VDOMContext, VDOMProps } from "@/lib/interfaces/interfaces";


export enum ENUM_COMPONENTS {
  BLOCK = 'BLOCK',
  BUTTON = 'BUTTON',
  CHECKBOX = 'CHECKBOX',
  COLLAPSE = 'COLLAPSE',
  COLLAPSECONTENT = 'COLLAPSECONTENT',
  COLLAPSETRIGGER = 'COLLAPSETRIGGER',
  COLOR = 'COLOR',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  DATERANGE = 'DATERANGE',
  DIALOG = 'DIALOG',
  DIALOGTRIGGER = 'DIALOGTRIGGER',
  DIALOGCONTENT = 'DIALOGCONTENT',
  EMAIL = 'EMAIL',
  FILE = 'FILE',
  FORM = 'FORM',
  INPUT = 'INPUT',
  IMAGE = 'IMAGE',
  LINK = "LINK",
  MULTICHOICES = "MULTICHOICES",
  NUMERIC = 'NUMERIC',
  RADIO = 'RADIO',
  RANGE = 'RANGE',
  RATING = 'RATING',
  LIST = 'LIST',
  SCHEDULER = 'SCHEDULER',
  SCHEDULER_FORM = 'SCHEDULER_FORM',
  SELECT = 'SELECT',
  TABLE = 'TABLE',
  TABS = 'TABS',
  TABSLIST = 'TABSLIST',
  TABSCONTENT = 'TABSCONTENT',
  TABSTRIGGER = 'TABSTRIGGER',
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  TIME = 'TIME',
  TOGGLE = 'TOGGLE',
}

export enum ENUM_PROPERTIES_COMPONENTS {
  INPUT = 'INPUT',
  STYLING = 'STYLING',
  AS = 'AS',
  DATASET = 'DATASET',
  GENERIC_INPUT = 'GENERIC_INPUT',
  LINK_OPTIONS = 'LINK_OPTIONS',
  AI_FORM = 'AI_FORM',
  TABLE = 'TABLE'
}
export interface IVDOMNode {
  _id: string;
  inline?: boolean;
  type: ENUM_COMPONENTS;
  name?: string;
  context: VDOMContext;
  props: VDOMProps
  path?: string[];
  children: IVDOMNode[];
  isOpen?: boolean;
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
  options?: ('SELECT_COLLECTION' | 'FIELDS' | 'CREATE' | 'ROUTE_PARAM' | 'STATIC_OPTIONS' | 'QUERY' | 'AI_FORM')[];
}
export interface IElementConfig {
  _id: string;
  inline?: boolean;
  label: string;
  type: ENUM_COMPONENTS;
  categories?: string[];
  tags?: { tag: string; types: string[], default?: boolean }[];
  instructions?: string;
  exampleHtml?: string;
  parameters?: ElementConfigProps[];
  vdom: IVDOMNode;
}

