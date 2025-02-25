export default async function DefaultLayoutRender({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
