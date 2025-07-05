'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AppData {
  user: unknown;
  inventory: unknown[];
  projects: unknown[];
  Developers: unknown[];
  reviews: unknown[];
  loading: boolean;
}

const AppContext = createContext<AppData>({
  user: null,
  inventory: [],
  projects: [],
  Developers: [],
  reviews: [],
  loading: true,
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [projects, setProjects] = useState([]);
  const [Developers, setDevelopers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [developersRes, inventoryRes, projectsRes, userRes, reviewsRes] = await Promise.all([
        fetch('/api/Developers'),
        fetch('/api/inventories'),
        fetch('/api/projects'),
        fetch('/api/user'),
        fetch('/api/review?canShow=true&limit=20'),
      ]);

      const [developersData, inventoryData, projectsData, userData, reviewsData] = await Promise.all([
        developersRes.json(),
        inventoryRes.json(),
        projectsRes.json(),
        userRes.json(),
        reviewsRes.json(),
      ]);

      setDevelopers(developersData);
      setInventory(inventoryData);
      setProjects(projectsData);
      setUser(userData);
      setReviews(reviewsData.reviews || []);
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
    <AppContext.Provider value={{ user, inventory, projects, Developers, reviews, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
