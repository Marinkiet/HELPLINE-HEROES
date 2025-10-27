import { createClient } from '@supabase/supabase-js';
import { openaiService } from './openaiService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Educational Analysis Service
 * AI-powered analysis of student performance data with actionable recommendations
 */

export interface PerformancePattern {
  category: string;
  ageGroup: string;
  province?: string;
  totalResponses: number;
  correctResponses: number;
  accuracyRate: number;
  avgResponseTime: number;
  avgAttempts: number;
}

export interface IdentifiedIssue {
  issueId: string;
  problemStatement: string;
  affectedPopulation: {
    ageGroups: string[];
    provinces?: string[];
    totalStudents: number;
    sampleSize: number;
  };
  metrics: {
    currentAccuracy: number;
    targetAccuracy: number;
    performanceGap: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface InterventionRecommendation {
  issueId: string;
  recommendationType: 'content' | 'pedagogy' | 'assessment' | 'support';
  priority: 'immediate' | 'short-term' | 'long-term';
  intervention: {
    title: string;
    description: string;
    implementationSteps: string[];
    requiredResources: string[];
    estimatedCost: 'low' | 'medium' | 'high';
    timeframe: string;
  };
  expectedOutcome: {
    description: string;
    estimatedImprovement: number;
    timeToImpact: string;
  };
  successMetrics: {
    metric: string;
    currentValue: number;
    targetValue: number;
    measurementMethod: string;
  }[];
}

export interface ComprehensiveAnalysis {
  generatedAt: Date;
  dataDateRange: {
    start: Date;
    end: Date;
  };
  overallMetrics: {
    totalStudents: number;
    totalGamesPlayed: number;
    totalQuestionsAnswered: number;
    overallAccuracy: number;
    avgSessionDuration: number;
  };
  identifiedIssues: IdentifiedIssue[];
  recommendations: InterventionRecommendation[];
  trendAnalysis: {
    improvingAreas: string[];
    decliningAreas: string[];
    stableAreas: string[];
  };
}

class EducationalAnalysisService {
  /**
   * Fetch performance patterns by question category
   */
  async getPerformanceByCategory(
    ageGroup?: string,
    province?: string,
    minResponses: number = 10
  ): Promise<PerformancePattern[]> {
    console.log('Note: Question response tracking not yet implemented in games. Returning empty data.');
    return [];
  }

  /**
   * Identify underperforming areas
   */
  async identifyIssues(accuracyThreshold: number = 60): Promise<IdentifiedIssue[]> {
    try {
      const patterns = await this.getPerformanceByCategory();
      const issues: IdentifiedIssue[] = [];

      // Group low-performing patterns
      const lowPerformingPatterns = patterns.filter(
        p => p.accuracyRate < accuracyThreshold
      );

      // Group by category
      const issuesByCategory = lowPerformingPatterns.reduce((acc: any, pattern) => {
        if (!acc[pattern.category]) {
          acc[pattern.category] = [];
        }
        acc[pattern.category].push(pattern);
        return acc;
      }, {});

      // Create issue for each problematic category
      for (const [category, categoryPatterns] of Object.entries(issuesByCategory) as [string, PerformancePattern[]][]) {
        const totalResponses = categoryPatterns.reduce((sum, p) => sum + p.totalResponses, 0);
        const totalCorrect = categoryPatterns.reduce((sum, p) => sum + p.correctResponses, 0);
        const overallAccuracy = (totalCorrect / totalResponses) * 100;

        const affectedAgeGroups = [...new Set(categoryPatterns.map(p => p.ageGroup))];
        const affectedProvinces = [...new Set(categoryPatterns.map(p => p.province).filter(Boolean))];

        // Determine severity
        let severity: 'low' | 'medium' | 'high' | 'critical';
        if (overallAccuracy < 30) severity = 'critical';
        else if (overallAccuracy < 45) severity = 'high';
        else if (overallAccuracy < 55) severity = 'medium';
        else severity = 'low';

        issues.push({
          issueId: `issue_${category.toLowerCase().replace(/\s+/g, '_')}`,
          problemStatement: `Low performance in ${category} questions: Students are struggling with ${category.toLowerCase()} concepts, with only ${overallAccuracy.toFixed(1)}% accuracy across ${totalResponses} attempts.`,
          affectedPopulation: {
            ageGroups: affectedAgeGroups,
            provinces: affectedProvinces.length > 0 ? affectedProvinces as string[] : undefined,
            totalStudents: categoryPatterns.length * 10, // Estimate
            sampleSize: totalResponses
          },
          metrics: {
            currentAccuracy: overallAccuracy,
            targetAccuracy: 75,
            performanceGap: 75 - overallAccuracy
          },
          severity
        });
      }

      return issues.sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      });
    } catch (error) {
      console.error('Error identifying issues:', error);
      return [];
    }
  }

  /**
   * Generate targeted recommendations for identified issues
   */
  async generateRecommendations(issues: IdentifiedIssue[]): Promise<InterventionRecommendation[]> {
    const recommendations: InterventionRecommendation[] = [];

    for (const issue of issues) {
      // Determine intervention type and priority based on severity and performance gap
      const isUrgent = issue.severity === 'critical' || issue.severity === 'high';
      const needsContentRevision = issue.metrics.currentAccuracy < 40;
      const needsPedagogicalSupport = issue.metrics.currentAccuracy >= 40 && issue.metrics.currentAccuracy < 60;

      // Content-based recommendation
      if (needsContentRevision) {
        recommendations.push({
          issueId: issue.issueId,
          recommendationType: 'content',
          priority: isUrgent ? 'immediate' : 'short-term',
          intervention: {
            title: 'Content Redesign with Multi-Modal Learning',
            description: `Redesign ${issue.problemStatement.split(':')[0]} content using visual aids, storytelling, and interactive elements. Current content may be too abstract or text-heavy for the target age groups.`,
            implementationSteps: [
              'Analyze current question formats and identify complex language or concepts',
              'Create visual aids (illustrations, diagrams, videos) for each concept',
              'Develop age-appropriate storytelling scenarios that embed learning',
              'Add interactive elements (drag-and-drop, matching games, simulations)',
              'Pilot test with small group and iterate based on feedback'
            ],
            requiredResources: [
              'Graphic designer or illustrator',
              'Educational content developer',
              'Age-appropriate stock images/videos',
              'Interactive question development tools'
            ],
            estimatedCost: 'medium',
            timeframe: '4-6 weeks'
          },
          expectedOutcome: {
            description: 'Improved comprehension and retention through multiple learning modalities',
            estimatedImprovement: Math.min(issue.metrics.performanceGap * 0.6, 30),
            timeToImpact: '2-3 weeks after implementation'
          },
          successMetrics: [
            {
              metric: 'Question Accuracy Rate',
              currentValue: issue.metrics.currentAccuracy,
              targetValue: issue.metrics.targetAccuracy,
              measurementMethod: 'Track accuracy rate weekly for affected questions'
            },
            {
              metric: 'Average Response Time',
              currentValue: 0, // Would need to fetch
              targetValue: 0, // Target faster decision-making
              measurementMethod: 'Monitor if students answer more confidently (faster) without compromising accuracy'
            },
            {
              metric: 'First Attempt Success Rate',
              currentValue: 0,
              targetValue: 70,
              measurementMethod: 'Percentage of students who answer correctly on first attempt'
            }
          ]
        });
      }

      // Pedagogical recommendation
      if (needsPedagogicalSupport) {
        recommendations.push({
          issueId: issue.issueId,
          recommendationType: 'pedagogy',
          priority: 'short-term',
          intervention: {
            title: 'Progressive Difficulty Scaffolding',
            description: 'Introduce concepts gradually with warm-up questions before presenting challenging scenarios. Build confidence through success.',
            implementationSteps: [
              'Identify prerequisite concepts for struggling areas',
              'Create 2-3 easier "warm-up" questions for each difficult concept',
              'Implement progressive difficulty curve (easy → medium → hard)',
              'Add "hint" system that provides scaffolded support',
              'Celebrate small wins with positive feedback'
            ],
            requiredResources: [
              'Question bank expansion',
              'Learning path designer',
              'Hint/tooltip content development'
            ],
            estimatedCost: 'low',
            timeframe: '2-3 weeks'
          },
          expectedOutcome: {
            description: 'Reduced frustration, increased confidence, and better concept mastery through gradual progression',
            estimatedImprovement: Math.min(issue.metrics.performanceGap * 0.4, 20),
            timeToImpact: '1-2 weeks after implementation'
          },
          successMetrics: [
            {
              metric: 'Completion Rate',
              currentValue: 0,
              targetValue: 85,
              measurementMethod: 'Percentage of students who complete all questions in category'
            },
            {
              metric: 'Hint Usage Rate',
              currentValue: 0,
              targetValue: 30,
              measurementMethod: 'Percentage of students using hints (shows engagement with support)'
            }
          ]
        });
      }

      // Assessment recommendation (always applicable)
      recommendations.push({
        issueId: issue.issueId,
        recommendationType: 'assessment',
        priority: 'immediate',
        intervention: {
          title: 'Enhanced Feedback and Explanations',
          description: 'Provide detailed, constructive feedback for incorrect answers, explaining WHY the answer is wrong and HOW to think about it correctly.',
          implementationSteps: [
            'Write detailed explanation for each incorrect answer option',
            'Include "teaching moments" in feedback (not just "wrong" but "here\'s why")',
            'Add positive reinforcement even for incorrect attempts',
            'Provide examples or analogies in explanations',
            'Allow students to retry questions after viewing feedback'
          ],
          requiredResources: [
            'Educational content writer for feedback',
            'Subject matter expert review',
            'UI/UX updates to display rich feedback'
          ],
          estimatedCost: 'low',
          timeframe: '1-2 weeks'
        },
        expectedOutcome: {
          description: 'Students learn from mistakes and develop better understanding through immediate, constructive feedback',
          estimatedImprovement: Math.min(issue.metrics.performanceGap * 0.3, 15),
          timeToImpact: 'Immediate'
        },
        successMetrics: [
          {
            metric: 'Retry Success Rate',
            currentValue: 0,
            targetValue: 80,
            measurementMethod: 'Percentage of students who answer correctly on second attempt after feedback'
          },
          {
            metric: 'Feedback Engagement',
            currentValue: 0,
            targetValue: 70,
            measurementMethod: 'Percentage of students who read feedback (track time spent on feedback screen)'
          }
        ]
      });

      // Regional-specific recommendation if multiple provinces affected
      if (issue.affectedPopulation.provinces && issue.affectedPopulation.provinces.length >= 2) {
        recommendations.push({
          issueId: issue.issueId,
          recommendationType: 'support',
          priority: 'long-term',
          intervention: {
            title: 'Regional Teacher Training and Support',
            description: `Provide targeted teacher training for ${issue.affectedPopulation.provinces.join(', ')} focused on teaching strategies for ${issue.problemStatement.split(':')[0]}.`,
            implementationSteps: [
              'Conduct needs assessment with teachers in affected regions',
              'Develop region-specific training materials',
              'Deliver virtual or in-person training workshops',
              'Create teacher support community/forum',
              'Provide ongoing coaching and resources'
            ],
            requiredResources: [
              'Teacher trainer or educational coach',
              'Training venue (virtual or physical)',
              'Training materials and handouts',
              'Ongoing support platform'
            ],
            estimatedCost: 'high',
            timeframe: '8-12 weeks'
          },
          expectedOutcome: {
            description: 'Improved teaching quality and student outcomes through better-equipped educators',
            estimatedImprovement: Math.min(issue.metrics.performanceGap * 0.5, 25),
            timeToImpact: '4-6 weeks after training'
          },
          successMetrics: [
            {
              metric: 'Teacher Participation Rate',
              currentValue: 0,
              targetValue: 80,
              measurementMethod: 'Percentage of teachers who complete training'
            },
            {
              metric: 'Student Performance in Trained Classes',
              currentValue: issue.metrics.currentAccuracy,
              targetValue: issue.metrics.targetAccuracy,
              measurementMethod: 'Compare performance before/after teacher training'
            }
          ]
        });
      }
    }

    return recommendations;
  }

  /**
   * Generate comprehensive analysis report
   */
  async generateComprehensiveAnalysis(
    daysBack: number = 30
  ): Promise<ComprehensiveAnalysis> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      // Fetch overall metrics from available tables
      const { data: overallData } = await supabase
        .from('game_sessions')
        .select('session_id, points_earned, duration_seconds, completed')
        .gte('created_at', startDate.toISOString());

      const totalStudents = new Set(overallData?.map(s => s.session_id) || []).size;
      const totalGamesPlayed = overallData?.length || 0;
      const totalQuestionsAnswered = 0;
      const overallAccuracy = 0;
      const avgSessionDuration = overallData && overallData.length > 0
        ? overallData.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / overallData.length
        : 0;

      // Identify issues and generate recommendations
      const issues = await this.identifyIssues(60);
      const recommendations = await this.generateRecommendations(issues);

      return {
        generatedAt: new Date(),
        dataDateRange: {
          start: startDate,
          end: endDate
        },
        overallMetrics: {
          totalStudents,
          totalGamesPlayed,
          totalQuestionsAnswered,
          overallAccuracy,
          avgSessionDuration
        },
        identifiedIssues: issues,
        recommendations,
        trendAnalysis: {
          improvingAreas: [],
          decliningAreas: [],
          stableAreas: []
        }
      };
    } catch (error) {
      console.error('Error generating comprehensive analysis:', error);
      throw error;
    }
  }

  /**
   * Get question-level insights
   */
  async getQuestionInsights(gameId: string, minResponses: number = 10) {
    console.log('Note: Question insights not available without question_responses table');
    return [];
  }

  /**
   * Generate GPT-4 Turbo powered comprehensive analysis
   */
  async generateGPTAnalysis(
    daysBack: number = 30
  ): Promise<ComprehensiveAnalysis | null> {
    try {
      // Check if OpenAI is configured
      if (!openaiService.isConfigured()) {
        console.warn('OpenAI not configured, falling back to rule-based analysis');
        return await this.generateComprehensiveAnalysis(daysBack);
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      // Fetch raw performance data
      const patterns = await this.getPerformanceByCategory();
      const questionInsights = await this.getQuestionInsights('all');

      // Fetch overall metrics
      const { data: overallData } = await supabase
        .from('game_sessions')
        .select('session_id, points_earned, duration_seconds, completed')
        .gte('created_at', startDate.toISOString());

      const { data: sessionData } = await supabase
        .from('user_sessions')
        .select('session_id, age_group, location_region')
        .gte('created_at', startDate.toISOString());

      const enrichedResponseData: any[] = [];

      // Prepare data for GPT analysis
      const performanceData = {
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          days: daysBack
        },
        overallMetrics: {
          totalStudents: new Set(overallData?.map(s => s.session_id) || []).size,
          totalGamesPlayed: overallData?.length || 0,
          totalQuestionsAnswered: enrichedResponseData.length,
          overallAccuracy: enrichedResponseData.length > 0
            ? (enrichedResponseData.filter(r => r.is_correct).length / enrichedResponseData.length) * 100
            : 0,
          avgSessionDuration: overallData && overallData.length > 0
            ? overallData.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / overallData.length
            : 0
        },
        performanceByCategory: patterns.slice(0, 10),
        performanceByAgeGroup: this.aggregateByDemographic(enrichedResponseData, 'age_group'),
        performanceByProvince: this.aggregateByDemographic(enrichedResponseData, 'province'),
        difficultQuestions: questionInsights.slice(0, 5)
      };

      // Call GPT-4 Turbo for analysis
      const gptResponse = await openaiService.analyzeEducationalData(performanceData);

      if (!gptResponse.success || !gptResponse.data) {
        console.error('GPT analysis failed:', gptResponse.error);
        return await this.generateComprehensiveAnalysis(daysBack);
      }

      // Parse GPT response
      let gptAnalysis;
      try {
        gptAnalysis = typeof gptResponse.data === 'string'
          ? JSON.parse(gptResponse.data)
          : gptResponse.data;
      } catch (parseError) {
        console.error('Failed to parse GPT response:', parseError);
        return await this.generateComprehensiveAnalysis(daysBack);
      }

      // Map GPT analysis to our format
      return {
        generatedAt: new Date(),
        dataDateRange: {
          start: startDate,
          end: endDate
        },
        overallMetrics: performanceData.overallMetrics,
        identifiedIssues: gptAnalysis.identifiedIssues || [],
        recommendations: gptAnalysis.recommendations || [],
        trendAnalysis: gptAnalysis.trendAnalysis || {
          improvingAreas: [],
          decliningAreas: [],
          stableAreas: []
        }
      };
    } catch (error) {
      console.error('Error generating GPT analysis:', error);
      return await this.generateComprehensiveAnalysis(daysBack);
    }
  }

  /**
   * Helper: Aggregate performance by demographic
   */
  private aggregateByDemographic(data: any[], field: 'age_group' | 'province') {
    return [];
  }
}

export const educationalAnalysisService = new EducationalAnalysisService();