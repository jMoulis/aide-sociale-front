import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from '@/components/ui/toaster';
import MongoUserProvider from '@/lib/mongo/MongoUserContext/MongoUserContext';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import Header from '../components/Header';

config.autoAddCss = false;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Solinn app - App Editor',
  description: "Bienvenue sur la page d'accueil de Solinn app editor"
};

export default async function DefaultLayoutRender({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = (await getMessages()) as any;

  return (
    <html lang='fr'>
      <ClerkProvider dynamic>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <NextIntlClientProvider messages={messages}>
            <MongoUserProvider>
              <main className='main-my-app'>
                <Header />
                {children}
              </main>
              <Toaster />
            </MongoUserProvider>
          </NextIntlClientProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
