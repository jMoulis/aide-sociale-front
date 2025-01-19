import Form from '@/components/form/Form';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import { UserExcerpt } from '@/lib/interfaces/interfaces';
import { useTranslations } from 'next-intl';

type Props = {
  user: UserExcerpt;
};

function BasicInformation({ user }: Props) {
  const t = useTranslations('ProfileSection');
  return (
    <Form>
      <FormField>
        <FormLabel>{t('email')}</FormLabel>
        <span className='text-muted-foreground text-xs'>{user.email}</span>
      </FormField>
    </Form>
  );
}

export default BasicInformation;
