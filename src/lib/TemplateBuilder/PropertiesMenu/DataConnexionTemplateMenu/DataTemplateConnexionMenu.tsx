import DataConnexionSelect from './DataConnexionSelect';
import { useTranslations } from 'next-intl';

function DataTemplateConnexionMenu() {
  // const { onSelectCollection } = useTemplateBuilder();
  // const [open, setOpen] = useState(false);
  // const user = useMongoUser();
  const t = useTranslations('TemplateSection');

  // const handleSubmit = async (collection: ICollection) => {
  //   onSelectCollection(collection);
  //   setOpen(false);
  // };

  return (
    <div className='flex flex-col'>
      <span className='text-sm'>{t('dataConnexion')}</span>
      {/* <Dialog
          open={open}
          onOpenChange={setOpen}
          Trigger={
            <Button>
              <FontAwesomeIcon icon={faAdd} />
            </Button>
          }>
          {user ? (
            <CollectionForm
              user={getUserSummary(user)}
              organizationId={user.organizationId}
              onSubmit={handleSubmit}
            />
          ) : null}
        </Dialog> */}
      <DataConnexionSelect />
    </div>
  );
}
export default DataTemplateConnexionMenu;
