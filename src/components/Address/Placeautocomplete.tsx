import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');
  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address', 'address_components']
    };
    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;
    placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace());
      document.body.style.pointerEvents = 'none';
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className='autocomplete-container'>
      <input
        className='flex w-full bg-white rounded-md border border-input px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 h-9 md:text-sm invalid:border-red-300'
        ref={inputRef}
        onFocus={() => (document.body.style.pointerEvents = 'unset')}
      />
    </div>
  );
};

export default PlaceAutocomplete;
