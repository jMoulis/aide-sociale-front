import { IContactInfo } from '@/lib/interfaces/interfaces';
import Button from '../buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faQuestion
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { useState } from 'react';
import Dialog from '../dialog/Dialog';
import { v4 } from 'uuid';
import ContactInfoForm from './ContactInfoForm';
import { useTranslations } from 'next-intl';
import SquareButton from '../buttons/SquareButton';
import { mappingContactInfoTypeIcon } from './mappingContactInfoTypeIcon';
import ContactInfoValue from './ContactInfoValue';

type Props = {
  contactsInfo: IContactInfo[];
  onUpdateContacts: (contactsInfo: IContactInfo[]) => void;
};
function ContactsInfo({ contactsInfo, onUpdateContacts }: Props) {
  const [selectedContactInfo, setSelectedContactInfo] =
    useState<IContactInfo | null>(null);
  const t = useTranslations('ContactInfoSection');
  const handleNewContactInfo = () => {
    const defaultAddress: IContactInfo = {
      _id: v4(),
      label: '',
      value: '',
      type: ''
    };
    setSelectedContactInfo(defaultAddress);
  };
  const handleDialogToggle = (status: boolean) => {
    if (!status) {
      setSelectedContactInfo(null);
    }
  };
  const handleUpsertContactInfo = (contactInfo: IContactInfo) => {
    const isNewContactInfo = !contactsInfo.find(
      (a) => a._id === contactInfo._id
    );
    const updatedContacts = isNewContactInfo
      ? [...contactsInfo, contactInfo]
      : contactsInfo.map((a) => {
          if (a._id === contactInfo._id) {
            return contactInfo;
          }
          return a;
        });
    onUpdateContacts(updatedContacts);
    setSelectedContactInfo(null);
  };

  const handleDeleteContactInfo = (contactInfo: IContactInfo) => {
    const updatedContacts = contactsInfo.filter(
      (a) => a._id !== contactInfo._id
    );
    onUpdateContacts(updatedContacts);
    setSelectedContactInfo(null);
  };
  return (
    <div>
      <Dialog
        open={!!selectedContactInfo}
        onOpenChange={handleDialogToggle}
        Trigger={
          <Button onClick={handleNewContactInfo}>{t('addContactInfo')}</Button>
        }>
        {selectedContactInfo ? (
          <ContactInfoForm
            prevContactInfo={selectedContactInfo}
            onSubmit={handleUpsertContactInfo}
            onDelete={handleDeleteContactInfo}
          />
        ) : null}
      </Dialog>
      {contactsInfo.map((contactInfo) => (
        <div key={contactInfo._id} className='flex items-center my-1'>
          <div>
            <p className='text-sm'>{contactInfo.label}</p>
            <div className='flex items-center'>
              <FontAwesomeIcon
                className='mr-2 text-sm'
                icon={
                  mappingContactInfoTypeIcon[contactInfo.type] || faQuestion
                }
              />
              <ContactInfoValue
                type={contactInfo.type}
                value={contactInfo.value}
              />
            </div>
          </div>
          <SquareButton onClick={() => setSelectedContactInfo(contactInfo)}>
            <FontAwesomeIcon icon={faEdit} />
          </SquareButton>
        </div>
      ))}
    </div>
  );
}
export default ContactsInfo;
