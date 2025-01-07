import React, { useState } from 'react';

type Props = {
  onChange: (status: boolean) => void;
  prevStatus?: boolean;
};
const SwitchButton = ({ onChange, prevStatus }: Props) => {
  const [isPublished, setIsPublished] = useState(prevStatus || false);

  const toggleStatus = () => {
    const updatedStatus = !isPublished;
    setIsPublished(updatedStatus);
    onChange(updatedStatus);
  };

  return (
    <button
      type='button'
      onClick={toggleStatus}
      className={`relative w-12 h-7 flex items-center rounded-full transition-all
          ${isPublished ? 'bg-green-500' : 'bg-gray-400'}`}
      aria-label='Toggle publish status'>
      <span
        className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform transform
            ${isPublished ? 'translate-x-6' : 'translate-x-1'}`}></span>
    </button>
  );
};

export default SwitchButton;
