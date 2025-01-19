'use client';

import { IAddress } from '@/lib/interfaces/interfaces';
import { useEffect, useMemo, useState } from 'react';
import Form from '../form/Form';
import FormField from '../form/FormField';
import FormLabel from '../form/FormLabel';
import Input from '../form/Input';
import FormFooterAction from '../dialog/FormFooterAction';
import Button from '../buttons/Button';
import { useTranslations } from 'next-intl';
import DeleteButton from '../buttons/DeleteButton';
import PlaceAutocomplete from './Placeautocomplete';
import { StaticMap, createStaticMapsUrl } from '@vis.gl/react-google-maps';

type Props = {
  prevAddress: IAddress;
  onSubmit: (address: IAddress) => void;
  onDelete: (address: IAddress) => void;
};
function AddressForm({ prevAddress, onSubmit, onDelete }: Props) {
  const tGlobal = useTranslations('GlobalSection.actions');
  const t = useTranslations('AddressSection');

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [address, setAddress] = useState<IAddress>(prevAddress);
  useEffect(() => {
    if (prevAddress) {
      setAddress(prevAddress);
    }
  }, [prevAddress]);

  const staticMapsUrl = useMemo(() => {
    const coords = selectedPlace?.geometry?.location;
    const staticConfig = {
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      width: 512,
      height: 512,
      center: { lat: 53.555570296010295, lng: 10.008892744638956 },
      zoom: 15
    };
    if (coords) {
      return createStaticMapsUrl({
        ...staticConfig,
        center: { lat: coords.lat(), lng: coords.lng() },
        zoom: 15,
        markers: [
          { location: { lat: coords.lat(), lng: coords.lng() }, scale: 1 }
        ]
      });
    }
    return createStaticMapsUrl(staticConfig);
  }, [selectedPlace]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(address);
  };

  const handleSelectPlace = (place: google.maps.places.PlaceResult | null) => {
    if (!place) return;
    const extractFormFields = (addressComponents: any[]) => {
      const getComponent = (type: string): string | null => {
        return (
          addressComponents.find((component) => component.types.includes(type))
            ?.long_name || null
        );
      };

      const streetNumber = getComponent('street_number') || '';
      const route = getComponent('route') || '';
      const city =
        getComponent('locality') || getComponent('sublocality') || '';
      const zipCode = getComponent('postal_code') || '';
      const country = getComponent('country') || '';

      const address: Partial<IAddress> = {
        street: [streetNumber, route].filter(Boolean).join(' '), // Combine number and street
        city,
        zipCode,
        country
      };
      setSelectedPlace(place);
      return address;
    };
    const formFields = extractFormFields(place.address_components || []);
    const latitude = place.geometry?.location?.lat() || 0;
    const longitude = place.geometry?.location?.lng() || 0;
    setAddress((prev) => ({
      ...prev,
      ...formFields,
      coords: { latitude, longitude }
    }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className='autocomplete-control mb-4'>
        <PlaceAutocomplete onPlaceSelect={handleSelectPlace} />
      </div>
      <div className='flex space-x-4 items-center'>
        <div className='flex-1'>
          <FormField>
            <FormLabel required>{t('labels.label')}</FormLabel>
            <Input
              required
              name='label'
              value={address.label}
              onChange={handleInputChange}
            />
          </FormField>
          <FormField>
            <FormLabel required>{t('labels.street')}</FormLabel>
            <Input
              required
              name='street'
              value={address.street}
              onChange={handleInputChange}
            />
          </FormField>
          <FormField>
            <FormLabel required>{t('labels.city')}</FormLabel>
            <Input
              required
              name='city'
              value={address.city}
              onChange={handleInputChange}
            />
          </FormField>
          <FormField>
            <FormLabel required>{t('labels.zipCode')}</FormLabel>
            <Input
              required
              name='zipCode'
              value={address.zipCode}
              onChange={handleInputChange}
            />
          </FormField>
          <FormField>
            <FormLabel>{t('labels.country')}</FormLabel>
            <Input
              name='country'
              value={address.country}
              onChange={handleInputChange}
            />
          </FormField>
        </div>
        <div className='w-64'>
          <StaticMap className='rounded' url={staticMapsUrl} />
        </div>
      </div>
      <FormFooterAction>
        <Button type='submit'>{tGlobal('save')}</Button>
        <DeleteButton onClick={() => onDelete(address)} />
      </FormFooterAction>
    </Form>
  );
}
export default AddressForm;
