import { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Target, Users, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { educationalAnalysisService, ComprehensiveAnalysis, InterventionRecommendation } from '../services/educationalAnalysisService';

export function AIInsightsPanel() {
  const [analysis, setAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use GPT-4 Turbo powered analysis
      const data = await educationalAnalysisService.generateGPTAnalysis(30);
      setAnalysis(data);
    } catch (err) {
      console.error('Error loading analysis:', err);
      setError('Failed to load AI insights. Please check your OpenAI API configuration.');
    } finally {
      setLoading(false);
    }
  };

  const toggleIssue = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'bg-red-50 border-red-200';
      case 'short-term': return 'bg-orange-50 border-orange-200';
      case 'long-term': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'content': return <Lightbulb className="w-5 h-5" />;
      case 'pedagogy': return <Target className="w-5 h-5" />;
      case 'assessment': return <CheckCircle className="w-5 h-5" />;
      case 'support': return <Users className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <div className="ml-4">
            <p className="text-gray-900 font-medium">GPT-4 Turbo is analyzing your data...</p>
            <p className="text-gray-500 text-sm mt-1">This may take 10-15 seconds</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
        <div className="text-center text-red-600">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
          <button
            onClick={loadAnalysis}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const getRecommendationsForIssue = (issueId: string) => {
    return analysis.recommendations.filter(r => r.issueId === issueId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">AI Educational Insights</h2>
              <p className="text-purple-100 text-sm">
                Powered by GPT-4 Turbo • Analysis generated {analysis.generatedAt.toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={loadAnalysis}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Refresh Analysis
          </button>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{analysis.overallMetrics.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Games Played</p>
              <p className="text-2xl font-bold text-gray-900">{analysis.overallMetrics.totalGamesPlayed}</p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Questions Answered</p>
              <p className="text-2xl font-bold text-gray-900">{analysis.overallMetrics.totalQuestionsAnswered}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">
                {analysis.overallMetrics.overallAccuracy.toFixed(1)}%
              </p>
            </div>
            {analysis.overallMetrics.overallAccuracy >= 70 ? (
              <TrendingUp className="w-8 h-8 text-green-500" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-500" />
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(analysis.overallMetrics.avgSessionDuration / 60)}m
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Identified Issues */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold text-gray-900">Identified Learning Gaps</h3>
            <span className="bg-orange-100 text-orange-800 text-sm font-semibold px-2 py-1 rounded-full">
              {analysis.identifiedIssues.length} Issues
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {analysis.identifiedIssues.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>No significant performance issues detected!</p>
              <p className="text-sm mt-1">Students are performing well across all areas.</p>
            </div>
          ) : (
            analysis.identifiedIssues.map((issue) => (
              <div key={issue.issueId} className="p-6">
                {/* Issue Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(issue.severity)}`}>
                        {issue.severity.toUpperCase()}
                      </span>
                      <button
                        onClick={() => toggleIssue(issue.issueId)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedIssues.has(issue.issueId) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{issue.problemStatement}</h4>

                    {/* Metrics Bar */}
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{issue.affectedPopulation.ageGroups.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>{issue.metrics.currentAccuracy.toFixed(1)}% accuracy</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Target: {issue.metrics.targetAccuracy}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedIssues.has(issue.issueId) && (
                  <div className="mt-4 space-y-4">
                    {/* Affected Population Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-2">Affected Population</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Age Groups:</span>
                          <span className="ml-2 font-medium">{issue.affectedPopulation.ageGroups.join(', ')}</span>
                        </div>
                        {issue.affectedPopulation.provinces && (
                          <div>
                            <span className="text-gray-600">Provinces:</span>
                            <span className="ml-2 font-medium">{issue.affectedPopulation.provinces.join(', ')}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600">Sample Size:</span>
                          <span className="ml-2 font-medium">{issue.affectedPopulation.sampleSize} responses</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Est. Students:</span>
                          <span className="ml-2 font-medium">{issue.affectedPopulation.totalStudents}</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Recommended Interventions</h5>
                      <div className="space-y-3">
                        {getRecommendationsForIssue(issue.issueId).map((rec, idx) => (
                          <RecommendationCard key={idx} recommendation={rec} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: InterventionRecommendation }) {
  const [expanded, setExpanded] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'bg-red-50 border-red-200 text-red-700';
      case 'short-term': return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'long-term': return 'bg-blue-50 border-blue-200 text-blue-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'content': return <Lightbulb className="w-5 h-5" />;
      case 'pedagogy': return <Target className="w-5 h-5" />;
      case 'assessment': return <CheckCircle className="w-5 h-5" />;
      case 'support': return <Users className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <div className={`border-2 rounded-lg ${getPriorityColor(recommendation.priority)}`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getRecommendationIcon(recommendation.recommendationType)}
            <h6 className="font-semibold text-gray-900">{recommendation.intervention.title}</h6>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-sm text-gray-700 mb-3">{recommendation.intervention.description}</p>

        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{recommendation.intervention.timeframe}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-medium">Cost:</span>
            <span className="capitalize">{recommendation.intervention.estimatedCost}</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>+{recommendation.expectedOutcome.estimatedImprovement.toFixed(0)}% improvement</span>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <h6 className="font-semibold text-gray-900 mb-2">Implementation Steps:</h6>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                {recommendation.intervention.implementationSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            <div>
              <h6 className="font-semibold text-gray-900 mb-2">Required Resources:</h6>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {recommendation.intervention.requiredResources.map((resource, idx) => (
                  <li key={idx}>{resource}</li>
                ))}
              </ul>
            </div>

            <div>
              <h6 className="font-semibold text-gray-900 mb-2">Expected Outcome:</h6>
              <p className="text-gray-700">{recommendation.expectedOutcome.description}</p>
              <p className="text-gray-600 text-xs mt-1">Time to impact: {recommendation.expectedOutcome.timeToImpact}</p>
            </div>

            <div>
              <h6 className="font-semibold text-gray-900 mb-2">Success Metrics:</h6>
              <div className="space-y-2">
                {recommendation.successMetrics.map((metric, idx) => (
                  <div key={idx} className="bg-white rounded p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{metric.metric}</span>
                      <span className="text-xs text-gray-600">{metric.targetValue}% target</span>
                    </div>
                    <p className="text-xs text-gray-600">{metric.measurementMethod}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}