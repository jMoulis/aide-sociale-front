import { Suspense } from 'react';
import ProfileForm from './components/ProfileForm';
import { currentUser } from '@clerk/nextjs/server';

async function ProfilePage() {
  const user = await currentUser();
  return (
    <Suspense fallback='loading...'>
      <ProfileForm
        userServer={{
          firstName: user?.firstName,
          lastName: user?.lastName,
          id: user?.id,
          imageUrl: user?.imageUrl
        }}
      />
    </Suspense>
  );
}

export default ProfilePage;
