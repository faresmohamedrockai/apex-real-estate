import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware({
  ...routing,
  defaultLocale: 'ar',         // تأكيد أن اللغة الافتراضية هي "ar"
   
});

export const config = {
  // Match all pathnames except for:
  // - paths that start with /api, /trpc, /_next, /_vercel
  // - paths that contain a dot (e.g. favicon.ico, image.png)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
