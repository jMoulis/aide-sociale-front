type Props = {
  children: React.ReactNode;
};
function MainLayout({ children }: Props) {
  return (
    <main
      style={{
        gridArea: 'main'
      }}>
      {children}
    </main>
  );
}

export default MainLayout;
