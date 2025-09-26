import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Globe, Clock, Trophy, GamepadIcon, TrendingUp, MapPin, Languages, Calendar } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface UserSession {
  id: string;
  session_id: string;
  age_group: string;
  language: string;
  location_country?: string;
  location_region?: string;
  location_city?: string;
  screen_time_seconds: number;
  points_earned: number;
  games_completed: string[];
  last_activity: string;
  created_at: string;
}

interface GameSession {
  id: string;
  session_id: string;
  game_id: string;
  game_name: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  points_earned: number;
  completed: boolean;
}

interface UserInteraction {
  id: string;
  session_id: string;
  interaction_type: string;
  interaction_data: Record<string, any>;
  timestamp: string;
}

interface DashboardStats {
  totalUsers: number;
  totalScreenTime: number;
  totalPoints: number;
  totalGamesCompleted: number;
  averageSessionTime: number;
  topLanguages: Array<{ language: string; count: number }>;
  topCountries: Array<{ country: string; count: number }>;
  ageGroupDistribution: Array<{ age_group: string; count: number }>;
  gameCompletionRates: Array<{ game_name: string; completion_rate: number; total_plays: number }>;
  dailyActiveUsers: Array<{ date: string; users: number }>;
}

export function EngagementDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'games' | 'interactions'>('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user sessions
      const { data: userSessionsData, error: userError } = await supabase
        .from('user_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (userError) throw userError;

      // Fetch game sessions
      const { data: gameSessionsData, error: gameError } = await supabase
        .from('game_sessions')
        .select('*')
        .order('start_time', { ascending: false });

      if (gameError) throw gameError;

      // Fetch interactions
      const { data: interactionsData, error: interactionError } = await supabase
        .from('user_interactions')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (interactionError) throw interactionError;

      setUserSessions(userSessionsData || []);
      setGameSessions(gameSessionsData || []);
      setInteractions(interactionsData || []);

      // Calculate stats
      calculateStats(userSessionsData || [], gameSessionsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (users: UserSession[], games: GameSession[]) => {
    const totalUsers = users.length;
    const totalScreenTime = users.reduce((sum, user) => sum + (user.screen_time_seconds || 0), 0);
    const totalPoints = users.reduce((sum, user) => sum + (user.points_earned || 0), 0);
    const totalGamesCompleted = games.filter(game => game.completed).length;
    const averageSessionTime = totalUsers > 0 ? totalScreenTime / totalUsers : 0;

    // Language distribution
    const languageCounts = users.reduce((acc, user) => {
      acc[user.language] = (acc[user.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topLanguages = Object.entries(languageCounts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Country distribution
    const countryCounts = users.reduce((acc, user) => {
      if (user.location_country) {
        acc[user.location_country] = (acc[user.location_country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    const topCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Age group distribution
    const ageGroupCounts = users.reduce((acc, user) => {
      acc[user.age_group] = (acc[user.age_group] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const ageGroupDistribution = Object.entries(ageGroupCounts)
      .map(([age_group, count]) => ({ age_group, count }));

    // Game completion rates
    const gameStats = games.reduce((acc, game) => {
      if (!acc[game.game_name]) {
        acc[game.game_name] = { total: 0, completed: 0 };
      }
      acc[game.game_name].total++;
      if (game.completed) {
        acc[game.game_name].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    const gameCompletionRates = Object.entries(gameStats)
      .map(([game_name, stats]) => ({
        game_name,
        completion_rate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
        total_plays: stats.total
      }))
      .sort((a, b) => b.completion_rate - a.completion_rate);

    // Daily active users (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyActiveUsers = last7Days.map(date => {
      const usersOnDate = users.filter(user => 
        user.created_at.split('T')[0] === date
      ).length;
      return { date, users: usersOnDate };
    });

    setStats({
      totalUsers,
      totalScreenTime,
      totalPoints,
      totalGamesCompleted,
      averageSessionTime,
      topLanguages,
      topCountries,
      ageGroupDistribution,
      gameCompletionRates,
      dailyActiveUsers
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading engagement data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Engagement Dashboard</h1>
            </div>
            <button
              onClick={fetchData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'users', label: 'User Sessions', icon: Users },
              { id: 'games', label: 'Game Sessions', icon: GamepadIcon },
              { id: 'interactions', label: 'Interactions', icon: Clock }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Screen Time</p>
                    <p className="text-2xl font-bold text-gray-900">{formatTime(stats.totalScreenTime)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Points</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPoints.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <GamepadIcon className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Games Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalGamesCompleted}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Language Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <Languages className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Top Languages</h3>
                </div>
                <div className="space-y-3">
                  {stats.topLanguages.map((lang, index) => (
                    <div key={lang.language} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{lang.language.toUpperCase()}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(lang.count / stats.totalUsers) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{lang.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Age Group Distribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <Users className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Age Groups</h3>
                </div>
                <div className="space-y-3">
                  {stats.ageGroupDistribution.map((group) => (
                    <div key={group.age_group} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {group.age_group === 'early' ? '6-8 years' : 
                         group.age_group === 'middle' ? '9-11 years' : '12-14 years'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(group.count / stats.totalUsers) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{group.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Completion Rates */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Trophy className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Game Completion Rates</h3>
              </div>
              <div className="space-y-4">
                {stats.gameCompletionRates.map((game) => (
                  <div key={game.game_name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{game.game_name}</h4>
                      <span className="text-sm text-gray-500">{game.total_plays} plays</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${game.completion_rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {game.completion_rate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">User Sessions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age Group
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Language
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Screen Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userSessions.map((session) => (
                    <tr key={session.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {session.session_id.substring(0, 12)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {session.age_group === 'early' ? '6-8' : 
                           session.age_group === 'middle' ? '9-11' : '12-14'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.language.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.location_city ? `${session.location_city}, ${session.location_country}` : 
                         session.location_country || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(session.screen_time_seconds)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.points_earned}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(session.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Game Sessions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Game Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Started
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gameSessions.map((session) => (
                    <tr key={session.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {session.game_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {session.session_id.substring(0, 12)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.duration_seconds ? formatTime(session.duration_seconds) : 'In Progress'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.points_earned}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          session.completed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.completed ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(session.start_time)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'interactions' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent User Interactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interaction Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {interactions.map((interaction) => (
                    <tr key={interaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {interaction.session_id.substring(0, 12)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {interaction.interaction_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {JSON.stringify(interaction.interaction_data)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(interaction.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}