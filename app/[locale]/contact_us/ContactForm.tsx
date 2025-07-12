'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaStar, FaClock, FaWhatsapp } from 'react-icons/fa';
import ImageBG from '../components/ImageBG';
import MultiRangeSlider from '../components/MultiRangeSlider';
import { useAppContext } from '../context/contextData';
import dynamic from 'next/dynamic';
import { useCurrentLocale, getLocalizedObject } from '../utils/localeUtils';

// Dynamic import for map to avoid SSR issues
const Map = dynamic(() => import('../components/Map'), { ssr: false });

interface Project {
  _id: string;
  name: string;
  name_en?: string;
}

export default function ContactForm() {
  const t = useTranslations('form');
  const contactT = useTranslations('contactText');
  const { projects } = useAppContext();
  const locale = useCurrentLocale();
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
    unitType: locale === 'ar' ? 'سكني' : 'Residential',
    notes: '',
    review: ''
  });

  // Get localized projects
  const localizedProjects = (projects as Project[])?.map(project => ({
    ...project,
    name: getLocalizedObject(project, 'name', locale)
  })) || [];

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
      const payload = {
        ...formData,
        rating: formType === 'review' ? rating : undefined,
        priceRange: formType === 'consultation' ? { min: priceRange[0], max: priceRange[1] } : undefined,
        // Add English translations for form data
        name_en: formData.name, // For now, using same name for both languages
        project_en: formData.project,
        unitType_en: locale === 'ar' ? 
          (formData.unitType === 'سكني' ? 'Residential' : 
           formData.unitType === 'تجاري' ? 'Commercial' : 'Administrative') : 
          formData.unitType,
        notes_en: formData.notes,
        review_en: formData.review
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: data.message || (formType === 'consultation' ? t('successMessage') : t('reviewSuccess'))
        });
        // Reset form
        setFormData({
          name: '',
          phone: '',
          project: '',
          unitType: locale === 'ar' ? 'سكني' : 'Residential',
          notes: '',
          review: ''
        });
        setRating(5);
        setPriceRange([250000, 100000000]);
      } else {
        setMessage({
          type: 'error',
          text: data.error || t('errorMessage')
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: t('networkError')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ImageBG />
      
      <div className="relative z-10 min-h-screen pt-20 sm:pt-24 bg-black/80 w-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6">
              {contactT('title')}
            </h1>
            <p className="text-white/80 text-lg max-w-3xl mx-auto">
              {contactT('description')}
            </p>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {/* Phone */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="w-16 h-16 bg-[#b70501] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPhone className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{contactT('phone')}</h3>
              <p className="text-white/80">+20 111 199 3383</p>
            </div>

            {/* Address */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="w-16 h-16 bg-[#b70501] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{contactT('address')}</h3>
              <p className="text-white/80">{contactT('addressText')}</p>
            </div>

            {/* Working Hours */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="w-16 h-16 bg-[#b70501] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{contactT('workingHours')}</h3>
              <p className="text-white/80">{contactT('workingHoursText')}</p>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
              {t('contactUs')}
            </h2>

            {/* Form Type Toggle */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="flex justify-center gap-4 mb-6"
            >
              {['consultation', 'review'].map((type) => (
                <motion.button
                  key={type}
                  variants={fadeInUp}
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

            {/* Success/Error Message */}
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

            {/* Form */}
            <AnimatePresence mode="wait">
              <motion.div key={formType} {...slideTransition}>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        placeholder={t('enterName')}
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
                        placeholder={t('enterPhone')}
                      />
                    </div>
                  </div>

                  {/* Project Selection */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      {t('project')}
                    </label>
                    <select
                      name="project"
                      value={formData.project}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:border-[#b70501] transition-colors"
                    >
                      <option value="" className="bg-black text-white">{t('selectProject')}</option>
                      {localizedProjects?.map((project: Project) => (
                        <option key={project._id} value={project.name} className="bg-black text-white">
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Unit Type */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      {t('unitType')}
                    </label>
                    <select
                      name="unitType"
                      value={formData.unitType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:border-[#b70501] transition-colors"
                    >
                      <option value={locale === 'ar' ? 'سكني' : 'Residential'} className="bg-black text-white">{t('residential')}</option>
                      <option value={locale === 'ar' ? 'تجاري' : 'Commercial'} className="bg-black text-white">{t('commercial')}</option>
                      <option value={locale === 'ar' ? 'إداري' : 'Administrative'} className="bg-black text-white">{t('administrative')}</option>
                    </select>
                  </div>

                  {/* Price Range for Consultation */}
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

                  {/* Rating for Review */}
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

                  {/* Notes/Review Text */}
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
                      placeholder={formType === 'consultation' ? t('notesPlaceholder') : t('writeReview')}
                    />
                  </div>

                  {/* Submit Button */}
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
          </motion.div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {locale === 'ar' ? 'موقعنا على الخريطة' : 'Our Location on Map'}
            </h3>
            <div className="h-64 rounded-lg overflow-hidden">
              <Map />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
} 