import { createClient } from '@supabase/supabase-js';

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
    try {
      let query = supabase
        .from('detailed_question_responses')
        .select(`
          question_category,
          is_correct,
          response_time_seconds,
          attempt_number,
          player_id,
          players!inner(age_group, province)
        `);

      if (ageGroup) {
        query = query.eq('players.age_group', ageGroup);
      }
      if (province) {
        query = query.eq('players.province', province);
      }

      const { data, error } = await query;

      if (error || !data) {
        console.error('Error fetching performance by category:', error);
        return [];
      }

      // Group by category and aggregate
      const categoryStats = data.reduce((acc: any, response: any) => {
        const category = response.question_category;
        const ageGrp = response.players?.age_group || 'unknown';
        const prov = response.players?.province || 'all';

        const key = `${category}_${ageGrp}_${prov}`;

        if (!acc[key]) {
          acc[key] = {
            category,
            ageGroup: ageGrp,
            province: prov === 'all' ? undefined : prov,
            totalResponses: 0,
            correctResponses: 0,
            totalResponseTime: 0,
            totalAttempts: 0
          };
        }

        acc[key].totalResponses++;
        if (response.is_correct) acc[key].correctResponses++;
        acc[key].totalResponseTime += response.response_time_seconds || 0;
        acc[key].totalAttempts += response.attempt_number || 1;

        return acc;
      }, {});

      // Calculate rates and filter by minimum responses
      const patterns: PerformancePattern[] = Object.values(categoryStats)
        .filter((stat: any) => stat.totalResponses >= minResponses)
        .map((stat: any) => ({
          category: stat.category,
          ageGroup: stat.ageGroup,
          province: stat.province,
          totalResponses: stat.totalResponses,
          correctResponses: stat.correctResponses,
          accuracyRate: (stat.correctResponses / stat.totalResponses) * 100,
          avgResponseTime: stat.totalResponseTime / stat.totalResponses,
          avgAttempts: stat.totalAttempts / stat.totalResponses
        }));

      return patterns.sort((a, b) => a.accuracyRate - b.accuracyRate);
    } catch (error) {
      console.error('Error in getPerformanceByCategory:', error);
      return [];
    }
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

      // Fetch overall metrics
      const { data: overallData } = await supabase
        .from('game_sessions')
        .select('session_id, points_earned, duration_seconds, completed')
        .gte('created_at', startDate.toISOString());

      const { data: responseData } = await supabase
        .from('detailed_question_responses')
        .select('is_correct')
        .gte('created_at', startDate.toISOString());

      const totalStudents = new Set(overallData?.map(s => s.session_id) || []).size;
      const totalGamesPlayed = overallData?.length || 0;
      const totalQuestionsAnswered = responseData?.length || 0;
      const correctAnswers = responseData?.filter(r => r.is_correct).length || 0;
      const overallAccuracy = totalQuestionsAnswered > 0
        ? (correctAnswers / totalQuestionsAnswered) * 100
        : 0;
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
    try {
      const { data, error } = await supabase
        .from('detailed_question_responses')
        .select(`
          question_id,
          question_text,
          question_category,
          is_correct,
          response_time_seconds,
          attempt_number,
          hints_used
        `)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error || !data) {
        console.error('Error fetching question insights:', error);
        return [];
      }

      // Aggregate by question
      const questionStats = data.reduce((acc: any, response: any) => {
        const qid = response.question_id;

        if (!acc[qid]) {
          acc[qid] = {
            questionId: qid,
            questionText: response.question_text,
            questionCategory: response.question_category,
            totalAttempts: 0,
            correctAttempts: 0,
            totalResponseTime: 0,
            totalHints: 0,
            multipleAttempts: 0
          };
        }

        acc[qid].totalAttempts++;
        if (response.is_correct) acc[qid].correctAttempts++;
        acc[qid].totalResponseTime += response.response_time_seconds || 0;
        acc[qid].totalHints += response.hints_used || 0;
        if (response.attempt_number > 1) acc[qid].multipleAttempts++;

        return acc;
      }, {});

      // Calculate insights
      return Object.values(questionStats)
        .filter((q: any) => q.totalAttempts >= minResponses)
        .map((q: any) => ({
          ...q,
          accuracyRate: (q.correctAttempts / q.totalAttempts) * 100,
          avgResponseTime: q.totalResponseTime / q.totalAttempts,
          retryRate: (q.multipleAttempts / q.totalAttempts) * 100,
          hintUsageRate: (q.totalHints / q.totalAttempts) * 100
        }))
        .sort((a: any, b: any) => a.accuracyRate - b.accuracyRate);
    } catch (error) {
      console.error('Error in getQuestionInsights:', error);
      return [];
    }
  }
}

export const educationalAnalysisService = new EducationalAnalysisService();