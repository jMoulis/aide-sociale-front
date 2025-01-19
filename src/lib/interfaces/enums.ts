export enum ENUM_APP_ROUTES {
  ADMIN_PAGE = '/admin',
  ADMIN_ROLES = "/admin/roles",
  ADMIN_USERS = "/admin/users",
  MAIN_PAGE = '/main',
  PROFILE = '/profile',
  PROFILE_SECURITY = '/profile/security',
  FORGOT_PASSWORD = '/forgot-password',
  DASHBOARD = '/dashboard',
  SIGN_IN = '/sign-in',
  SIGN_UP = '/sign-up',
  RESSOURCES = '/admin/ressources',
  ORGANIZATIONS = '/dashboard/organization',
  DEPARTMENTS = '/dashboard/departments',
  TEMPLATES = '/admin/templates',
  COLLECTIONS = '/admin/collections',
  MY_APP = '/my-app',
  STRUCTURES = '/dashboard/structures',
  EMPLOYEES = 'employees',
}

export enum ENUM_RESSOURCES {
  ADMIN = 'admin',
  ROLES = 'roles',
  USERS = 'users',
  RESSOURCES = 'ressources',
  ORGANIZATION = 'organization',
  BENEFICIARY = 'beneficiary',
  TEAM = 'team',
  PROJECT = 'project',
  COLLECTIONS = 'collections',
  DASHBOARD = 'dashboard',

}

export enum ENUM_API_ROUTES {
  ROLES_WEBHOOK = '/api/roles-webhook',
  SIGN_UP = '/api/sign-up',
  UPLOAD_MEDIA = '/api/upload-media',
  DELETE_MEDIA = '/api/delete-media',
}

export enum ENUM_ACTIONS {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  ALL = 'ALL'
}

export type ActionKey = keyof typeof ENUM_ACTIONS;
