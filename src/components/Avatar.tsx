import { faUser } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

type Props = {
  src?: string | null;
  alt: string;
  size?: number;
};
function Avatar({ src, alt, size }: Props) {
  return (
    <div className='flex items-center justify-center'>
      {src ? (
        <Image
          src={src}
          alt={alt}
          sizes={`${size || '40'}px`}
          height={size || 40}
          width={size || 40}
          className='rounded-full'
          style={{
            objectFit: 'cover'
          }}
        />
      ) : (
        <FontAwesomeIcon
          icon={faUser}
          style={{
            height: `${size || '40'}px`,
            width: `${size || '40'}px`
          }}
        />
      )}
    </div>
  );
}
export default Avatar;
