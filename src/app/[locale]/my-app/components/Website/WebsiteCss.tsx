import { Drawer } from '@/components/drawer/Drawer';
import Button from '@/components/buttons/Button';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import SaveButton from '@/components/buttons/SaveButton';
import IDE from '../Builder/Properties/IDE';
import { useCssLive } from '../stores/useCssLive';
import { useCssEditor } from '../stores/useCssEditor';

function WebsiteCss() {
  const setWebsiteCss = useCssLive((state) => state.setWebsiteStyle);
  const websiteCss = useCssLive((state) => state.websiteStyle);
  const {
    open,
    onOpenChange,
    websiteId,
    title,
    isSaving,
    onChangeStyle,
    onSubmit
  } = useCssEditor({
    pathStorage: `main.css`,
    stylesheetName: 'main'
  });
  const handleChange = (style: string) => {
    onChangeStyle(style, setWebsiteCss);
  };

  return (
    <Drawer
      title={title}
      side='left'
      open={open}
      onOpenChange={onOpenChange}
      Trigger={<Button>Website Css</Button>}>
      <div className='w-[400px]'>
        <span>{websiteId}</span>
        <IDE height='80vh' value={websiteCss} onChange={handleChange} />
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
  );
}
export default WebsiteCss;
