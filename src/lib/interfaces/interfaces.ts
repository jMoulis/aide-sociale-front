import { ENUM_ACTIONS } from "./enums";

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

export interface IRole {
  _id: string;
  name: string;
  description: string;
  permissions?: Record<string, ENUM_ACTIONS[]>;
  key: string;
  organizationId: string;
}

export interface ITeamSummary {
  _id: string;
  name: string;
}