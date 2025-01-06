'use client';

import * as React from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { isClerkErrors } from '@/lib/utils/auth/utils';
import { toast } from '@/lib/hooks/use-toast';
// import FormField from '@/components/form/FormField';
// import FormLabel from '@/components/form/FormLabel';
import { useTranslations } from 'next-intl';
// import Input from '@/components/form/Input';
// import InputPassword from '@/components/form/InputPassword';
// import Button from '@/components/buttons/Button';
// import FormFooterAction from '@/components/dialog/FormFooterAction';
// import Form from '@/components/form/Form';
import { ENUM_API_ROUTES } from '@/lib/interfaces/enums';
import { ISignupApiBody } from '@/lib/interfaces/api/auth/interfaces';
import { slugifyFunction } from '@/lib/utils/utils';
// import { IOrganization } from '../../dashboard/organization/interfaces';
import { v4 } from 'uuid';

type Identity = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = React.useState(false);
  const [code, setCode] = React.useState('');
  const router = useRouter();
  const t = useTranslations('SecuritySection');
  const tProfile = useTranslations('ProfilePage');
  const tGlobal = useTranslations('Global');
  const tOrganization = useTranslations('OrganizationSection');

  const [formIdentity, setFormIdentity] = React.useState<Identity>({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  // const [organization, setOrganization] = React.useState<IOrganization>({
  //   _id: v4(),
  //   name: '',
  //   subDomain: '',
  //   createdAt: new Date(),
  //   addresses: [],
  //   contactPoints: []
  // });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isLoaded) return;

    // Start the sign-up process using the email and password provided
    try {
      await signUp.create({
        ...formIdentity,
        emailAddress: formIdentity.email
      });
      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code'
      });

      // Set 'verifying' true to display second form
      // and capture the OTP code
      setVerifying(true);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setVerifying(false);
    setCode('');
    setFormIdentity({ firstName: '', lastName: '', email: '', password: '' });
  };
  // Handle the submission of the verification form
  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        const signupApiBody: ISignupApiBody = {
          authId: signUpAttempt.createdUserId as string,
          firstName: formIdentity.firstName,
          lastName: formIdentity.lastName,
          email: formIdentity.email
          // organizationInput: organization
        };
        await fetch(ENUM_API_ROUTES.SIGN_UP, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(signupApiBody)
        });
        const test = await signUpAttempt.reload();
        await setActive({ session: test.createdSessionId });
        router.push('/');
      } else {
        toast({
          title: 'Error',
          description: 'An error occurred',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      const { status, parsedError } = isClerkErrors(error);
      if (status) {
        resetForm();
        toast({
          title: 'Error',
          description: parsedError.errors
            ?.map((err: any) => err.message)
            .join(', '),
          variant: 'destructive'
        });
      }
    }
  };

  const handleInputIdentity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormIdentity({
      ...formIdentity,
      [event.target.name]: event.target.value
    });
  };

  const handleInputOrganization = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    // if (name === 'name') {
    //   setOrganization({
    //     ...organization,
    //     [name]: value,
    //     subDomain: slugifyFunction(value)
    //   });
    // } else {
    //   setOrganization({
    //     ...organization,
    //     [event.target.name]: event.target.value
    //   });
    // }
  };
  // Display the verification form to capture the OTP code
  if (verifying) {
    return (
      <>
        <h1>{t('verifyCodeEmail')}</h1>
        {/* <Form onSubmit={handleVerify}>
          <FormField>
            <FormLabel htmlFor='code'>{t('enterVerifyCode')}</FormLabel>
            <Input
              value={code}
              id='code'
              name='code'
              onChange={(e) => setCode(e.target.value)}
            />
          </FormField>
          <FormFooterAction>
            <Button type='submit'>{t('verify')}</Button>
          </FormFooterAction>
        </Form> */}
      </>
    );
  }

  // Display the initial sign-up form to capture the email and password
  return (
    <>
      <h1>{t('signUp')}</h1>
      {/* <Form onSubmit={handleSubmit}>
        <div>
          <h1>Identité</h1>
          <FormField>
            <FormLabel required htmlFor='firstName'>
              {tProfile('firstName')}
            </FormLabel>
            <Input
              onChange={handleInputIdentity}
              required
              id='firstName'
              name='firstName'
              placeholder={tProfile('firstNamePlaceholder')}
              value={formIdentity.firstName}
            />
          </FormField>
          <FormField>
            <FormLabel required htmlFor='lastName'>
              {tProfile('lastName')}
            </FormLabel>
            <Input
              onChange={handleInputIdentity}
              required
              id='lastName'
              name='lastName'
              placeholder={tProfile('lastNamePlaceholder')}
              value={formIdentity.lastName}
            />
          </FormField>
        </div>
        <div>
          <h1>{tOrganization('create.title')}</h1>
          <FormField>
            <FormLabel htmlFor='organization'>
              {tOrganization('organizationName')}
            </FormLabel>
            <Input
              onChange={handleInputOrganization}
              required
              id='organization'
              name='name'
              placeholder={tOrganization('organizationPlaceholder')}
              value={organization.name}
            />
            <div className='text-xs text-muted-foreground flex flex-col mt-1 ml-1'>
              <span className='text-xs text-muted-foreground flex flex-col'>
                {tOrganization('organizationSubdomainName')}
              </span>
              <span className='text-xs text-muted-foreground flex flex-col'>
                {organization.subDomain}.placementsocial.fr
              </span>
            </div>
          </FormField>
        </div>
        <div>
          <h1>Sécurité</h1>
          <FormField>
            <FormLabel required htmlFor='email'>
              {tProfile('email')}
            </FormLabel>
            <Input
              onChange={handleInputIdentity}
              required
              id='email'
              name='email'
              type='email'
              placeholder={tGlobal('emailPlaceholder')}
              value={formIdentity.email}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor='password'>{t('password')}</FormLabel>
            <InputPassword
              onChange={handleInputIdentity}
              id='password'
              name='password'
              value={formIdentity.password}
            />
          </FormField>
        </div>
        <FormFooterAction>
          <Button type='submit'>{t('signUp')}</Button>
        </FormFooterAction>
      </Form> */}
    </>
  );
}
