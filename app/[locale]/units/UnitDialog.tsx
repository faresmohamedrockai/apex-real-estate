import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { FaBed, FaBath, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";
import { ReactNode } from "react";

export type Unit = {
  _id: string;
  title: string;
  title_en?: string;
  price: number;
  unitType?: string;
  unitType_en?: string;
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  projectId?: string; // ObjectId as string
  region?: string;
  region_en?: string;
  project?: string;
  project_en?: string;
  isUnique?: boolean;
  latitude?: number;
  longitude?: number;
};

interface UnitDialogProps {
  unit: Unit;
  children: ReactNode;
}

export default function UnitDialog({ unit, children }: UnitDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl w-full bg-black/90 text-white border-white/20 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">{unit.title}</DialogTitle>
          <DialogDescription className="mb-4">
            <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
              <Image
                src={unit.images?.[0] || "/images/no-image.png"}
                alt={unit.title}
                fill
                className="object-cover"
              />
              {unit.unitType && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full shadow">
                  {unit.unitType}
                </div>
              )}
              {unit.isUnique && (
                <div className="absolute top-2 left-2 bg-[#b70501] text-white text-xs px-3 py-1 rounded-full font-bold shadow">
                  مميز
                </div>
              )}
            </div>
            <div className="space-y-2 text-right">
              <div className="flex items-center gap-2">
                <span>السعر:</span>
                <span>{unit.price.toLocaleString()} ج.م</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBed />
                <span>{unit.bedrooms}</span>
                <span>|</span>
                <FaBath />
                <span>{unit.bathrooms}</span>
              </div>
              {unit.area !== undefined && (
                <div className="flex items-center gap-2">
                  <span>المساحة:</span>
                  <span>{unit.area} م²</span>
                </div>
              )}
              {unit.region && (
                <div className="flex items-center gap-2">
                  <span>المنطقة:</span>
                  <span>{unit.region}</span>
                </div>
              )}
              {unit.project && (
                <div className="flex items-center gap-2">
                  <span>المشروع:</span>
                  <span>{unit.project}</span>
                </div>
              )}
              {(unit.latitude !== undefined && unit.longitude !== undefined) && (
                <div className="flex items-center gap-2">
                  <span>الموقع:</span>
                  <span>({unit.latitude}, {unit.longitude})</span>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
} 