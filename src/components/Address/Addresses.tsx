'use client';

import { IAddress } from '@/lib/interfaces/interfaces';
import Button from '../buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faMapLocationDot
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { useState } from 'react';
import Dialog from '../dialog/Dialog';
import AddressForm from './AddressForm';
import { v4 } from 'uuid';
import { useTranslations } from 'next-intl';
import SquareButton from '../buttons/SquareButton';
import { APIProvider } from '@vis.gl/react-google-maps';

type Props = {
  addresses: IAddress[];
  onUpdateAddress: (addresses: IAddress[]) => void;
};
function Addresses({ addresses, onUpdateAddress }: Props) {
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const t = useTranslations('AddressSection');

  const handleAddNewAddress = () => {
    const defaultAddress: IAddress = {
      _id: v4(),
      label: 'Mon addresse',
      street: '',
      city: '',
      zipCode: '',
      country: '',
      coords: {
        latitude: 0,
        longitude: 0
      }
    };
    setSelectedAddress(defaultAddress);
  };
  const handleDialogToggle = (status: boolean) => {
    if (!status) {
      setSelectedAddress(null);
    }
  };
  const handleUpsertAddress = (address: IAddress) => {
    const isNewAddress = !addresses.find((a) => a._id === address._id);
    const updatedAddresses = isNewAddress
      ? [...addresses, address]
      : addresses.map((a) => {
          if (a._id === address._id) {
            return address;
          }
          return a;
        });
    onUpdateAddress(updatedAddresses);
    setSelectedAddress(null);
  };

  const handleDeleteAddress = (address: IAddress) => {
    const updatedAddresses = addresses.filter((a) => a._id !== address._id);
    onUpdateAddress(updatedAddresses);
    setSelectedAddress(null);
  };

  return (
    <div>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <Dialog
          contentStyle={{ width: '50vw', maxWidth: 'unset' }}
          open={!!selectedAddress}
          onOpenChange={handleDialogToggle}
          Trigger={
            <Button onClick={handleAddNewAddress}>{t('addAddress')}</Button>
          }>
          {selectedAddress ? (
            <AddressForm
              prevAddress={selectedAddress}
              onSubmit={handleUpsertAddress}
              onDelete={handleDeleteAddress}
            />
          ) : null}
        </Dialog>
      </APIProvider>
      <div className='mt-2'>
        {addresses.map((address) => (
          <div key={address._id} className='flex  items-center mb-2'>
            <FontAwesomeIcon icon={faMapLocationDot} />
            <div>
              <p className='text-sm'>{address.label}</p>
              <p className='text-sm'>{address.street}</p>
            </div>
            <SquareButton onClick={() => setSelectedAddress(address)}>
              <FontAwesomeIcon icon={faEdit} />
            </SquareButton>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Addresses;
