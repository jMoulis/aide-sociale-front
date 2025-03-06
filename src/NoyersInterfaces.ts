export type UserRole = 'parent' | 'educator' | 'partner' | 'admin';
export type ChildStatus = 'pending' | 'admitted' | 'refused';
export type AdmissionStatus = 'contact' | 'visit' | 'trial' | 'accepted' | 'refused';
export type PlanningType = 'presence' | 'activity' | 'appointment';
export type InvoiceStatus = 'pending' | 'paid';

export interface IUser {
  _id: string;
  clerkId: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChild {
  _id: string;
  name: string;
  birthDate: Date;
  parentIds: string[];
  admissionId?: string;
  projectId?: string;
  status: ChildStatus;
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdmission {
  _id: string;
  childId: string;
  status: AdmissionStatus;
  stepsCompleted: string[];
  notes?: string;
  authorId: string;
  startedAt: Date;
  completedAt?: Date;
  updatedAt: Date;
}

export interface IEducationalProject {
  _id: string;
  childId: string;
  objectives: string[];
  activities: string[];
  evaluationNotes?: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlanning {
  _id: string;
  date: Date;
  childId: string;
  educatorId: string;
  partnerId?: string;
  type: PlanningType;
  notes?: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInvoice {
  _id: string;
  familyId: string;
  childId: string;
  amount: number;
  period: { start: Date; end: Date };
  pdfUrl: string;
  status: InvoiceStatus;
  issuedAt: Date;
  paidAt?: Date;
  authorId: string;
}
