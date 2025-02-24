import AiHTMLPrompt from '../Properties/AiFormPrompt/AiHTMLPrompt';
import AdvancedPageEditor from './AdvancedPageEditor';
import ElementsSelector from './ElementSelector';
import ElementsTree from './Tree/ElementsTree';

function ElementsTab() {
  return (
    <div className='border-r p-4 flex flex-col flex-1'>
      <AiHTMLPrompt />
      <AdvancedPageEditor />
      <ElementsSelector />
      <ElementsTree />
    </div>
  );
}
export default ElementsTab;
