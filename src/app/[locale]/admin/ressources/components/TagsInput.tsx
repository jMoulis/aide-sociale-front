import React, { useState } from 'react';

type Props = {
  onChange: (tags: string[]) => void;
  previousTags?: string[];
};
const TagsInput = ({ onChange, previousTags }: Props) => {
  const [tags, setTags] = useState<string[]>(previousTags || []);
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        const updatedTags = [...tags, inputValue.trim()];
        setTags(updatedTags);
        onChange(updatedTags);
      }
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
    onChange(updatedTags);
  };

  return (
    <div className='w-full max-w-md mx-auto'>
      <div className='border border-gray-300 p-1 rounded'>
        <div className='flex flex-wrap gap-2'>
          {tags.map((tag, index) => (
            <button
              key={index}
              onClick={() => removeTag(index)}
              className='hover:bg-red-500 hover:text-white cursor-pointer flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded'>
              {tag}
              &times;
            </button>
          ))}
        </div>
        <input
          type='text'
          className='w-full border-0 rounded mt-1 px-1 py-1 focus:outline-none focus:ring-1 text-sm'
          placeholder='Type a word and press Enter'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default TagsInput;
