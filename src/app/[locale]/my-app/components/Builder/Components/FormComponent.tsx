import Form from '@/components/form/Form';
import { toast } from '@/lib/hooks/use-toast';
import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import { useCallback, useEffect, useId, useRef } from 'react';
import { v4 } from 'uuid';
import { FormType, useFormContext } from './FormContext';
import { useMongoUser } from '@/lib/mongo/MongoUserContext/MongoUserContext';
import { getUserSummary } from '@/lib/utils/utils';

function FormComponent({
  props,
  children,
  context
}: PropsWithChildrenAndContext) {
  const { forms } = useFormContext();
  const formRef = useRef<HTMLFormElement | null>(null);
  const formId = useId();
  const user = useMongoUser();

  useEffect(() => {
    if (context.isBuilderMode) return;
    const isCreation = context.dataset?.isCreation;
    if (isCreation) {
      return;
    }
    const collectionSlug = context.dataset?.collectionSlug;
    const param = context.dataset?.connexion?.routeParam;
    if (!context.routeParams) {
      toast({
        title: 'Erreur',
        description: 'Les paramètres de route sont manquants',
        variant: 'destructive'
      });
      return;
    }
    if (!collectionSlug) {
      toast({
        title: 'Erreur',
        description: 'La collection est manquante',
        variant: 'destructive'
      });
      return;
    }
    if (!param) {
      toast({
        title: 'Erreur',
        description: 'Le paramètre de route est manquant',
        variant: 'destructive'
      });
      return;
    }
  }, [
    context.dataset?.collectionSlug,
    context.dataset?.isCreation,
    context.routeParams,
    context.dataset?.connexion?.routeParam,
    context.isBuilderMode
  ]);

  const { className, ...rest } = props;

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!context.dataset) {
        return;
      }
      const form = e.target as HTMLFormElement;
      if (form.id !== formRef.current?.id) return;
      const collectionSlug = context.dataset?.collectionSlug;

      if (!collectionSlug) {
        // eslint-disable-next-line no-console
        console.error('Collection slug is missing');
        return;
      }

      const formToSave = forms[collectionSlug];
      const isCreation = context.dataset?.isCreation;

      try {
        if (isCreation) {
          const newEntry: FormType = {
            _id: v4(),
            createdBy: user ? getUserSummary(user) : undefined,
            createdAt: new Date(),
            data: formToSave.data,
            templatePageVersionId: context.dataset.pageTemplateVersionId,
            collectionSlug: collectionSlug as ENUM_COLLECTIONS
          };
          await client.create<FormType>(
            collectionSlug as ENUM_COLLECTIONS,
            newEntry
          );
        } else {
          await client.update<FormType>(
            collectionSlug as ENUM_COLLECTIONS,
            {
              _id: formToSave._id
            },
            {
              $set: {
                updatedAt: new Date(),
                updatedBy: user ? getUserSummary(user) : undefined,
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
        form.reset();
      } catch (error: any) {
        toast({
          title: 'Erreur',
          description: `Une erreur est survenue: ${error.message}`,
          variant: 'destructive'
        });
      }
    },
    [context.dataset, forms, user]
  );

  return (
    <Form
      ref={formRef}
      id={formId}
      onSubmit={handleSubmit}
      className={cn('p-1', className)}
      {...rest}>
      {children}
    </Form>
  );
}
export default FormComponent;
