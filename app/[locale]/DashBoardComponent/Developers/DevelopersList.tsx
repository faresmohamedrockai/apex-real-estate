import DeveloperDialog, { Developer } from "./DeveloperDialog";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface DevelopersListProps {
  developers: Developer[];
  onDeveloperUpdated?: (dev: Developer) => void;
  onDeveloperDeleted?: (id: string) => void;
}

export default function DevelopersList({ developers, onDeveloperUpdated, onDeveloperDeleted }: DevelopersListProps) {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {developers.length > 0 ? developers
          .filter(dev =>
            dev &&
            typeof dev._id === 'string' &&
            (typeof dev.name === 'string' ||
              (typeof dev.name === 'object' && dev.name !== null && 'ar' in dev.name))
          )



          .map((dev) => (


            
          <DeveloperDialog key={dev._id.toString()} developer={dev} onDeveloperUpdated={onDeveloperUpdated}>
            <div
              className="group relative h-[28rem] rounded-3xl overflow-hidden shadow-2xl cursor-pointer flex flex-col items-center justify-center bg-gradient-to-b from-[#b70501]/90 to-neutral-900/90 border border-white/10 hover:scale-105 transition-transform duration-300 backdrop-blur-md"
              dir="rtl"
            >
              {/* Glow effect */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full bg-[#b70501]/30 blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-300 z-0" />
              <div className="relative z-10 w-56 h-56 rounded-full border-8 border-white/40 shadow-2xl mb-8 overflow-hidden bg-white group-hover:border-[#b70501] group-hover:shadow-yellow-400/40 transition-all duration-300 flex items-center justify-center">
                <Image
                  src={typeof dev.logo === 'string' ? dev.logo : '/images/no-image.png'}
                  alt={typeof dev.name === "object" && dev.name !== null && 'ar' in dev.name && typeof (dev.name as any).ar === 'string'
                    ? (dev.name as any).ar
                    : typeof dev.name === 'string'
                      ? dev.name
                      : ''}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="relative z-10 text-3xl font-extrabold text-white bg-black/40 rounded-2xl px-8 py-4 mt-2 group-hover:text-[#b70501] group-hover:bg-white/70 group-hover:backdrop-blur-md transition-all duration-300 text-right shadow-lg">
                {typeof dev.name === "object" && dev.name !== null && 'ar' in dev.name && typeof (dev.name as any).ar === 'string'
                  ? (dev.name as any).ar
                  : typeof dev.name === 'string'
                    ? dev.name
                    : ''}
              </h3>
              {role === 'admin' && (
                <Button onClick={() => onDeveloperDeleted && onDeveloperDeleted(dev._id)} variant="destructive">حذف</Button>
              )}
            </div>
          </DeveloperDialog>
        )) : (
          <div className="col-span-full text-right py-12">
            <div className="text-6xl mb-4">🏢</div>
            <p className="text-xl font-medium text-white">لا توجد مطورين</p>
            <p className="text-sm text-white/70 mt-2">سيتم إضافة المطورين قريباً</p>
          </div>
        )}
      </div>
    </div>
  );
} 