import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import Form from '../Form';
import Button from '@/components/buttons/Button';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useToast } from '@/lib/hooks/use-toast';
import FormFooterAction from '@/components/dialog/FormFooterAction';
import { Progress } from '@/components/ui/progress';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  imageUrl?: string | null;
  children?: React.ReactNode;
  onUpload: (file: File) => Promise<void>;
  progress?: number;
}
const ImageUpload = forwardRef<HTMLInputElement, Props>(
  ({ imageUrl, onUpload, progress }, ref) => {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState<string | undefined | null>(imageUrl);
    const tMedia = useTranslations('MediaSection');
    const tError = useTranslations('ErrorSection');
    const tGlobal = useTranslations('GlobalSection');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const [file] = event.target.files || [];
      if (!file) {
        return;
      }
      const selectedImageURL = URL.createObjectURL(file);
      setImage(selectedImageURL);
    };

    useEffect(() => {
      setImage(imageUrl);
    }, [imageUrl]);

    const handleSubmit = useCallback(
      async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const inputFile = event.currentTarget.elements.namedItem(
          'imageUrl'
        ) as HTMLInputElement | null;

        const [file] = inputFile?.files || [];
        if (!file) {
          toast({
            title: tError('errorUploadFileSelect.title'),
            description: tError('errorUploadFileSelect.description'),
            variant: 'destructive'
          });
          return;
        }
        await onUpload(file);
        setOpen(false);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );
    return (
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            {image ? (
              <Image
                className='rounded-md'
                src={image}
                alt='profile image'
                width={100}
                height={100}
              />
            ) : (
              <span>{tMedia('upload')}</span>
            )}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <span className='mr-2'>{tMedia('upload')}</span>
                <span>{tMedia('image')}</span>
              </DialogTitle>
              <DialogDescription></DialogDescription>
              <Form onSubmit={handleSubmit}>
                {image ? (
                  <Image
                    src={image}
                    alt='avatar'
                    width={100}
                    height={100}
                    className='rounded-md mb-3'
                  />
                ) : null}
                <input
                  ref={ref}
                  type='file'
                  name='imageUrl'
                  onChange={handleChange}
                />
                <FormFooterAction>
                  <Button type='submit'>{tGlobal('actions.save')}</Button>
                  {typeof progress === 'number' ? (
                    <Progress value={progress} />
                  ) : null}
                </FormFooterAction>
              </Form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;
