import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from './FormContext';
import ChildrenDndWrapper from './ChildrenDndWrapper';
import { cn } from '@/lib/utils/shadcnUtils';
import { useEffect, useState } from 'react';
import { pathToRegexp } from 'path-to-regexp';
import { Link } from '@/i18n/routing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';

const isValidParam = (param: string) => {
  if (param.includes(':')) {
    return false;
  }
  return true;
};

const buildUrl = (
  url = '',
  param = '',
  routeParam = '',
  routeParams: Record<string, string> = {}
) => {
  const routeConfiguredParams = ['unitId'];

  const testRouteParams = {
    ...routeParams,
    [routeParam]: param
  };
  const { keys } = pathToRegexp(url);

  const allKeys = [...keys.map((key) => key.name), ...routeConfiguredParams];

  const paramsValues = allKeys.reduce((acc: Record<string, string>, key) => {
    if (testRouteParams[key]) {
      acc[key] = testRouteParams[key];
    }
    return acc;
  }, {});

  let parsedUrl = url;
  const isAllParamsAreValid = Object.values(paramsValues).every((param) =>
    isValidParam(param as string)
  );
  if (!isAllParamsAreValid) {
    return '';
  }
  Object.keys(paramsValues).forEach((key) => {
    parsedUrl = parsedUrl.replace(`:${key}`, paramsValues[key]);
  });
  const ROOT = 'app';
  return `/${ROOT}/${parsedUrl}`;
};

const Error = () => {
  return (
    <span>
      <FontAwesomeIcon icon={faExclamation} />
    </span>
  );
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
                context?.dataset?.connexion?.routeParam,
                context.routeParams
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
      {!props.href && !attributes.href ? <Error /> : null}
      <ChildrenDndWrapper ref={dndChildrenContainerRef}>
        {children}
      </ChildrenDndWrapper>
    </Link>
  );
}

export default LinkComponent;
