import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Users, Globe, Clock, Trophy, TrendingUp, MapPin, Languages, Gamepad as GamepadIcon, BarChart3, PieChart, Activity, Calendar, ArrowLeft, Brain, Lightbulb, Database, Shield, Eye, Settings } from 'lucide-react';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AnalyticsData {
  totalUsers: number;
  totalScreenTime: number;
  totalPoints: number;
  totalGamesCompleted: number;
  ageGroupDistribution: { age_group: string; count: number }[];
  languageDistribution: { language: string; count: number }[];
  locationDistribution: { location_country: string; count: number }[];
  dailyActivity: { date: string; users: number; screen_time: number }[];
  gameCompletionRates: { game_id: string; game_name: string; completion_rate: number }[];
  averageSessionTime: number;
  topProvinces: { province: string; users: number; avg_screen_time: number }[];
  questionAnalytics: {
    totalQuestions: number;
    overallAccuracy: number;
    gameAccuracy: { game_id: string; game_name: string; accuracy: number; total_responses: number }[];
    difficultQuestions: { question_id: string; question_text: string; game_id: string; accuracy: number; total_responses: number }[];
    commonWrongAnswers: { question_id: string; question_text: string; wrong_answer: string; count: number }[];
  };
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('7'); // days
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [showTrackingInfo, setShowTrackingInfo] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

      // Fetch user sessions data
      const { data: userSessions, error: userError } = await supabase
        .from('user_sessions')
        .select('*')
        .gte('created_at', daysAgo.toISOString());

      if (userError) throw userError;

      // Fetch game sessions data
      const { data: gameSessions, error: gameError } = await supabase
        .from('game_sessions')
        .select('*')
        .gte('created_at', daysAgo.toISOString());

      if (gameError) throw gameError;

      // Fetch question responses data
      const { data: questionResponses, error: questionError } = await supabase
        .from('question_responses')
        .select('*')
        .gte('created_at', daysAgo.toISOString());

      if (questionError) throw questionError;

      // Process the data
      const analyticsData = processAnalyticsData(userSessions || [], gameSessions || [], questionResponses || []);
      setData(analyticsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (userSessions: any[], gameSessions: any[], questionResponses: any[]): AnalyticsData => {
    // Basic metrics
    const totalUsers = userSessions.length;
    const totalScreenTime = userSessions.reduce((sum, session) => sum + (session.screen_time_seconds || 0), 0);
    const totalPoints = userSessions.reduce((sum, session) => sum + (session.points_earned || 0), 0);
    const totalGamesCompleted = gameSessions.filter(game => game.completed).length;
    const averageSessionTime = totalUsers > 0 ? Math.round(totalScreenTime / totalUsers) : 0;

    // Age group distribution
    const ageGroups = userSessions.reduce((acc, session) => {
      const ageGroup = session.age_group || 'unknown';
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {});
    const ageGroupDistribution = Object.entries(ageGroups).map(([age_group, count]) => ({
      age_group,
      count: count as number
    }));

    // Language distribution
    const languages = userSessions.reduce((acc, session) => {
      const language = session.language || 'unknown';
      acc[language] = (acc[language] || 0) + 1;
      return acc;
    }, {});
    const languageDistribution = Object.entries(languages).map(([language, count]) => ({
      language,
      count: count as number
    }));

    // Location distribution
    const locations = userSessions.reduce((acc, session) => {
      const country = session.location_country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});
    const locationDistribution = Object.entries(locations).map(([location_country, count]) => ({
      location_country,
      count: count as number
    }));

    // Daily activity (simplified - group by date)
    const dailyStats = userSessions.reduce((acc, session) => {
      const date = new Date(session.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { users: 0, screen_time: 0 };
      }
      acc[date].users += 1;
      acc[date].screen_time += session.screen_time_seconds || 0;
      return acc;
    }, {} as Record<string, { users: number; screen_time: number }>);

    const dailyActivity = Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      users: stats.users,
      screen_time: Math.round(stats.screen_time / 60) // Convert to minutes
    }));

    // Game completion rates
    const gameStats = gameSessions.reduce((acc, game) => {
      const gameId = game.game_id;
      if (!acc[gameId]) {
        acc[gameId] = { total: 0, completed: 0, name: game.game_name };
      }
      acc[gameId].total += 1;
      if (game.completed) acc[gameId].completed += 1;
      return acc;
    }, {} as Record<string, { total: number; completed: number; name: string }>);

    const gameCompletionRates = Object.entries(gameStats).map(([game_id, stats]) => ({
      game_id,
      game_name: stats.name,
      completion_rate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    }));

    // Top provinces with average screen time
    const provinceStats = userSessions.reduce((acc, session) => {
      const province = session.location_region || 'Unknown Province';
      if (!acc[province]) {
        acc[province] = { users: 0, total_screen_time: 0 };
      }
      acc[province].users += 1;
      acc[province].total_screen_time += session.screen_time_seconds || 0;
      return acc;
    }, {} as Record<string, { users: number; total_screen_time: number }>);

    const topProvinces = Object.entries(provinceStats)
      .map(([province, stats]) => ({
        province,
        users: stats.users,
        avg_screen_time: Math.round(stats.total_screen_time / stats.users / 60) // Convert to minutes
      }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 10);

    // Question Analytics
    const totalQuestions = questionResponses.length;
    const correctAnswers = questionResponses.filter(q => q.is_correct).length;
    const overallAccuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Game accuracy breakdown
    const gameAccuracyStats = questionResponses.reduce((acc, response) => {
      const gameId = response.game_id;
      if (!acc[gameId]) {
        acc[gameId] = { total: 0, correct: 0, name: getGameName(gameId) };
      }
      acc[gameId].total += 1;
      if (response.is_correct) acc[gameId].correct += 1;
      return acc;
    }, {} as Record<string, { total: number; correct: number; name: string }>);

    const gameAccuracy = Object.entries(gameAccuracyStats).map(([game_id, stats]) => ({
      game_id,
      game_name: stats.name,
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      total_responses: stats.total
    }));

    // Difficult questions (low accuracy)
    const questionStats = questionResponses.reduce((acc, response) => {
      const questionId = response.question_id;
      if (!acc[questionId]) {
        acc[questionId] = { 
          total: 0, 
          correct: 0, 
          text: response.question_text,
          game_id: response.game_id 
        };
      }
      acc[questionId].total += 1;
      if (response.is_correct) acc[questionId].correct += 1;
      return acc;
    }, {} as Record<string, { total: number; correct: number; text: string; game_id: string }>);

    const difficultQuestions = Object.entries(questionStats)
      .map(([question_id, stats]) => ({
        question_id,
        question_text: stats.text,
        game_id: stats.game_id,
        accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        total_responses: stats.total
      }))
      .filter(q => q.total_responses >= 5) // Only questions with at least 5 responses
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 10);

    // Common wrong answers
    const wrongAnswerStats = questionResponses
      .filter(response => !response.is_correct)
      .reduce((acc, response) => {
        const key = `${response.question_id}_${response.user_answer}`;
        if (!acc[key]) {
          acc[key] = {
            question_id: response.question_id,
            question_text: response.question_text,
            wrong_answer: response.user_answer,
            count: 0
          };
        }
        acc[key].count += 1;
        return acc;
      }, {} as Record<string, { question_id: string; question_text: string; wrong_answer: string; count: number }>);

    const commonWrongAnswers = Object.values(wrongAnswerStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const questionAnalytics = {
      totalQuestions,
      overallAccuracy,
      gameAccuracy,
      difficultQuestions,
      commonWrongAnswers
    };

    return {
      totalUsers,
      totalScreenTime,
      totalPoints,
      totalGamesCompleted,
      ageGroupDistribution,
      languageDistribution,
      locationDistribution,
      dailyActivity,
      gameCompletionRates,
      averageSessionTime,
      topProvinces,
      questionAnalytics
    };
  };

  const getGameName = (gameId: string): string => {
    const gameNames: Record<string, string> = {
      'safe_touch_detective': 'Safe Touch Detective',
      'trusted_heroes_circle': 'Trusted Heroes Circle',
      'brave_voice': 'Brave Voice'
    };
    return gameNames[gameId] || gameId;
  };

  const generateAISuggestions = async () => {
    if (!data) return;
    
    setLoadingAI(true);
    try {
      // Prepare data for AI analysis
      const analysisData = {
        overallAccuracy: data.questionAnalytics.overallAccuracy,
        gameAccuracy: data.questionAnalytics.gameAccuracy,
        difficultQuestions: data.questionAnalytics.difficultQuestions.slice(0, 5),
        commonWrongAnswers: data.questionAnalytics.commonWrongAnswers.slice(0, 5),
        totalResponses: data.questionAnalytics.totalQuestions
      };

      // Note: In a real implementation, you would call OpenAI GPT API here
      // For now, we'll simulate the response
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const mockSuggestions = `
## AI Analysis & Improvement Suggestions

### Overall Performance
- **Accuracy Rate**: ${data.questionAnalytics.overallAccuracy}% (${data.questionAnalytics.totalQuestions} total responses)
- **Status**: ${data.questionAnalytics.overallAccuracy >= 70 ? '✅ Good' : '⚠️ Needs Improvement'}

### Game-Specific Insights
${data.questionAnalytics.gameAccuracy.map(game => `
**${game.game_name}**: ${game.accuracy}% accuracy (${game.total_responses} responses)
${game.accuracy < 60 ? '- 🔴 Consider simplifying questions or adding visual aids' : 
  game.accuracy < 80 ? '- 🟡 Good performance, minor improvements possible' : 
  '- 🟢 Excellent performance'}
`).join('')}

### Most Challenging Questions
${data.questionAnalytics.difficultQuestions.slice(0, 3).map((q, i) => `
${i + 1}. **${q.accuracy}% accuracy** - "${q.question_text.substring(0, 100)}..."
   - Suggestion: Add visual cues or break into simpler steps
`).join('')}

### Recommended Improvements
1. **Visual Enhancement**: Add more illustrations to difficult questions
2. **Progressive Difficulty**: Introduce easier warm-up questions
3. **Feedback Quality**: Provide more detailed explanations for wrong answers
4. **Language Adaptation**: Consider cultural context in question phrasing
5. **Interactive Elements**: Add drag-and-drop or matching activities

### Next Steps
- Focus on questions with <60% accuracy
- A/B test different question formats
- Gather qualitative feedback from users
- Consider age-appropriate language adjustments
      `;
      
      setAiSuggestions(mockSuggestions);
      setShowAISuggestions(true);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      setAiSuggestions('Error generating suggestions. Please try again.');
      setShowAISuggestions(true);
    } finally {
      setLoadingAI(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getAgeGroupLabel = (ageGroup: string) => {
    switch (ageGroup) {
      case 'early': return '6-8 years (Early)';
      case 'middle': return '9-11 years (Middle)';
      case 'teen': return '12-14 years (Teen)';
      default: return 'Unknown';
    }
  };

  const getLanguageLabel = (lang: string) => {
    const languages: Record<string, string> = {
      en: 'English',
      af: 'Afrikaans',
      zu: 'Zulu',
      xh: 'Xhosa',
      st: 'Sesotho',
      tn: 'Setswana',
      ts: 'Tsonga',
      ve: 'Venda',
      nr: 'South Ndebele',
      nso: 'Northern Sotho'
    };
    return languages[lang] || lang;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trustline Heroes Analytics</h1>
              <p className="text-gray-600 mt-1">User engagement and app performance insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">Last 24 hours</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
              <button
                onClick={fetchAnalyticsData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Activity className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={generateAISuggestions}
                disabled={loadingAI}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>{loadingAI ? 'Analyzing...' : 'Q Suggestions'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{data.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Screen Time</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(data.totalScreenTime)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{data.totalPoints.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GamepadIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Games Completed</p>
                <p className="text-2xl font-bold text-gray-900">{data.totalGamesCompleted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Analytics Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Brain className="w-6 h-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Question Analytics</h3>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-600">{data.questionAnalytics.overallAccuracy}%</p>
              <p className="text-sm text-gray-600">Overall Accuracy</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Game Accuracy */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Game Performance</h4>
              <div className="space-y-3">
                {data.questionAnalytics.gameAccuracy.map((game) => (
                  <div key={game.game_id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                      {game.game_name}
                    </span>
                    <div className="flex items-center space-x-2 ml-2">
                      <div className={`w-3 h-3 rounded-full ${
                        game.accuracy >= 80 ? 'bg-green-500' : 
                        game.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-semibold text-gray-900 w-12">
                        {game.accuracy}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficult Questions */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Most Challenging</h4>
              <div className="space-y-3">
                {data.questionAnalytics.difficultQuestions.slice(0, 3).map((question, index) => (
                  <div key={question.question_id} className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-red-600">#{index + 1}</span>
                      <span className="text-xs font-semibold text-red-800">{question.accuracy}%</span>
                    </div>
                    <p className="text-xs text-gray-700 line-clamp-2">
                      {question.question_text.substring(0, 80)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Wrong Answers */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Common Mistakes</h4>
              <div className="space-y-3">
                {data.questionAnalytics.commonWrongAnswers.slice(0, 3).map((mistake, index) => (
                  <div key={`${mistake.question_id}_${mistake.wrong_answer}`} className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-orange-600">#{index + 1}</span>
                      <span className="text-xs font-semibold text-orange-800">{mistake.count}x</span>
                    </div>
                    <p className="text-xs text-gray-700">
                      Answer: <span className="font-semibold">"{mistake.wrong_answer}"</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestions Modal */}
        {showAISuggestions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center">
                  <Lightbulb className="w-6 h-6 text-yellow-500 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">AI Question Improvement Suggestions</h3>
                </div>
                <button
                  onClick={() => setShowAISuggestions(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {aiSuggestions}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Age Group Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Age Group Distribution</h3>
            </div>
            <div className="space-y-4">
              {data.ageGroupDistribution.map((item) => (
                <div key={item.age_group} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {getAgeGroupLabel(item.age_group)}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(item.count / data.totalUsers) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Language Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <Languages className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Language Distribution</h3>
            </div>
            <div className="space-y-4">
              {data.languageDistribution.slice(0, 6).map((item) => (
                <div key={item.language} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {getLanguageLabel(item.language)}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${(item.count / data.totalUsers) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Daily Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <div className="flex items-end space-x-2 h-64 min-w-max">
              {data.dailyActivity.map((day) => (
                <div key={day.date} className="flex flex-col items-center">
                  <div className="flex flex-col items-end space-y-1 mb-2">
                    <div
                      className="bg-blue-500 rounded-t w-8 min-h-[4px]"
                      style={{
                        height: `${Math.max(4, (day.users / Math.max(...data.dailyActivity.map(d => d.users))) * 200)}px`
                      }}
                      title={`${day.users} users`}
                    ></div>
                    <div
                      className="bg-green-500 rounded-t w-8 min-h-[4px]"
                      style={{
                        height: `${Math.max(4, (day.screen_time / Math.max(...data.dailyActivity.map(d => d.screen_time))) * 100)}px`
                      }}
                      title={`${day.screen_time} minutes`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 transform -rotate-45 origin-top-left mt-2">
                    {new Date(day.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Screen Time (minutes)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Provinces */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Top Provinces</h3>
            </div>
            <div className="space-y-4">
              {data.topProvinces.slice(0, 8).map((province, index) => (
                <div key={province.province} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-gray-400 w-4">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {province.province}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {province.users} users
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      {province.avg_screen_time}m avg
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Completion Rates */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Game Completion Rates</h3>
            </div>
            <div className="space-y-4">
              {data.gameCompletionRates.slice(0, 6).map((game) => (
                <div key={game.game_id} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                    {game.game_name}
                  </span>
                  <div className="flex items-center space-x-3 ml-4">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${game.completion_rate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-10">
                      {game.completion_rate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{formatTime(data.averageSessionTime)}</p>
              <p className="text-sm text-gray-600">Average Session Time</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {data.totalUsers > 0 ? Math.round((data.totalGamesCompleted / data.totalUsers) * 100) / 100 : 0}
              </p>
              <p className="text-sm text-gray-600">Games per User</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {data.totalUsers > 0 ? Math.round(data.totalPoints / data.totalUsers) : 0}
              </p>
              <p className="text-sm text-gray-600">Average Points per User</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}