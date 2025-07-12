"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import AddProjectDialog from "./Projects/AddProjectDialog";
import ProjectsList from "./Projects/ProjectsList";
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const ProjectsDashboard = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProjects = () => {
    setLoading(true);
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectUpdated = () => {
    fetchProjects();
  };
  const handleProjectDeleted = () => {
    fetchProjects();
  };

  // فلترة المشاريع حسب البحث
  const filteredProjects = projects.filter((proj) => {
    const name = typeof proj.name === "object" && proj.name !== null ? proj.name.ar : proj.name;
    return name && name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-6 min-h-[60vh]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <div className="relative w-full md:w-1/3">
        <Input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن مشروع..."
          className="w-full rounded-xl bg-neutral-900/80 border border-white/20 text-white py-2 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-[#b70501] text-right placeholder:text-white/50"
          dir="rtl"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" size={22} />
      </div>
      <Sheet open={openAdd} onOpenChange={setOpenAdd}>
        <SheetTrigger asChild>
        <Button
          variant="outline"
          className="text-sm text-white border-white/30 hover:bg-neutral-800 hover:text-white rounded-2xl font-bold px-6 py-2"
          onClick={() => setOpenAdd(true)}
        >
          إضافة مشروع
        </Button>
        </SheetTrigger>
        <AddProjectDialog open={openAdd} onClose={() => { setOpenAdd(false); fetchProjects(); }} onProjectAdded={fetchProjects} />
      </Sheet>
      </div>
      <h2 className="text-3xl font-extrabold text-white mb-8 text-right">المشاريع</h2>
      {loading ? (
      <div className="flex justify-center items-center min-h-[40vh]">
        <LoadingSpinner size="lg" color="red" />
      </div>
      ) : (
      <ProjectsList projects={filteredProjects} onProjectUpdated={handleProjectUpdated} onProjectDeleted={handleProjectDeleted} />
      )}
    </div>
  );
};

export default ProjectsDashboard; 