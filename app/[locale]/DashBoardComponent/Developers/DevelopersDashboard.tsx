"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import AddDeveloperDialog from "./AddDeveloperDialog";
import DevelopersList from "./DevelopersList";
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";

const DevelopersDashboard = () => {
  const [developers, setDevelopers] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDevelopers = () => {
    setLoading(true);
    fetch("/api/Developers")
      .then(res => res.json())
      .then(data => {
        setDevelopers(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDevelopers();
    
    
  }, []);
console.log(developers);

  const handleDeveloperUpdated = () => {
    fetchDevelopers();
  };
  const handleDeveloperDeleted = () => {
    fetchDevelopers();
  };

  return (
    <div className="p-6 min-h-[60vh]">
      <div className="flex justify-end mb-4">
        <Sheet open={openAdd} onOpenChange={setOpenAdd}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="text-sm text-white border-white/30 hover:bg-neutral-800 hover:text-white rounded-2xl font-bold px-6 py-2"
              onClick={() => setOpenAdd(true)}
            >
              إضافة مطور
            </Button>
          </SheetTrigger>
          <AddDeveloperDialog open={openAdd} onClose={() => { setOpenAdd(false); fetchDevelopers(); }} onDeveloperAdded={fetchDevelopers} />
        </Sheet>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <LoadingSpinner size="lg" color="red" />
        </div>
      ) : (
        
        <DevelopersList developers={developers} />
      )}
    </div>
  );
};

export default DevelopersDashboard; 