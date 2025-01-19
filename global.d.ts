import fr from './messages/fr.json';

type Messages = typeof fr;

declare global {
  // Use type safe message keys with `next-intl`
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages { }
}

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    onFetchData?: () => Promise<void>;
    onSelectPermissions?: (
      ressourceName: string,
      action: ENUM_ACTIONS,
      checkState: boolean | 'indeterminate'
    ) => void;
    permissions?: Record<string, string[]>;
  }
}

export { }

// Create a type for the roles
export type Roles = 'admin' | 'moderator'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      organizationId: string;
    }
  }
  interface UserPublicMetadata {
    organizationId?: string;
  }
}