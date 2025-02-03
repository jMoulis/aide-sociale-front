import React from 'react';
import Button from '@/components/buttons/Button';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import ElementsTab from './ElementsTab';
import StylesTab from './StylesTab';

function LeftPanel() {
  const pageVersion = usePageBuilderStore((state) => state.pageVersion);

  const [selectedTab, setSelectedTab] = React.useState('elements');

  const tabsRef = React.useRef(['elements', 'styles']);

  if (!pageVersion) return null;
  return (
    <div className='flex'>
      <ul>
        {tabsRef.current.map((tab) => (
          <li key={tab}>
            <Button onClick={() => setSelectedTab(tab)}> {tab}</Button>
          </li>
        ))}
      </ul>
      <div className='w-[250px] flex'>
        {selectedTab === 'elements' ? <ElementsTab /> : null}
        {selectedTab === 'styles' ? <StylesTab /> : null}
      </div>
    </div>
  );
}
export default LeftPanel;
