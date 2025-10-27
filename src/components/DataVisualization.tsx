import React from 'react';
import { GeoAnalysis, AggregatedMetrics, CorrelationInsight } from '../services/dataStorytellingService';
import { TrendingUp, TrendingDown, Globe, Users, Clock, Award } from 'lucide-react';

interface DataVisualizationProps {
  metrics: AggregatedMetrics;
  geoAnalysis: GeoAnalysis[];
  correlation: CorrelationInsight;
}

export function DataVisualization({ metrics, geoAnalysis, correlation }: DataVisualizationProps) {
  const totalHours = Math.round(metrics.totalScreenTime / 3600);
  const avgMinutes = Math.round(metrics.avgScreenTime / 60);

  const getEngagementColor = (tier: 'low' | 'medium' | 'high'): string => {
    switch (tier) {
      case 'low': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-green-500';
    }
  };

  const getPerformanceColor = (tier: 'low' | 'medium' | 'high'): string => {
    switch (tier) {
      case 'low': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      case 'high': return 'bg-purple-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <div className="text-3xl font-bold">{metrics.totalUsers}</div>
          </div>
          <div className="text-sm opacity-90">Total Users</div>
          <div className="text-xs opacity-75 mt-1">{metrics.uniqueCountries} countries</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 opacity-80" />
            <div className="text-3xl font-bold">{avgMinutes}m</div>
          </div>
          <div className="text-sm opacity-90">Avg Session Time</div>
          <div className="text-xs opacity-75 mt-1">{totalHours.toLocaleString()}h total</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 opacity-80" />
            <div className="text-3xl font-bold">{Math.round(metrics.avgPoints)}</div>
          </div>
          <div className="text-sm opacity-90">Avg Points</div>
          <div className="text-xs opacity-75 mt-1">{metrics.totalPoints.toLocaleString()} total</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-8 h-8 opacity-80" />
            <div className="text-3xl font-bold">{metrics.avgPointsPerMinute.toFixed(1)}</div>
          </div>
          <div className="text-sm opacity-90">Points / Minute</div>
          <div className="text-xs opacity-75 mt-1">Efficiency metric</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Engagement Distribution</h3>
          <div className="space-y-4">
            {(['low', 'medium', 'high'] as const).map((tier) => {
              const count = metrics.engagementTiers[tier];
              const percentage = (count / metrics.totalUsers) * 100;
              return (
                <div key={tier}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">{tier} Engagement</span>
                    <span className="text-sm text-gray-600">{count} users ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${getEngagementColor(tier)} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Distribution</h3>
          <div className="space-y-4">
            {(['low', 'medium', 'high'] as const).map((tier) => {
              const count = metrics.performanceTiers[tier];
              const percentage = (count / metrics.totalUsers) * 100;
              return (
                <div key={tier}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">{tier} Performance</span>
                    <span className="text-sm text-gray-600">{count} users ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${getPerformanceColor(tier)} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Screen Time vs Points Correlation</h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {correlation.coefficient.toFixed(3)}
            </div>
            <div className="text-sm text-gray-600 mb-1">Correlation Coefficient</div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
              {correlation.coefficient >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm font-medium text-gray-700 capitalize">{correlation.strength}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700">{correlation.interpretation}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Locations by User Count</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Users</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg Time</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Avg Points</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {geoAnalysis.slice(0, 10).map((geo, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">{geo.city || geo.country}</div>
                    {geo.city && <div className="text-xs text-gray-500">{geo.country}</div>}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-700">{geo.userCount}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{Math.round(geo.avgScreenTime / 60)}m</td>
                  <td className="text-right py-3 px-4 text-gray-700">{Math.round(geo.avgPoints)}</td>
                  <td className="text-right py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-700">
                      {geo.performanceIndex.toFixed(1)}
                      {geo.performanceIndex > metrics.avgPointsPerMinute && (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
