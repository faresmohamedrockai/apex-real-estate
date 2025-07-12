// components/ConditionalLayout.tsx
'use client';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Header from '@/app/[locale]/components/Header';
import Footer from '@/app/[locale]/components/Footer';


export default function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

   // نتحقق إذا المسار يحتوي على /dashboard أو /login بعد الجزء الخاص بالـ locale
   const isDashboard = pathname.includes('/dashboard');
   const isLogin = pathname.includes('/login');
 
   const hideLayout = isDashboard || isLogin;

  return (
    <>
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        {!hideLayout && <Header />}
       
        <main className="flex-1 w-full">
          {children}
        </main>
        {!hideLayout && <Footer />}
      </div>
      </SidebarProvider>
    </>
  );
}
