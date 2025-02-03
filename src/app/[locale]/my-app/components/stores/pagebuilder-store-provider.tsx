'use client';

import { createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import {
  PageBuilderState,
  type PageBuilderStore,
  createPageBuilderStore
} from './pagebuilder-store';

export type PageBuilderStoreApi = ReturnType<typeof createPageBuilderStore>;

export const PageBuilderStoreContext = createContext<
  PageBuilderStoreApi | undefined
>(undefined);

export type PagebuilderStoreProviderProps =
  React.PropsWithChildren<PageBuilderState>;

export const PagebuilderProvider = ({
  children,
  ...props
}: PagebuilderStoreProviderProps) => {
  const storeRef = useRef<PageBuilderStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createPageBuilderStore(props);
  }

  return (
    <PageBuilderStoreContext.Provider value={storeRef.current}>
      {children}
    </PageBuilderStoreContext.Provider>
  );
};

export const usePageBuilderStore = <T,>(
  selector: (store: PageBuilderStore) => T
): T => {
  const counterStoreContext = useContext(PageBuilderStoreContext);

  if (!counterStoreContext) {
    throw new Error(
      `usePagebuilderStore must be used within PageBuilderStoreProvider`
    );
  }

  return useStore(counterStoreContext, selector);
};
