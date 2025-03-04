import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { ElementConfigProps } from '../../../interfaces';
import { usePageBuilderStore } from '../../../stores/pagebuilder-store-provider';
import { useProperties } from '../useProperties';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import Dialog from '@/components/dialog/Dialog';
import Button from '@/components/buttons/Button';
import {
  ENUM_TABLE_COMPONENTS,
  ICollectionField,
  ITableField
} from '@/lib/interfaces/interfaces';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import SaveButton from '@/components/buttons/SaveButton';
import Selectbox from '@/components/form/Selectbox';
import OptionsLink from './OptionsLinks';
import {
  faArrowDown,
  faArrowUp
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  config: ElementConfigProps;
};
function TableProperties({ config }: Props) {
  const { stores, selectedNode } = useProperties({ config });
  const onUpdateNodeProperty = usePageBuilderStore(
    (state) => state.onUpdateNodeProperty
  );
  const [open, setOpen] = useState(false);

  const store = useMemo(() => {
    const storeSlug =
      selectedNode?.context?.dataset?.connexion?.input?.storeSlug;
    if (!storeSlug)
      return {
        store: null,
        fields: []
      };
    const store = stores.find((store) => store.slug === storeSlug);
    const fields = store?.collection?.fields || [];

    return {
      store,
      fields
    };
  }, [selectedNode?.context?.dataset?.connexion?.input?.storeSlug, stores]);

  const handleCheckboxChange = (
    status: CheckedState,
    field: ICollectionField
  ) => {
    const previousFields = (selectedNode?.context?.table?.fields ||
      []) as ICollectionField[];
    const fields = status
      ? [...previousFields, field]
      : previousFields.filter((f) => f.key !== field.key);
    onUpdateNodeProperty(
      {
        table: {
          fields
        }
      },
      config.context
    );
  };

  const handleSelectComponent = (
    event: ChangeEvent<HTMLSelectElement>,
    field: ITableField
  ) => {
    const previousFields = (selectedNode?.context?.table?.fields ||
      []) as ITableField[];
    const fields = previousFields.map((f) => {
      if (f.key === field.key) {
        return {
          ...f,
          component: event.target.value
        };
      }
      return f;
    });
    onUpdateNodeProperty(
      {
        table: {
          fields
        }
      },
      config.context
    );
  };

  const handleUpdateField = (field: ITableField) => {
    const previousFields = (selectedNode?.context?.table?.fields ||
      []) as ITableField[];
    const fields = previousFields.map((f) => {
      if (f.key === field.key) {
        return field;
      }
      return f;
    });
    onUpdateNodeProperty(
      {
        table: {
          fields
        }
      },
      config.context
    );
  };

  const handleSelectStoreField = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const previousFields = (selectedNode?.context?.table?.fields ||
      []) as ICollectionField[];
    const field = store.fields.find((field) => field.key === value);
    if (!field) return;
    const fields = [...previousFields, field];
    onUpdateNodeProperty(
      {
        table: {
          fields
        }
      },
      config.context
    );
  };
  const handleReorder = useCallback(
    (entryIdx: number, direction: 'up' | 'down') => {
      const updatedFields = [...(selectedNode?.context?.table?.fields || [])];
      if (direction === 'up' && entryIdx > 0) {
        [updatedFields[entryIdx - 1], updatedFields[entryIdx]] = [
          updatedFields[entryIdx],
          updatedFields[entryIdx - 1]
        ];
      } else if (direction === 'down' && entryIdx < updatedFields.length - 1) {
        [updatedFields[entryIdx + 1], updatedFields[entryIdx]] = [
          updatedFields[entryIdx],
          updatedFields[entryIdx + 1]
        ];
      }
      onUpdateNodeProperty(
        {
          table: {
            fields: updatedFields
          }
        },
        config.context
      );
    },
    [config.context, onUpdateNodeProperty, selectedNode?.context?.table?.fields]
  );

  return (
    <div>
      <span>TableProperties</span>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        Trigger={<Button>Config</Button>}>
        <div>
          <FormField>
            <FormLabel>Store fields</FormLabel>
            <Selectbox
              options={store.fields.map((field) => ({
                label: field.label,
                value: field.key
              }))}
              value={store.store?.slug}
              onChange={handleSelectStoreField}
            />
          </FormField>
          <ul>
            {selectedNode?.context?.table?.fields.map((field, entryIndex) => (
              <li key={entryIndex}>
                <FormField className='flex-row items-center'>
                  <Checkbox
                    id={field.key}
                    checked={selectedNode?.context?.table?.fields?.some(
                      (f) => f.key === field.key
                    )}
                    onCheckedChange={(status) =>
                      handleCheckboxChange(status, field)
                    }
                  />
                  <FormLabel className='mb-0 ml-2' htmlFor={field.key}>
                    {field.label}
                  </FormLabel>
                </FormField>
                <FormField>
                  <Selectbox
                    value={field.component}
                    onChange={(e) => handleSelectComponent(e, field)}
                    options={Object.values(ENUM_TABLE_COMPONENTS).map(
                      (key) => ({
                        label: key,
                        value: key
                      })
                    )}
                  />
                </FormField>
                <div className='flex items-center'>
                  <Button
                    onClick={() => handleReorder(entryIndex, 'up')}
                    disabled={entryIndex === 0}>
                    <FontAwesomeIcon icon={faArrowUp} />
                  </Button>
                  <Button
                    onClick={() => handleReorder(entryIndex, 'down')}
                    disabled={
                      entryIndex ===
                      (selectedNode?.context?.table?.fields || []).length - 1
                    }>
                    <FontAwesomeIcon icon={faArrowDown} />
                  </Button>
                </div>
                {field.component === ENUM_TABLE_COMPONENTS.LINK ? (
                  <OptionsLink
                    config={config}
                    field={field}
                    onUpdateField={handleUpdateField}
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        <FormFooterAction>
          <SaveButton onClick={() => setOpen(false)} />
        </FormFooterAction>
      </Dialog>
      <ul className='flex flex-wrap space-x-2'>
        {selectedNode?.context?.table?.fields?.map((field, key) => (
          <li className='' key={key}>
            <span className='text-xs rounded bg-gray-200 px-1'>
              {field.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default TableProperties;
