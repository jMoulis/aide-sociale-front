import { ICollection, IDataset } from "@/lib/interfaces/interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ElementConfigProps, ENUM_COMPONENTS, IVDOMNode } from "../../../interfaces";
import { useTranslations } from "next-intl";
import { useProperties } from "../useProperties";
import client from "@/lib/mongo/initMongoClient";
import { ENUM_COLLECTIONS } from "@/lib/mongo/interfaces";
import { usePageBuilderStore } from "../../../stores/pagebuilder-store-provider";

function findClosestFormParent(
  vdom: IVDOMNode,
  targetId: string,
  searchType: ENUM_COMPONENTS
): IVDOMNode | null {
  const parentMap = new Map<string, IVDOMNode>();
  function buildParentMap(node: IVDOMNode, parent: IVDOMNode | null = null) {
    if (parent) {
      parentMap.set(node._id, parent);
    }
    node?.children?.forEach((child) => buildParentMap(child, node));
  }

  // Step 1: Build parent references
  buildParentMap(vdom);

  // Step 2: Traverse up to find the closest FORM parent
  let current = parentMap.get(targetId);
  while (current) {
    if (current.type === searchType) {
      return current;
    }
    current = parentMap.get(current._id);
  }

  return null;
}

type Props = {
  config: ElementConfigProps;
};
export const useDataset = ({ config }: Props) => {
  const [collections, setCollections] = useState<Record<string, ICollection>>(
    {}
  );
  const [collectionsSelectedCollection, setCollectionsSelectedCollection] =
    useState<ICollection | null>(null);

  const organizationId = usePageBuilderStore((state) => state.organizationId);

  const tTemplate = useTranslations('TemplateSection');
  const pageTemplateVersion = usePageBuilderStore((state) => state.pageVersion);
  const page = usePageBuilderStore((state) => state.selectedPage);
  const [parentForm, setParentForm] = useState<IVDOMNode | null>(null);
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
    vdom,
    selectedNode
  }: {
    value: IDataset | null;
    vdom: IVDOMNode | null;
    selectedNode: IVDOMNode | null;
  } = useProperties({ config });

  useEffect(() => {
    if (
      !vdom ||
      !selectedNode?._id ||
      selectedNode?.type === ENUM_COMPONENTS.FORM
    )
      return;
    const form = findClosestFormParent(
      vdom,
      selectedNode._id,
      ENUM_COMPONENTS.FORM
    );
    const list = findClosestFormParent(
      vdom,
      selectedNode._id,
      ENUM_COMPONENTS.LIST
    );

    setParentForm(form || list);
  }, [vdom, selectedNode?._id, selectedNode?.type]);

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

    if (parentForm?.context?.dataset?.collectionSlug) {
      collection = collections[parentForm.context.dataset.collectionSlug];
    } else if (currentValue?.collectionSlug) {
      collection = collections[currentValue?.collectionSlug];
    }
    setCollectionsSelectedCollection(collection);
  }, [
    collections,
    parentForm?.context?.dataset,
    pageTemplateVersion?._id,
    currentValue?.collectionSlug
  ]);

  return {
    collections,
    collectionsSelectedCollection,
    parentForm,
    optionsSourceTypes,
    currentValue,
    selectedNode,
    fetchCollections,
    setCollectionsSelectedCollection,
    pageTemplateVersion,
    page
  }
}