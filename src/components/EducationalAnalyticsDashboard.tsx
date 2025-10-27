import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Users, Target, CheckCircle, XCircle, Clock, Star, Download, RefreshCw, Filter, Brain } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import type {
  LessonAnalyticsSummary,
  LessonPerformanceMetrics,
  AnalyticsFilters,
  GPTAnalysisExport
} from '../types/analytics';

export function EducationalAnalyticsDashboard() {
  const [lessonsSummary, setLessonsSummary] = useState<LessonAnalyticsSummary[]>([]);
  const [topPerforming, setTopPerforming] = useState<LessonAnalyticsSummary[]>([]);
  const [needsImprovement, setNeedsImprovement] = useState<LessonAnalyticsSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilters>({});
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [filters]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summary, top, needsWork] = await Promise.all([
        analyticsService.getLessonAnalyticsSummary(filters),
        analyticsService.getTopPerformingLessons(5),
        analyticsService.getLessonsNeedingImprovement(5)
      ]);

      setLessonsSummary(summary);
      setTopPerforming(top);
      setNeedsImprovement(needsWork);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportForGPTAnalysis = async () => {
    try {
      setExportLoading(true);
      const exportData = await analyticsService.exportDataForGPTAnalysis(filters);

      if (exportData) {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lesson-analytics-export-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error exporting data:', err);
    } finally {
      setExportLoading(false);
    }
  };

  const calculateAggregateStats = () => {
    if (lessonsSummary.length === 0) {
      return {
        totalLessons: 0,
        totalAttempts: 0,
        totalCompletions: 0,
        avgCompletionRate: 0,
        avgRating: 0,
        totalUniqueUsers: 0
      };
    }

    const totalAttempts = lessonsSummary.reduce((sum, l) => sum + l.total_attempts, 0);
    const totalCompletions = lessonsSummary.reduce((sum, l) => sum + l.total_completions, 0);
    const avgCompletionRate = totalAttempts > 0 ? (totalCompletions / totalAttempts) * 100 : 0;
    const ratingsSum = lessonsSummary.reduce((sum, l) => sum + (l.avg_rating || 0), 0);
    const ratingsCount = lessonsSummary.filter(l => l.avg_rating > 0).length;
    const avgRating = ratingsCount > 0 ? ratingsSum / ratingsCount : 0;
    const totalUniqueUsers = lessonsSummary.reduce((sum, l) => sum + l.unique_users, 0);

    return {
      totalLessons: lessonsSummary.length,
      totalAttempts,
      totalCompletions,
      avgCompletionRate,
      avgRating,
      totalUniqueUsers
    };
  };

  const stats = calculateAggregateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading educational analytics...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
                Educational Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Comprehensive lesson performance and engagement insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchAnalyticsData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={exportForGPTAnalysis}
                disabled={exportLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>{exportLoading ? 'Exporting...' : 'Export for GPT'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLessons}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unique Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUniqueUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgCompletionRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}/5</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Lessons</h3>
            </div>
            <div className="space-y-4">
              {topPerforming.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No lessons available</p>
              ) : (
                topPerforming.map((lesson, index) => (
                  <div key={lesson.lesson_id} className="flex items-start justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                        <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                      </div>
                      <p className="text-xs text-gray-600">
                        {lesson.subject_category} · {lesson.difficulty_level}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-600">
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          {lesson.total_completions} completions
                        </span>
                        <span className="text-xs text-gray-600">
                          <Star className="w-3 h-3 inline mr-1 text-yellow-500" />
                          {lesson.avg_rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <Brain className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Needs Improvement</h3>
            </div>
            <div className="space-y-4">
              {needsImprovement.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No lessons available</p>
              ) : (
                needsImprovement.map((lesson, index) => (
                  <div key={lesson.lesson_id} className="flex items-start justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-bold text-orange-600">#{index + 1}</span>
                        <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                      </div>
                      <p className="text-xs text-gray-600">
                        {lesson.subject_category} · {lesson.difficulty_level}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-600">
                          <XCircle className="w-3 h-3 inline mr-1" />
                          {((lesson.total_attempts - lesson.total_completions) / lesson.total_attempts * 100).toFixed(0)}% dropout
                        </span>
                        <span className="text-xs text-gray-600">
                          <Star className="w-3 h-3 inline mr-1 text-yellow-500" />
                          {lesson.avg_rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">All Lessons Performance</h3>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={filters.subject_category || ''}
                onChange={(e) => setFilters({ ...filters, subject_category: e.target.value || undefined })}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="">All Subjects</option>
                <option value="child-safety">Child Safety</option>
                <option value="personal-boundaries">Personal Boundaries</option>
                <option value="communication">Communication</option>
                <option value="emotional-intelligence">Emotional Intelligence</option>
              </select>
              <select
                value={filters.difficulty_level || ''}
                onChange={(e) => setFilters({ ...filters, difficulty_level: e.target.value as any })}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {lessonsSummary.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No lessons found</p>
              <p className="text-gray-400 text-sm">Start by creating lessons to see analytics</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Lesson</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Users</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Attempts</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Completion</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Avg Duration</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {lessonsSummary.map((lesson) => (
                    <tr key={lesson.lesson_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{lesson.title}</p>
                          <p className="text-xs text-gray-500">{lesson.difficulty_level}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{lesson.subject_category}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-900">{lesson.unique_users}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-900">{lesson.total_attempts}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${lesson.total_attempts > 0 ? (lesson.total_completions / lesson.total_attempts) * 100 : 0}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-900 w-10">
                            {lesson.total_attempts > 0 ? ((lesson.total_completions / lesson.total_attempts) * 100).toFixed(0) : 0}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-900">
                        <Clock className="w-4 h-4 inline mr-1 text-gray-400" />
                        {Math.round(lesson.avg_duration_seconds / 60)}m
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-semibold text-gray-900">
                            {lesson.avg_rating > 0 ? lesson.avg_rating.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-sm p-6 border border-blue-200 mt-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">GPT-Powered Analysis</h3>
              <p className="text-gray-700 mb-4">
                Export your lesson analytics data in JSON format for GPT analysis. The export includes comprehensive
                metrics on lesson performance, user engagement, feedback, and performance indicators. Use this data to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                <li>Identify patterns in lesson completion and dropout rates</li>
                <li>Discover which content types resonate best with learners</li>
                <li>Optimize lesson difficulty and pacing</li>
                <li>Generate personalized improvement recommendations</li>
                <li>Analyze user feedback sentiment and common themes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
