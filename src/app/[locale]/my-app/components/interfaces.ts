import { CSSProperties } from "react";

export enum ENUM_COMPONENTS {
  TEXT = 'TEXT',
  INPUT = 'INPUT',
  BLOCK = 'BLOCK',
  FIELD_INPUT = 'FIELD_INPUT'
}

export enum ENUM_PROPERTIES_COMPONENTS {
  INPUT = 'INPUT',
  STYLING = 'STYLING',
  AS = 'AS'
}
export interface IVDOMNode {
  _id: string;
  inline?: boolean;
  type: ENUM_COMPONENTS;
  context: {
    [key: string]: any; // e.g. textContent, placeholder, className, etc.
    styling?: {
      style?: CSSProperties;
      className?: string;
    }
  }
  props: {
    [key: string]: any; // e.g. textContent, placeholder, className, etc.
    children: IVDOMNode[] | string;
  };
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
  type: ENUM_COMPONENTS;
  parameters?: ElementConfigProps[];
  vdom: IVDOMNode;
}

