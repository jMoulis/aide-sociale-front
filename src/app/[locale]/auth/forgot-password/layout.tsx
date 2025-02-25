import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mot de passe oublié',
  description: 'Gestion de placements'
};

function ForgotPasswordLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

export default ForgotPasswordLayout;
