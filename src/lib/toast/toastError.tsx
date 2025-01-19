export const toastError = (
  t: any,
  titleKey: string,
  errorKey: string,
  error: any
) => {
  return {
    title: t(titleKey),
    description: t.rich(errorKey, {
      error: error.message,
      code: (chunks: any) => <code>{chunks} </code>
    }),
    variant: 'destructive' as any
  };
};
