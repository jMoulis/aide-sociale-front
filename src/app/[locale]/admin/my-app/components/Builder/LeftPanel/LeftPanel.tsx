import React from 'react';
import Button from '@/components/buttons/Button';
import { usePageBuilderStore } from '../../stores/pagebuilder-store-provider';
import ElementsTab from './ElementsTab';
import StylesTab from './StylesTab';
import StoresTab from './StoresTab';

function LeftPanel() {
  const pageVersion = usePageBuilderStore((state) => state.pageVersion);

  const [selectedTab, setSelectedTab] = React.useState('elements');

  const tabsRef = React.useRef(['elements', 'styles', 'stores']);

  if (!pageVersion) return null;
  return (
    <div className='flex'>
      <ul>
        {tabsRef.current.map((tab) => (
          <li key={tab}>
            <Button
              className={tab === selectedTab ? 'bg-black text-white' : ''}
              onClick={() => setSelectedTab(tab)}>
              {tab}
            </Button>
          </li>
        ))}
      </ul>
      <div className='flex'>
        {selectedTab === 'elements' ? <ElementsTab /> : null}
        {selectedTab === 'styles' ? <StylesTab /> : null}
        {selectedTab === 'stores' ? <StoresTab page={pageVersion} /> : null}
      </div>
    </div>
  );
}
export default LeftPanel;
