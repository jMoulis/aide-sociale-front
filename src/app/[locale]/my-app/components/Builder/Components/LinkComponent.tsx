import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from './FormContext';
import ChildrenDndWrapper from './ChildrenDndWrapper';
import { cn } from '@/lib/utils/shadcnUtils';
import { useEffect, useState } from 'react';
import { pathToRegexp } from 'path-to-regexp';
import { Link } from '@/i18n/routing';

const buildUrl = (url = '', param = '', routeParam = '') => {
  const { keys } = pathToRegexp(url);
  let parsedUrl = url;
  const routeParamKey = keys?.find((key) => key.name === routeParam);
  if (routeParamKey) {
    parsedUrl = url.replace(`:${routeParam}`, param);
  }
  return `${parsedUrl}`;
};

function LinkComponent({
  props,
  context,
  children,
  dndChildrenContainerRef
}: PropsWithChildrenAndContext) {
  const { getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);
  const { className, ...rest } = props;
  const [attributes, setAttributes] = useState<
    Record<string, string | undefined>
  >({});

  useEffect(() => {
    setAttributes(() => {
      return (context['options-link'] || []).reduce(
        (attrProps: Record<string, string | undefined>, attr) => {
          if (attr.attr === 'href') {
            return {
              ...attrProps,
              href: buildUrl(
                attr.value || attr.page?.route,
                value as string,
                context.dataset?.connexion?.routeParam
              )
            };
          }
          return {
            ...attrProps,
            [attr.attr]: attr.value
          };
        },
        {}
      );
    });
  }, [context, value]);

  if (context.isBuilderMode) {
    return (
      <span className={cn('p-1 inline-block', className)} {...rest}>
        <ChildrenDndWrapper ref={dndChildrenContainerRef}>
          {children}
        </ChildrenDndWrapper>
      </span>
    );
  }

  return (
    <Link {...props} {...attributes}>
      <ChildrenDndWrapper ref={dndChildrenContainerRef}>
        {children}
      </ChildrenDndWrapper>
    </Link>
  );
}

export default LinkComponent;
