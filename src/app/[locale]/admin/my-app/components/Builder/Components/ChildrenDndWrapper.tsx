type Props = {
  children?: React.ReactNode;
  ref?: any;
};
function ChildrenDndWrapper({ ref, children }: Props) {
  return (
    // <div ref={ref} className='children-dnd contents'>
    <>{children}</>
    // </div>
  );
}
export default ChildrenDndWrapper;
