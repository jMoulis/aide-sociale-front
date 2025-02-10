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
import { useTranslations } from 'next-intl';
import { useToast } from '@/lib/hooks/use-toast';
import FormFooterAction from '@/components/dialog/FormFooterAction';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  files?: string[];
  children?: React.ReactNode;
  onUpload: (files: File[]) => Promise<void>;
  progress?: number;
}
const FileUpload = forwardRef<HTMLInputElement, Props>(
  ({ files, onUpload, children }, ref) => {
    const { toast } = useToast();

    const [open, setOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>(files || []);
    const tMedia = useTranslations('MediaSection');
    const tError = useTranslations('ErrorSection');
    const tGlobal = useTranslations('GlobalSection');

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const tempFiles = event.target.files || [];

      const selectedFilesURL = [...tempFiles].map((file) =>
        URL.createObjectURL(file)
      );

      setUploadedFiles(selectedFilesURL);
    };

    useEffect(() => {
      setUploadedFiles(files || []);
    }, [files]);

    const handleSubmit = useCallback(
      async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const inputFile = event.currentTarget.elements.namedItem(
          'imageUrl'
        ) as HTMLInputElement | null;

        const files = inputFile?.files || [];

        // if (!file) {
        //   toast({
        //     title: tError('errorUploadFileSelect.title'),
        //     description: tError('errorUploadFileSelect.description'),
        //     variant: 'destructive'
        //   });
        //   return;
        // }
        await onUpload(Array.from(files));
        setOpen(false);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );
    return (
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <span>{tMedia('upload')}</span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <span className='mr-2'>{tMedia('upload')}</span>
                <span>{tMedia('image')}</span>
              </DialogTitle>
              <DialogDescription></DialogDescription>
              <Form onSubmit={handleSubmit}>
                <input
                  ref={ref}
                  multiple
                  type='file'
                  name='imageUrl'
                  onChange={handleChange}
                />
                <ul>
                  {uploadedFiles.map((file, key) => (
                    <li key={key}>{file}</li>
                  ))}
                </ul>
                {children}
                <FormFooterAction>
                  <Button type='submit'>{tGlobal('actions.save')}</Button>
                </FormFooterAction>
              </Form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
