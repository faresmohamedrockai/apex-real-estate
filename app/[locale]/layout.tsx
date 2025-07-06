import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Header from './components/Header';
import '@/app/[locale]/globals.css';
import PageTransition from './components/PageTransation';
import Footer from './components/Footer';
import { AppProvider } from './context/contextData';
import GlobalLoading from './components/GlobalLoading';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={`${locale === 'ar' ? 'rtl' : 'ltr'} relative min-h-screen overflow-x-hidden`}>
        
        {/* ✅ كل المحتوى */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProvider>
            <GlobalLoading />
            <PageTransition>
              <Header />
              {children}
              <Footer />
            </PageTransition>
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
