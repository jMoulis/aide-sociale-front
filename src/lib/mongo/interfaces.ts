export enum ENUM_COLLECTIONS {
  ROLES = 'roles',
  PERMISSIONS = 'permissions',
  USERS = 'users',
  RESSOURCES = 'ressources',
  ORGANIZATIONS = 'organizations',
  BENEFICIARIES = 'beneficiaries',
  TEAMS = 'teams',
  PROJECTS = 'projects',
  TEMPLATES = 'templates',
  TEMPLATES_MASTER = 'templates_master',
  CATEGORIES = 'categories',
  DOCUMENTS = 'documents',
  MENUS = 'menus',
  COLLECTIONS = 'collections',
  WEBSITES = 'websites',
  STRUCTURES = 'structures',
  WEB_APP_ELEMENTS = 'web-app-elements',
  PAGE_TEMPLATES = 'page-templates',
}

export interface IAutocompleteResponse<T> {
  data: T[];
  error: string | null;
}
export interface IGetResponse<T> {
  data: T | null;
  error: string | null;
}
export interface IListResponse<T> {
  data: T[];
  error: string | null;
}
export interface IDeleteResponse {
  message: string | null;
  error: string | null;
}
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface IMongoRealtimeConfig {
  baseURL: string;
}

export type FilterType = Record<string, any>;

export interface IUpsertResponse {
  result: {
    upsertedId?: { _id: string };
  };
  message: string;
}
export enum ENUM_SOCKET_EVENTS {
  UNSUBSCRIBE = 'unsubscribe',
  LISTEN_COLLECTION = 'listen-collection',
  DB_CHANGE = 'db-change',
  CHANGE_STREAM_ERROR = 'change-stream-error',
  LISTEN_DOCUMENT = 'listen-document',
}

export interface IBucket {
  _id: string;
  count: number;
}
export interface ICount {
  lowerBound: number;
}
export type FacetType = Record<string, { buckets: IBucket[] }>;


export interface IFacets {
  count: ICount;
  facet: FacetType;
};
export interface IFacetsConfig {
  facets: Record<string, { type: string; path: string }>;
}
export interface ISocketEventListenCollectionProps {
  collection: string;
  filter: Record<string, any>;
  subscriptionId: string;
  pipelineMatch?: Document[]
}