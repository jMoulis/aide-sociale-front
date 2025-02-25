import { SelectboxOption } from "@/components/form/Selectbox";
import { VDOMContext } from "@/lib/interfaces/interfaces";

export const buildOptions = (
  lists: Record<string, any[]>,
  context: VDOMContext
): SelectboxOption[] => {
  const connexion = context?.dataset?.connexion;
  if (!connexion) return [];

  const externalDataOptions = connexion.externalDataOptions;
  const staticDataOptions = connexion.staticDataOptions;
  if (!externalDataOptions && !staticDataOptions) return [];

  if (
    externalDataOptions?.collectionSlug &&
    externalDataOptions?.labelField &&
    externalDataOptions?.valueField
  ) {
    const list = lists[externalDataOptions.collectionSlug];
    if (!list) return [] as any;

    const options = list.reduce((acc: SelectboxOption[], item) => {
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