import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {getMessages} from 'next-intl/server'; // ✅ لازم تضيف دي
import {routing} from '@/i18n/routing';
import Header from './components/Header';
import '@/app/[locale]/globals.css'
import PageTransition from './components/PageTransation';
import Footer from './components/Footer';
import { AppProvider } from './context/contextData';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string }; 
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
  <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Bree+Serif&family=Changa:wght@200..800&family=Edu+SA+Hand:wght@400..700&family=Edu+VIC+WA+NT+Hand+Pre:wght@400..700&family=El+Messiri:wght@400..700&family=Playpen+Sans+Arabic:wght@100..800&family=Reem+Kufi:wght@400..700&family=Vazirmatn:wght@100..900&display=swap" rel="stylesheet" />
</head>



  <body className={`${locale === 'ar' ? 'rtl' : 'ltr'} relative min-h-screen overflow-x-hidden`}>
  

   
    <div className="fixed top-0 left-0 w-full h-full bg-black/75 z-10"></div>

  
    <div className="relative z-20">
      <NextIntlClientProvider locale={locale} messages={messages}>
        <PageTransition>
          <AppProvider>
          <Header />
          {children}
          <Footer />
          </AppProvider>
        </PageTransition>
      </NextIntlClientProvider>
    </div>
  </body>
</html>

  );
}

