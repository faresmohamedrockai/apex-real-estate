import ProjectsList from "./ProjectsList";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import AddProjectDialog from "./AddProjectDialog";

const ProjectsDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProjects = () => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => setProjects(data));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Show message for 3 seconds after adding a project
  const handleProjectAdded = () => {
    setMessage("تمت إضافة المشروع بنجاح");
    fetchProjects();
    setOpenAdd(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleProjectUpdated = () => {
    setMessage("تم تعديل المشروع بنجاح");
    fetchProjects();
    setTimeout(() => setMessage(""), 3000);
  };

  const handleProjectDeleted = () => {
    setMessage("تم حذف المشروع بنجاح");
    fetchProjects();
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="p-6">
      {message && (
        <div className="mb-4 text-center text-white bg-green-600 rounded p-2 font-bold animate-pulse">
          {message}
        </div>
      )}
      <div className="flex justify-end mb-4">
        <Sheet open={openAdd} onOpenChange={setOpenAdd}>
          <SheetTrigger asChild className=" bg-[#b70501]">
            <Button
              variant="outline"
              className="text-sm text-white border-white/30 bg-[#b70501]  hover:bg-[#b70501]/90 hover:text-white rounded-2xl font-bold px-6 py-2 cursor-pointer"
              onClick={() => setOpenAdd(true)}
            >
              إضافة مشروع
            </Button>
          </SheetTrigger>
          <AddProjectDialog open={openAdd} onClose={() => setOpenAdd(false)} onProjectAdded={handleProjectAdded} />
        </Sheet>
      </div>
      <ProjectsList projects={projects} onProjectUpdated={handleProjectUpdated} onProjectDeleted={handleProjectDeleted} />
    </div>
  );
};

export default ProjectsDashboard; 