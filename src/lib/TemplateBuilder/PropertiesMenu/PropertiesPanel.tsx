'use client';

import { useTranslations } from 'next-intl';
import { Tab, useTemplateBuilder } from '../TemplateBuilderContext';
import Button from '@/components/buttons/Button';
import { useRef } from 'react';
import TemplatePropertiesMenu from './TemplatePropertiesMenu';
import History from './History/History';
import ListItemBuilder from './ListItemBuilder/ListItemBuilder';
import ElementPropertiesMenu from './ElementPropertiesMenu';

export default function PropertiesPanel() {
  const { onSelectTab, selectedTab, mode } = useTemplateBuilder();
  const t = useTranslations('TemplateSection');

  const tabs = useRef<{ name: Tab; trad: string; modes: string[] }[]>([
    {
      name: 'template',
      trad: 'templatePropertiesTab',
      modes: ['light', 'full']
    },
    {
      name: 'element',
      trad: 'elementPropertiesTab',
      modes: ['light', 'full']
    },
    {
      name: 'listItem',
      trad: 'listItemTab',
      modes: ['full']
    },
    {
      name: 'history',
      trad: 'historyTab',
      modes: ['light', 'full']
    }
  ]);

  return (
    <>
      <ul className='flex'>
        {tabs.current.map((tab) =>
          tab.modes.includes(mode || '') ? (
            <li key={tab.name} className='flex-1'>
              <Button
                className={`w-full flex justify-center text-center ${
                  selectedTab === tab.name ? 'bg-black text-white' : ''
                }`}
                onClick={() => onSelectTab(tab.name)}>
                {t(`${tab.trad}` as any)}
              </Button>
            </li>
          ) : null
        )}
      </ul>
      <div>
        {selectedTab === 'template' ? <TemplatePropertiesMenu /> : null}
        {selectedTab === 'element' ? <ElementPropertiesMenu /> : null}
        {selectedTab === 'listItem' && mode === 'full' ? (
          <ListItemBuilder />
        ) : null}
        {selectedTab === 'history' ? <History /> : null}
      </div>
    </>
  );
}
