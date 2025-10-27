import React from 'react';
import { AudienceType, ToneType, TimeContext } from '../services/narrativeEngine';

interface DataStorytellingControlsProps {
  audience: AudienceType;
  tone: ToneType;
  timeContext: TimeContext;
  onAudienceChange: (audience: AudienceType) => void;
  onToneChange: (tone: ToneType) => void;
  onTimeContextChange: (context: TimeContext) => void;
  selectedCountry?: string;
  selectedCity?: string;
  availableCountries: string[];
  availableCities: string[];
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
  dateRange: { start: Date; end: Date };
  onDateRangeChange: (range: { start: Date; end: Date }) => void;
}

export function DataStorytellingControls({
  audience,
  tone,
  timeContext,
  onAudienceChange,
  onToneChange,
  onTimeContextChange,
  selectedCountry,
  selectedCity,
  availableCountries,
  availableCities,
  onCountryChange,
  onCityChange,
  dateRange,
  onDateRangeChange
}: DataStorytellingControlsProps) {
  const handleQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    onDateRangeChange({ start, end });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Story Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Audience Perspective
          </label>
          <div className="space-y-2">
            {(['executive', 'technical', 'general'] as AudienceType[]).map((type) => (
              <button
                key={type}
                onClick={() => onAudienceChange(type)}
                className={`w-full px-4 py-2 rounded-lg text-left transition-all ${
                  audience === type
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-medium capitalize">{type}</div>
                <div className="text-xs opacity-90">
                  {type === 'executive' && 'ROI & strategic insights'}
                  {type === 'technical' && 'Statistical analysis'}
                  {type === 'general' && 'Easy-to-understand overview'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Narrative Tone
          </label>
          <div className="space-y-2">
            {(['neutral', 'optimistic', 'cautionary', 'urgent'] as ToneType[]).map((type) => (
              <button
                key={type}
                onClick={() => onToneChange(type)}
                className={`w-full px-4 py-2 rounded-lg text-left transition-all ${
                  tone === type
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-medium capitalize">{type}</div>
                <div className="text-xs opacity-90">
                  {type === 'neutral' && 'Balanced factual presentation'}
                  {type === 'optimistic' && 'Highlight successes & opportunities'}
                  {type === 'cautionary' && 'Flag risks & concerns'}
                  {type === 'urgent' && 'Critical action required'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Context
          </label>
          <div className="space-y-2">
            {(['current', 'historical', 'predictive'] as TimeContext[]).map((type) => (
              <button
                key={type}
                onClick={() => onTimeContextChange(type)}
                className={`w-full px-4 py-2 rounded-lg text-left transition-all ${
                  timeContext === type
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-medium capitalize">{type}</div>
                <div className="text-xs opacity-90">
                  {type === 'current' && 'Present state analysis'}
                  {type === 'historical' && 'Past trends & patterns'}
                  {type === 'predictive' && 'Future projections'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Date Range
            </label>
            <div className="flex gap-2">
              {[7, 30, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => handleQuickDateRange(days)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country Filter
            </label>
            <select
              value={selectedCountry || ''}
              onChange={(e) => onCountryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Countries</option>
              {availableCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {selectedCountry && availableCities.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City Filter
              </label>
              <select
                value={selectedCity || ''}
                onChange={(e) => onCityChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
