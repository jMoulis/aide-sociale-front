import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from './FormContext';
import { cn } from '@/lib/utils/shadcnUtils';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { buildUrl } from './utils';

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
  children
}: PropsWithChildrenAndContext) {
  const [init, setInit] = useState(false);
  const { getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);
  const { className, ...rest } = props;
  const [attributes, setAttributes] = useState<
    Record<string, string | undefined>
  >({});

  useEffect(() => {
    if (!init) {
      setInit(true);
    }
    setAttributes(() => {
      return (context['options-link'] || []).reduce(
        (attrProps: Record<string, string | undefined>, attr) => {
          if (attr.attr === 'href') {
            return {
              ...attrProps,
              href: buildUrl(
                attr.value || attr.page?.route,
                value as string,
                attr.page?.routeParam,
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
  }, [context, value, init]);

  if (context.isBuilderMode) {
    return (
      <span className={cn('p-1 inline-block', className)} {...rest}>
        {children}
      </span>
    );
  }

  return (
    <Link {...props} {...attributes}>
      {!props.href && !attributes.href && init ? <Error /> : null}
      {children}
    </Link>
  );
}

export default LinkComponent;
