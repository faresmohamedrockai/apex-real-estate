'use client';

import { useState } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAppContext } from '../context/contextData';
import { useTranslations } from 'next-intl';
import { useCurrentLocale, getLocalizedObject } from '../utils/localeUtils';

type Review = {
  name: string;
  name_en?: string;
  review: string;
  review_en?: string;
  rating: number;
  createdAt: string;
  project?: string;
  project_en?: string;
  unitType?: string;
  unitType_en?: string;
};

const ReviewsSlider = () => {
  const { reviews, loading } = useAppContext() as { reviews: Review[]; loading: boolean };
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useTranslations('reviews');
  const tCommon = useTranslations('common');
  const locale = useCurrentLocale();

  // Get localized reviews
  const localizedReviews = reviews.map(review => ({
    ...review,
    name: getLocalizedObject(review, 'name', locale),
    review: getLocalizedObject(review, 'review', locale),
    project: getLocalizedObject(review, 'project', locale),
    unitType: getLocalizedObject(review, 'unitType', locale)
  }));

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === localizedReviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? localizedReviews.length - 1 : prevIndex - 1
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#b70501]"></div>
            <p className="mt-2 text-white">{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (localizedReviews.length === 0) {
    return (
      <div className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold text-white mb-2">{t('title')}</h2>
          <p className="text-white">{t('noReviews')}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-white text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* أزرار التنقل */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label={t('previous')}
          >
            <FaChevronLeft size={20} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label={t('next')}
          >
            <FaChevronRight size={20} />
          </button>

          {/* Review Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 text-center border border-white/20">
              {/* النجوم */}
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`w-6 h-6 ${
                      index < localizedReviews[currentIndex]?.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* نص المراجعة */}
              <blockquote className="text-lg md:text-xl text-white mb-6 leading-relaxed">
                &ldquo;{localizedReviews[currentIndex]?.review}&rdquo;
              </blockquote>

              {/* معلومات العميل */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-1">
                  {localizedReviews[currentIndex]?.name}
                </h3>
                {localizedReviews[currentIndex]?.project && (
                  <p className="text-white/80">
                    {t('projectLabel')} {localizedReviews[currentIndex]?.project}
                  </p>
                )}
                {localizedReviews[currentIndex]?.unitType && (
                  <p className="text-white/80">
                    {t('unitTypeLabel')} {localizedReviews[currentIndex]?.unitType}
                  </p>
                )}
                <p className="text-sm text-white/60 mt-2">
                  {formatDate(localizedReviews[currentIndex]?.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* مؤشرات الصفحات */}
          <div className="flex justify-center mt-8 space-x-2 rtl:space-x-reverse">
            {localizedReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#b70501] scale-125'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`${t('goToReview')} ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* عداد المراجعات */}
        <div className="text-center mt-6">
          <p className="text-white/80">
            {currentIndex + 1} {t('reviewCounter')} {localizedReviews.length} {t('review')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSlider;
