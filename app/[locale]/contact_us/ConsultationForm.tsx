'use client';

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import MultiRangeSlider from '../components/MultiRangeSlider';
import dynamic from 'next/dynamic';
import { useCurrentLocale, getLocalizedObject } from '../utils/localeUtils';
import { FaPhone, FaWhatsapp } from 'react-icons/fa';
// import { useTranslations } from 'next-intl';
const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function ConsultationForm() {
  const t = useTranslations("form");
  const locale = useLocale();

  const [loading, setLoading] = useState(false);
  const [localizedProjects, setLocalizedProjects] = useState<any[]>([]);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    phone_type: "phone",
    email: "",
    project: "",
    unitType: "",
    notes: ""
  });


  const [priceRange, setPriceRange] = useState<[number, number]>([250000, 10000000]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setLocalizedProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    let requestData: any = {
      ...formData,
      priceRange: {
        min: priceRange[0],
        max: priceRange[1]
      }
    };
    if (locale === 'en') {
      requestData = {
        ...formData,
        name_en: formData.name,
        project_en: formData.project,
        unitType_en: formData.unitType,
        notes_en: formData.notes,
        // لا تفرغ الحقول الأساسية
        priceRange: {
          min: priceRange[0],
          max: priceRange[1]
        }
      };
    }
    

  

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      });

      const result = await res.json();
      console.log('API response:', result);

      if (res.ok) {
        setMessage({ text: t("successMessage"), type: "success" });
        setFormData({
          name: "",
          phone: "",
          phone_type: "phone",
          email: "",
          project: "",
          unitType: "",
          notes: ""
        });
        setPriceRange([250000, 10000000]);
      } else {
        setMessage({ text: result.message || t("errorMessage"), type: "error" });
      }
    } catch (err) {
      console.error('Error submitting consultation:', err);
      setMessage({ text: t("networkError"), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative z-10 min-h-screen pt-20 sm:pt-24  w-screen">
        <div className="max-w-5xl mx-auto px-4 py-8">


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8"
          >
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mb-6 p-4 rounded-lg text-center ${message.type === 'success'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                    }`}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <h1 className="text-2xl font-extrabold text-white text-center">{locale === 'ar' ? "من فضلك املاء الحقول الاتية" : "Please Fill Next Inputs"}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-white text-sm mb-2">{t("name")} *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t("enterName")}
                    className="w-full px-4 py-3 rounded-lg text-left bg-white/10 border border-white/20 text-white placeholder-white/50 placeholder:text-right focus:outline-none focus:border-[#b70501] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm mb-2">{t("phone")} *</label>
                  <div className="flex gap-2">
                    <div className="relative min-w-[120px]">
                      <select
                        name="phone_type"
                        value={formData.phone_type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pr-10 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#b70501] transition-colors text-sm appearance-none cursor-pointer"
                      >
                        <option value="phone" className="bg-black text-white flex items-center gap-2">
                          {locale === 'ar' ? 'هاتف' : 'Phone'}
                        </option>
                        <option value="whatsapp" className="bg-black text-white flex items-center gap-2">
                          {locale === 'ar' ? 'واتساب' : 'WhatsApp'}
                        </option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        {formData.phone_type === 'whatsapp' ? (
                          <FaWhatsapp className="text-white/70 text-sm" />
                        ) : (
                          <FaPhone className="text-white/70 text-sm" />
                        )}
                      </div>
                    </div>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder={t("enterPhone")}
                      className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none rlt:text-right focus:border-[#b70501] transition-colors"
                    />
                  </div>
                </div>
              </div>


              <div>
                <div>
                  <label className="block text-white text-sm mb-2">{t("email")} *</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}

                    placeholder={t("enterEmail")}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none rlt:text-right focus:border-[#b70501] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm mb-2">{t("project")}</label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:border-[#b70501]"
                >
                  <option value="">{t("selectProject")}</option>
                  {localizedProjects.map((project) => (
                    <option key={project._id} value={locale === 'en' ? (project.name_en || project.name) : project.name} className="bg-black text-white">
                      {locale === 'en' ? (project.name_en || project.name) : project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm mb-2">{t("unitType")}</label>
                <select
                  name="unitType"
                  value={formData.unitType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:border-[#b70501]"
                >
                  <option value="">{locale === 'ar' ? 'كل الأنواع' : 'All Types'}</option>
                  <option value="شقة">{locale === 'ar' ? 'شقة' : 'Apartment'}</option>
                  <option value="دوبلكس">{locale === 'ar' ? 'دوبلكس' : 'Duplex'}</option>
                  <option value="توين هاوس">{locale === 'ar' ? 'توين هاوس' : 'Twinhouse'}</option>
                  <option value="تاون هاوس">{locale === 'ar' ? 'تاون هاوس' : 'TownHouse'}</option>
                  <option value="فيلا">{locale === 'ar' ? 'فيلا' : 'Villa'}</option>
                  <option value="فيلا مستقلة">{locale === 'ar' ? 'فيلا مستقلة' : 'Standalone Villa'}</option>
                  <option value="بنتهاوس">{locale === 'ar' ? 'بنتهاوس' : 'Penthouse'}</option>
                  <option value="شاليه">{locale === 'ar' ? 'شاليه' : 'Chalet'}</option>
                  <option value="استوديو">{locale === 'ar' ? 'استوديو' : 'Studio'}</option>
                  <option value="لوفت">{locale === 'ar' ? 'لوفت' : 'Loft'}</option>
                  <option value="كابينة">{locale === 'ar' ? 'كابينة' : 'Cabin'}</option>
                  <option value="مكتب">{locale === 'ar' ? 'مكتب' : 'Office'}</option>
                  <option value="مكتب اداري">{locale === 'ar' ? 'مكتب إداري' : 'Admin Office'}</option>
                  <option value="عيادة">{locale === 'ar' ? 'عيادة' : 'Clinic'}</option>
                  <option value="تجاري">{locale === 'ar' ? 'تجاري' : 'Commercial'}</option>
                  <option value="عقار">{locale === 'ar' ? 'عقار' : 'Building'}</option>
                </select>

              </div>

              <div>
                <label className="block text-white text-sm mb-2">{t("priceRange")}</label>
                <div className="px-4 py-6 bg-white/5 rounded-lg">
                  <MultiRangeSlider
                    min={250000}
                    max={10000000}
                    values={priceRange}
                    onChange={setPriceRange}
                  />
                  <div className="flex justify-between text-white text-sm mt-2">
                    <span>{priceRange[0].toLocaleString()} {t("egp")}</span>
                    <span>{priceRange[1].toLocaleString()} {t("egp")}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white text-sm mb-2">{t("notes")}</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder={t("notesPlaceholder")}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#b70501] transition-colors resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-[#b70501] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#8a0401] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? t("sending") : t("send")}
              </motion.button>
            </form>
          </motion.div>


        </div>
      </div>
    </>
  );
}
