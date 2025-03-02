import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { FormType, useFormContext } from './FormContext';
import ChildrenDndWrapper from './ChildrenDndWrapper';
import { IVDOMNode } from '../../interfaces';
import { renderVNode } from './renderVode';
import { nanoid } from 'nanoid';

function ListComponent({
  props,
  children,
  context,
  node,
  dndChildrenContainerRef
}: PropsWithChildrenAndContext) {
  const { asyncData } = useFormContext();
  const [items, setItems] = useState<any[]>(
    (context.dataset?.connexion?.input?.storeId &&
      (asyncData[context.dataset?.connexion?.input?.storeId]
        ?.data as FormType[])) ||
      [] ||
      []
  );

  const { className, ...rest } = props || {};
  const CustomTag = `${context.as || 'div'}` as any;

  useEffect(() => {
    if (context.isBuilderMode) return;

    // if (context.dataset?.connexion?.input?.plugToQuery) {
    //   const queryKey = context.dataset?.connexion?.input?.plugToQuery;
    //   if (queryResults && queryResults[queryKey]) {
    //     const result = queryResults[queryKey];
    //     if (Array.isArray(result)) {
    //       setItems(queryResults[queryKey]);
    //     }
    //   }
    //   return;
    // }
    if (!context.dataset?.connexion?.input?.storeId) return;

    const datas =
      (asyncData[context.dataset?.connexion?.input?.storeId]
        ?.data as FormType[]) || [];
    setItems(datas);
  }, [
    context.dataset?.connexion?.input?.storeId,
    // context.dataset?.connexion?.input?.plugToQuery,
    context.isBuilderMode,
    asyncData,
    context.dataset?.connexion?.input
  ]);

  const renderRecursiveNodeWithIndex = useCallback(
    (item: IVDOMNode, index: number) => {
      return (
        <Fragment key={nanoid()}>
          {renderVNode(item, context.path, context.routeParams, index)}
        </Fragment>
      );
    },
    [context.path, context.routeParams]
  );

  const renderListChildren = useCallback(() => {
    const listChild = node.children?.[0];
    return (items || []).map((_, index) => {
      return renderRecursiveNodeWithIndex(listChild, index);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, node.children]);

  return (
    <CustomTag className={cn('p-1', className)} {...rest}>
      <ChildrenDndWrapper ref={dndChildrenContainerRef}>
        {context.isBuilderMode ? children : renderListChildren()}
      </ChildrenDndWrapper>
    </CustomTag>
  );
}
export default ListComponent;
