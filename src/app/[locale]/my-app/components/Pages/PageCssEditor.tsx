import { Drawer } from '@/components/drawer/Drawer';
import Button from '@/components/buttons/Button';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import SaveButton from '@/components/buttons/SaveButton';
import { useCssLive } from '../stores/useCssLive';
import IDE from '../Builder/Properties/IDE';
import { useCssEditor } from '../stores/useCssEditor';
import { usePageBuilderStore } from '../stores/pagebuilder-store-provider';

function PageCssEditor() {
  const selectedPage = usePageBuilderStore((state) => state.selectedPage);

  const setPageStyle = useCssLive((state) => state.setPageStyle);
  const pageStyle = useCssLive((state) => state.pageStyle);

  const { open, onOpenChange, isSaving, onChangeStyle, onSubmit, title } =
    useCssEditor({
      pathStorage: selectedPage ? `pages/page-${selectedPage._id}.css` : null,
      stylesheetName: selectedPage ? selectedPage.name : null
    });

  const handleChange = (style: string) => {
    onChangeStyle(style, setPageStyle);
  };
  return (
    <>
      <Drawer
        title={title}
        side='left'
        open={open}
        onOpenChange={onOpenChange}
        Trigger={<Button>Page css</Button>}>
        <div className='w-[400px]'>
          <span>{selectedPage?._id}</span>
          <IDE height='80vh' value={pageStyle} onChange={handleChange} />
          <FormFooterAction>
            <SaveButton
              disabled={isSaving}
              loading={isSaving}
              type='button'
              onClick={onSubmit}
            />
          </FormFooterAction>
        </div>
      </Drawer>
    </>
  );
}
export default PageCssEditor;
