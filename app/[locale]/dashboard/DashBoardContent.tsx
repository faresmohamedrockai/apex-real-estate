'use client';

import { useState, useMemo } from "react";
import Sidebar, { type SidebarItem } from "@/app/[locale]/dashboard/sideBar";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { UserRoundCheck } from 'lucide-react';
import { UsersTable } from "../DashBoardComponent/UsersTabel";
import UnitsDahsBoard from "../DashBoardComponent/Units/UnitsDahsBoard";
import Loading from "../components/loading/loading";
import ProjectsDashboard from "../DashBoardComponent/ProjectsDashboard";
import DevelopersDashboard from "../DashBoardComponent/Developers/DevelopersDashboard";
import ReviewsDashboard from "../DashBoardComponent/ReviewsDashboard";
import ConsultationDashboard from "../DashBoardComponent/Consultation/ConsultationDashboard";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [selected, setSelected] = useState("home");
  const [isOpen, setIsOpen] = useState(true);

  const role = session?.user?.role;
  console.log(session);
  const sidebarItems: SidebarItem[] = useMemo(() => {
    const baseItems: SidebarItem[] = [
      { title: "الوحدات", key: "inbox", icon: "House" },
      { title: "المشاريع", key: "calendar", icon: "Hotel" },
      { title: "المطورين", key: "search", icon: "Briefcase" },
      { title: "المراجعات", key: "reviews", icon: "Star" },
      { title: "الاستشارات", key: "consult", icon: "HelpCircle" },
    ];

    // إضافة المستخدمين في النهاية إذا كان admin
    if (role === "admin") {
      baseItems.push({ title: "المستخدمين", key: "home", icon: "Users" });
    }

    // إضافة تسجيل الخروج منفصل
    baseItems.push({ title: "تسجيل الخروج", key: "logout", icon: "LogOut", isLogout: true });

    return baseItems;
  }, [role]);

  const renderContent = () => {
    if (selected === "logout") {
      signOut({ callbackUrl: "/" });
      return <div className="p-10">جاري تسجيل الخروج...</div>;
    }

    switch (selected) {
     
      case "inbox":
        return <UnitsDahsBoard />;
         case "home":
        return role === "admin" ? <UsersTable /> : <div>ليس لديك صلاحية عبي امستخدمين اختار من القائمة</div>;
      case "calendar":
        return <ProjectsDashboard/>;
      case "search":
        return <DevelopersDashboard/>;
      case "reviews":
        return <ReviewsDashboard/>;
      case "consult":
        return <ConsultationDashboard/>;
      
      default:
        return <div>اختر قسم من القائمة</div>;
    }
  };

  if (status === "loading") return <Loading/>;


  return (
    <div dir="rtl" className="flex min-h-screen w-screen bg-neutral-900 text-white">
      <Sidebar
        items={sidebarItems}
        selected={selected}
        onSelect={setSelected}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <main
        className={`flex-1 transition-all duration-500 w-full ease-in-out ${
          isOpen ? "md:ml-52" : "md:ml-20"
        }`}
      >
        {/* Header محسن */}
        <div className="bg-gradient-to-r from-[#b70501]/10 to-transparent backdrop-blur-sm border-b border-white/10 p-8 md:p-12 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-[#b70501]/20 rounded-2xl shadow-lg">
                <UserRoundCheck size={40} className="text-[#b70501]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white">
                  مرحبًا يا: {(session?.user as any)?.name}
                </h1>
                <p className="text-white/70 text-sm md:text-base mt-2">
                  مرحبًا بك في لوحة التحكم
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-white/80 text-sm">الدور</p>
                <p className="text-[#b70501] font-semibold capitalize text-lg">{role}</p>
              </div>
              <div className="relative">
                <Image
                  src={"/red.logo.jpg"}
                  width={90}
                  height={90}
                  alt="icon"
                  className="rounded-2xl shadow-2xl shadow-[#b70501]/30 border-4 border-[#b70501]/20 hover:border-[#b70501]/40 transition-all duration-300 hover:scale-110"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-neutral-900 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="p-2 md:p-4 lg:p-8 w-full">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border w-full max-w-full mx-auto border-white/20 shadow-2xl overflow-hidden">
            <div className="p-6 md:p-10 lg:p-16">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
