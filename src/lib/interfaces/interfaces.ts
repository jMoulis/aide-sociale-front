import { IVDOMNode } from "@/app/[locale]/admin/my-app/components/interfaces";
import { ActionKey, ENUM_ACTIONS } from "./enums";
import { TemplateDiff } from "../TemplateBuilder/interfaces";
import { CSSProperties, PropsWithChildren } from "react";
import { FormType } from "@/app/[locale]/admin/my-app/components/Builder/Components/FormContext";
import { ENUM_COLLECTIONS } from "../mongo/interfaces";

export type UserExcerpt = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  lastSignInAt: number;
  joinedAt: number;
  isBanned: boolean;
  organizationId?: string | null;
}
export interface IUserSummary {
  _id: string;
  firstName: string;
  lastName: string;
  imageUrl?: string | null;
}
export type AuthOrganization = {
  id: string;
  subDomain: string;
}
export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  email?: string;
  roles: IRole[];
  organizationId: string;
  super_admin?: boolean;
  authId?: string;
  structureId?: string;
  teams?: ITeamSummary[];
  dateOfBirth?: Date;
  createdAt: Date;
  updatedAt?: Date;
  gender?: string;
}

export interface IEmployee extends IUser {
  entryDate?: Date;
}

export interface IMenuEntry {
  label: string;
  uri: string;
  roles: string[];
}
export interface IMenu {
  _id: string;
  title: string;
  roles: string[];
  entries: IMenuEntry[];
}
export type SchemaType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date';

export interface ICollectionField {
  label: string;
  key: string;
  new?: boolean;
  system?: boolean;
  type: SchemaType;
  required?: boolean;
  // For an object type or array items of type object, define nested properties.
  fields?: ICollectionField[];
  // For arrays, you can store the type of the items.
  arrayItemType?: SchemaType;
}
export interface ICollection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  roles: string[];
  system?: boolean;
  createdBy?: IUserSummary;
  updatedBy?: IUserSummary;
  updatedAt?: Date;
  createdAt: Date;
  organizationId: string;
  fields: ICollectionField[];
  schema?: string;
}

export interface IVirtualCollection {
  _id: string;
  name: string;
  slug: string;
  fields: ICollectionField[];
  virtual: boolean;
}
export interface ICollectionSummary {
  _id: string;
  name: string;
  slug: string;
  fields: ICollectionField[];
}
export interface IDatasetConnexion {
  input?: IDatasetConnexionItem;
  output?: IDatasetConnexionItem;
  outputs?: IDatasetConnexionItem[];
}
export interface IDatasetConnexionItem {
  storeSlug?: string;
  parametersToSave?: string[];
  optionsSourceType?: 'static' | 'database';
  staticDataOptions?: string[];
  externalDataOptions?: {
    collectionSlug: string;
    labelField: string;
    valueField: string;
  };
  field?: string;
  routeParam?: string;
  query?: string;
}
export interface IDataset {
  isCreation?: boolean;
  pageTemplateVersionId: string;
  connexion?: IDatasetConnexion;
}
export type VDOMProps = {
  [key: string]: any;
}

export type LinkAttributes = {
  attr: string;
  value?: string;
  label: string,
  page?: {
    slug: string,
    route: string,
    name: string,
    routeParam?: string,
    dataset?: {
      field?: string,
      routeParam?: string
    }
  }
};
export enum ENUM_TABLE_COMPONENTS {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  DATE_RANGE = 'dateRange',
  BOOLEAN = 'boolean',
  IMAGE = 'image',
  LINK = 'link',
}
export interface ITableField extends ICollectionField {
  component: ENUM_TABLE_COMPONENTS;
  link?: LinkAttributes[];
}
export interface ITable {
  fields: ITableField[];
}
export interface IContextTableProps {
  table: ITable
}
export type VDOMContext = {
  [key: string]: any;
  styling?: {
    style?: CSSProperties;
    className?: string;
  },
  "options-link"?: LinkAttributes[];
  isBuilderMode?: boolean;
  dataset?: IDataset;
  routeParams?: Record<string, string>;
  table?: ITable;
}
export interface PropsWithChildrenAndContext extends PropsWithChildren {
  dndChildrenContainerRef?: any;
  context: VDOMContext;
  props: any;
  node: IVDOMNode;
  ref?: any

}
export interface IRessource {
  _id: string;
  name: string;
  description: string;
  mandatoryPermissions: ActionKey[];
  organizationId?: string;
  menus: IMenu[],
  route: string;
  templateId?: string;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: IUserSummary;
}
export interface IRole {
  _id: string;
  name: string;
  description: string;
  permissions?: Record<string, ENUM_ACTIONS[]>;
  key: string;
  organizationId: string;
  updatedAt?: Date;
}
export interface IRoleInput {
  _id: string;
  name: string;
  description: string;
  key: string;
  permissions?: Record<string, ENUM_ACTIONS[]>;
  organizationId?: string;
}

export interface IPermission {
  _id: string;
  name: string;
  description: string;
  key: string;
}

export interface IProject {
  _id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  teamId: string;
  organizationId: string;
  institutionId: string;
  createdAt: Date;
  updatedAt?: Date;
}
export interface IProjectSummary {
  _id: string;
  name: string;
}
export interface ITeamSummary {
  _id: string;
  name: string;
}
export interface ITeam {
  _id: string;
  name: string;
  description: string;
  organizationId: string;
  institutionId?: string;
  members: IUserSummary[];
  projects: IProjectSummary[];
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: IUserSummary;
}


export interface IModification {
  modifiedAt: Date; // Date of modification
  modifiedBy: string; // User ID of the person who made the modification
  changeDescription: string; // Description of what was changed
}
export interface IPlacementHistory {
  id: string;
  youthCaseId: string; // Linked youth case
  structureId: string; // Structure where the youth was placed
  organizationId?: string; // Optional if linked to an organization
  authorId: string; // User who created or modified the placement
  departmentId: string; // Department managing the placement
  startDate: Date; // Placement start date
  endDate?: Date; // Placement end date (if ended)
  reason?: string; // Reason for the placement
  modifications?: IModification[]; // History of changes
}
export interface ITask {
  id: string;
  associatedEntityId: string; // ID of the case, structure, or organization
  entityType: "youth_case" | "structure" | "organization"; // Type of entity linked to the task
  title: string; // Title of the task
  description: string; // Detailed description of the task
  assignedTo: string; // User ID of the staff member responsible for the task
  authorId: string; // User who created the task
  departmentId: string; // Department managing the task
  dueDate: Date; // Deadline for the task
  status: "pending" | "completed" | "overdue"; // Status of the task
  modifications?: IModification[]; // History of changes
}
export interface IStructure {
  _id: string;
  name: string; // Structure name
  description: string; // Description of the structure
  type?: "family" | "foster_home" | "specialized_center"; // Type of structure
  capacity: number; // Total capacity of the structure
  occupancy: number; // Number of occupied places
  organizationId: string; // Linked organization
  departmentId: string; // Department overseeing the structure
  placements: IPlacementHistory[]; // Placement history for the structure
  tasks: ITask[]; // Tasks associated with the structure
  modifications?: IModification[]; // History of changes
  createdAt: Date; // Date of creation
}
export interface IOrganization {
  _id: string;
  name: string; // Organization name
  structures: IStructure[]; // Linked structures
  department: string; // Department overseeing the organization
  createdAt: Date; // Date of creation
  modifications?: IModification[]; // History of changes
  addresses: IAddress[];
  contactsInfo: IContactInfo[];
  slug: string;
}

export interface IStore {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  collection?: ICollectionSummary | IVirtualCollection;
  routeParam?: string;
  type: 'list' | 'form';
}

export interface IPage {
  _id: string;
  name: string;
  slug: string;
  organizationId: string;
  parentId?: string;
  createdAt: Date;
  updatedAt?: Date;
  masterTemplateIds: string[];
  route: string;
  websiteId: string;
  position?: number;
  menus: IMenu[];
  props?: {
    style?: string;
  };
}
export interface ITreePage extends IPage {
  children: ITreePage[];
}
export interface IPageTemplateVersion {
  _id: string;
  title: string;
  description: string;
  summaryAiAction?: string;
  masterTemplateId: string;
  version: number;
  vdom: IVDOMNode;
  createdAt: Date;
  createdBy: IUserSummary | null;
  changedBy?: IUserSummary;
  diff: TemplateDiff;
  published: boolean;
  hasBeenPublished: boolean;
  forceUpdate?: boolean;
  isDirty?: boolean;
  hasUnpublishedChanges?: boolean;
  archived?: boolean;
  stores?: IStore[];
}
export interface IStylesheet {
  name: string;
  uri: string;
}
export interface IWebsite {
  _id: string;
  name: string;
  organizationId: string;
  createdAt: Date;
  updatedAt?: Date;
  tailwindConfig?: string;
  stylesheets?: IStylesheet[];
  menus: IMenu[];
  published: boolean;
  public?: boolean;
}

export interface IAddress {
  _id: string;
  label?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  coords?: {
    latitude: number;
    longitude: number;
  }
}

export interface IContactInfo {
  _id: string;
  label: string;
  value: string;
  type: string;
}

export type AsyncPayloadMap = Record<string, { store: IStore, data: FormType | FormType[] }>;

export enum ENUM_METHODS {
  update = 'update',
  create = 'create',
  delete = 'delete',
  list = 'list',
  get = 'get',
  search = 'search',
  "update-many" = 'update-many',
  "update-store" = 'update-store'
}
export type Method =
  | 'update'
  | 'create'
  | 'delete'
  | 'list'
  | 'get'
  | 'search'
  | 'update-many'
  | 'update-store';

export interface IQuery {
  method: Method;
  collection: ENUM_COLLECTIONS;
  filters?: Record<string, any>;
  updateOptions?: Record<string, any>;
  aggregateOptions?: any[];
  matchQuery?: Record<string, any>;
  upsertQuery?: Record<string, any>;
  upsertOptions?: Record<string, any>;
  output?: {
    name: string;
    operation: 'map' | 'reduce' | 'filter' | 'sort';
    input: string;
    mapper: string;
    type: 'form' | 'list';
  };
}
