'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaStar } from 'react-icons/fa';
import ImageBG from '../components/ImageBG';
import MultiRangeSlider from '../components/MultiRangeSlider';
import { useAppContext } from '../context/contextData';

interface Project {
  _id: string;
  name: string;
}

export default function ContactForm() {
  const t = useTranslations('form');
  const contactT = useTranslations('cntactText');
  const { projects } = useAppContext();
  const [formType, setFormType] = useState<'review' | 'consultation'>('consultation');
  const [priceRange, setPriceRange] = useState<[number, number]>([250000, 100000000]);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    project: '',
    unitType: 'سكني',
    notes: '',
    review: ''
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const slideTransition = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 60 },
    transition: { duration: 0.4 },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const endpoint = formType === 'consultation' ? '/api/consultation' : '/api/review';
      const payload = formType === 'consultation' ? {
        name: formData.name,
        phone: formData.phone,
        project: formData.project,
        unitType: formData.unitType,
        priceRange: {
          min: priceRange[0],
          max: priceRange[1]
        },
        notes: formData.notes
      } : {
        name: formData.name,
        phone: formData.phone,
        rating,
        review: formData.review,
        project: formData.project,
        unitType: formData.unitType
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message });
        // Reset form
        setFormData({
          name: '',
          phone: '',
          project: '',
          unitType: t('residential'),
          notes: '',
          review: ''
        });
        setPriceRange([250000, 100000000]);
        setRating(5);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch {
      setMessage({ type: 'error', text: t('error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ImageBG />
      
      <div className="relative z-10 min-h-screen pt-24 bg-black/80">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl text-center font-extrabold text-white mb-10"
        >
          {contactT('text')}
        </motion.h1>

        {/* الأزرار */}
        <motion.div
          className="flex justify-center gap-4 mb-10"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {['consultation', 'review'].map((type) => (
            <motion.button
              key={type}
              variants={fadeInUp}
              custom={1}
              onClick={() => setFormType(type as 'consultation' | 'review')}
                className={`px-6 py-2 rounded-xl border text-lg font-medium transition-all duration-300 ${
                  formType === type
                  ? 'bg-[#b70501] text-white border-[#b70501]'
                    : 'border-[#b70501] text-[#b70501] bg-white hover:bg-[#b70501] hover:text-white'
                }`}
            >
              {type === 'consultation' ? t('consalte') : t('opinion')}
            </motion.button>
          ))}
        </motion.div>

          {/* رسالة النجاح/الخطأ */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mb-6 p-4 rounded-lg text-center ${
                  message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* النموذج */}
          <AnimatePresence mode="wait">
            <motion.div
              key={formType}
              {...slideTransition}
              className="max-w-2xl mx-auto"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* الاسم والهاتف */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      {t('name')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#b70501] transition-colors"
                      placeholder={t('namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      {t('phone')} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#b70501] transition-colors"
                      placeholder={t('phonePlaceholder')}
                    />
                  </div>
                </div>

                {/* المشروع */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {t('project')}
                  </label>
                  <select
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#b70501] transition-colors"
                  >
                    <option value="">{t('selectProject')}</option>
                    {projects?.map((project: unknown) => {
                      const projectItem = project as Project;
                      return (
                        <option key={projectItem._id} value={projectItem.name}>
                          {projectItem.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* نوع الوحدة */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {t('unitType')}
                  </label>
                  <select
                    name="unitType"
                    value={formData.unitType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#b70501] transition-colors"
                  >
                    <option value="سكني">{t('residential')}</option>
                    <option value="تجاري">{t('commercial')}</option>
                    <option value="إداري">{t('administrative')}</option>
                  </select>
                </div>

                {/* نطاق السعر - فقط للاستشارة */}
                {formType === 'consultation' && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      {t('priceRange')}
                    </label>
                    <div className="px-4 py-6 bg-white/5 rounded-lg">
                      <MultiRangeSlider
                        min={250000}
                        max={100000000}
                        onChange={setPriceRange}
                        values={priceRange}
                      />
                      <div className="flex justify-between text-white text-sm mt-2">
                        <span>{priceRange[0].toLocaleString()} {t('egp')}</span>
                        <span>{priceRange[1].toLocaleString()} {t('egp')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* التقييم - فقط للرأي */}
                {formType === 'review' && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      {t('rating')}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-2xl transition-colors ${
                            star <= rating ? 'text-yellow-400' : 'text-white/30'
                          }`}
                        >
                          <FaStar />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* الملاحظات أو الرأي */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {formType === 'consultation' ? t('notes') : t('review')}
                  </label>
                  <textarea
                    name={formType === 'consultation' ? 'notes' : 'review'}
                    value={formType === 'consultation' ? formData.notes : formData.review}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#b70501] transition-colors resize-none"
                    placeholder={formType === 'consultation' ? t('notesPlaceholder') : t('reviewPlaceholder')}
                  />
                </div>

                {/* زر الإرسال */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#b70501] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#8a0401] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? t('sending') : t('send')}
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>

          {/* معلومات التواصل */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-6">{t('contactInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg">
                <FaPhone className="text-[#b70501] text-2xl mb-2" />
                <span className="text-white font-medium">+20 111 199 3383</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg">
                <FaMapMarkerAlt className="text-[#b70501] text-2xl mb-2" />
                <span className="text-white font-medium text-center">الإسكندرية، مصر</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg">
                <FaEnvelope className="text-[#b70501] text-2xl mb-2" />
                <span className="text-white font-medium">info@apex-realestate.com</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
} 