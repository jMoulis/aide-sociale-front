type Props = {
  children: React.ReactNode;
};
function TabsWrapper({ children }: Props) {
  return <div className='flex space-x-4 flex-1'>{children}</div>;
}
export default TabsWrapper;
