import ProjectDialog, { Project } from "./ProjectDialog";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface ProjectsListProps {
  projects: Project[];
  onProjectUpdated: () => void;
  onProjectDeleted: () => void;
}

export default function ProjectsList({ projects, onProjectUpdated, onProjectDeleted }: ProjectsListProps) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [filter, setFilter] = useState("");
  const filteredProjects = projects.filter(
    (item) =>
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      (item.zone && item.zone.toLowerCase().includes(filter.toLowerCase()))
  );
  return (
    <div className="max-w-7xl mx-auto">
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredProjects.length > 0 ? filteredProjects.map((item) => {
          const projectForDialog = {
            ...item,
            developerId:
              typeof item.developerId === "object" && item.developerId !== null
                ? (item.developerId as any).name
                : item.developerId,
          };
          const imageSrc = Array.isArray(item.image) && item.image[0] ? item.image[0] : '/images/no-image.png';
          return (
            <ProjectDialog key={item._id} project={projectForDialog} onProjectUpdated={onProjectUpdated} onProjectDeleted={onProjectDeleted}>
              <div
                className="card-3d-interactive relative h-64 rounded-xl overflow-hidden shadow-lg block cursor-pointer"
                dir="rtl"
              >
                <Image
                  src={imageSrc}
                  alt={typeof item.name === "object" && item.name !== null ? (item.name as any).ar : item.name}
                  fill
                  className="object-cover z-0 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                <div className="card-glare"></div>
                <div className="relative z-20 p-4 pb-0 flex justify-end w-full">
                  <h2 className="text-lg font-bold text-white bg-black/45 rounded-2xl p-2 mb-2 group-hover:text-[#b70501] transition-colors duration-300 text-right">
                    {typeof item.name === "object" && item.name !== null ? (item.name as any).ar : item.name}
                  </h2>
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-20">
                  <div className="bg-black/70 backdrop-blur-sm p-3">
                    <div className="text-white text-xs space-y-1 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span>{typeof item.zone === "object" && item.zone !== null ? (item.zone as any).ar : item.zone || 'غير محدد'}</span>
                        <FaMapMarkerAlt className="text-white" />
                      </div>
                      {projectForDialog.developerId && (
                        <div className="flex items-center gap-2 justify-end">
                          <span>{projectForDialog.developerId}</span>
                          <FaBuilding className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ProjectDialog>
          );
        }        ) : (
          <div className="col-span-full text-right py-12">
            <div className="text-6xl mb-4">🏗️</div>
            <p className="text-xl font-medium text-white">لا توجد مشاريع</p>
            <p className="text-sm text-white/70 mt-2">سيتم إضافة المشاريع قريباً</p>
          </div>
        )}
      </div>
    </div>
  );
} 