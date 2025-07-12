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
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredUnits.map((item) => (
            <UnitDialog key={item._id} unit={item} onUnitUpdated={onUnitUpdated} onUnitDeleted={onUnitDeleted}>
              <div
                className="card-3d-interactive relative h-64 rounded-xl overflow-hidden shadow-lg block cursor-pointer"
                dir="rtl"
              >
                <Image
                  src={item.images?.[0] || '/images/no-image.png'}
                  alt={item.title}
                  fill
                  className="object-cover z-0 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                <div className="card-glare"></div>
                <div className="relative z-20 p-4 pb-0 flex justify-end w-full">
                  <h2 className="text-lg font-bold text-white bg-black/45 rounded-2xl p-2 mb-2 group-hover:text-[#b70501] transition-colors duration-300 text-right">
                    {item.title}
                  </h2>
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-20">
                  <div className="bg-black/70 backdrop-blur-sm p-3">
                    <div className="text-white text-xs space-y-1 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-[#b70501] font-bold">{item.price?.toLocaleString()} ج.م</span>
                        <span className="text-white">{t('price')}:</span>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <span>{item.bathrooms}</span>
                        <FaBath className="text-white" />
                        <span className="text-white">|</span>
                        <span>{item.bedrooms}</span>
                        <FaBed className="text-white" />
                      </div>
                      {typeof item.area === 'number' && (
                        <div className="flex items-center gap-2 justify-end">
                          <span>{item.area} م²</span>
                          <FaRulerCombined className="text-white" />
                        </div>
                      )}
                      {item.region && (
                        <div className="flex items-center gap-2 justify-end">
                          <span>{item.region}</span>
                          <FaGlobeAfrica className="text-white" />
                        </div>
                      )}
                      {item.project && (
                        <div className="flex items-center gap-2 justify-end">
                          <span>{item.project}</span>
                          <FaBuilding className="text-white" />
                        </div>
                      )}
                      {item.unitType && (
                        <div className="flex items-center gap-2 justify-end">
                          <span className="bg-[#b70501] text-white text-xs px-2 py-1 rounded-full">
                            {item.unitType}
                          </span>
                        </div>
                      )}
                      {item.isUnique && (
                        <div className="flex items-center gap-2 justify-end">
                          <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                            {t('unique')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </UnitDialog>
          ))}
        </div>
      </div>
    </>
  );
} 