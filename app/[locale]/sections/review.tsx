'use client';

import { useState } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAppContext } from '../context/contextData';

type Review = {
  name: string;
  review: string;
  rating: number;
  createdAt: string;
  project?: string;
  unitType?: string;
};

const ReviewsSlider = () => {
  const { reviews, loading } = useAppContext() as { reviews: Review[]; loading: boolean };
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
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
            <p className="mt-2 text-white">جاري تحميل المراجعات...</p>
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold text-white mb-2">مراجعات العملاء</h2>
          <p className="text-white">لا توجد مراجعات متاحة حالياً</p>
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
            مراجعات العملاء
          </h2>
          <p className="text-white text-lg">
            ما يقوله عملاؤنا عن خدماتنا
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* أزرار التنقل */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="السابق"
          >
            <FaChevronLeft size={20} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="التالي"
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
                      index < reviews[currentIndex]?.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* نص المراجعة */}
              <blockquote className="text-lg md:text-xl text-white mb-6 leading-relaxed">
                &ldquo;{reviews[currentIndex]?.review}&rdquo;
              </blockquote>

              {/* معلومات العميل */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-1">
                  {reviews[currentIndex]?.name}
                </h3>
                {reviews[currentIndex]?.project && (
                  <p className="text-white/80">
                    مشروع: {reviews[currentIndex]?.project}
                  </p>
                )}
                {reviews[currentIndex]?.unitType && (
                  <p className="text-white/80">
                    نوع الوحدة: {reviews[currentIndex]?.unitType}
                  </p>
                )}
                <p className="text-sm text-white/60 mt-2">
                  {formatDate(reviews[currentIndex]?.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* مؤشرات الصفحات */}
          <div className="flex justify-center mt-8 space-x-2 rtl:space-x-reverse">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#b70501] scale-125'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`انتقل إلى المراجعة ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* عداد المراجعات */}
        <div className="text-center mt-6">
          <p className="text-white/80">
            {currentIndex + 1} من {reviews.length} مراجعة
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSlider;
