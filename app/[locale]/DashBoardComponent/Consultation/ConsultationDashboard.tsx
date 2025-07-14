"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/app/[locale]/components/LoadingSpinner";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

type Consultation = {
  _id: string;
  name: string;
  name_en?: string;
  email?:string
  phone?: string;
  phone_type?:string;
  project?: string;
  project_en?: string;
  unitType?: string;
  unitType_en?: string;
  priceRange?: { min: number; max: number };
  notes?: string;
  notes_en?: string;
  status?: string;
  message?: string;
  read?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const ConsultationDashboard = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchConsultations = async () => {
    setLoading(true);
    const res = await fetch("/api/consultation");
    const data = await res.json();
    setConsultations(data);
  
    
    setLoading(false);
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف الاستشارة؟")) return;
    const res = await fetch(`/api/consultation/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessage("تم حذف الاستشارة بنجاح");
      fetchConsultations();
      setTimeout(() => setMessage(""), 2000);
    } else {
      setMessage("حدث خطأ أثناء الحذف");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    const res = await fetch(`/api/consultation/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    if (res.ok) {
      setMessage("تم تعليم الاستشارة كمقروءة");
      fetchConsultations();
      setTimeout(() => setMessage(""), 2000);
    } else {
      setMessage("حدث خطأ أثناء التحديث");
    }
  };

  const filteredConsultations = consultations.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-transparent min-h-screen text-white">
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <LoadingSpinner size="lg" color="red" />
        </div>
      ) : (
        <>
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 text-center text-white bg-green-600 rounded p-2 font-bold"
            >
              {message}
            </motion.div>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن استشارة..."
                className="w-full rounded-xl bg-neutral-900/80 border border-white/20 text-white py-2 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-[#b70501] text-right placeholder:text-white/50"
                dir="rtl"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" size={22} />
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-6 text-right">الاستشارات</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConsultations.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`relative rounded-2xl p-6 shadow-md backdrop-blur-md transition-all border-2 ${
                  item.read ? "bg-green-900/20 border-green-500" : "bg-yellow-900/20 border-yellow-500"
                }`}
              >
                {/* Badge الحالة */}
                <div className={`absolute top-4 left-4 px-4 py-1 rounded-full text-xs font-bold shadow-lg
                  ${item.read ? "bg-green-600 text-white" : "bg-red-800 text-white animate-pulse"}`}>
                  {item.read ? " قرأت " : "لم تقرأ"}
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="font-bold text-red-400">الاسم: </span>
                    <span className="font-normal">{item.name || item.name_en || '-'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-red-400">الاسم بالإنجليزية: </span>
                    <span className="font-normal">{item.name_en || item.name || '-'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-red-400">رقم الهاتف: </span>
                    <span className="font-normal">{item.phone}</span>
                  </div>
                  <div>
                    <span className="font-bold text-red-400">نوع رقم الهاتف:</span>
                    <span className="font-normal">{item.phone_type}</span>
                  </div>
                  <div>
                    <span className="font-bold text-red-400"> البريد الالكتروني: </span>
                    <span className="font-normal">{item.email}</span>
                  </div>
                  <div>
                    <span className="font-bold text-red-400">المشروع: </span>
                    <span className="font-normal">{item.project || item.project_en || '-'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-red-400">المشروع (بالإنجليزية): </span>
                    <span className="font-normal">{item.project_en || item.project || '-'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-red-400">نوع الوحدة: </span>
                    <span className="font-normal">{item.unitType || item.unitType_en || '-'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-red-400">نوع الوحدة (بالإنجليزية): </span>
                    <span className="font-normal">{item.unitType_en || item.unitType || '-'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-red-400">الميزانية: </span>
                    <span className="font-normal">{(item.priceRange?.min ?? '-') + ' - ' + (item.priceRange?.max ?? '-')}</span>
                  </div>
                  <div>
                    <span className="font-bold text-red-400">ملاحظات: </span>
                    <span className="font-normal">{item.notes || item.notes_en || '-'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-red-400">ملاحظات (بالإنجليزية): </span>
                    <span className="font-normal">{item.notes_en || item.notes || '-'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-red-400">الحالة: </span>
                    <span className={`font-bold ${item.read ? 'text-red-400' : 'text-green-400'}`}>{item.read  ? "تمت القراءة": "قيد الانتظار" }</span>
                  </div>
                </div>
                <div className="text-xs opacity-60 mb-1">أنشئت في: {item.createdAt && new Date(item.createdAt).toLocaleString()}</div>
                <div className="text-xs opacity-60 mb-3">آخر تحديث: {item.updatedAt && new Date(item.updatedAt).toLocaleString()}</div>

                <div className="text-white mt-2 mb-4">{item.message}</div>

                <div className="flex gap-2 mt-2">
                  {!item.read && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleMarkAsRead(item._id)}
                    >
                      تمت القراءة
                    </Button>
                  )}
                  {role === 'admin' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item._id)}
                    >
                      حذف
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ConsultationDashboard;
