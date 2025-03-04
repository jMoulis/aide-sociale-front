import { SelectboxOption } from "@/components/form/Selectbox";
import { AsyncPayloadMap, VDOMContext } from "@/lib/interfaces/interfaces";
import { pathToRegexp } from 'path-to-regexp';

export const buildOptions = (
  lists: AsyncPayloadMap,
  context: VDOMContext
): SelectboxOption[] => {
  const connexion = context?.dataset?.connexion;
  if (!connexion) return [];

  const externalDataOptions = connexion.input?.externalDataOptions;
  const staticDataOptions = connexion.input?.staticDataOptions;

  if (!externalDataOptions && !staticDataOptions) return [];

  if (
    externalDataOptions?.collectionSlug &&
    externalDataOptions?.labelField &&
    externalDataOptions?.valueField
  ) {
    const asyncList = lists[externalDataOptions.collectionSlug];
    if (!asyncList?.data || !Array.isArray(asyncList.data)) return [] as any;
    const list = asyncList.data;
    const options = list.reduce((acc: SelectboxOption[], item: any) => {
      if (!item[externalDataOptions.labelField]) return acc;
      return [
        ...acc,
        {
          label: item[externalDataOptions.labelField],
          value: item[externalDataOptions.valueField]
        }
      ];
    }, []);
    return options;
  }
  if (staticDataOptions) {
    return staticDataOptions.map((option) => ({
      value: option,
      label: option
    }));
  }
  return [] as any;
};

const isValidParam = (param: string) => {
  if (param.includes(':')) {
    return false;
  }
  return true;
};

export const buildUrl = (
  url = '',
  param = '',
  routeParam = '',
  routeParams: Record<string, string> = {}
) => {
  const testRouteParams = {
    ...routeParams,
    [routeParam]: param
  };
  const { keys } = pathToRegexp(url, {});
  const allKeys = [...keys.map((key) => key.name)];

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
  return `/${ROOT}${parsedUrl}`;
};