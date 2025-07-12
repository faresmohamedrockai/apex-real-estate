// import { headers } from 'next/headers';
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Header from './components/Header'
import '@/app/[locale]/globals.css'
import PageTransition from './components/PageTransation'
import Footer from './components/Footer'
import { AppProvider } from './context/contextData'
import GlobalLoading from './components/GlobalLoading'
import { useRouter } from 'next/navigation';
import { Cairo } from 'next/font/google'
import ConditionalLayout from '@/app/showpathname';


const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  weight: ['300', '400', '700'],
  display: 'swap'
})

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={cairo.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="relative min-h-screen overflow-x-hidden font-sans">
       
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AppProvider>
              <GlobalLoading />
              <PageTransition>
               <ConditionalLayout>
                
                  {children}
               
                </ConditionalLayout>
              </PageTransition>
            </AppProvider>
          </NextIntlClientProvider>
      
      </body>
    </html>
  )
}
