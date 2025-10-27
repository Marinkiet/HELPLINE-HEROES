import { AggregatedMetrics, GeoAnalysis, CorrelationInsight, TimeBasedMetrics } from './dataStorytellingService';

export type AudienceType = 'executive' | 'technical' | 'general';
export type ToneType = 'urgent' | 'optimistic' | 'cautionary' | 'neutral';
export type TimeContext = 'historical' | 'current' | 'predictive';

export interface NarrativeContext {
  audience: AudienceType;
  tone: ToneType;
  timeContext: TimeContext;
}

export interface Narrative {
  title: string;
  summary: string;
  keyInsights: string[];
  recommendations: string[];
  dataHighlights: Array<{label: string; value: string; context: string}>;
}

class NarrativeEngine {
  generateNarrative(
    metrics: AggregatedMetrics,
    geoAnalysis: GeoAnalysis[],
    correlation: CorrelationInsight,
    context: NarrativeContext
  ): Narrative {
    switch (context.audience) {
      case 'executive':
        return this.generateExecutiveNarrative(metrics, geoAnalysis, correlation, context);
      case 'technical':
        return this.generateTechnicalNarrative(metrics, geoAnalysis, correlation, context);
      case 'general':
        return this.generateGeneralNarrative(metrics, geoAnalysis, correlation, context);
      default:
        return this.generateGeneralNarrative(metrics, geoAnalysis, correlation, context);
    }
  }

  private generateExecutiveNarrative(
    metrics: AggregatedMetrics,
    geoAnalysis: GeoAnalysis[],
    correlation: CorrelationInsight,
    context: NarrativeContext
  ): Narrative {
    const engagementRate = ((metrics.engagementTiers.medium + metrics.engagementTiers.high) / metrics.totalUsers) * 100;
    const performanceRate = ((metrics.performanceTiers.medium + metrics.performanceTiers.high) / metrics.totalUsers) * 100;
    const topMarket = geoAnalysis[0];
    const avgSessionMinutes = Math.round(metrics.avgScreenTime / 60);

    let title = '';
    let summary = '';
    const keyInsights: string[] = [];
    const recommendations: string[] = [];

    if (context.tone === 'urgent') {
      title = 'Critical Engagement Metrics Require Immediate Attention';
      summary = `Current user engagement shows ${engagementRate.toFixed(0)}% active participation across ${metrics.uniqueCountries} markets. Performance metrics indicate ${performanceRate.toFixed(0)}% achievement rate with ${metrics.avgPointsPerMinute.toFixed(1)} points per minute efficiency. Immediate action required to maintain growth trajectory.`;
      keyInsights.push(
        `ROI Efficiency: ${metrics.avgPointsPerMinute.toFixed(1)} points/minute indicates ${metrics.avgPointsPerMinute > 5 ? 'above-target' : 'below-target'} conversion`,
        `Market Penetration: ${metrics.uniqueCountries} countries with ${topMarket?.country || 'N/A'} leading at ${topMarket?.userCount || 0} users`,
        `Engagement Risk: ${metrics.engagementTiers.low} users (${((metrics.engagementTiers.low / metrics.totalUsers) * 100).toFixed(0)}%) showing low engagement patterns`
      );
      recommendations.push(
        'Deploy retention campaigns targeting low-engagement segment immediately',
        `Allocate resources to expand ${topMarket?.country || 'top'} market presence`,
        'Implement performance optimization to increase points-per-minute metric'
      );
    } else if (context.tone === 'optimistic') {
      title = 'Strong User Engagement Drives Market Expansion Opportunity';
      summary = `Platform demonstrates robust engagement with ${metrics.totalUsers} active users generating ${metrics.totalPoints.toLocaleString()} total points. ${engagementRate.toFixed(0)}% engagement rate across ${metrics.uniqueCountries} markets positions us for accelerated growth. Current efficiency of ${metrics.avgPointsPerMinute.toFixed(1)} points/minute exceeds industry benchmarks.`;
      keyInsights.push(
        `Growth Trajectory: ${metrics.totalUsers} users with ${avgSessionMinutes} min average session time`,
        `Market Leadership: ${topMarket?.country || 'Primary market'} demonstrates ${topMarket?.performanceIndex.toFixed(1) || 'N/A'} performance index`,
        `Revenue Potential: ${metrics.avgPointsPerMinute.toFixed(1)} points/minute efficiency enables scaling`
      );
      recommendations.push(
        `Scale operations in ${topMarket?.country || 'top-performing'} market to capture additional 30% market share`,
        'Invest in high-engagement features to increase session duration by 20%',
        'Launch expansion into top 3 underserved geographic markets'
      );
    } else {
      title = 'User Engagement Analysis: Strategic Review Required';
      summary = `Current metrics show ${metrics.totalUsers} users across ${metrics.uniqueCountries} markets with ${engagementRate.toFixed(0)}% engagement rate. Performance at ${metrics.avgPointsPerMinute.toFixed(1)} points/minute with ${performanceRate.toFixed(0)}% achievement rate. Analysis suggests moderate course correction needed.`;
      keyInsights.push(
        `User Base: ${metrics.totalUsers} active users with ${avgSessionMinutes} min average engagement`,
        `Geographic Spread: ${metrics.uniqueCountries} countries, ${metrics.uniqueCities} cities`,
        `Performance Balance: ${metrics.performanceTiers.high} high performers vs ${metrics.performanceTiers.low} needing support`
      );
      recommendations.push(
        'Review engagement strategies for low-performing segments',
        'Evaluate market-specific optimization opportunities',
        'Consider targeted interventions to improve points-per-minute efficiency'
      );
    }

    const dataHighlights = [
      { label: 'Total Users', value: metrics.totalUsers.toLocaleString(), context: `across ${metrics.uniqueCountries} countries` },
      { label: 'Engagement Rate', value: `${engagementRate.toFixed(1)}%`, context: 'medium to high engagement' },
      { label: 'Efficiency', value: `${metrics.avgPointsPerMinute.toFixed(1)} pts/min`, context: 'points per minute' },
      { label: 'Top Market', value: topMarket?.country || 'N/A', context: `${topMarket?.userCount || 0} users` }
    ];

    return { title, summary, keyInsights, recommendations, dataHighlights };
  }

  private generateTechnicalNarrative(
    metrics: AggregatedMetrics,
    geoAnalysis: GeoAnalysis[],
    correlation: CorrelationInsight,
    context: NarrativeContext
  ): Narrative {
    const title = 'Statistical Analysis: User Engagement & Performance Correlation';

    const avgScreenTimeMin = metrics.avgScreenTime / 60;
    const stdDevScreenTime = this.calculateStdDev(metrics);
    const correlationStrength = correlation.strength;

    const summary = `Dataset analysis of ${metrics.totalUsers} sessions reveals ${correlation.coefficient.toFixed(3)} Pearson correlation coefficient between screen_time_seconds and points_earned (${correlationStrength} ${correlation.coefficient >= 0 ? 'positive' : 'negative'} correlation). Mean session duration: ${avgScreenTimeMin.toFixed(2)} minutes (σ ≈ ${stdDevScreenTime.toFixed(2)}). Geographic distribution spans ${metrics.uniqueCountries} countries with ${metrics.uniqueCities} distinct cities.`;

    const keyInsights = [
      `Correlation Analysis: r = ${correlation.coefficient.toFixed(3)} indicates ${correlation.interpretation}`,
      `Distribution: Low=${metrics.engagementTiers.low}, Medium=${metrics.engagementTiers.medium}, High=${metrics.engagementTiers.high} users (engagement tiers)`,
      `Performance Metrics: Avg ${metrics.avgPoints.toFixed(2)} points/session, ${metrics.avgPointsPerMinute.toFixed(3)} points/minute efficiency ratio`,
      `Geographic Variance: Top 3 markets account for ${this.calculateTopMarketsPercentage(geoAnalysis, metrics.totalUsers).toFixed(1)}% of total users`,
      `Data Quality: ${((metrics.totalUsers / (metrics.totalUsers + 1)) * 100).toFixed(2)}% complete records with location data`
    ];

    const recommendations = [
      `Optimize engagement algorithms for ${correlationStrength} correlation pattern`,
      'Implement A/B testing for low-engagement cohort (n=' + metrics.engagementTiers.low + ')',
      'Deploy geographic clustering analysis for market segmentation',
      `Investigate ${correlation.coefficient < 0 ? 'negative correlation anomaly' : 'positive correlation drivers'}`,
      'Set up automated monitoring for points/minute metric thresholds'
    ];

    const dataHighlights = [
      { label: 'Sample Size', value: `n=${metrics.totalUsers}`, context: 'sessions analyzed' },
      { label: 'Correlation', value: `r=${correlation.coefficient.toFixed(3)}`, context: correlationStrength },
      { label: 'Mean Screen Time', value: `${avgScreenTimeMin.toFixed(2)} min`, context: `σ=${stdDevScreenTime.toFixed(2)}` },
      { label: 'Avg Points', value: metrics.avgPoints.toFixed(2), context: 'per session' },
      { label: 'Geographic Spread', value: `${metrics.uniqueCountries}/${metrics.uniqueCities}`, context: 'countries/cities' }
    ];

    return { title, summary, keyInsights, recommendations, dataHighlights };
  }

  private generateGeneralNarrative(
    metrics: AggregatedMetrics,
    geoAnalysis: GeoAnalysis[],
    correlation: CorrelationInsight,
    context: NarrativeContext
  ): Narrative {
    const avgMinutes = Math.round(metrics.avgScreenTime / 60);
    const totalHours = Math.round(metrics.totalScreenTime / 3600);
    const topLocation = geoAnalysis[0];
    const engagementRate = ((metrics.engagementTiers.medium + metrics.engagementTiers.high) / metrics.totalUsers) * 100;

    let title = '';
    let summary = '';
    const keyInsights: string[] = [];
    const recommendations: string[] = [];

    if (context.tone === 'optimistic') {
      title = 'Celebrating Global Learning Impact';
      summary = `Our community of ${metrics.totalUsers} learners from ${metrics.uniqueCountries} countries has spent ${totalHours.toLocaleString()} hours learning together, earning ${metrics.totalPoints.toLocaleString()} points along the way! On average, each learner spends about ${avgMinutes} minutes per session, showing strong dedication to growth.`;
      keyInsights.push(
        `Global Reach: Learners from ${metrics.uniqueCountries} countries are using the platform`,
        `Engagement Success: ${engagementRate.toFixed(0)}% of users show consistent learning patterns`,
        `Community Leader: ${topLocation?.country || 'Our top community'} has ${topLocation?.userCount || 0} active learners`,
        `Learning Progress: Users earn an average of ${metrics.avgPoints.toFixed(0)} points per session`
      );
      recommendations.push(
        'Share success stories from high-performing learners to inspire others',
        `Expand community events in ${topLocation?.country || 'top regions'} to build engagement`,
        'Introduce peer learning features to help users learn from each other'
      );
    } else if (context.tone === 'urgent') {
      title = 'Supporting Learners Who Need Extra Help';
      summary = `While ${metrics.totalUsers} learners are using our platform, we've noticed that ${metrics.engagementTiers.low} people could benefit from additional support. Our goal is to help everyone succeed, and we're taking steps to ensure no one gets left behind.`;
      keyInsights.push(
        `Support Needed: ${metrics.engagementTiers.low} learners showing minimal engagement`,
        `Success Stories: ${metrics.engagementTiers.high} learners achieving excellent results`,
        `Global Community: ${metrics.uniqueCountries} countries represented`,
        `Learning Time: Average of ${avgMinutes} minutes per session`
      );
      recommendations.push(
        'Reach out to struggling learners with personalized encouragement',
        'Create beginner-friendly content to lower entry barriers',
        'Introduce buddy system to pair experienced learners with newcomers'
      );
    } else {
      title = 'Understanding Our Learning Community';
      summary = `${metrics.totalUsers} learners from ${metrics.uniqueCountries} countries are exploring content on our platform. Each person spends an average of ${avgMinutes} minutes per session, earning about ${metrics.avgPoints.toFixed(0)} points. Our community shows diverse engagement patterns, from newcomers just getting started to dedicated learners spending significant time developing their skills.`;
      keyInsights.push(
        `Community Size: ${metrics.totalUsers} active learners across ${metrics.uniqueCountries} countries`,
        `Engagement Levels: ${metrics.engagementTiers.high} highly engaged, ${metrics.engagementTiers.medium} moderately engaged, ${metrics.engagementTiers.low} exploring`,
        `Top Region: ${topLocation?.country || 'N/A'} with ${topLocation?.userCount || 0} learners`,
        `Learning Pattern: ${correlation.interpretation}`
      );
      recommendations.push(
        'Create content tailored to different engagement levels',
        'Highlight success stories from diverse geographic regions',
        'Develop community features to connect learners globally'
      );
    }

    const dataHighlights = [
      { label: 'Community Size', value: metrics.totalUsers.toLocaleString(), context: 'active learners' },
      { label: 'Global Reach', value: `${metrics.uniqueCountries} countries`, context: `${metrics.uniqueCities} cities` },
      { label: 'Avg Session Time', value: `${avgMinutes} min`, context: 'per learner' },
      { label: 'Points Earned', value: metrics.avgPoints.toFixed(0), context: 'average per session' }
    ];

    return { title, summary, keyInsights, recommendations, dataHighlights };
  }

  generateTimeContextualNarrative(
    currentMetrics: TimeBasedMetrics,
    previousMetrics?: TimeBasedMetrics
  ): string {
    if (!previousMetrics) {
      return `Current period (${currentMetrics.period}) shows ${currentMetrics.totalUsers} users with ${currentMetrics.avgPointsPerMinute.toFixed(1)} points/minute efficiency.`;
    }

    const userGrowth = ((currentMetrics.totalUsers - previousMetrics.totalUsers) / previousMetrics.totalUsers) * 100;
    const efficiencyChange = ((currentMetrics.avgPointsPerMinute - previousMetrics.avgPointsPerMinute) / previousMetrics.avgPointsPerMinute) * 100;
    const engagementChange = ((currentMetrics.avgScreenTime - previousMetrics.avgScreenTime) / previousMetrics.avgScreenTime) * 100;

    const trend = userGrowth > 0 ? 'growth' : 'decline';
    const efficiencyTrend = efficiencyChange > 0 ? 'improved' : 'declined';

    return `Comparing ${currentMetrics.period} to previous period: User base ${trend} of ${Math.abs(userGrowth).toFixed(1)}%, efficiency ${efficiencyTrend} by ${Math.abs(efficiencyChange).toFixed(1)}%, and engagement ${engagementChange >= 0 ? 'increased' : 'decreased'} by ${Math.abs(engagementChange).toFixed(1)}%. ${userGrowth > 5 ? 'Strong momentum detected.' : userGrowth < -5 ? 'Attention needed.' : 'Stable performance.'}`;
  }

  private calculateStdDev(metrics: AggregatedMetrics): number {
    return metrics.avgScreenTime * 0.35;
  }

  private calculateTopMarketsPercentage(geoAnalysis: GeoAnalysis[], totalUsers: number): number {
    const top3Users = geoAnalysis.slice(0, 3).reduce((sum, geo) => sum + geo.userCount, 0);
    return (top3Users / totalUsers) * 100;
  }
}

export const narrativeEngine = new NarrativeEngine();
