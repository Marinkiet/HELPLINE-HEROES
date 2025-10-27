import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface UserSessionData {
  location_country: string | null;
  location_city: string | null;
  screen_time_seconds: number;
  points_earned: number;
}

export interface AggregatedMetrics {
  totalUsers: number;
  totalScreenTime: number;
  totalPoints: number;
  avgScreenTime: number;
  avgPoints: number;
  avgPointsPerMinute: number;
  uniqueCountries: number;
  uniqueCities: number;
  topCountries: Array<{country: string; users: number; avgScreenTime: number; avgPoints: number}>;
  topCities: Array<{city: string; country: string; users: number; avgScreenTime: number; avgPoints: number}>;
  engagementTiers: {
    low: number;
    medium: number;
    high: number;
  };
  performanceTiers: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface TimeBasedMetrics extends AggregatedMetrics {
  period: string;
  startDate: string;
  endDate: string;
}

export interface GeoAnalysis {
  country: string;
  city?: string;
  userCount: number;
  totalScreenTime: number;
  totalPoints: number;
  avgScreenTime: number;
  avgPoints: number;
  engagementRate: number;
  performanceIndex: number;
}

export interface CorrelationInsight {
  coefficient: number;
  strength: string;
  interpretation: string;
}

class DataStorytellingService {
  async fetchUserSessionData(
    startDate?: Date,
    endDate?: Date
  ): Promise<UserSessionData[]> {
    if (!supabase) {
      console.warn('Supabase not initialized');
      return [];
    }

    try {
      let query = supabase
        .from('user_sessions')
        .select('location_country, location_city, screen_time_seconds, points_earned');

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }
      if (endDate) {
        query = query.lte('created_at', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching user session data:', error);
      return [];
    }
  }

  aggregateMetrics(data: UserSessionData[]): AggregatedMetrics {
    if (data.length === 0) {
      return {
        totalUsers: 0,
        totalScreenTime: 0,
        totalPoints: 0,
        avgScreenTime: 0,
        avgPoints: 0,
        avgPointsPerMinute: 0,
        uniqueCountries: 0,
        uniqueCities: 0,
        topCountries: [],
        topCities: [],
        engagementTiers: { low: 0, medium: 0, high: 0 },
        performanceTiers: { low: 0, medium: 0, high: 0 }
      };
    }

    const totalUsers = data.length;
    const totalScreenTime = data.reduce((sum, d) => sum + d.screen_time_seconds, 0);
    const totalPoints = data.reduce((sum, d) => sum + d.points_earned, 0);
    const avgScreenTime = totalScreenTime / totalUsers;
    const avgPoints = totalPoints / totalUsers;
    const avgPointsPerMinute = totalScreenTime > 0 ? (totalPoints / (totalScreenTime / 60)) : 0;

    const countries = new Map<string, {users: number; screenTime: number; points: number}>();
    const cities = new Map<string, {city: string; country: string; users: number; screenTime: number; points: number}>();

    data.forEach(session => {
      if (session.location_country) {
        const existing = countries.get(session.location_country) || {users: 0, screenTime: 0, points: 0};
        countries.set(session.location_country, {
          users: existing.users + 1,
          screenTime: existing.screenTime + session.screen_time_seconds,
          points: existing.points + session.points_earned
        });
      }

      if (session.location_city && session.location_country) {
        const cityKey = `${session.location_city},${session.location_country}`;
        const existing = cities.get(cityKey) || {city: session.location_city, country: session.location_country, users: 0, screenTime: 0, points: 0};
        cities.set(cityKey, {
          ...existing,
          users: existing.users + 1,
          screenTime: existing.screenTime + session.screen_time_seconds,
          points: existing.points + session.points_earned
        });
      }
    });

    const topCountries = Array.from(countries.entries())
      .map(([country, stats]) => ({
        country,
        users: stats.users,
        avgScreenTime: stats.screenTime / stats.users,
        avgPoints: stats.points / stats.users
      }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 10);

    const topCities = Array.from(cities.values())
      .map(stats => ({
        city: stats.city,
        country: stats.country,
        users: stats.users,
        avgScreenTime: stats.screenTime / stats.users,
        avgPoints: stats.points / stats.users
      }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 10);

    const screenTimeThresholds = this.calculateThresholds(data.map(d => d.screen_time_seconds));
    const pointsThresholds = this.calculateThresholds(data.map(d => d.points_earned));

    const engagementTiers = {
      low: data.filter(d => d.screen_time_seconds < screenTimeThresholds.low).length,
      medium: data.filter(d => d.screen_time_seconds >= screenTimeThresholds.low && d.screen_time_seconds < screenTimeThresholds.high).length,
      high: data.filter(d => d.screen_time_seconds >= screenTimeThresholds.high).length
    };

    const performanceTiers = {
      low: data.filter(d => d.points_earned < pointsThresholds.low).length,
      medium: data.filter(d => d.points_earned >= pointsThresholds.low && d.points_earned < pointsThresholds.high).length,
      high: data.filter(d => d.points_earned >= pointsThresholds.high).length
    };

    return {
      totalUsers,
      totalScreenTime,
      totalPoints,
      avgScreenTime,
      avgPoints,
      avgPointsPerMinute,
      uniqueCountries: countries.size,
      uniqueCities: cities.size,
      topCountries,
      topCities,
      engagementTiers,
      performanceTiers
    };
  }

  private calculateThresholds(values: number[]): {low: number; high: number} {
    const sorted = [...values].sort((a, b) => a - b);
    const low = sorted[Math.floor(sorted.length * 0.33)] || 0;
    const high = sorted[Math.floor(sorted.length * 0.67)] || 0;
    return { low, high };
  }

  async getTimeBasedMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<TimeBasedMetrics> {
    const data = await this.fetchUserSessionData(startDate, endDate);
    const metrics = this.aggregateMetrics(data);

    return {
      ...metrics,
      period: this.formatPeriod(startDate, endDate),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  }

  private formatPeriod(startDate: Date, endDate: Date): string {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 1) return 'Today';
    if (days <= 7) return 'Last 7 days';
    if (days <= 30) return 'Last 30 days';
    return `${days} days`;
  }

  getGeoAnalysis(data: UserSessionData[]): GeoAnalysis[] {
    const geoMap = new Map<string, {
      country: string;
      city?: string;
      users: number;
      totalScreenTime: number;
      totalPoints: number;
    }>();

    data.forEach(session => {
      const key = session.location_city
        ? `${session.location_country}|${session.location_city}`
        : `${session.location_country}|`;

      const existing = geoMap.get(key) || {
        country: session.location_country || 'Unknown',
        city: session.location_city || undefined,
        users: 0,
        totalScreenTime: 0,
        totalPoints: 0
      };

      geoMap.set(key, {
        ...existing,
        users: existing.users + 1,
        totalScreenTime: existing.totalScreenTime + session.screen_time_seconds,
        totalPoints: existing.totalPoints + session.points_earned
      });
    });

    return Array.from(geoMap.values()).map(geo => {
      const avgScreenTime = geo.totalScreenTime / geo.users;
      const avgPoints = geo.totalPoints / geo.users;
      const engagementRate = avgScreenTime / 3600;
      const performanceIndex = avgScreenTime > 0 ? (avgPoints / (avgScreenTime / 60)) : 0;

      return {
        country: geo.country,
        city: geo.city,
        userCount: geo.users,
        totalScreenTime: geo.totalScreenTime,
        totalPoints: geo.totalPoints,
        avgScreenTime,
        avgPoints,
        engagementRate,
        performanceIndex
      };
    }).sort((a, b) => b.userCount - a.userCount);
  }

  calculateCorrelation(data: UserSessionData[]): CorrelationInsight {
    if (data.length < 2) {
      return {
        coefficient: 0,
        strength: 'insufficient data',
        interpretation: 'Not enough data to determine correlation'
      };
    }

    const validData = data.filter(d => d.screen_time_seconds > 0 && d.points_earned > 0);

    if (validData.length < 2) {
      return {
        coefficient: 0,
        strength: 'insufficient data',
        interpretation: 'Not enough valid data points to determine correlation'
      };
    }

    const n = validData.length;
    const sumX = validData.reduce((sum, d) => sum + d.screen_time_seconds, 0);
    const sumY = validData.reduce((sum, d) => sum + d.points_earned, 0);
    const sumXY = validData.reduce((sum, d) => sum + (d.screen_time_seconds * d.points_earned), 0);
    const sumX2 = validData.reduce((sum, d) => sum + (d.screen_time_seconds ** 2), 0);
    const sumY2 = validData.reduce((sum, d) => sum + (d.points_earned ** 2), 0);

    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt(((n * sumX2) - (sumX ** 2)) * ((n * sumY2) - (sumY ** 2)));

    const coefficient = denominator === 0 ? 0 : numerator / denominator;

    let strength = 'none';
    let interpretation = '';

    const absCoef = Math.abs(coefficient);
    if (absCoef < 0.3) {
      strength = 'weak';
      interpretation = 'Screen time has minimal impact on points earned';
    } else if (absCoef < 0.7) {
      strength = 'moderate';
      interpretation = 'Screen time has a moderate relationship with points earned';
    } else {
      strength = 'strong';
      interpretation = 'Screen time is strongly correlated with points earned';
    }

    if (coefficient < 0) {
      interpretation += ' (negative correlation - unusual pattern detected)';
    }

    return { coefficient, strength, interpretation };
  }

  filterByEngagement(data: UserSessionData[], tier: 'low' | 'medium' | 'high'): UserSessionData[] {
    const screenTimes = data.map(d => d.screen_time_seconds);
    const thresholds = this.calculateThresholds(screenTimes);

    switch (tier) {
      case 'low':
        return data.filter(d => d.screen_time_seconds < thresholds.low);
      case 'medium':
        return data.filter(d => d.screen_time_seconds >= thresholds.low && d.screen_time_seconds < thresholds.high);
      case 'high':
        return data.filter(d => d.screen_time_seconds >= thresholds.high);
      default:
        return data;
    }
  }

  filterByPerformance(data: UserSessionData[], tier: 'low' | 'medium' | 'high'): UserSessionData[] {
    const points = data.map(d => d.points_earned);
    const thresholds = this.calculateThresholds(points);

    switch (tier) {
      case 'low':
        return data.filter(d => d.points_earned < thresholds.low);
      case 'medium':
        return data.filter(d => d.points_earned >= thresholds.low && d.points_earned < thresholds.high);
      case 'high':
        return data.filter(d => d.points_earned >= thresholds.high);
      default:
        return data;
    }
  }

  filterByLocation(data: UserSessionData[], country?: string, city?: string): UserSessionData[] {
    return data.filter(d => {
      if (country && d.location_country !== country) return false;
      if (city && d.location_city !== city) return false;
      return true;
    });
  }
}

export const dataStorytellingService = new DataStorytellingService();
