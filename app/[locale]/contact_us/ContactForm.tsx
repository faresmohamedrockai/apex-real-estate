'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaStar, FaClock, FaWhatsapp } from 'react-icons/fa';
import ImageBG from '../components/ImageBG';
import MultiRangeSlider from '../components/MultiRangeSlider';
import { useAppContext } from '../context/contextData';
import dynamic from 'next/dynamic';

// Dynamic import for map to avoid SSR issues
const Map = dynamic(() => import('../components/Map'), { ssr: false });

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

          {/* Main Content Grid - Form on Right, Info on Left */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            
            {/* Left Side - Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FaMapMarkerAlt className="text-[#b70501] mr-3" />
                  معلومات الاتصال
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#b70501] rounded-full flex items-center justify-center">
                      <FaPhone className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">الهاتف</h4>
                      <p className="text-white/80">+20 111 199 3383</p>
                      <p className="text-white/60 text-sm">متاح 24/7</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#b70501] rounded-full flex items-center justify-center">
                      <FaWhatsapp className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">واتساب</h4>
                      <p className="text-white/80">+20 111 199 3383</p>
                      <p className="text-white/60 text-sm">للرسائل السريعة</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#b70501] rounded-full flex items-center justify-center">
                      <FaEnvelope className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">البريد الإلكتروني</h4>
                      <p className="text-white/80">info@apex-realestate.com</p>
                      <p className="text-white/60 text-sm">للرسائل الرسمية</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#b70501] rounded-full flex items-center justify-center">
                      <FaMapMarkerAlt className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">العنوان</h4>
                      <p className="text-white/80">الإسكندرية، مصر</p>
                      <p className="text-white/60 text-sm">مكتبنا الرئيسي</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#b70501] rounded-full flex items-center justify-center">
                      <FaClock className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">ساعات العمل</h4>
                      <p className="text-white/80">الأحد - الخميس: 9:00 ص - 6:00 م</p>
                      <p className="text-white/80">الجمعة - السبت: 10:00 ص - 4:00 م</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info Card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="text-xl font-bold text-white mb-4">لماذا تختار APEX؟</h4>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#b70501] rounded-full mr-3"></div>
                    خبرة أكثر من 10 سنوات في السوق
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#b70501] rounded-full mr-3"></div>
                    فريق متخصص من الخبراء
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#b70501] rounded-full mr-3"></div>
                    خدمة عملاء 24/7
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#b70501] rounded-full mr-3"></div>
                    أسعار تنافسية وشفافة
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">أرسل لنا رسالة</h3>

              {/* Form Type Toggle */}
              <motion.div
                className="flex justify-center gap-4 mb-6"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
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

                    {/* Unit Type */}
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
          </div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">موقعنا على الخريطة</h3>
            <div className="h-64 rounded-lg overflow-hidden">
              <Map />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
} 