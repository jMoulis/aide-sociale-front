type Props = {
  children: React.ReactNode;
};
function TabContent({ children }: Props) {
  return (
    <div className='flex-1 rounded-lg border bg-card text-card-foreground shadow-sm p-3'>
      {children}
    </div>
  );
}
export default TabContent;
