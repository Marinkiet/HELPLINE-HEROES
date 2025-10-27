import { analyticsService } from '../services/analyticsService';
import type { CreateLessonInput, QuizScore } from '../types/analytics';

export class SampleDataGenerator {
  private static sampleLessons: CreateLessonInput[] = [
    {
      title: 'Understanding Safe Touch',
      description: 'Learn to identify safe and unsafe touch situations',
      content: {
        sections: [
          { type: 'introduction', text: 'Welcome to learning about safe touch!' },
          { type: 'content', text: 'Safe touch makes you feel comfortable and happy.' },
          { type: 'quiz', questions: 5 }
        ]
      },
      difficulty_level: 'beginner',
      subject_category: 'child-safety',
      learning_objectives: [
        'Identify safe vs unsafe touch',
        'Understand body boundaries',
        'Know when to seek help'
      ]
    },
    {
      title: 'Identifying Trusted Adults',
      description: 'Learn who you can trust and talk to when you need help',
      content: {
        sections: [
          { type: 'introduction', text: 'Who can you trust?' },
          { type: 'content', text: 'Trusted adults are people who keep you safe.' },
          { type: 'activity', activities: 3 }
        ]
      },
      difficulty_level: 'beginner',
      subject_category: 'personal-boundaries',
      learning_objectives: [
        'Identify trusted adults',
        'Understand support networks',
        'Practice asking for help'
      ]
    },
    {
      title: 'Speaking Up with Confidence',
      description: 'Learn how to use your brave voice in difficult situations',
      content: {
        sections: [
          { type: 'introduction', text: 'Your voice matters!' },
          { type: 'content', text: 'Learn to speak up when something feels wrong.' },
          { type: 'practice', scenarios: 4 }
        ]
      },
      difficulty_level: 'intermediate',
      subject_category: 'communication',
      learning_objectives: [
        'Practice assertive communication',
        'Use appropriate tone and words',
        'Build confidence in speaking up'
      ]
    },
    {
      title: 'Understanding Your Emotions',
      description: 'Learn to recognize and express different emotions',
      content: {
        sections: [
          { type: 'introduction', text: 'All feelings are okay!' },
          { type: 'content', text: 'Learn to identify and name your emotions.' },
          { type: 'activity', activities: 5 }
        ]
      },
      difficulty_level: 'beginner',
      subject_category: 'emotional-intelligence',
      learning_objectives: [
        'Identify basic emotions',
        'Express feelings appropriately',
        'Understand emotional triggers'
      ]
    },
    {
      title: 'Advanced Boundary Setting',
      description: 'Master the art of setting and maintaining personal boundaries',
      content: {
        sections: [
          { type: 'introduction', text: 'Your boundaries matter!' },
          { type: 'content', text: 'Learn advanced techniques for boundary setting.' },
          { type: 'practice', scenarios: 6 }
        ]
      },
      difficulty_level: 'advanced',
      subject_category: 'personal-boundaries',
      learning_objectives: [
        'Set clear personal boundaries',
        'Communicate boundaries effectively',
        'Handle boundary violations'
      ]
    }
  ];

  static async generateSampleData(sessionId: string = 'sample-session-001'): Promise<void> {
    try {
      console.log('Starting sample data generation...');

      const createdLessons = [];
      for (const lessonInput of this.sampleLessons) {
        const lesson = await analyticsService.createLesson(lessonInput);
        if (lesson) {
          console.log(`Created lesson: ${lesson.title}`);
          createdLessons.push(lesson);
        }
      }

      console.log(`Generated ${createdLessons.length} lessons`);

      for (const lesson of createdLessons) {
        const numEngagements = Math.floor(Math.random() * 15) + 5;

        for (let i = 0; i < numEngagements; i++) {
          const engagement = await this.generateRandomEngagement(
            `${sessionId}-user-${i}`,
            lesson.lesson_id
          );

          if (engagement && Math.random() > 0.3) {
            await this.generateRandomFeedback(
              `${sessionId}-user-${i}`,
              lesson.lesson_id
            );
          }
        }

        await analyticsService.updatePerformanceMetrics(lesson.lesson_id);
        console.log(`Generated engagement data for: ${lesson.title}`);
      }

      console.log('Sample data generation completed successfully!');
    } catch (error) {
      console.error('Error generating sample data:', error);
      throw error;
    }
  }

  private static async generateRandomEngagement(sessionId: string, lessonId: string) {
    const completionStatuses: Array<'completed' | 'partial' | 'abandoned'> = ['completed', 'partial', 'abandoned'];
    const weights = [0.6, 0.25, 0.15];
    const status = this.weightedRandom(completionStatuses, weights);

    const durationSeconds = status === 'completed'
      ? Math.floor(Math.random() * 600) + 300
      : status === 'partial'
      ? Math.floor(Math.random() * 400) + 100
      : Math.floor(Math.random() * 200) + 30;

    const interactionCount = status === 'completed'
      ? Math.floor(Math.random() * 30) + 20
      : status === 'partial'
      ? Math.floor(Math.random() * 20) + 5
      : Math.floor(Math.random() * 10) + 1;

    const scrollDepth = status === 'completed'
      ? Math.floor(Math.random() * 20) + 80
      : status === 'partial'
      ? Math.floor(Math.random() * 40) + 30
      : Math.floor(Math.random() * 30) + 10;

    const quizAttempts = status === 'completed'
      ? Math.floor(Math.random() * 3) + 1
      : Math.floor(Math.random() * 2);

    const quizScores: QuizScore[] = [];
    for (let i = 0; i < quizAttempts; i++) {
      const maxScore = 10;
      const score = status === 'completed'
        ? Math.floor(Math.random() * 4) + 6
        : Math.floor(Math.random() * 6) + 2;

      quizScores.push({
        score,
        max_score: maxScore,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        quiz_id: `quiz-${i + 1}`
      });
    }

    const engagement = await analyticsService.startEngagement({
      session_id: sessionId,
      lesson_id: lessonId,
      completion_status: status,
      interaction_count: interactionCount,
      scroll_depth_percentage: scrollDepth,
      quiz_attempts: quizAttempts,
      quiz_scores: quizScores
    });

    if (engagement) {
      await analyticsService.updateEngagement(engagement.engagement_id, {
        session_end_time: new Date(Date.now() + durationSeconds * 1000).toISOString(),
        duration_seconds: durationSeconds,
        completion_status: status
      });
    }

    return engagement;
  }

  private static async generateRandomFeedback(sessionId: string, lessonId: string) {
    const ratings = [1, 2, 3, 4, 5];
    const ratingWeights = [0.05, 0.1, 0.2, 0.35, 0.3];
    const rating = this.weightedRandom(ratings, ratingWeights);

    const difficultyPerceptions: Array<'too_easy' | 'just_right' | 'too_hard'> = ['too_easy', 'just_right', 'too_hard'];
    const difficultyWeights = [0.15, 0.65, 0.2];
    const difficulty = this.weightedRandom(difficultyPerceptions, difficultyWeights);

    const clarityRatings = [1, 2, 3, 4, 5];
    const clarityWeights = [0.05, 0.1, 0.15, 0.35, 0.35];
    const clarity = this.weightedRandom(clarityRatings, clarityWeights);

    const feedbackTexts = [
      'Really helpful lesson! I learned a lot.',
      'The content was clear and easy to understand.',
      'Good lesson but could use more examples.',
      'Very informative and engaging.',
      'I wish there were more interactive activities.',
      'Perfect pacing and great explanations.',
      'Some parts were confusing, but overall good.',
      'Excellent content! Very practical.',
      'Could be more detailed in some areas.',
      'Great lesson! My child really enjoyed it.'
    ];

    const writtenFeedback = Math.random() > 0.4
      ? feedbackTexts[Math.floor(Math.random() * feedbackTexts.length)]
      : undefined;

    return await analyticsService.submitFeedback({
      session_id: sessionId,
      lesson_id: lessonId,
      rating,
      written_feedback: writtenFeedback,
      difficulty_perception: difficulty,
      clarity_rating: clarity
    });
  }

  private static weightedRandom<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }

    return items[items.length - 1];
  }

  static async cleanupSampleData(): Promise<void> {
    console.log('Sample data cleanup would require admin privileges');
    console.log('Use the Supabase dashboard to manually delete test data if needed');
  }

  static async generateQuickTestData(): Promise<void> {
    console.log('Generating quick test data with 2 lessons...');

    const testLessons = this.sampleLessons.slice(0, 2);

    for (const lessonInput of testLessons) {
      const lesson = await analyticsService.createLesson(lessonInput);
      if (lesson) {
        console.log(`Created test lesson: ${lesson.title}`);

        for (let i = 0; i < 3; i++) {
          await this.generateRandomEngagement(`test-session-${i}`, lesson.lesson_id);
          await this.generateRandomFeedback(`test-session-${i}`, lesson.lesson_id);
        }

        await analyticsService.updatePerformanceMetrics(lesson.lesson_id);
      }
    }

    console.log('Quick test data generation completed!');
  }
}

if (typeof window !== 'undefined') {
  (window as any).SampleDataGenerator = SampleDataGenerator;
}
