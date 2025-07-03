'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AppData {
  user: any;
  inventory: any[];
  projects: any[];
  Developers: any[];
  loading: boolean;
}

const AppContext = createContext<AppData>({
  user: null,
  inventory: [],
  projects: [],
  Developers: [],
  loading: true,
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [projects, setProjects] = useState([]);
  const [Developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [developersRes, inventoryRes, projectsRes, userRes] = await Promise.all([
        fetch('/api/Developers'),
        fetch('/api/inventories'),
        fetch('/api/projects'),
        fetch('/api/user'),
      ]);

      const [developersData, inventoryData, projectsData, userData] = await Promise.all([
        developersRes.json(),
        inventoryRes.json(),
        projectsRes.json(),
        userRes.json(),
      ]);

      setDevelopers(developersData);
      setInventory(inventoryData);
      setProjects(projectsData);
      setUser(userData);
    } catch (error) {
      console.error('❌ خطأ أثناء تحميل البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ user, inventory, projects, Developers, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
