import AiHTMLPrompt from '../Properties/AiFormPrompt/AiHTMLPrompt copy';
import AdvancedPageEditor from './AdvancedPageEditor';
import ElementsSelector from './ElementSelector';
import TreeView from './Tree/TreeView';

function ElementsTab() {
  return (
    <div className='border-r p-4 flex flex-col flex-1'>
      <AiHTMLPrompt />
      <AdvancedPageEditor />
      <ElementsSelector />
      <TreeView />
    </div>
  );
}
export default ElementsTab;
