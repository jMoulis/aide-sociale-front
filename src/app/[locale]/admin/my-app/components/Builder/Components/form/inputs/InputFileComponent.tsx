import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import { useFormContext } from '../../FormContext';
import Button from '@/components/buttons/Button';
import { useCallback, useState } from 'react';
import FileUpload from '@/components/form/ImageUpload/FileUpload';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/firebaseClient';

export interface FileUploadProgress {
  fileName: string;
  progress: number;
}

export const uploadMultipleFiles = (
  rootUrl: string,
  files: File[],
  onProgress?: (data: FileUploadProgress) => void
): Promise<string[]> => {
  const uploadPromises = files.map((file: File) => {
    const storageRef = ref(storage, `${rootUrl}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.({ fileName: file.name, progress });
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => resolve(url))
            .catch((error) => reject(error));
        }
      );
    });
  });
  return Promise.all(uploadPromises);
};
function InputFileComponent({ props, context }: PropsWithChildrenAndContext) {
  const [downloadURLs, setDownloadURLs] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const { getFormFieldValue, onUpdateForm } = useFormContext();
  const value = getFormFieldValue(context);

  const handleInputFileChange = useCallback(
    async (files: File[]) => {
      try {
        const urls = await uploadMultipleFiles(
          context.dataset?.connexion?.input?.storeSlug || '',
          [...files],
          ({ fileName, progress: fileProgress }: FileUploadProgress) => {
            setProgress((prev) => ({ ...prev, [fileName]: fileProgress }));
          }
        );
        // setDownloadURLs(urls);
        const storeSlug = context.dataset?.connexion?.input?.storeSlug;
        const filedName = context.dataset?.connexion?.input?.field;
        if (!storeSlug || !filedName) return;
        // const storagePath = `${context.dataset?.storeSlug}/${file.name}`;
        // const url = await uploadFile(file, storagePath);
        // console.log('url', url);
        // console.log(filedName);
        onUpdateForm(context, storeSlug, filedName, urls);
      } catch (error) {
        console.log(error);
      }
    },
    [context, onUpdateForm]
  );

  if (context.isBuilderMode) {
    return <Button {...props}>Upload</Button>;
  }
  return (
    <>
      <FileUpload {...props} name='imageUrl' onUpload={handleInputFileChange}>
        <div>
          {Object.keys(progress).map((fileName) => (
            <div key={fileName} className='mb-1'>
              <span className='mr-2'>{fileName}:</span>
              <span>{progress[fileName].toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </FileUpload>

      <div className='mt-4'>
        {downloadURLs.map((url) => (
          <a
            key={url}
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='block text-blue-500 hover:underline'>
            {url}
          </a>
        ))}
      </div>
    </>
  );
}

export default InputFileComponent;
