import { ICollection, IDataset, IStore } from "@/lib/interfaces/interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ElementConfigProps, IVDOMNode } from "../../../interfaces";
import { useTranslations } from "next-intl";
import { useProperties } from "../useProperties";
import client from "@/lib/mongo/initMongoClient";
import { ENUM_COLLECTIONS } from "@/lib/mongo/interfaces";
import { usePageBuilderStore } from "../../../stores/pagebuilder-store-provider";

// function findClosestFormParent(
//   vdom: IVDOMNode,
//   targetId: string,
//   searchType: ENUM_COMPONENTS
// ): IVDOMNode | null {
//   const parentMap = new Map<string, IVDOMNode>();
//   function buildParentMap(node: IVDOMNode, parent: IVDOMNode | null = null) {
//     if (parent) {
//       parentMap.set(node._id, parent);
//     }
//     node?.children?.forEach((child) => buildParentMap(child, node));
//   }

//   // Step 1: Build parent references
//   buildParentMap(vdom);

//   // Step 2: Traverse up to find the closest FORM parent
//   let current = parentMap.get(targetId);
//   while (current) {
//     if (current.type === searchType) {
//       return current;
//     }
//     current = parentMap.get(current._id);
//   }

//   return null;
// }

type Props = {
  config: ElementConfigProps;
  datasetKey: 'input' | 'output';
};
export const useDataset = ({ config, datasetKey }: Props) => {
  const [collections, setCollections] = useState<Record<string, ICollection>>(
    {}
  );
  const [collectionsSelectedCollection, setCollectionsSelectedCollection] =
    useState<ICollection | null>(null);

  const organizationId = usePageBuilderStore((state) => state.organizationId);

  const tTemplate = useTranslations('TemplateSection');
  const pageTemplateVersion = usePageBuilderStore((state) => state.pageVersion);
  const page = usePageBuilderStore((state) => state.selectedPage);
  const [stores, setStores] = useState<IStore[]>(pageTemplateVersion?.stores || []);


  const optionsSourceTypes = useMemo(
    () => [
      {
        value: 'database',
        label: tTemplate('databaseOptions')
      },
      {
        value: 'static',
        label: tTemplate('staticOptions')
      },
      {
        value: 'template',
        label: tTemplate('template')
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const {
    value: currentValue,
    selectedNode
  }: {
    value: IDataset | null;
    vdom: IVDOMNode | null;
    selectedNode: IVDOMNode | null;
  } = useProperties({ config });

  useEffect(() => {
    setStores(pageTemplateVersion?.stores || []);
  }, [pageTemplateVersion?.stores]);

  const fetchCollections = useCallback(async () => {
    const { data } = await client.list<ICollection>(
      ENUM_COLLECTIONS.COLLECTIONS,
      {
        $or: [
          { organizationId },
          { system: true }
        ]
      }
    );
    if (!data) return;
    const collectionsAsMap = data.reduce(
      (acc: Record<string, ICollection>, collection) => {
        acc[collection.slug] = collection;
        return acc;
      },
      {}
    );
    setCollections(collectionsAsMap);
  }, [organizationId]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  useEffect(() => {
    let collection: ICollection | null = null;
    if (!pageTemplateVersion?._id) return;

    const datasetItem = currentValue?.connexion?.[datasetKey];
    if (datasetItem?.storeSlug) {
      const store = stores.find(store => store.slug === datasetItem?.storeSlug);
      if (!store?.collection?.name) {
        return;
      }
      collection = collections[store.collection.slug];
    }
    setCollectionsSelectedCollection(collection);
  }, [collections, pageTemplateVersion?._id, datasetKey, stores, currentValue?.connexion]);

  return {
    collections,
    collectionsSelectedCollection,
    optionsSourceTypes,
    currentValue,
    selectedNode,
    pageTemplateVersion,
    page
  }
}