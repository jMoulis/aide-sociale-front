import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../FormContext';
import { cn } from '@/lib/utils/shadcnUtils';

function RatingComponent({ props, context }: PropsWithChildrenAndContext) {
  const { onUpdateForm, getFormFieldValue } = useFormContext();
  const value = getFormFieldValue(context);

  const ratingVal = (value as number) || 0;
  const maxStars = props.max ?? 5;

  const handleChangeValue = (value: number) => {
    const collectionSlug = context.dataset?.collectionSlug;
    const filedName = context.dataset?.connexion?.field;
    if (!collectionSlug || !filedName) return;
    onUpdateForm(collectionSlug, filedName, value, context.listIndex);
  };

  return (
    <div
      ref={props.ref}
      className={cn('flex space-x-1 w-fit', props.className)}
      onClick={props.onClick}>
      {[...Array(maxStars)].map((_, i) => {
        const starIndex = i + 1;
        const filled = starIndex <= ratingVal;
        return (
          <button
            key={i}
            type='button'
            onClick={() => handleChangeValue(starIndex)}
            disabled={props.readOnly}>
            <span className={filled ? 'text-yellow-400' : 'text-gray-400'}>
              ★
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default RatingComponent;
