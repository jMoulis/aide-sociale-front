import { faTimes } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

type Props = {
  onChange: (tags: string[]) => void;
  previousTags?: string[];
  addTag?: string;
  CustomTagComponent?: React.FC<{ tag: string; index: number }>;
};
const TagsInput = ({
  onChange,
  previousTags,
  addTag,
  CustomTagComponent
}: Props) => {
  const [tags, setTags] = useState<string[]>(previousTags || []);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = React.useRef<HTMLInputElement>(null);

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
      <div className='flex flex-wrap gap-2 mb-2'>
        {tags.length ? (
          tags.map((tag, index) =>
            CustomTagComponent ? (
              <CustomTagComponent key={index} tag={tag} index={index} />
            ) : (
              <button
                type='button'
                key={index}
                onClick={() => removeTag(index)}
                className='hover:bg-red-500 hover:text-white cursor-pointer flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded'>
                <span className='text-xs mr-1'>{tag}</span>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )
          )
        ) : (
          <span
            onClick={() => inputRef.current?.focus()}
            className='hover:bg-blue-500 hover:text-white cursor-pointer flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded'>
            <span className='text-xs mr-1'>{addTag ?? t('addTag')}</span>
          </span>
        )}
      </div>
      <input
        type='text'
        ref={inputRef}
        className='flex w-full bg-white rounded-md border border-input px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-blue-400 focus-visible:ring-1 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 h-9 md:text-sm invalid:border-red-300'
        placeholder={t('addTagPlaceholder')}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default TagsInput;
