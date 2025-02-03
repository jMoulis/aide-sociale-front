import { faTimes } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

type Props = {
  onChange: (tags: string[]) => void;
  previousTags?: string[];
};
const TagsInput = ({ onChange, previousTags }: Props) => {
  const [tags, setTags] = useState<string[]>(previousTags || []);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    setTags(previousTags || []);
  }, [previousTags]);
  const t = useTranslations('GlobalSection.actions');
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
    <div className='flex flex-col'>
      <div className='flex flex-wrap gap-2 mb-5'>
        {tags.map((tag, index) => (
          <button
            type='button'
            key={index}
            onClick={() => removeTag(index)}
            className='hover:bg-red-500 hover:text-white cursor-pointer flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded'>
            <span className='text-xs mr-1'>{tag}</span>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        ))}
      </div>
      <input
        type='text'
        className='flex w-full bg-white rounded-md border border-input px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 h-9 md:text-sm invalid:border-red-300'
        placeholder={t('addTag')}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default TagsInput;
