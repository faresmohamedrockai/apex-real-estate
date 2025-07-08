'use client';

import dynamic from 'next/dynamic';
import ImageBG from '../components/ImageBG';
import MultiRangeSlider from '../components/MultiRangeSlider';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiDollarSign, FiX } from 'react-icons/fi';
import { FaBed, FaBath, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useCurrentLocale, getLocalizedObject } from '../utils/localeUtils';

const MapComponent = dynamic(() => import('@/app/[locale]/components/Map/InventoryMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-black/80 backdrop-blur-md animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-white">جاري تحميل الخريطة...</div>
    </div>
  ),
});

interface Project {
  _id: string;
  name: string;
  region?: string;
  latitude?: number;
  longitude?: number;
}

interface InventoryItem {
  _id: string;
  title: string;
  unitType: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  region?: string;
  project?: string;
  projectId: Project;
  price: number;
  images: string[];
  latitude?: number;
  longitude?: number;
  isUnique?: boolean;
}

interface SearchResponse {
  data: InventoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function SearchContent() {
  const t = useTranslations('navigation');
  const locale = useCurrentLocale();
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [region, setRegion] = useState('');
  const [project, setProject] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([250000, 100000000]);

  // State for data and loading
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Debounced search term for API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data from API
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
      if (area) params.append('area', area);
      if (bedrooms) params.append('bedrooms', bedrooms);
      if (bathrooms) params.append('bathrooms', bathrooms);
      if (region) params.append('region', region);
      if (project) params.append('project', project);
      if (priceRange[0]) params.append('priceMin', priceRange[0].toString());
      if (priceRange[1]) params.append('priceMax', priceRange[1].toString());
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error('فشل في جلب البيانات');
      }

      const result: SearchResponse = await response.json();
      setInventory(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, area, bedrooms, bathrooms, region, project, priceRange, pagination.page, pagination.limit]);

  // Fetch data when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filters change
  }, [debouncedSearchTerm, area, bedrooms, bathrooms, region, project, priceRange]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setArea('');
    setBedrooms('');
    setBathrooms('');
    setRegion('');
    setProject('');
    setPriceRange([250000, 100000000]);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getDisplayInfo = (item: InventoryItem) => {
    const region = item.region || item.projectId?.region || 'غير محدد';
    const project = item.project || item.projectId?.name || 'غير محدد';
    return { region, project };
  };

  return (
    <>
      <ImageBG />

      <div className="relative z-10 min-h-screen pt-20 sm:pt-24 bg-black/80">
        <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4 sm:mb-6 md:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 sm:mb-4">
              {t('searchTitle')}
            </h1>
            <p className="text-white/80 text-sm sm:text-base md:text-lg">
              {t('searchSubtitle')}
            </p>
          </motion.div>

          {/* Search Bar and Filters Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-4 sm:mb-6 md:mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/60 text-lg sm:text-xl" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/60 backdrop-blur-md text-white border border-white/30 px-10 sm:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#b70501] focus:border-[#b70501] transition-all duration-300"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-[#b70501] hover:bg-[#a00401] text-white px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 font-medium"
              >
                <FiFilter className="text-lg" />
                <span className="hidden sm:inline">{t('filters')}</span>
              </button>
            </div>
          </motion.div>

          {/* Main Content - 2 Columns Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* ✅ عمود نتائج البحث */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-8 bg-transparent rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6"
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* العنوان وعدد النتائج */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{t('results')}</h2>
                <span className="text-xs sm:text-sm text-white/70 bg-black/50 px-2 sm:px-3 py-1 rounded-full">
                  {pagination.total} {t('resultsCount')}
                </span>
              </div>

              {/* ✅ النتائج */}
              {!loading && !error && (
                <>
                  {inventory.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 rounded-2xl">
                      {inventory.map((item) => {
                        // تجهيز البيانات حسب اللغة
                        const localizedItem = {
                          ...item,
                          title: getLocalizedObject(item, 'title', locale),
                          unitType: getLocalizedObject(item, 'unitType', locale),
                          region: getLocalizedObject(item, 'region', locale),
                          project: getLocalizedObject(item, 'project', locale),
                          projectId: {
                            ...item.projectId,
                            name: getLocalizedObject(item.projectId, 'name', locale),
                            region: getLocalizedObject(item.projectId, 'region', locale)
                          }
                        };
                        const { region: displayRegion } = getDisplayInfo(localizedItem);
                        return (
                          <motion.div
                            key={localizedItem._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`group relative aspect-square w-full rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer bg-transparent border-0`}
                            dir={locale === 'ar' ? 'rtl' : 'ltr'}
                          >
                            <div className="relative w-full h-full rounded-3xl">
                              <Link href={`/units/${localizedItem._id}`} className="block w-full h-full rounded-3xl">
                                <Image
                                  src={localizedItem.images?.[0] || '/images/no-image.png'}
                                  alt={localizedItem.title}
                                  fill
                                  className="object-cover rounded-3xl"
                                />
                                {localizedItem.isUnique && (
                                  <div className={`absolute ${locale === 'ar' ? 'top-4 left-4' : 'top-4 right-4'} bg-[#b70501] text-white text-xs px-3 py-1 rounded-full font-bold z-20`}>
                                    {t('unique')}
                                  </div>
                                )}

                                <div className={`absolute ${locale === 'ar' ? 'top-4 right-4' : 'top-4 left-4'} z-20 text-white bg-black/45 rounded-4xl p-2 text-lg font-bold drop-shadow-lg ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
                                  {localizedItem.title}
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 z-20">
                                  <div className="bg-black/80 backdrop-blur-sm p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-white text-sm">
                                      <div className="flex items-center gap-1">
                                        <FaBed className="text-white" />
                                        <span>{localizedItem.bedrooms}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <FaBath className="text-white" />
                                        <span>{localizedItem.bathrooms}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-white" />
                                        <span>{displayRegion}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <FiDollarSign className="text-white" />
                                        <span className="font-bold">{localizedItem.price?.toLocaleString()} ج.م</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                              <div className={`absolute bottom-16 ${locale === 'ar' ? 'left-2' : 'right-2'} z-30`}>

                                <Link
                                  href={`https://wa.me/201111993383?text=${locale === 'ar' ? 'أنا مهتم بالوحدة:' : 'I am interested in unit:'} ${localizedItem.title}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border-2 border-green-400/30 w-14 h-14 flex items-center justify-center"
                                  aria-label="WhatsApp"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <FaWhatsapp size={26} className="text-white" />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🏠</div>
                      <p className="text-white font-medium text-sm sm:text-base">{t('noResults')}</p>
                      <p className="text-white text-xs sm:text-sm">{t('noResultsSubtitle')}</p>
                    </div>
                  )}
                </>
              )}

              {/* ✅ الترقيم */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/20">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-2 sm:px-3 py-2 bg-[#b70501] hover:bg-[#a00401] disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-all duration-300 text-white text-xs sm:text-sm"
                  >
                    {t('previous')}
                  </button>
                  <span className="px-2 sm:px-3 py-2 bg-black/50 backdrop-blur-md rounded-lg text-white text-xs sm:text-sm border border-white/20">
                    {pagination.page} {t('page')} {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="px-2 sm:px-3 py-2 bg-[#b70501] hover:bg-[#a00401] disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-all duration-300 text-white text-xs sm:text-sm"
                  >
                    {t('next')}
                  </button>
                </div>
              )}
            </motion.div>

            {/* ✅ عمود الخريطة في الديسكتوب - sticky مضمون */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-28 z-30">
                <div className="bg-black/70 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
                  <div className="h-[650px] w-full">
                    <MapComponent inventory={inventory} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* في الموبايل فقط، أظهر الخريطة تحت النتائج */}
          <div className="block lg:hidden mt-6">
            <div className="bg-black/70 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
              <div className="h-[250px] w-full">
                <MapComponent inventory={inventory} />
              </div>
            </div>
          </div>

          {/* Filters Popup */}
          <AnimatePresence>
            {showFilters && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                  onClick={() => setShowFilters(false)}
                />

                {/* Filters Panel */}
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/20 z-50 max-h-[80vh] overflow-y-auto"
                >
                  <div className="max-w-7xl mx-auto p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{t('filtersTitle')}</h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-white hover:text-[#b70501] transition-colors p-2"
                      >
                        <FiX size={24} />
                      </button>
                    </div>

                    {/* Filters Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {/* Area Filter */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">{t('area')} (م²)</label>
                        <input
                          type="number"
                          placeholder={t('areaPlaceholder')}
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          className="w-full p-3 rounded-xl text-white bg-black/50 backdrop-blur-md border border-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#b70501]"
                        />
                      </div>

                      {/* Bedrooms Filter */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">{t('bedrooms')}</label>
                        <input
                          type="number"
                          placeholder={t('bedroomsPlaceholder')}
                          value={bedrooms}
                          onChange={(e) => setBedrooms(e.target.value)}
                          className="w-full p-3 rounded-xl text-white bg-black/50 backdrop-blur-md border border-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#b70501]"
                        />
                      </div>

                      {/* Bathrooms Filter */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">{t('bathrooms')}</label>
                        <input
                          type="number"
                          placeholder={t('bathroomsPlaceholder')}
                          value={bathrooms}
                          onChange={(e) => setBathrooms(e.target.value)}
                          className="w-full p-3 rounded-xl text-white bg-black/50 backdrop-blur-md border border-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#b70501]"
                        />
                      </div>

                      {/* Region Filter */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">{t('zone')}</label>
                        <input
                          type="text"
                          placeholder={t('regionPlaceholder')}
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          className="w-full p-3 rounded-xl text-white bg-black/50 backdrop-blur-md border border-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#b70501]"
                        />
                      </div>

                      {/* Project Filter */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">{t('project')}</label>
                        <input
                          type="text"
                          placeholder={t('projectPlaceholder')}
                          value={project}
                          onChange={(e) => setProject(e.target.value)}
                          className="w-full p-3 rounded-xl text-white bg-black/50 backdrop-blur-md border border-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#b70501]"
                        />
                      </div>

                      {/* Clear Filters Button */}
                      <div className="flex items-end">
                        <button
                          onClick={clearFilters}
                          className="w-full bg-[#b70501] hover:bg-[#a00401] text-white px-4 py-3 rounded-xl transition-all duration-300 font-medium"
                        >
                          {t('clearFilters')}
                        </button>
                      </div>
                    </div>

                    {/* Price Range Filter - Full Width */}
                    <div className="mt-6">
                      <MultiRangeSlider
                        min={250000}
                        max={100000000}
                        step={10000}
                        values={priceRange}
                        onChange={setPriceRange}
                        formatValue={(value: number) => `${value.toLocaleString()} جنيه`}
                        label={t('priceRange')}
                        className="space-y-2"
                      />
                    </div>

                    {/* Apply Filters Button */}
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="bg-[#b70501] hover:bg-green-600 text-white px-8 py-3 rounded-xl transition-all duration-300 font-medium"
                      >
                        {t('applyFilters')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* إخفاء الـ scrollbar من الفلتر في الموبايل */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .fixed.bottom-0.left-0.right-0.bg-black\/90.backdrop-blur-md.border-t.border-white\/20.z-50.max-h-\[80vh\].overflow-y-auto::-webkit-scrollbar {
            display: none;
          }
          .fixed.bottom-0.left-0.right-0.bg-black\/90.backdrop-blur-md.border-t.border-white\/20.z-50.max-h-\[80vh\].overflow-y-auto {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
    </>
  );
}
