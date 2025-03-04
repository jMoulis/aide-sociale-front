import React, { useEffect, useState } from 'react';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { ITableField, VDOMContext } from '@/lib/interfaces/interfaces';
import { Link } from '@/i18n/routing';
import { buildUrl } from '../../utils';
import { cn } from '@/lib/utils/shadcnUtils';

export interface NameCellRendererParams<T> {
  field: T;
}
const LinkCell = (params: CustomCellRendererProps) => {
  const [attributes, setAttributes] = useState<
    Record<string, string | undefined>
  >({});

  useEffect(() => {
    const linkAttrs = ((params as any).field as ITableField)?.link;
    const context = params.context as VDOMContext;
    const value = params.value;
    setAttributes(() => {
      return (linkAttrs || []).reduce(
        (attrProps: Record<string, string | undefined>, attribute) => {
          if (attribute.attr === 'href') {
            return {
              ...attrProps,
              href: buildUrl(
                attribute.value || attribute.page?.route,
                value as string,
                attribute.page?.routeParam,
                context.routeParams
              )
            };
          }
          return {
            ...attrProps,
            [attribute.attr]: attribute.value
          };
        },
        {}
      );
    });
  }, [params]);
  return (
    <Link
      className={cn('underline')}
      href={attributes?.href || ''}
      {...attributes}>
      {params.value}
    </Link>
  );
};

export default LinkCell;
