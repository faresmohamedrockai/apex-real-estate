'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaStar } from 'react-icons/fa';
import ImageBG from '../components/ImageBG';
import MultiRangeSlider from '../components/MultiRangeSlider';

export default function ConsultationForm() {
  const t = useTranslations('form');
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
    setMessage('');

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
          {t('cntactText.text')}
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
                className={`max-w-md mx-auto mb-6 p-4 rounded-lg text-center ${
                  message.type === 'success' 
                    ? 'bg-green-500/20 border border-green-500 text-green-300' 
                    : 'bg-red-500/20 border border-red-500 text-red-300'
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

        {/* الفورم و البيانات */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.3, delayChildren: 0.6 } } }}
        >
          {/* الفورم */}
          <AnimatePresence mode="wait">
            <motion.div
              key={formType}
              {...slideTransition}
                className="bg-black/60 backdrop-blur-md rounded-3xl shadow-xl p-8 text-white border border-white/20"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">
                {formType === 'review' ? t('reviewTitle') : t('title')}
              </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                  type="text"
                    name="name"
                  placeholder={t('enterName')}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 text-white border border-white/30 px-3 py-2 rounded-xl text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#b70501]"
                />

                    <div className="flex gap-2">
                    <select className="w-[30%] bg-white/10 text-white border border-white/30 px-2 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b70501]">
                        <option>+20</option>
                        <option>+966</option>
                      </select>
                      <input
                        type="text"
                      name="phone"
                      className="w-[70%] bg-white/10 text-white border border-white/30 px-3 py-2 rounded-xl text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#b70501]"
                        placeholder={t('enterPhone')}
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      />
                    </div>

                  <select 
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 text-white border border-white/30 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b70501]"
                  >
                    <option value="">{t('selectProject')}</option>
                    <option value="مشروع 1">مشروع 1</option>
                    <option value="مشروع 2">مشروع 2</option>
                    </select>

                  <select 
                    name="unitType"
                    value={formData.unitType}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 text-white border border-white/30 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b70501]"
                  >
                    <option value="سكني">{t('residential')}</option>
                    <option value="تجاري">{t('commercial')}</option>
                    <option value="مكتبي">مكتبي</option>
                    </select>

                                      {formType === 'consultation' && (
                      <MultiRangeSlider
                        min={250000}
                        max={100000000}
                        step={10000}
                        values={priceRange}
                        onChange={setPriceRange}
                        formatValue={(value: number) => `${value.toLocaleString()} LE`}
                        label={t('priceRange')}
                      />
                    )}

                  {formType === 'review' && (
                    <div className="space-y-2">
                      <label className="text-sm text-white block">التقييم</label>
                      <div className="flex gap-1">
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

                <textarea
                    name={formType === 'review' ? 'review' : 'notes'}
                  rows={4}
                    placeholder={formType === 'review' ? t('writeReview') : t('notesPlaceholder')}
                    value={formType === 'review' ? formData.review : formData.notes}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/10 text-white border border-white/30 px-4 py-3 rounded-xl text-sm resize-none placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#b70501]"
                  />

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#b70501] text-white px-8 py-3 rounded-xl hover:bg-[#a00401] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'جاري الإرسال...' : t('submit')}
                </button>
                </form>
            </motion.div>
          </AnimatePresence>

          {/* معلومات التواصل */}
            <motion.div className="bg-black/60 backdrop-blur-md rounded-3xl shadow-xl p-8 text-white border border-white/20 space-y-4">
            <h3 className="text-2xl font-bold text-center mb-4">معلومات التواصل</h3>

              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#b70501]" />
                <span>شارع المليونير، برج الألماس، الدور 99، مدينة الأحلام، محافظة الخيال</span>
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-[#b70501]" />
                <span>info@fake-realestate-spam.com</span>
              </p>
              <p className="flex items-center gap-2">
                <FaPhone className="text-[#b70501]" />
                <span>+20 111 199 3383</span>
              </p>
              <p className="flex items-center gap-2">
                <FaPhone className="text-[#b70501]" />
                <span>+20 111 199 3383</span>
              </p>

            {/* أيقونات التواصل */}
            <div className="flex gap-6 justify-center mt-6">
              {/* Facebook */}
              <a href="https://www.facebook.com/people/Apex-Real-Estate-Investment/61567153032479/" target="_blank" rel="noopener noreferrer">
                  <div className="bg-white rounded-full p-2 w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12a12 12 0 1 0-13.875 11.875v-8.4h-2.812v-3.475h2.812V9.845c0-2.787 1.664-4.322 4.216-4.322 1.223 0 2.5.218 2.5.218v2.75H16.66c-1.4 0-1.834.868-1.834 1.756v2.108h3.125l-.5 3.475h-2.625v8.4A12 12 0 0 0 24 12z" />
                  </svg>
                </div>
              </a>

              {/* WhatsApp */}
              <a href="https://wa.me/201111993383" target="_blank" rel="noopener noreferrer">
                  <div className="bg-white rounded-full p-2 w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                    <path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"></path><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"></path><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"></path><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"></path><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </a>
            </div>

            {/* الخريطة */}
            <div className="mt-6 overflow-hidden rounded-xl border border-white/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13648.751634080065!2d29.9420061!3d31.215522999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c4919c447a91%3A0xd0f971e233ebf6c9!2sSmouha%2C%20Ezbet%20Saad%2C%20Sidi%20Gaber%2C%20Alexandria%20Governorate%205432062!5e0!3m2!1sen!2seg!4v1751459541195!5m2!1sen!2seg"
                width="100%"
                height="250"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
