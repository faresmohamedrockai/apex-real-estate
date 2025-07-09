'use client';

import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useTranslations, useLocale } from 'next-intl';

interface MultiRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
  formatValue?: (value: number) => string;
  className?: string;
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
  color?: string;
  trackHeight?: number;
  handleSize?: number;
}

export default function MultiRangeSlider({
  min,
  max,
  step = 1000,
  values,
  onChange,
  formatValue = (value) => value.toLocaleString(),
  className = '',
  label,
  leftLabel,
  rightLabel,
  color = '#b70501',
  trackHeight = 8,
  handleSize = 24
}: MultiRangeSliderProps) {
  const [localValues, setLocalValues] = useState<[number, number]>(values);
  const t = useTranslations('common');
  const locale = useLocale();

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const handleChange = (newValues: number | number[]) => {
    if (Array.isArray(newValues)) {
      setLocalValues([newValues[0], newValues[1]]);
      onChange([newValues[0], newValues[1]]);
    }
  };

  return (
    <div className={`space-y-3 px-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}
      
      {/* Top labels */}
      <div className="flex justify-between px-2 mb-2">
        <span className="text-xs text-white font-bold opacity-80">
          {leftLabel || formatValue(min)}
        </span>
        <span className="text-xs text-white font-bold opacity-80">
          {rightLabel || formatValue(max)}
        </span>
      </div>
      
      <div className="py-3">
        <Slider
          range
          min={min}
          max={max}
          step={step}
          value={localValues}
          onChange={handleChange}
          allowCross={false}
          handleStyle={[
            {
              backgroundColor: color,
              border: '3px solid white',
              width: handleSize,
              height: handleSize,
              marginTop: -(handleSize / 2 - trackHeight / 2),
              boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.8)',
              opacity: 1,
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            },
            {
              backgroundColor: color,
              border: '3px solid white',
              width: handleSize,
              height: handleSize,
              marginTop: -(handleSize / 2 - trackHeight / 2),
              boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.8)',
              opacity: 1,
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }
          ]}
          trackStyle={[{
            backgroundColor: color,
            height: trackHeight,
            borderRadius: trackHeight / 2,
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
          }]}
          railStyle={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            height: trackHeight,
            borderRadius: trackHeight / 2,
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
          }}
          dotStyle={{ display: 'none' }}
        />
      </div>
      
      {/* Value display below */}
      <div className="flex justify-between text-sm px-2 mt-2">
        <div className="text-white font-bold bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm">
          {locale === 'ar' ? 'من' : 'From'}: {formatValue(localValues[0])}
        </div>
        <div className="text-white font-bold bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm">
          {locale === 'ar' ? 'إلى' : 'To'}: {formatValue(localValues[1])}
        </div>
      </div>
      
      <style jsx global>{`
        .rc-slider-handle {
          transition: all 0.2s ease !important;
        }
        .rc-slider-handle:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 6px 16px rgba(0,0,0,0.4), 0 0 0 3px rgba(255,255,255,0.9) !important;
        }
        .rc-slider-handle:active {
          transform: scale(1.15) !important;
          box-shadow: 0 0 0 6px rgba(183,5,1,0.2), 0 6px 16px rgba(0,0,0,0.4), 0 0 0 3px rgba(255,255,255,0.9) !important;
        }
        .rc-slider-handle:focus {
          box-shadow: 0 0 0 6px rgba(183,5,1,0.2), 0 4px 12px rgba(0,0,0,0.3), 0 0 0 3px rgba(255,255,255,0.9) !important;
        }
        .rc-slider-track {
          background: linear-gradient(90deg, ${color}, ${color}) !important;
        }
        .rc-slider-rail {
          background-color: rgba(255,255,255,0.15) !important;
        }
        .rc-slider-mark-text {
          color: rgba(255,255,255,0.7) !important;
          font-size: 12px !important;
        }
      `}</style>
    </div>
  );
} 