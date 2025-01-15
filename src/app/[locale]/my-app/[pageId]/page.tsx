type Props = {
  params: Promise<{ pageId: string }>;
};
export default async function PageBuilder({ params }: Props) {
  const { pageId } = await params;
  return (
    <>
      <h1>My website</h1>
      <div>PageBuilder</div>
    </>
  );
}
