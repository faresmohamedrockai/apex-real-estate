'use client';

import {
  Sidebar as UiSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Users, House, Briefcase, HelpCircle, Menu, X, LogOut, Hotel, Building2, Star } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

const iconMap = { Users, House, Briefcase, HelpCircle, LogOut, Hotel, Building2, Star };

export type SidebarItem = {
  title: string;
  key: string;
  icon: keyof typeof iconMap;
  isLogout?: boolean;
};

interface SidebarProps {
  items: SidebarItem[];
  selected: string;
  onSelect: (key: string) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function Sidebar({ items, selected, onSelect, isOpen, setIsOpen }: SidebarProps) {
  // فصل عناصر القائمة عن تسجيل الخروج
  const menuItems = items.filter(item => !item.isLogout);
  const logoutItem = items.find(item => item.isLogout);

  return (
    <UiSidebar
      dir="rtl"
      className={clsx(
        "bg-[#b70501] min-h-screen transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <SidebarContent className="bg-[#b70501] text-white h-full flex flex-col">
        {/* Header مع زر إغلاق/فتح */}
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          {isOpen && (
            <div className="flex items-center gap-2">
              <Image
                width={40}
                height={40}
                src="/logo.png"
                alt="شعار"
                className="rounded-full"
              />
              <span className="font-bold text-lg">لوحة التحكم</span>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="flex-1 flex flex-col justify-between py-4">
          {/* عناصر القائمة */}
          <SidebarMenu className="flex flex-col space-y-2 w-full px-3">
            {menuItems.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = selected === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelect(item.key)}
                  className={clsx(
                    "flex items-center gap-x-3 text-sm px-4 py-3 cursor-pointer transition-all duration-200 rounded-xl w-full group",
                    "hover:bg-[#930400] hover:text-white",
                    {
                      "bg-[#930400] text-white font-semibold": isActive,
                      "text-white": !isActive,
                    }
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {isOpen && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </button>
              );
            })}
          </SidebarMenu>

          {/* تسجيل الخروج في الأسفل */}
          {logoutItem && (
            <SidebarFooter className="px-3 pb-4">
              <button
                onClick={() => onSelect(logoutItem.key)}
                className={clsx(
                  "flex items-center gap-x-3 text-sm px-4 py-3 cursor-pointer transition-all duration-200 rounded-xl w-full",
                  "bg-red-600/20 hover:bg-red-600/30 text-red-100 hover:text-white",
                  "border border-red-500/30 hover:border-red-500/50"
                )}
              >
                <LogOut className="w-5 h-5" />
                {isOpen && (
                  <span className="font-medium">تسجيل الخروج</span>
                )}
              </button>
            </SidebarFooter>
          )}
        </div>
      </SidebarContent>
    </UiSidebar>
  );
}
