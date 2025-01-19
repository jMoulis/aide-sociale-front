'use client';

import { IAddress, IOrganization, ITeam } from '@/lib/interfaces/interfaces';
import OrganizationForm from './OrganizationForm';
import { useState } from 'react';
import { toastPromise } from '@/lib/toast/toastPromise';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { removeObjectFields } from '@/lib/utils/utils';
import { useTranslations } from 'next-intl';
import Addresses from '@/components/Address/Addresses';
import ContactsInfo from '@/components/ContactInfo/ContactsInfo';
import Teams from '@/components/Teams/Teams';
import Button from '@/components/buttons/Button';

type Props = {
  prevOrganization: IOrganization | null;
  teams?: ITeam[];
};
function OrganizationPage({ prevOrganization, teams = [] }: Props) {
  const [organization, setOrganization] = useState<IOrganization | null>(
    prevOrganization
  );
  const [selectedTab, setSelectedTab] = useState('infos');
  const t = useTranslations('OrganizationSection');

  const handleSaveOrganization = async (organization: IOrganization) => {
    if (prevOrganization) {
      await toastPromise(
        client.update(
          ENUM_COLLECTIONS.ORGANIZATIONS,
          { _id: prevOrganization._id },
          { $set: removeObjectFields(organization, ['_id']) }
        ),
        t,
        'edit'
      );
    } else {
      await toastPromise(
        client.create(ENUM_COLLECTIONS.ORGANIZATIONS, organization),
        t,
        'create'
      );
    }
  };
  const handleUpsertAddress = (addresses: IAddress[]) => {
    const updatedOrganization = {
      ...organization,
      addresses
    } as IOrganization;
    setOrganization(updatedOrganization);
    handleSaveOrganization(updatedOrganization);
  };

  const handleUpsertContactInfo = (contactsInfo: IAddress[]) => {
    const updatedOrganization = {
      ...organization,
      contactsInfo
    } as IOrganization;
    setOrganization(updatedOrganization);

    handleSaveOrganization(updatedOrganization);
  };

  if (!organization) return null;
  return (
    <>
      <OrganizationForm prevOrganization={organization} />
      <div className='flex'>
        <ul className='rounded-lg border bg-card text-card-foreground shadow-sm p-4 w-36 mr-4'>
          <li>
            <Button
              className={`w-full ${
                selectedTab === 'infos' ? 'bg-black text-white' : ''
              }`}
              onClick={() => setSelectedTab('infos')}>
              infos
            </Button>
          </li>
          <li>
            <Button
              className={`w-full ${
                selectedTab === 'teams' ? 'bg-black text-white' : ''
              }`}
              onClick={() => setSelectedTab('teams')}>
              Teams
            </Button>
          </li>
        </ul>
        <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-4'>
          {selectedTab === 'infos' ? (
            <div>
              <Addresses
                addresses={organization?.addresses || []}
                onUpdateAddress={handleUpsertAddress}
              />
              <ContactsInfo
                contactsInfo={organization?.contactsInfo || []}
                onUpdateContacts={handleUpsertContactInfo}
              />
            </div>
          ) : null}
          {selectedTab === 'teams' ? (
            <Teams prevTeams={teams} organizationId={organization._id} />
          ) : null}
        </div>
      </div>
    </>
  );
}
export default OrganizationPage;
