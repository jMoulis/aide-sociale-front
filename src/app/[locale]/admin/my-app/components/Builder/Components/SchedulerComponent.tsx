import {
  IUser,
  PropsWithChildrenAndContext
} from '@/lib/interfaces/interfaces';
import ChildrenDndWrapper from './ChildrenDndWrapper';
import { Scheduler } from '@/components/Scheduler/Scheduler';
import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { FormType, useFormContext } from './FormContext';
import { renderVNode } from './renderVode';
import { CalendarEvent } from '@/components/Scheduler/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { getUserSummary } from '@/lib/utils/utils';
import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';
import { ENUM_COMPONENTS } from '../../interfaces';
import { nanoid } from 'nanoid';
import { toast } from '@/lib/hooks/use-toast';

const buildQuery = (currentDate: Date) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const previousMonthStart = new Date(year, month - 1, 1);
  const nextMonthEnd = new Date(year, month + 2, 0);

  const query = {
    $or: [
      {
        'data.start': {
          $gte: previousMonthStart,
          $lte: nextMonthEnd
        }
      },
      { 'data.end': { $gte: previousMonthStart, $lte: nextMonthEnd } }
    ]
  };
  return query;
};

const generateDefaultFormEntry = (
  user: IUser,
  data: any,
  templatePageVersionId: string,
  collectionSlug: string
) => {
  const id = data._id || nanoid();
  const newEntry: FormType = {
    _id: id,
    createdBy: getUserSummary(user),
    createdAt: new Date(),
    data,
    templatePageVersionId,
    collectionSlug,
    organizationId: user.organizationId
  };
  return newEntry;
};
const SchedulerComponent = ({
  context,
  children,
  dndChildrenContainerRef,
  node
}: PropsWithChildrenAndContext) => {
  const [events, setEvents] = useState<any>([]);
  const [createFormRef, setCreateFormRef] = useState<ReactNode | null>(null);
  const { asyncData, onAddListItem, onUpdateList } = useFormContext();
  const user = useMongoUser();
  const schedulerRef = useRef<any | null>(null);

  const fetchItems = useCallback(
    async (currentDate: Date) => {
      const query = buildQuery(currentDate);
      if (context.isBuilderMode) return;

      if (!context.dataset?.connexion?.input?.storeSlug) return;
      const store =
        asyncData[context.dataset?.connexion?.input?.storeSlug]?.store;

      if (!store?.collection?.name) return;
      client
        .list<FormType>(store.collection.name as ENUM_COLLECTIONS, query)
        .then(({ data }) => {
          if (data) {
            onUpdateList(
              context.dataset?.connexion?.input?.storeSlug as string,
              data
            );
            setEvents(
              data.reduce((acc: any, { _id, data }) => {
                if (!data.start) return acc;
                return [
                  ...acc,
                  {
                    _id,
                    ...data,
                    start: new Date(data.start),
                    end: new Date(data.end)
                  }
                ];
              }, [])
            );
          }
        });
    },
    [
      context.dataset?.connexion?.input?.storeSlug,
      context.isBuilderMode,
      asyncData,
      onUpdateList
    ]
  );

  useEffect(() => {
    fetchItems(new Date());
  }, [fetchItems]);

  useEffect(() => {
    if (context.isBuilderMode) return;

    const createForm = node.children?.find(
      (child) => child.type === ENUM_COMPONENTS.SCHEDULER_FORM
    );

    if (createForm) {
      setCreateFormRef(
        renderVNode(createForm, node.path || [], context.routeParams)
      );
    }
  }, [node.children, node.path, context.routeParams, context.isBuilderMode]);

  const handleNext = (currentDate: Date) => {
    fetchItems(currentDate);
  };

  const handlePrev = (currentDate: Date) => {
    fetchItems(currentDate);
  };

  const handleSubmit = useCallback(
    async (id: string) => {
      if (!context.dataset || context.isBuilderMode) {
        toast({
          title: 'Erreur',
          description: 'Les données du formulaire sont manquantes'
        });
        return;
      }

      const storeSlug = context.dataset.connexion?.input?.storeSlug;

      if (!storeSlug) {
        console.warn('Collection slug is missing');
        return;
      }
      const asyncList = asyncData[storeSlug] || [];
      // get the right from store
      if (!Array.isArray(asyncList.data)) {
        console.warn('List is missing');
        return;
      }
      const formToSave =
        asyncList?.data?.find((item) => item._id === id) ||
        ({
          data: {}
        } as FormType);
      const isCreation = context.dataset?.isCreation;

      const params =
        context.dataset?.connexion?.input?.parametersToSave?.reduce(
          (acc: Record<string, string>, param) => {
            if (!context.routeParams) {
              return acc;
            }
            if (!context.routeParams[param]) {
              return acc;
            }
            acc[param] = context.routeParams[param];
            return acc;
          },
          {}
        );

      try {
        if (!user) {
          console.warn('User is missing');
          return;
        }
        const collectionSlug = asyncList.store.collection?.name;

        if (!collectionSlug) {
          console.warn('Collection slug is missing');
          return;
        }
        if (!formToSave?._id || isCreation) {
          const id = nanoid();
          const event = {
            id,
            ...formToSave.data,
            end: formToSave.data.end ? new Date(formToSave.data.end) : null,
            start: formToSave.data.start
              ? new Date(formToSave.data.start)
              : null,
            ...params
          };

          const newEntry: FormType = generateDefaultFormEntry(
            user,
            event,
            context.dataset.pageTemplateVersionId,
            collectionSlug
          );

          schedulerRef.current?.upsertEvent(id, event);

          await client.create<FormType>(
            collectionSlug as ENUM_COLLECTIONS,
            newEntry
          );
          //  formElement.reset();
        } else if (formToSave._id) {
          const parsedEvent = {
            ...formToSave.data,
            end: formToSave.data.end ? new Date(formToSave.data.end) : null,
            start: formToSave.data.start
              ? new Date(formToSave.data.start)
              : null
          };
          schedulerRef.current?.upsertEvent(formToSave._id, parsedEvent);
          await client.update<FormType>(
            collectionSlug as ENUM_COLLECTIONS,
            {
              _id: formToSave._id
            },
            {
              $set: {
                updatedAt: new Date(),
                updatedBy: getUserSummary(user),
                data: parsedEvent,
                templatePageVersionId: context.dataset.pageTemplateVersionId
              }
            }
          );
        }
        toast({
          title: 'Succès',
          description: 'Sauvegardé avec succès',
          variant: 'success'
        });
      } catch (error: any) {
        toast({
          title: 'Erreur',
          description: `Une erreur est survenue: ${error.message}`,
          variant: 'destructive'
        });
      }
    },
    [
      context.dataset,
      context.isBuilderMode,
      context.routeParams,
      asyncData,
      user
    ]
  );
  const handleAddEvent = useCallback(
    (event: CalendarEvent) => {
      const storeSlug = context.dataset?.connexion?.input?.storeSlug;
      if (!storeSlug) {
        console.warn('Collection slug is missing');
        return;
      }
      const asyncList = asyncData[storeSlug] || [];
      const collectionSlug = asyncList.store.collection?.name;

      const pageTemplateVersionId = context.dataset?.pageTemplateVersionId;
      if (!user) return;
      if (!collectionSlug) {
        console.warn('Collection slug is missing');
        return;
      }
      if (!pageTemplateVersionId) {
        console.warn('Page template version id is missing');
        return;
      }
      const params =
        context.dataset?.connexion?.input?.parametersToSave?.reduce(
          (acc: Record<string, string>, param) => {
            if (!context.routeParams) {
              return acc;
            }
            if (!context.routeParams[param]) {
              return acc;
            }
            acc[param] = context.routeParams[param];
            return acc;
          },
          {}
        );
      const newEntry: FormType = generateDefaultFormEntry(
        user,
        {
          ...event,
          end: event.end ? new Date(event.end) : null,
          start: event.start ? new Date(event.start) : null,
          ...params
        },
        pageTemplateVersionId,
        collectionSlug
      );
      onAddListItem(collectionSlug, newEntry);
    },
    [
      context.dataset?.connexion?.input?.parametersToSave,
      context.dataset?.connexion?.input?.storeSlug,
      context.dataset?.pageTemplateVersionId,
      context.routeParams,
      asyncData,
      onAddListItem,
      user
    ]
  );

  if (context.isBuilderMode) {
    return (
      <div>
        <ChildrenDndWrapper ref={dndChildrenContainerRef}>
          {children}
        </ChildrenDndWrapper>
      </div>
    );
  }
  return (
    <>
      <Scheduler
        ref={schedulerRef}
        onUpsertEvent={handleSubmit}
        onAddEvent={handleAddEvent}
        onNext={handleNext}
        onPrev={handlePrev}
        customForm={createFormRef}
        events={events}
      />
    </>
  );
};

export default SchedulerComponent;
