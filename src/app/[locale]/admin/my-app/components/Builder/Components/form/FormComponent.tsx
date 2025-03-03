import Form from '@/components/form/Form';
import { toast } from '@/lib/hooks/use-toast';
import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import { forwardRef, useCallback, useId, useRef } from 'react';
import { nanoid } from 'nanoid';
import { FormType, useFormContext } from '../FormContext';
import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';
import { getUserSummary } from '@/lib/utils/utils';
import ChildrenDndWrapper from '../ChildrenDndWrapper';

const FormComponent = forwardRef<HTMLFormElement, PropsWithChildrenAndContext>(
  ({ props, children, context, dndChildrenContainerRef }, ref) => {
    const { asyncData } = useFormContext();
    const formRef = useRef<HTMLFormElement | null>(null);
    const formId = useId();
    const user = useMongoUser();

    // useEffect(() => {
    //   // Check if the form is in creation mode or builder mode
    //   // If so, return early to avoid subsequent controls
    //   if (context.dataset?.isCreation || context.isBuilderMode) {
    //     return;
    //   }
    //   if (!context.routeParams) {
    //     toast({
    //       title: 'Erreur',
    //       description: 'Les paramètres de route sont manquants',
    //       variant: 'destructive'
    //     });
    //     return;
    //   }
    // }, [
    //   context.dataset?.isCreation,
    //   context.routeParams,
    //   context.isBuilderMode
    // ]);

    const { className, ...rest } = props;

    const handleSubmit = useCallback(
      async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!context.dataset || context.isBuilderMode) {
          toast({
            title: 'Erreur',
            description: 'Les données du formulaire sont manquantes'
          });
          return;
        }
        const formElement = e.target as HTMLFormElement;
        if (formElement.id !== formRef.current?.id) {
          console.warn('Form submission from other forms');
          return;
        } // Prevent form submission from other forms

        const storeSlug = context.dataset.connexion?.input?.storeSlug;

        if (!storeSlug) {
          console.warn('Store ID is missing');
          return;
        }

        const { data: formToSave, store } = asyncData[storeSlug] || {
          data: {},
          store: {}
        };

        const isCreation = context.dataset?.isCreation;

        const collectionSlug = store.collection?.slug;
        if (!collectionSlug) {
          console.warn('Collection slug is missing');
          return;
        }
        const params =
          context.dataset?.connexion?.input?.parametersToSave?.reduce(
            (acc: Record<string, string>, param) => {
              if (!context.routeParams) {
                return acc;
              }
              if (!context.routeParams[param]) {
                return acc;
              }
              acc[param] = context.routeParams[param];
              return acc;
            },
            {}
          );
        if (params && Object.keys(params || {}).length === 0) {
          console.warn('Missing parameters to save');
          toast({
            title: 'Erreur',
            description: 'Paramètres manquants',
            variant: 'destructive'
          });
          return;
        }
        try {
          if (!user) {
            console.warn('User is missing');
            return;
          }
          if (Array.isArray(formToSave)) return;

          if (!formToSave._id || isCreation) {
            const id = nanoid();
            const newEntry: FormType = {
              _id: id,
              createdBy: getUserSummary(user),
              createdAt: new Date(),
              data: { id, ...formToSave.data, ...params },
              templatePageVersionId: context.dataset.pageTemplateVersionId,
              collectionSlug,
              organizationId: user.organizationId
            };
            await client.create<FormType>(
              collectionSlug as ENUM_COLLECTIONS,
              newEntry
            );
            formElement.reset();
          } else if (formToSave._id) {
            await client.update<FormType>(
              collectionSlug as ENUM_COLLECTIONS,
              {
                _id: formToSave._id
              },
              {
                $set: {
                  updatedAt: new Date(),
                  updatedBy: getUserSummary(user),
                  data: formToSave.data,
                  templatePageVersionId: context.dataset.pageTemplateVersionId
                }
              }
            );
          }
          toast({
            title: 'Succès',
            description: 'Sauvegardé avec succès',
            variant: 'success'
          });
        } catch (error: any) {
          toast({
            title: 'Erreur',
            description: `Une erreur est survenue: ${error.message}`,
            variant: 'destructive'
          });
        }
      },
      [
        context.dataset,
        context.isBuilderMode,
        context.routeParams,
        asyncData,
        user
      ]
    );

    return (
      <Form
        ref={context.isBuilderMode ? ref : formRef}
        id={formId}
        onSubmit={handleSubmit}
        className={cn('p-1', className)}
        {...rest}>
        <ChildrenDndWrapper ref={dndChildrenContainerRef}>
          {children}
        </ChildrenDndWrapper>
      </Form>
    );
  }
);

FormComponent.displayName = 'FormComponent';
export default FormComponent;
