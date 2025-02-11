import { ActionKey } from "../interfaces/enums";
import { IPageTemplateVersion, IUserSummary } from "../interfaces/interfaces";

export enum ENUM_FIELD_TYPE {
  TEXT = 'text',
  INPUT = 'input',
  NUMBER = 'number',
  DATE = 'date',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  TEXTAREA = 'textarea',
  EMAIL = 'email',
  FILE = 'file',
  RANGE = 'range',
  TOGGLE = 'toggle',
  MULTISELECT = 'multiselect',
  COLOR = 'color',
  DATETIME = 'datetime',
  DATERANGE = 'daterange',
  RATING = 'rating',
  TIME = 'time',
  FORM = 'form',
}
export type OptionsSourceType = 'static' | 'database' | 'template';

export interface IMasterTemplate {
  _id: string;
  title: string;
  description?: string;
  latestVersion: number;
  publishedVersion: IPageTemplateVersion | null;
  createdBy: IUserSummary | null;
  organizationId: string;
  createdAt: Date;
  forceUpdate?: boolean;
  mandatoryPermissions?: ActionKey[];
  roles?: string[];
}
export interface IFormField {
  id: string
  name: string
  label: string
  type: ENUM_FIELD_TYPE
  required?: boolean
  options?: string[]
  description?: string
  placeholder?: string
  optionsSourceType?: OptionsSourceType;       // 'static' (default) or 'database'
  // If optionsSourceType === 'database', we might specify:
  collectionName?: string;
  labelField?: string;
  valueField?: string;
  connectedFieldId?: string;
  connectedTemplateId?: string;
  max?: number;
  min?: number;
  step?: number;
  blocks?: IFormBlock[];
}

export type BlockLayout = 'single-column' | 'two-column' | 'three-column'

export interface IFormBlock {
  id: string
  layout: BlockLayout
  title: string
  fields: IFormField[]
}

export interface ITemplateListItem {
  id: string;
  blocks: IFormBlock[];
}
export interface IFormTemplate {
  _id: string;
  summaryAiAction?: string;
  masterId?: string;
  version: number;
  globalCollectionName?: string;
  title: string;
  blocks: IFormBlock[];
  createdBy: IUserSummary | null;
  createdAt: Date;
  organizationId?: string;
  updatedAt?: Date;
  changedBy?: IUserSummary | null;
  diff?: TemplateDiff;
  published?: boolean;
  hasBeenPublished?: boolean;
  forceUpdate?: boolean;
  templateListItem?: { title: string, _id: string, version: number } | null;
  parentsTemplateIds?: string[];
}

export interface IFormData {
  data: Record<string, any>;
  archivedData?: Record<string, any>;
  _id: string;
  createdAt: Date;
  createdBy: IUserSummary | null;
  organizationId: string;
  updatedAt: Date;
  beneficiaryId?: string;
  institutionId?: string;
  categoryId: string;
  templateVersionId: string;
  templateVersionNumber: number;
}

export interface TemplateDiff {
  templateId: string;
  oldVersion: number;
  newVersion: number;
  changedBy?: IUserSummary | null;    // from newVersion.changedBy
  timestamp: Date;      // from newVersion.createdAt
  blocks: {
    added: IFormBlock[];
    removed: IFormBlock[];
    changed: BlockChange[];
  };
}

// "changed" entry for a block
export interface BlockChange {
  blockId: string;
  changedProperties?: PropertyChange[];  // e.g. block.title changed
  changedBy?: IUserSummary | null; // <--- newly added
  changedAt?: Date;
  fields?: {
    added: IFormField[];
    removed: IFormField[];
    changed: FieldChange[];
  };
}

export interface PropertyChange {
  key: string;         // e.g. "title", "layout"
  oldValue: any;
  newValue: any;   // same as newVersion.changedBy, or you could track it per property
}

export interface FieldChange {
  fieldId: string;
  changedProperties: PropertyChange[];
  changedBy?: IUserSummary | null; // <--- newly added
  changedAt?: Date;
}


export interface IDraftAlert {
  template: IFormTemplate;
  create: () => Promise<void>;
  edit: () => void;
}

export type CustomDiffResult = {
  label: string;
  name: string;
  description?: string;
};

export interface ITrackChangeItem {
  message: string; // e.g. "Julien added Block ID=xxx"
  changedBy?: IUserSummary | null; // e.g. user name or ID
  changedAt?: Date; // e.g. date/time string
}