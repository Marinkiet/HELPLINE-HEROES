import React from 'react';
import { AggregatedMetrics, GeoAnalysis } from '../services/dataStorytellingService';
import { AudienceType, ToneType } from '../services/narrativeEngine';
import { Lightbulb, AlertTriangle, TrendingUp, Target, MapPin, Zap } from 'lucide-react';

interface PersonalizedInsightsProps {
  metrics: AggregatedMetrics;
  geoAnalysis: GeoAnalysis[];
  audience: AudienceType;
  tone: ToneType;
}

interface Insight {
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: string;
}

export function PersonalizedInsights({ metrics, geoAnalysis, audience, tone }: PersonalizedInsightsProps) {
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];

    const lowEngagementRate = (metrics.engagementTiers.low / metrics.totalUsers) * 100;
    const highEngagementRate = (metrics.engagementTiers.high / metrics.totalUsers) * 100;
    const topMarket = geoAnalysis[0];
    const avgEfficiency = metrics.avgPointsPerMinute;

    if (lowEngagementRate > 40) {
      insights.push({
        type: 'risk',
        title: 'High Low-Engagement Rate',
        description: `${lowEngagementRate.toFixed(0)}% of users show low engagement patterns, indicating potential churn risk.`,
        priority: 'high',
        actionable: audience === 'executive'
          ? 'Deploy retention campaign to capture at-risk users before churn'
          : audience === 'technical'
          ? 'Analyze session logs to identify friction points causing early exit'
          : 'Reach out to struggling users with personalized support and encouragement'
      });
    }

    if (highEngagementRate > 30) {
      insights.push({
        type: 'opportunity',
        title: 'Strong High-Engagement Cohort',
        description: `${highEngagementRate.toFixed(0)}% of users are highly engaged, representing core user base.`,
        priority: 'medium',
        actionable: audience === 'executive'
          ? 'Leverage engaged users for referral programs and testimonials'
          : audience === 'technical'
          ? 'Extract behavioral patterns from high-engagement cohort for optimization'
          : 'Create community features to connect enthusiastic learners together'
      });
    }

    if (topMarket && topMarket.userCount > metrics.totalUsers * 0.3) {
      insights.push({
        type: 'trend',
        title: `${topMarket.country} Market Dominance`,
        description: `${topMarket.country} represents ${((topMarket.userCount / metrics.totalUsers) * 100).toFixed(0)}% of user base with ${topMarket.performanceIndex.toFixed(1)} efficiency.`,
        priority: 'medium',
        actionable: audience === 'executive'
          ? `Double down on ${topMarket.country} market with localized marketing`
          : audience === 'technical'
          ? `Optimize infrastructure for ${topMarket.country} region to reduce latency`
          : `Celebrate success stories from ${topMarket.country} community`
      });
    }

    if (avgEfficiency < 3) {
      insights.push({
        type: 'risk',
        title: 'Below-Target Efficiency',
        description: `Current ${avgEfficiency.toFixed(1)} points/minute is below optimal efficiency threshold.`,
        priority: 'high',
        actionable: audience === 'executive'
          ? 'Prioritize product improvements to increase conversion efficiency'
          : audience === 'technical'
          ? 'Profile and optimize slow code paths affecting points calculation'
          : 'Simplify learning paths to help users progress more quickly'
      });
    } else if (avgEfficiency > 7) {
      insights.push({
        type: 'opportunity',
        title: 'Excellent Efficiency Performance',
        description: `Strong ${avgEfficiency.toFixed(1)} points/minute indicates optimal user experience.`,
        priority: 'low',
        actionable: audience === 'executive'
          ? 'Maintain current feature set while scaling user acquisition'
          : audience === 'technical'
          ? 'Document successful patterns for replication in other modules'
          : 'Continue providing quality content that users find valuable'
      });
    }

    if (metrics.uniqueCountries >= 5 && geoAnalysis.length > 3) {
      const underservedMarkets = geoAnalysis.filter(g => g.userCount < metrics.totalUsers * 0.1).length;
      insights.push({
        type: 'opportunity',
        title: 'Geographic Expansion Potential',
        description: `${underservedMarkets} markets show initial traction with room for growth.`,
        priority: 'medium',
        actionable: audience === 'executive'
          ? 'Allocate marketing budget to expand presence in emerging markets'
          : audience === 'technical'
          ? 'Implement localization framework for multi-market scaling'
          : 'Connect users across different countries to build global community'
      });
    }

    const performanceImbalance = Math.abs(metrics.performanceTiers.high - metrics.performanceTiers.low) / metrics.totalUsers;
    if (performanceImbalance > 0.4) {
      insights.push({
        type: 'recommendation',
        title: 'Performance Distribution Imbalance',
        description: `Significant gap between high and low performers suggests need for better scaffolding.`,
        priority: 'high',
        actionable: audience === 'executive'
          ? 'Invest in adaptive learning features to support struggling users'
          : audience === 'technical'
          ? 'Implement difficulty adjustment algorithm based on performance'
          : 'Provide different learning paths for various skill levels'
      });
    }

    if (tone === 'urgent') {
      insights.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    }

    return insights.slice(0, 6);
  };

  const insights = generateInsights();

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'opportunity': return <Zap className="w-5 h-5 text-green-600" />;
      case 'risk': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'trend': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'recommendation': return <Target className="w-5 h-5 text-purple-600" />;
    }
  };

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'opportunity': return 'bg-green-50 border-green-200';
      case 'risk': return 'bg-red-50 border-red-200';
      case 'trend': return 'bg-blue-50 border-blue-200';
      case 'recommendation': return 'bg-purple-50 border-purple-200';
    }
  };

  const getPriorityBadge = (priority: Insight['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-gray-100 text-gray-700'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const audienceContext = {
    executive: 'Strategic Insights',
    technical: 'Technical Analysis',
    general: 'Key Takeaways'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-bold text-gray-800">{audienceContext[audience]}</h2>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        {audience === 'executive' && 'Strategic recommendations based on key performance indicators and market trends.'}
        {audience === 'technical' && 'Data-driven insights highlighting optimization opportunities and technical improvements.'}
        {audience === 'general' && 'Important patterns and actionable suggestions to improve learning outcomes.'}
      </p>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getInsightColor(insight.type)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getInsightIcon(insight.type)}
                <h3 className="font-semibold text-gray-800">{insight.title}</h3>
              </div>
              {getPriorityBadge(insight.priority)}
            </div>

            <p className="text-sm text-gray-700 mb-3">{insight.description}</p>

            <div className="bg-white bg-opacity-50 rounded p-3 border-l-4 border-gray-400">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-1">ACTION</div>
                  <div className="text-sm text-gray-800">{insight.actionable}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {geoAnalysis.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Geographic Focus Areas</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {geoAnalysis.slice(0, 4).map((geo, index) => {
              const performanceLevel = geo.performanceIndex > metrics.avgPointsPerMinute ? 'high' : 'low';
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">{geo.city || geo.country}</span>
                    <span className={`text-xs font-semibold ${performanceLevel === 'high' ? 'text-green-600' : 'text-orange-600'}`}>
                      {performanceLevel === 'high' ? '↑' : '↓'} {geo.performanceIndex.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {geo.userCount} users • {Math.round(geo.avgScreenTime / 60)}m avg
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
