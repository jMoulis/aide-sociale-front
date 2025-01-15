import {
  ChangeEvent,
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import client from '../initMongoClient';
import { IFacets, IFacetsConfig } from '../interfaces';
import MongoRealtimeClient from '../clients/MongoRealtimeClient';

type MongoSearchContextType<T> = {
  suggestions: T[];
  autocompleteTerm: string;
  onAutocompleteTermChange: Dispatch<SetStateAction<string>>;
  onFetchFacets: () => void;
  onInputSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFacetFilter: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name?: string; value?: string; checked?: boolean } }
  ) => void;
  onFetchData: () => void;
  onSuggestionsInit: (index: string, path: string) => void;
  onClearFilters: () => void;
  onSubmitSearch: () => void;
  initFacets: (config: any, facetIndex: string) => void;
  initHits: (index: string | null) => void;
  refresh: () => void;
  initSearch: (index: string) => void;
  onResetSearch: () => void;
  facets: IFacets[];
  hits: T[];
  searchTerm?: string;
  client: MongoRealtimeClient;
  facetsStatus?: Status;
  hitsStatus?: Status;
  suggestionsStatus?: Status;
  filters: { [key: string]: string[] };
  facetsConfig: { config: IFacetsConfig; index: string } | null;
};

export const defaultSearchContextProps = {
  suggestions: [],
  autocompleteTerm: '',
  onAutocompleteTermChange: () => {},
  onFetchFacets: () => {},
  onFacetFilter: () => {},
  onSuggestionsInit: () => {},
  onFetchData: () => {},
  onClearFilters: () => {},
  onInputSearch: () => {},
  onSubmitSearch: () => {},
  refresh: () => {},
  initFacets: () => {},
  initHits: () => {},
  initSearch: () => {},
  onResetSearch: () => {},
  facets: [],
  hits: [],
  searchTerm: '',
  client,
  filters: {},
  facetsConfig: null
};
export const MongoSearchContext = createContext<MongoSearchContextType<any>>(
  defaultSearchContextProps
);
type Status = {
  status: boolean;
  error: string | null;
};
const defaultStatus = {
  status: false,
  error: null
};
type Props = {
  children: React.ReactNode;
  collection: string | any;
  searchFilters?: { [key: string]: string };
};
function MongoSearchProvider<T>({
  children,
  collection,
  searchFilters
}: Props) {
  const [autocompleteTerm, setAutocompleteTerm] = useState<string>('');
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [facets, setFacets] = useState<IFacets[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
  const [hits, setHits] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [facetsStatus, setFacetsStatus] = useState<Status>(defaultStatus);
  const [hitsStatus, setHitsStatus] = useState<Status>(defaultStatus);
  const [initFilterStatus, setInitFilterStatus] = useState<'unset' | 'set'>(
    'unset'
  );
  const [hitsIndex, setHitsIndex] = useState<string | null>(null);
  const [searchIndex, setSearchIndex] = useState<string | null>(null);
  const [suggestionsStatus, setSuggestionsStatus] =
    useState<Status>(defaultStatus);
  const [facetsConfig, setFacetsConfig] = useState<{
    config: IFacetsConfig;
    index: string;
  } | null>(null);

  const [suggestionConfig, setSuggestionConfig] = useState<{
    path: string;
    index: string;
  } | null>(null);

  const onFetchFacets = useCallback(async () => {
    if (!facetsConfig?.config) return;
    try {
      setFacetsStatus({
        status: true,
        error: null
      });
      const query = [
        {
          $searchMeta: {
            index: facetsConfig.index,
            facet: facetsConfig.config
          }
        }
      ];

      const { data } = await client.search<IFacets>(collection, query);

      setFacets(data || []);

      setFacetsStatus({
        status: false,
        error: null
      });
    } catch (error: any) {
      setFacetsStatus({
        status: false,
        error: error.message
      });
    }
  }, [collection, facetsConfig]);

  const handleSuggestions = useCallback(
    async (term: string) => {
      if (!suggestionConfig) return;

      try {
        setSuggestionsStatus({
          status: true,
          error: null
        });
        const { data: suggestions } = await client.search<any>(collection, [
          {
            $search: {
              index: suggestionConfig?.index,
              autocomplete: {
                path: suggestionConfig?.path,
                query: term,
                fuzzy: {
                  maxEdits: 1
                }
              }
            }
          }
        ]);
        setSuggestions(suggestions || []);
        setSuggestionsStatus({
          status: false,
          error: null
        });
      } catch (error: any) {
        setSuggestionsStatus({
          status: false,
          error: error.message
        });
      }
    },
    [collection, suggestionConfig]
  );

  const onFacetFilter = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | { target: { name?: string; value?: string; checked?: boolean } }
    ) => {
      const { name, value, checked } = e.target;
      if (!name || !value) return;
      const path = name.replace('Facet', '');
      setInitFilterStatus('set');

      if (checked) {
        setFilters((prevFilters) => {
          const prevFilter = prevFilters[path] || [];
          return {
            ...prevFilters,
            [path]: [...prevFilter, value]
          };
        });
      } else {
        setFilters((prevFilters) => {
          const prevFilter = prevFilters[path] || [];
          return {
            ...prevFilters,
            [path]: prevFilter.filter((f: string) => f !== value)
          };
        });
      }
    },
    []
  );

  const onFetchData = useCallback(async () => {
    try {
      setHitsStatus({
        status: true,
        error: null
      });
      client.onSnapshotList<T>(collection, searchFilters ?? {}, (data) => {
        setHits(data || []);
        setHitsStatus({
          status: false,
          error: null
        });
      });
      // if (error) {
      //   throw new Error(error);
      // }
      // setHits(data || []);
      // setHitsStatus({
      //   status: false,
      //   error: null
      // });
    } catch (error: any) {
      setHitsStatus({
        status: false,
        error: error.message
      });
    }
  }, [collection, searchFilters]);

  const initFacets = useCallback((config: any, facetIndex: string) => {
    setFacetsConfig({ config, index: facetIndex });
  }, []);

  const onSuggestionsInit = useCallback(async (index: string, path: string) => {
    setSuggestionConfig({ index, path });
  }, []);

  const onClearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const onInputSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const onSubmitSearch = useCallback(async () => {
    if (!searchIndex) return;

    const { data } = await client.search(collection, [
      {
        $search: {
          index: searchIndex,
          text: {
            query: searchTerm,
            path: {
              wildcard: '*'
            },
            fuzzy: {
              maxEdits: 2,
              prefixLength: 0,
              maxExpansions: 50
            }
          }
        }
      }
    ]);
    setHits(data || []);
  }, [searchIndex, collection, searchTerm]);

  const onResetSearch = useCallback(() => {
    setSearchTerm('');
    onFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(() => {
    onFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!autocompleteTerm) return;
    if (autocompleteTerm) {
      handleSuggestions(autocompleteTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autocompleteTerm]);

  useEffect(() => {
    if (initFilterStatus === 'unset') return;
    const compoundFilters = Object.keys(filters).reduce((acc: any, key) => {
      if (filters[key].length === 0) return acc;
      return [
        ...acc,
        {
          text: {
            query: filters[key],
            path: key
          }
        }
      ];
    }, []);
    if (compoundFilters.length === 0) {
      onFetchData();
      return;
    }

    const query = [
      {
        $search: {
          index: searchIndex || 'default',
          compound: {
            filter: compoundFilters
          }
        }
      }
    ];
    client.search(collection, query).then(({ data }) => setHits(data || []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, collection, searchIndex]);

  useEffect(() => {
    if (hitsIndex) {
      onFetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hitsIndex]);
  return (
    <MongoSearchContext.Provider
      value={{
        onAutocompleteTermChange: setAutocompleteTerm,
        onFetchFacets,
        onFacetFilter,
        onFetchData,
        onSuggestionsInit,
        onClearFilters,
        onInputSearch,
        onSubmitSearch,
        refresh,
        initFacets,
        initHits: setHitsIndex,
        initSearch: setSearchIndex,
        onResetSearch,
        autocompleteTerm,
        suggestions,
        facets,
        hits,
        searchTerm,
        client,
        facetsStatus,
        hitsStatus,
        suggestionsStatus,
        filters,
        facetsConfig
      }}>
      {children}
    </MongoSearchContext.Provider>
  );
}

export const useMongoSearch: <T = any>() => MongoSearchContextType<T> = () => {
  const context = useContext(MongoSearchContext);
  if (context === undefined) {
    throw new Error('useMongoSearch must be used within a MongoSearchProvider');
  }
  return context;
};
export default MongoSearchProvider;
