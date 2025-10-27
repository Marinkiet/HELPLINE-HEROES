import React, { useState } from 'react';
import { AggregatedMetrics } from '../services/dataStorytellingService';
import { Calculator, Play } from 'lucide-react';

interface WhatIfScenarioProps {
  baseMetrics: AggregatedMetrics;
}

interface ScenarioResult {
  projectedUsers: number;
  projectedScreenTime: number;
  projectedPoints: number;
  projectedRevenue?: number;
  impactSummary: string;
}

export function WhatIfScenario({ baseMetrics }: WhatIfScenarioProps) {
  const [userGrowth, setUserGrowth] = useState(0);
  const [engagementChange, setEngagementChange] = useState(0);
  const [performanceChange, setPerformanceChange] = useState(0);
  const [revenuePerUser, setRevenuePerUser] = useState(10);
  const [result, setResult] = useState<ScenarioResult | null>(null);

  const calculateScenario = () => {
    const growthMultiplier = 1 + (userGrowth / 100);
    const engagementMultiplier = 1 + (engagementChange / 100);
    const performanceMultiplier = 1 + (performanceChange / 100);

    const projectedUsers = Math.round(baseMetrics.totalUsers * growthMultiplier);
    const projectedAvgScreenTime = baseMetrics.avgScreenTime * engagementMultiplier;
    const projectedTotalScreenTime = projectedUsers * projectedAvgScreenTime;
    const projectedAvgPoints = baseMetrics.avgPoints * performanceMultiplier;
    const projectedPoints = Math.round(projectedUsers * projectedAvgPoints);
    const projectedRevenue = projectedUsers * revenuePerUser;

    let impactSummary = '';

    if (userGrowth > 0 && engagementChange > 0 && performanceChange > 0) {
      impactSummary = `Strong growth scenario: Adding ${projectedUsers - baseMetrics.totalUsers} users with improved engagement and performance could generate ${projectedPoints.toLocaleString()} total points and $${projectedRevenue.toLocaleString()} in revenue.`;
    } else if (userGrowth < 0 || engagementChange < 0 || performanceChange < 0) {
      const negativeFactors = [];
      if (userGrowth < 0) negativeFactors.push('declining user base');
      if (engagementChange < 0) negativeFactors.push('reduced engagement');
      if (performanceChange < 0) negativeFactors.push('lower performance');
      impactSummary = `Risk scenario: ${negativeFactors.join(', ')} could result in ${Math.abs(projectedUsers - baseMetrics.totalUsers)} user change and reduced outcomes. Intervention recommended.`;
    } else if (userGrowth === 0 && engagementChange === 0 && performanceChange === 0) {
      impactSummary = `Baseline scenario: Maintaining current levels would yield ${baseMetrics.totalPoints.toLocaleString()} points with ${baseMetrics.totalUsers} users.`;
    } else {
      impactSummary = `Moderate scenario: Projected ${projectedUsers} users generating ${projectedPoints.toLocaleString()} points with $${projectedRevenue.toLocaleString()} potential revenue.`;
    }

    setResult({
      projectedUsers,
      projectedScreenTime: projectedTotalScreenTime,
      projectedPoints,
      projectedRevenue,
      impactSummary
    });
  };

  const resetScenario = () => {
    setUserGrowth(0);
    setEngagementChange(0);
    setPerformanceChange(0);
    setResult(null);
  };

  const presetScenarios = [
    { name: 'Conservative Growth', users: 10, engagement: 5, performance: 5 },
    { name: 'Aggressive Expansion', users: 50, engagement: 20, performance: 15 },
    { name: 'Quality Focus', users: 5, engagement: 30, performance: 40 },
    { name: 'Crisis Mitigation', users: -20, engagement: -15, performance: -10 }
  ];

  const applyPreset = (preset: typeof presetScenarios[0]) => {
    setUserGrowth(preset.users);
    setEngagementChange(preset.engagement);
    setPerformanceChange(preset.performance);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">What-If Scenario Builder</h2>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Explore potential outcomes by adjusting key metrics. See how changes in user growth, engagement, and performance impact your results.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {presetScenarios.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User Growth (%)
          </label>
          <input
            type="range"
            min="-50"
            max="100"
            value={userGrowth}
            onChange={(e) => setUserGrowth(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>-50%</span>
            <span className="font-semibold">{userGrowth}%</span>
            <span>+100%</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {baseMetrics.totalUsers} → {Math.round(baseMetrics.totalUsers * (1 + userGrowth / 100))} users
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Engagement Change (%)
          </label>
          <input
            type="range"
            min="-50"
            max="100"
            value={engagementChange}
            onChange={(e) => setEngagementChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>-50%</span>
            <span className="font-semibold">{engagementChange}%</span>
            <span>+100%</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(baseMetrics.avgScreenTime / 60)}m → {Math.round((baseMetrics.avgScreenTime * (1 + engagementChange / 100)) / 60)}m avg session
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Performance Change (%)
          </label>
          <input
            type="range"
            min="-50"
            max="100"
            value={performanceChange}
            onChange={(e) => setPerformanceChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>-50%</span>
            <span className="font-semibold">{performanceChange}%</span>
            <span>+100%</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(baseMetrics.avgPoints)} → {Math.round(baseMetrics.avgPoints * (1 + performanceChange / 100))} avg points
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Revenue Per User ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={revenuePerUser}
            onChange={(e) => setRevenuePerUser(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="text-xs text-gray-500 mt-1">
            Estimated revenue per active user
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={calculateScenario}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
        >
          <Play className="w-5 h-5" />
          Run Scenario
        </button>
        <button
          onClick={resetScenario}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>

      {result && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Projected Results</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-600 font-medium mb-1">Users</div>
              <div className="text-2xl font-bold text-blue-900">{result.projectedUsers.toLocaleString()}</div>
              <div className="text-xs text-blue-600 mt-1">
                {result.projectedUsers > baseMetrics.totalUsers ? '+' : ''}
                {(result.projectedUsers - baseMetrics.totalUsers).toLocaleString()}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-600 font-medium mb-1">Total Time</div>
              <div className="text-2xl font-bold text-green-900">{Math.round(result.projectedScreenTime / 3600)}h</div>
              <div className="text-xs text-green-600 mt-1">
                {Math.round(result.projectedScreenTime / 3600) > Math.round(baseMetrics.totalScreenTime / 3600) ? '+' : ''}
                {(Math.round(result.projectedScreenTime / 3600) - Math.round(baseMetrics.totalScreenTime / 3600))}h
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600 font-medium mb-1">Total Points</div>
              <div className="text-2xl font-bold text-purple-900">{result.projectedPoints.toLocaleString()}</div>
              <div className="text-xs text-purple-600 mt-1">
                {result.projectedPoints > baseMetrics.totalPoints ? '+' : ''}
                {(result.projectedPoints - baseMetrics.totalPoints).toLocaleString()}
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-sm text-orange-600 font-medium mb-1">Revenue</div>
              <div className="text-2xl font-bold text-orange-900">${result.projectedRevenue?.toLocaleString()}</div>
              <div className="text-xs text-orange-600 mt-1">
                Potential earnings
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Impact Summary</h4>
            <p className="text-sm text-gray-700">{result.impactSummary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
