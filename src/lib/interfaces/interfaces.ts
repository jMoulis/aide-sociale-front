import { ActionKey, ENUM_ACTIONS } from "./enums";

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
  institutionId?: string;
  teams?: ITeamSummary[];
  dateOfBirth?: Date;
  createdAt: Date;
  updatedAt?: Date;
  gender?: string;
}
export interface IRessource {
  _id: string;
  name: string;
  description: string;
  mandatoryPermissions: ActionKey[];
  fields: string[];
}
export interface IRole {
  _id: string;
  name: string;
  description: string;
  permissions?: Record<string, ENUM_ACTIONS[]>;
  key: string;
  organizationId: string;
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

export interface ITeamSummary {
  _id: string;
  name: string;
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
  id: string;
  name: string; // Structure name
  type: "family" | "foster_home" | "specialized_center"; // Type of structure
  capacity: number; // Total capacity of the structure
  occupied: number; // Number of occupied places
  organizationId: string; // Linked organization
  departmentId: string; // Department overseeing the structure
  placements: IPlacementHistory[]; // Placement history for the structure
  tasks: ITask[]; // Tasks associated with the structure
  modifications?: IModification[]; // History of changes
}
export interface IOrganization {
  _id: string;
  name: string; // Organization name
  structures: IStructure[]; // Linked structures
  department: string; // Department overseeing the organization
  createdAt: Date; // Date of creation
  modifications?: IModification[]; // History of changes
}