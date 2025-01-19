import { toast } from '../hooks/use-toast';

export async function toastPromise<T>(
  promise: Promise<T>,
  translation: any,
  key: 'create' | 'delete' | 'edit'
) {
  try {
    await promise;
    toast({
      variant: 'success',
      title: translation(`${key}.success`),
      description: translation(`${key}.description`)
    });
  } catch (error: any) {
    toast({
      title: translation(`${key}.action`),
      description: translation.rich(`${key}.error`, {
        error: error.message,
        code: (chunks: any) => <code>{chunks} </code>
      }),
      variant: 'destructive' as any
    });
  }
}
