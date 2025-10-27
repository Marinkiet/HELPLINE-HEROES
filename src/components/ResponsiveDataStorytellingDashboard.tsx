import React, { useState, useEffect } from 'react';
import { dataStorytellingService, UserSessionData, AggregatedMetrics, GeoAnalysis, CorrelationInsight } from '../services/dataStorytellingService';
import { narrativeEngine, AudienceType, ToneType, TimeContext, Narrative } from '../services/narrativeEngine';
import { DataStorytellingControls } from './DataStorytellingControls';
import { DataVisualization } from './DataVisualization';
import { WhatIfScenario } from './WhatIfScenario';
import { PersonalizedInsights } from './PersonalizedInsights';
import { BookOpen, RefreshCw } from 'lucide-react';

export function ResponsiveDataStorytellingDashboard() {
  const [audience, setAudience] = useState<AudienceType>('general');
  const [tone, setTone] = useState<ToneType>('neutral');
  const [timeContext, setTimeContext] = useState<TimeContext>('current');

  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  });

  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  const [rawData, setRawData] = useState<UserSessionData[]>([]);
  const [filteredData, setFilteredData] = useState<UserSessionData[]>([]);
  const [metrics, setMetrics] = useState<AggregatedMetrics | null>(null);
  const [geoAnalysis, setGeoAnalysis] = useState<GeoAnalysis[]>([]);
  const [correlation, setCorrelation] = useState<CorrelationInsight | null>(null);
  const [narrative, setNarrative] = useState<Narrative | null>(null);

  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  useEffect(() => {
    applyFilters();
  }, [rawData, selectedCountry, selectedCity]);

  useEffect(() => {
    if (metrics && geoAnalysis.length > 0 && correlation) {
      generateNarrative();
    }
  }, [audience, tone, timeContext, metrics, geoAnalysis, correlation]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await dataStorytellingService.fetchUserSessionData(dateRange.start, dateRange.end);
      setRawData(data);

      const countries = [...new Set(data.map(d => d.location_country).filter(Boolean))].sort() as string[];
      setAvailableCountries(countries);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...rawData];

    if (selectedCountry) {
      filtered = dataStorytellingService.filterByLocation(filtered, selectedCountry);

      const cities = [...new Set(filtered.map(d => d.location_city).filter(Boolean))].sort() as string[];
      setAvailableCities(cities);
    } else {
      setAvailableCities([]);
    }

    if (selectedCity) {
      filtered = dataStorytellingService.filterByLocation(filtered, selectedCountry, selectedCity);
    }

    setFilteredData(filtered);

    const calculatedMetrics = dataStorytellingService.aggregateMetrics(filtered);
    setMetrics(calculatedMetrics);

    const geo = dataStorytellingService.getGeoAnalysis(filtered);
    setGeoAnalysis(geo);

    const corr = dataStorytellingService.calculateCorrelation(filtered);
    setCorrelation(corr);
  };

  const generateNarrative = () => {
    if (!metrics || !correlation) return;

    const story = narrativeEngine.generateNarrative(
      metrics,
      geoAnalysis,
      correlation,
      { audience, tone, timeContext }
    );

    setNarrative(story);
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedCity('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading data storytelling dashboard...</p>
        </div>
      </div>
    );
  }

  if (!metrics || !correlation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 mb-4">No data available for the selected period.</p>
          <button
            onClick={loadData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Responsive Data Storytelling</h1>
          </div>
          <p className="text-gray-600">
            Transform raw engagement data into compelling narratives tailored to your audience and context.
          </p>
        </div>

        <DataStorytellingControls
          audience={audience}
          tone={tone}
          timeContext={timeContext}
          onAudienceChange={setAudience}
          onToneChange={setTone}
          onTimeContextChange={setTimeContext}
          selectedCountry={selectedCountry}
          selectedCity={selectedCity}
          availableCountries={availableCountries}
          availableCities={availableCities}
          onCountryChange={handleCountryChange}
          onCityChange={setSelectedCity}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {narrative && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{narrative.title}</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">{narrative.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {narrative.dataHighlights.map((highlight, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                  <div className="text-sm font-medium text-gray-600 mb-1">{highlight.label}</div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{highlight.value}</div>
                  <div className="text-xs text-gray-500">{highlight.context}</div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Insights</h3>
              <ul className="space-y-2">
                {narrative.keyInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span className="text-gray-700">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {narrative.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">→</span>
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mb-6">
          <DataVisualization
            metrics={metrics}
            geoAnalysis={geoAnalysis}
            correlation={correlation}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PersonalizedInsights
            metrics={metrics}
            geoAnalysis={geoAnalysis}
            audience={audience}
            tone={tone}
          />

          <WhatIfScenario baseMetrics={metrics} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">About This Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Audience Perspectives</h4>
              <p className="text-sm text-gray-600">
                Switch between executive, technical, and general views to see how the same data tells different stories for different audiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Narrative Tones</h4>
              <p className="text-sm text-gray-600">
                Adjust the tone from neutral to urgent to see how emotional framing changes the presentation and recommendations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Interactive Scenarios</h4>
              <p className="text-sm text-gray-600">
                Use the what-if scenario builder to explore potential outcomes and make data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
