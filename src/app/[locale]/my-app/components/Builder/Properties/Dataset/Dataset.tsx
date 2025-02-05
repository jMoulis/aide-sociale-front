import { useEffect, useState } from 'react';
import {
  ElementConfigProps,
  ENUM_COMPONENTS,
  IVDOMNode
} from '../../../interfaces';
import { ICollection, IDataset } from '@/lib/interfaces/interfaces';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select';
import { useProperties } from '../useProperties';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import FormLabel from '@/components/form/FormLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import FormField from '@/components/form/FormField';
import Input from '@/components/form/Input';

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
    node.props?.children?.forEach((child) => buildParentMap(child, node));
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
const Dataset = ({ config }: Props) => {
  const organizationId = usePageBuilderStore((state) => state.organizationId);
  const pageTemplateVersion = usePageBuilderStore((state) => state.pageVersion);
  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );
  const {
    value: currentCollection,
    vdom,
    selectedNode
  }: {
    value: IDataset | null;
    vdom: IVDOMNode | null;
    selectedNode: IVDOMNode | null;
  } = useProperties({ config });
  const [collections, setCollections] = useState<Record<string, ICollection>>(
    {}
  );
  const [collectionsSelectedCollection, setCollectionsSelectedCollection] =
    useState<ICollection | null>(null);
  const t = useTranslations('CollectionSection');

  const [parentForm, setParentForm] = useState<IVDOMNode | null>(null);

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
    setParentForm(form);
  }, [vdom, selectedNode?._id, selectedNode?.type]);

  useEffect(() => {
    client
      .list<ICollection>(ENUM_COLLECTIONS.COLLECTIONS, { organizationId })
      .then(({ data }) => {
        if (!data) return;
        const collectionsAsMap = data.reduce(
          (acc: Record<string, ICollection>, collection) => {
            acc[collection.slug] = collection;
            return acc;
          },
          {}
        );
        setCollections(collectionsAsMap);
      });
  }, [organizationId]);

  useEffect(() => {
    if (
      parentForm?.context.dataset?.collectionName &&
      pageTemplateVersion?._id
    ) {
      const collection = collections[parentForm.context.dataset.collectionSlug];
      if (!collection) return;
      setCollectionsSelectedCollection(collection);
      const updatedCollection: IDataset = {
        collectionSlug: collection.slug,
        collectionName: collection.name,
        pageTemplateVersionId: pageTemplateVersion._id,
        connexion: {}
      };
      onUpdateNodeProperty(
        { [config.propKey]: updatedCollection || '' },
        config.context
      );
    }
  }, [
    collections,
    parentForm?.context?.dataset,
    config.propKey,
    config.context,
    onUpdateNodeProperty,
    pageTemplateVersion?._id
  ]);

  const handleSelectCollection = (value?: string) => {
    if (!pageTemplateVersion?._id) return;
    const selectedCollection = value ? collections[value] : null;
    if (!selectedCollection) return;
    const collection: IDataset = {
      collectionSlug: selectedCollection.slug,
      collectionName: selectedCollection.name,
      pageTemplateVersionId: pageTemplateVersion?._id,
      connexion: {}
    };

    onUpdateNodeProperty(
      { [config.propKey]: collection || '' },
      config.context
    );
    setCollectionsSelectedCollection(selectedCollection);
  };

  const handleSelectField = (state: CheckedState, selectedValue?: string) => {
    if (!currentCollection) return;
    const collection = collections[currentCollection.collectionSlug];

    const updatedCollection: IDataset = {
      collectionSlug: collection.slug,
      collectionName: collection.name,
      pageTemplateVersionId: pageTemplateVersion?._id as string,
      connexion: {
        ...currentCollection.connexion,
        field: selectedValue || ''
      }
    };
    onUpdateNodeProperty(
      { [config.propKey]: updatedCollection || '' },
      config.context
    );
  };

  const handleCreateFormChecked = (state: CheckedState) => {
    if (!currentCollection) return;
    const collection = collections[currentCollection.collectionSlug];

    const updatedCollection: IDataset = {
      collectionSlug: collection.slug,
      collectionName: collection.name,
      isCreation: state as unknown as boolean,
      connexion: currentCollection.connexion,
      pageTemplateVersionId: pageTemplateVersion?._id as string
    };
    onUpdateNodeProperty(
      { [config.propKey]: updatedCollection || '' },
      config.context
    );
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!currentCollection) return;
    const updatedCollection: IDataset = {
      ...currentCollection,
      connexion: {
        ...currentCollection?.connexion,
        [name]: value
      }
    };
    onUpdateNodeProperty(
      { [config.propKey]: updatedCollection || '' },
      config.context
    );
  };

  return (
    <div>
      Dataset
      {parentForm ? (
        <div>
          <span className='text-xs'>
            <FontAwesomeIcon icon={faInfoCircle} />
            Parent form connection: {parentForm.context.dataset?.collectionName}
          </span>
        </div>
      ) : null}
      <Select
        disabled={Boolean(parentForm)}
        onValueChange={handleSelectCollection}
        defaultValue={currentCollection?.collectionSlug}
        value={currentCollection?.collectionSlug}>
        <SelectTrigger className='w-[180px]'>
          <span style={{ textAlign: 'left' }}>
            {parentForm?.context.dataset?.collectionName ??
              currentCollection?.collectionName ??
              t('selectCollection')}
          </span>
        </SelectTrigger>
        <SelectContent>
          {Object.values(collections).map((collection) => (
            <SelectItem key={collection.slug} value={collection.slug}>
              {collection.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {collectionsSelectedCollection ? (
        <ul className='ml-2'>
          {collectionsSelectedCollection.fields.map((field) => (
            <li key={field.key} className='mt-2 flex items-center'>
              <Checkbox
                id={`${field.key}`}
                onCheckedChange={(state) => handleSelectField(state, field.key)}
                value={field.key}
                checked={currentCollection?.connexion?.field === field.key}
              />
              <FormLabel className='mb-0 ml-1' htmlFor={field.key}>
                {field.label}
              </FormLabel>
            </li>
          ))}
        </ul>
      ) : null}
      <FormField className='mt-2 flex flex-row items-center'>
        <Checkbox onCheckedChange={handleCreateFormChecked} id='create-form' />
        <FormLabel className='mb-0 ml-1' htmlFor='create-form'>
          CREATE
        </FormLabel>
      </FormField>
      <FormField>
        <FormLabel>Route param</FormLabel>
        <Input
          name='routeParam'
          value={currentCollection?.connexion?.routeParam || ''}
          onChange={handleInputChange}
        />
      </FormField>
    </div>
  );
};
export default Dataset;
