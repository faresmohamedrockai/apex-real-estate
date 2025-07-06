import { useLocale } from 'next-intl';

// Utility function to get the appropriate field based on current locale
export const getLocalizedField = (
  arabicField: string | undefined,
  englishField: string | undefined,
  locale: string
): string => {
  if (locale === 'en' && englishField) {
    return englishField;
  }
  return arabicField || englishField || '';
};

// Hook to get current locale
export const useCurrentLocale = () => {
  return useLocale();
};

// Utility function to get localized object fields
export const getLocalizedObject = (
  obj: any,
  fieldName: string,
  locale: string
): string => {
  const arabicField = obj[fieldName];
  const englishField = obj[`${fieldName}_en`];
  
  return getLocalizedField(arabicField, englishField, locale);
};

// Utility function to get localized array of objects
export const getLocalizedArray = (
  array: any[],
  fieldName: string,
  locale: string
): any[] => {
  return array.map(item => ({
    ...item,
    [fieldName]: getLocalizedObject(item, fieldName, locale)
  }));
}; 