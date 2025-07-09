'use client';

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function LangChanger() {
  const pathname = usePathname(); // /en/projects
  const currentLocale = useLocale(); // 'en'

  const nextLocale = currentLocale === 'ar' ? 'en' : 'ar';
  const label = currentLocale === 'ar' ? 'English' : 'العربية';

  // Remove the current locale manually
  const newPath = pathname.replace(`/${currentLocale}`, '') || '/';

  return (
    <Link
      href={newPath}
      locale={nextLocale}
      className="px-4 py-2  text-[#f8eef0] rounded hover:opacity-90 transition font-bold bg-[#b70501]"
    >
      {label}
    </Link>
  );
}
