type Props = {
  children: React.ReactNode;
};
function FormFooterAction({ children }: Props) {
  return (
    <footer className='flex items-center justify-end py-2 space-x-4'>
      {children}
    </footer>
  );
}

export default FormFooterAction;
