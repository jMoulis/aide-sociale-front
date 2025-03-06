import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { Fragment, useMemo } from 'react';
import { renderVNode } from './renderVode';
import { useCalendarStore } from '@/components/Scheduler/store/useCalendarStore';
import { IVDOMNode } from '../../interfaces';
import { nanoid } from 'nanoid';
import Form from '@/components/form/Form';
import { cn } from '@/lib/utils/shadcnUtils';

const SchedulerFormComponent = ({
  props,
  context,
  children,
  node
}: PropsWithChildrenAndContext) => {
  const { className, ...rest } = props;
  const { selectedEvent, events } = useCalendarStore();

  // const handleRemoveEvent = async (eventId: string) => {
  //   const collectionSlug = context.dataset?.collectionSlug;
  //   if (!collectionSlug) {
  //     console.warn('Collection slug is missing');
  //     return;
  //   }
  //   client.delete(collectionSlug as ENUM_COLLECTIONS, eventId);
  // };

  // useEffect(() => {
  //   if (init) return;

  //   if (!user) return;
  //   if (!context.dataset?.collectionSlug) {
  //     console.warn('Collection slug is missing');
  //     return;
  //   }
  //   const isNewEvent = selectedEvent?.new;

  //   if (isNewEvent) {
  //     const params = context.dataset?.connexion?.parametersToSave?.reduce(
  //       (acc: Record<string, string>, param) => {
  //         if (!context.routeParams) {
  //           return acc;
  //         }
  //         if (!context.routeParams[param]) {
  //           return acc;
  //         }
  //         acc[param] = context.routeParams[param];
  //         return acc;
  //       },
  //       {}
  //     );
  //     // const id = nanoid();
  //     // const event = { id, ...selectedEvent, ...params };
  //     // const newEntry: FormType = {
  //     //   _id: id,
  //     //   createdBy: getUserSummary(user),
  //     //   createdAt: new Date(),
  //     //   data: { ...event, new: false },
  //     //   templatePageVersionId: context.dataset.pageTemplateVersionId,
  //     //   collectionSlug: context.dataset?.collectionSlug,
  //     //   organizationId: user.organizationId
  //     // };
  //     // onAddListItem(context.dataset?.collectionSlug, newEntry);
  //     // upsertEvent(id, {
  //     //   ...event,
  //     //   end: event.end ? new Date(event.end) : new Date(),
  //     //   start: event.start ? new Date(event.start) : new Date(),
  //     //   new: false
  //     // });
  //   }
  // }, [
  //   selectedEvent,
  //   context.dataset?.collectionSlug,
  //   init,
  //   user,
  //   context.routeParams,
  //   context.dataset?.connexion?.parametersToSave,
  //   context.dataset?.pageTemplateVersionId,
  //   onAddListItem,
  //   upsertEvent
  // ]);

  const renderForm = useMemo(() => {
    const eventIndex = events.findIndex(
      (event) => event._id === selectedEvent?._id
    );

    const renderRecursiveNode = (node: IVDOMNode, item: any) => {
      const updatedItem: IVDOMNode = {
        ...node,
        children: node.children.map((sub) => renderRecursiveNode(sub, item))
      };
      return updatedItem;
    };

    const updatedTreeNode = renderRecursiveNode(node, selectedEvent);

    const children = updatedTreeNode.children.map((node) => {
      return (
        <Fragment key={nanoid()}>
          {renderVNode(node, context.path, context.routeParams, eventIndex)}
        </Fragment>
      );
    });
    return children;
  }, [node, selectedEvent, context.path, context.routeParams, events]);

  if (context.isBuilderMode) {
    return children;
  }
  return (
    <Form className={cn('p-1', className)} {...rest}>
      {renderForm}
    </Form>
  );
};

export default SchedulerFormComponent;
