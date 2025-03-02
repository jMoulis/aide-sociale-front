import { SelectboxOption } from "@/components/form/Selectbox";
import { AsyncPayloadMap, VDOMContext } from "@/lib/interfaces/interfaces";

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