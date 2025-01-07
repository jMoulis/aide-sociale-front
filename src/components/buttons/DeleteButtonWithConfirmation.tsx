import { useTranslations } from 'next-intl';
import Dialog from '../dialog/Dialog';
import FormFooterAction from '../dialog/FormFooterAction';

import { FormEvent, useState } from 'react';
import CancelButton from './CancelButton';
import Form from '../form/Form';
import Button from './Button';

type Props = {
  onDelete: (
    event:
      | FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => Promise<void>;
  title: string;
  buttonActionText: React.ReactNode;
  deleteDescription?: string;
  deleteActionText: string;
  onCancel?: () => void;
  deleting?: boolean;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
};

function DeleteButtonWithConfirmation({
  title,
  onDelete,
  buttonActionText,
  deleteActionText,
  deleteDescription,
  onCancel,
  deleting,
  children,
  onOpenChange,
  disabled
}: Props) {
  const tGlobal = useTranslations('GlobalSection');
  const [open, setOpen] = useState(false);

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await onDelete(event);
      setOpen(false);
    } catch (error) {
      // console.error(error);
    }
  };
  const handleCancel = () => {
    setOpen(false);
    if (onCancel) {
      onCancel();
    }
  };
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={title}
      Trigger={
        <Button
          loading={deleting}
          disabled={deleting || disabled}
          onClick={(event) => event.stopPropagation()}
          type='button'
          className='bg-red-500 flex justify-start cursor-pointer text-white'>
          {buttonActionText}
        </Button>
      }>
      <Form onSubmit={handleDelete}>
        {children ?? deleteDescription}
        <FormFooterAction>
          <Button
            className='bg-red-500 flex justify-start cursor-pointer text-white'
            type='submit'>
            {deleteActionText}
          </Button>
          <CancelButton onClick={handleCancel} type='button'>
            {tGlobal('actions.cancel')}
          </CancelButton>
        </FormFooterAction>
      </Form>
    </Dialog>
  );
}
export default DeleteButtonWithConfirmation;
