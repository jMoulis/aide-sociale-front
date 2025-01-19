'use client';

import { IStructure } from '@/lib/interfaces/interfaces';
import StructureForm from '../../components/StructureForm';
import { useRef, useState } from 'react';
import Tabs, { Tab } from '@/components/Tabs/Tabs';
import TabContent from '@/components/Tabs/TabContent';
import TabsWrapper from '@/components/Tabs/TabsWrapper';
import EmployeesList from '../[employeeId]/components/EmployeesList';

type Props = {
  initialStructure: IStructure;
  organizationId: string;
};
function StructureDetailPage({ initialStructure, organizationId }: Props) {
  const [structure, _setStructure] = useState<IStructure>(initialStructure);

  const [selectedTab, setSelectedTab] = useState<Tab>({
    label: 'infos',
    value: 'infos'
  });
  const tabs = useRef([
    { label: 'Info', value: 'infos' },
    { label: 'placements', value: 'placements' },
    { label: 'beneficiaries', value: 'beneficiaries' },
    { label: 'Employees', value: 'employees' }
  ]);

  return (
    <div className='flex'>
      <TabsWrapper>
        <Tabs
          tabs={tabs.current}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
        />
        <TabContent>
          {selectedTab.value === 'infos' ? (
            <StructureForm
              prevStructure={structure}
              organizationId={organizationId}
            />
          ) : null}
          {selectedTab.value === 'employees' ? (
            <EmployeesList
              structureId={structure._id}
              organizationId={organizationId}
            />
          ) : null}
        </TabContent>
      </TabsWrapper>
    </div>
  );
}
export default StructureDetailPage;
