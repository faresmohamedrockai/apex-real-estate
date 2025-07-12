import UnitDialog, { Unit } from "./UnitDialog";
import Image from "next/image";
import { FaBed, FaBath, FaBuilding, FaMapMarkerAlt, FaRulerCombined, FaGlobeAfrica } from "react-icons/fa";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface UnitsListProps {
  units: Unit[];
  t?: (key: string) => string;
  onUnitUpdated?: () => void;
  onUnitDeleted?: () => void;
}













export default function UnitsList({ units, t = (x) => x, onUnitUpdated, onUnitDeleted }: UnitsListProps) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [filter, setFilter] = useState("");
  const filteredUnits = units.filter(
    (item) =>
      item.title.toLowerCase().includes(filter.toLowerCase()) ||
      (item.unitType && item.unitType.toLowerCase().includes(filter.toLowerCase()))
  );
  return (
    <>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnits.map((item) => (
            <UnitDialog
              key={item._id}
              unit={item}
              onUnitUpdated={onUnitUpdated}
              onUnitDeleted={onUnitDeleted}
            >
              <div
                className="relative group rounded-2xl overflow-hidden shadow-xl w-full transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl bg-white/5 backdrop-blur-md border border-white/10 cursor-pointer"
                dir="rtl"
                style={{ height: "420px" }} // ✨ ارتفاع الكارت بالكامل
              >
                {/* صورة الوحدة */}
                <div className="relative h-[220px] overflow-hidden">
                  <Image
                    src={item.images?.[0] || '/images/no-image.png'}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                </div>

                {/* عنوان الوحدة */}
                <div className="absolute top-3 right-3 z-20 bg-black/50 text-white text-sm font-semibold px-3 py-1 rounded-xl">
                  {item.title}
                </div>

                {/* نوع الوحدة / مميز */}
                <div className="absolute top-3 left-3 z-20 flex flex-row-reverse items-center gap-2">
                  {item.unitType && (
                    <span className="bg-[#b70501] text-white text-xs px-2 py-1 rounded-full">
                      {item.unitType}
                    </span>
                  )}
                  {item.isUnique && (
                    <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                      {t('unique')}
                    </span>
                  )}
                </div>

                {/* معلومات الوحدة */}
                <div className="p-4 space-y-2 text-sm text-white bg-black/70 backdrop-blur-md h-[200px] overflow-y-auto scrollbar-hidden">
                  <div className="flex items-center justify-start gap-5">
                    <span className="text-white">السعر :</span>
                    <span className="font-bold text-[#b70501]">
                      {item.price?.toLocaleString()} ج.م
                    </span>
                  </div>
                  <div className="flex items-center justify-start gap-4">
                    <span className="flex gap-1 items-center">
                      <FaBath /> {item.bathrooms}
                    </span>
                    <span className="flex gap-1 items-center">
                      <FaBed /> {item.bedrooms}
                    </span>
                  </div>
                  {typeof item.area === 'number' && (
                    <div className="flex items-center justify-start">
                      <span className="flex gap-1 items-center">
                        <FaRulerCombined /> {item.area} م²
                      </span>
                    </div>
                  )}
                  {item.region && (
                    <div className="flex items-center justify-start">
                      <span className="flex gap-1 items-center">
                        <FaGlobeAfrica /> {item.region}
                      </span>
                    </div>
                  )}
                  {item.project && (
                    <div className="flex items-center justify-start">
                      <span className="flex gap-1 items-center">
                        <FaBuilding /> {item.project}
                      </span>
                    </div>
                  )}
                </div>

                {/* زر التفاصيل عند hover */}
                <div className="absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-xs bg-[#b70501] text-white px-3 py-1 rounded-full shadow-md">
                    {t('details')}
                  </span>
                </div>
              </div>
            </UnitDialog>
          ))}
        </div>
      </div>


    </>
  );
} 