import { IVDOMNode } from "@/app/[locale]/my-app/components/interfaces";
import { ActionKey, ENUM_ACTIONS } from "./enums";
import { TemplateDiff } from "../TemplateBuilder/interfaces";

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
export interface ICollection {
  _id: string;
  name: string;
  createdBy?: IUserSummary;
  createdAt: Date;
  organizationId: string;
  fields: string[];
  templates: string[];
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
}

export interface IPage {
  _id: string;
  name: string;
  organizationId: string;
  subPages: IPage[];
  parentId?: string;
  createdAt: Date;
  updatedAt?: Date;
  masterTemplates: string[];
  route: string;
  websiteId: string;
  roles: string[];
  props?: {
    style?: string;
  };
}
export interface IPageTemplateVersion {
  _id: string;
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
}
export interface IWebsite {
  _id: string;
  name: string;
  organizationId: string;
  createdAt: Date;
  updatedAt?: Date;
  pages: IPage[];
  tailwindConfig?: string;
  stylesheets?: string[];
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

