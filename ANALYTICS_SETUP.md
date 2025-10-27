# Educational Analytics Database - Setup Guide

## Overview

This comprehensive analytics system tracks educational lesson performance and user engagement metrics for GPT-powered learning systems. The implementation uses Supabase (PostgreSQL) for robust, scalable data storage and analysis.

## Database Architecture

### Tables

#### 1. `lessons`
Stores educational lesson content and metadata.

**Columns:**
- `lesson_id` (uuid, PK) - Unique lesson identifier
- `title` (text) - Lesson title
- `description` (text) - Lesson description
- `content` (jsonb) - Full lesson content in structured format
- `difficulty_level` (enum) - beginner, intermediate, advanced
- `subject_category` (text) - Subject classification
- `learning_objectives` (jsonb) - Array of learning objectives
- `creation_date` (timestamptz) - Creation timestamp
- `last_modified` (timestamptz) - Last update timestamp
- `is_active` (boolean) - Active status flag

**Indexes:**
- Primary key on `lesson_id`
- Index on `subject_category`
- Index on `difficulty_level`
- Index on `is_active`
- GIN index on `content` (JSONB)
- GIN index on `learning_objectives` (JSONB)

---

#### 2. `lesson_engagement`
Tracks detailed user interaction with lessons.

**Columns:**
- `engagement_id` (uuid, PK) - Unique engagement record
- `session_id` (text, FK) - References user_sessions
- `lesson_id` (uuid, FK) - References lessons
- `session_start_time` (timestamptz) - Session start
- `session_end_time` (timestamptz) - Session end
- `duration_seconds` (integer) - Session duration
- `completion_status` (enum) - completed, partial, abandoned
- `interaction_count` (integer) - User interactions
- `scroll_depth_percentage` (integer) - Scroll depth (0-100)
- `quiz_attempts` (integer) - Number of quiz attempts
- `quiz_scores` (jsonb) - Array of quiz scores
- `created_at` (timestamptz) - Record creation

**Indexes:**
- Primary key on `engagement_id`
- Index on `lesson_id`
- Index on `session_id`
- Index on `session_start_time`
- Index on `completion_status`
- GIN index on `quiz_scores` (JSONB)

---

#### 3. `lesson_feedback`
Captures user feedback and ratings.

**Columns:**
- `feedback_id` (uuid, PK) - Unique feedback identifier
- `session_id` (text, FK) - References user_sessions
- `lesson_id` (uuid, FK) - References lessons
- `rating` (integer) - Rating 1-5 scale
- `written_feedback` (text) - Detailed feedback
- `difficulty_perception` (enum) - too_easy, just_right, too_hard
- `clarity_rating` (integer) - Clarity rating 1-5
- `timestamp` (timestamptz) - Submission time

**Indexes:**
- Primary key on `feedback_id`
- Index on `lesson_id`
- Index on `session_id`
- Index on `rating`
- Index on `timestamp`

---

#### 4. `lesson_performance_metrics`
Aggregated performance metrics per lesson.

**Columns:**
- `metric_id` (uuid, PK) - Unique metric record
- `lesson_id` (uuid, FK, UNIQUE) - References lessons
- `average_completion_rate` (numeric) - Completion percentage
- `average_session_duration` (numeric) - Average duration (seconds)
- `user_satisfaction_score` (numeric) - Average rating
- `drop_off_points` (jsonb) - Common abandonment points
- `common_struggle_areas` (jsonb) - Areas of difficulty
- `total_attempts` (integer) - Total attempts
- `total_completions` (integer) - Total completions
- `last_calculated` (timestamptz) - Last calculation time

**Indexes:**
- Primary key on `metric_id`
- Unique constraint on `lesson_id`
- GIN index on `drop_off_points` (JSONB)
- GIN index on `common_struggle_areas` (JSONB)

---

### Views

#### `lesson_analytics_summary`
Comprehensive analytics view combining all tables for easy querying.

**Columns:**
- `lesson_id`, `title`, `subject_category`, `difficulty_level`
- `unique_users` - Count of distinct users
- `total_attempts` - Total lesson attempts
- `total_completions` - Total completions
- `avg_duration_seconds` - Average duration
- `avg_interactions` - Average interactions
- `avg_scroll_depth` - Average scroll depth
- `avg_rating` - Average rating
- `feedback_count` - Number of feedback entries
- `creation_date`, `last_modified`

---

## Security (Row Level Security)

All tables have RLS enabled with anonymous access policies for educational content:

- **lessons**: Public read access for active lessons
- **lesson_engagement**: Anonymous insert/update for tracking
- **lesson_feedback**: Anonymous insert for feedback
- **lesson_performance_metrics**: Public read access

---

## Functions

### `update_lesson_performance_metrics(lesson_id)`
Automatically calculates and updates performance metrics for a lesson.

**Calculates:**
- Average completion rate
- Average session duration
- User satisfaction score
- Total attempts and completions

---

## TypeScript Service Layer

### `analyticsService`

Located in: `src/services/analyticsService.ts`

#### Lesson Operations
```typescript
// Create a new lesson
createLesson(input: CreateLessonInput): Promise<Lesson | null>

// Get lesson by ID
getLesson(lessonId: string): Promise<Lesson | null>

// Get all lessons with optional filters
getAllLessons(filters?: AnalyticsFilters): Promise<Lesson[]>

// Update lesson
updateLesson(lessonId: string, updates: Partial<CreateLessonInput>): Promise<Lesson | null>

// Soft delete lesson
deleteLesson(lessonId: string): Promise<boolean>
```

#### Engagement Tracking
```typescript
// Start engagement session
startEngagement(input: CreateEngagementInput): Promise<LessonEngagement | null>

// Update engagement
updateEngagement(engagementId: string, updates: UpdateEngagementInput): Promise<LessonEngagement | null>

// Get engagements by lesson
getEngagementsByLesson(lessonId: string, filters?: AnalyticsFilters): Promise<LessonEngagement[]>

// Get engagements by session
getEngagementsBySession(sessionId: string): Promise<LessonEngagement[]>
```

#### Feedback Operations
```typescript
// Submit feedback
submitFeedback(input: CreateFeedbackInput): Promise<LessonFeedback | null>

// Get feedback by lesson
getFeedbackByLesson(lessonId: string, filters?: AnalyticsFilters): Promise<LessonFeedback[]>
```

#### Performance Metrics
```typescript
// Update metrics for a lesson
updatePerformanceMetrics(lessonId: string): Promise<boolean>

// Get metrics for a lesson
getPerformanceMetrics(lessonId: string): Promise<LessonPerformanceMetrics | null>

// Get all metrics
getAllPerformanceMetrics(): Promise<LessonPerformanceMetrics[]>
```

#### Analytics & Insights
```typescript
// Get analytics summary
getLessonAnalyticsSummary(filters?: AnalyticsFilters): Promise<LessonAnalyticsSummary[]>

// Get top performing lessons
getTopPerformingLessons(limit?: number): Promise<LessonAnalyticsSummary[]>

// Get lessons needing improvement
getLessonsNeedingImprovement(limit?: number): Promise<LessonAnalyticsSummary[]>

// Get engagement trends
getEngagementTrends(lessonId: string, days?: number): Promise<any[]>
```

#### GPT Integration
```typescript
// Export data for GPT analysis
exportDataForGPTAnalysis(filters?: AnalyticsFilters): Promise<GPTAnalysisExport | null>
```

---

## Usage Examples

### 1. Creating a Lesson

```typescript
import { analyticsService } from './services/analyticsService';

const lesson = await analyticsService.createLesson({
  title: 'Understanding Safe Touch',
  description: 'Learn to identify safe and unsafe touch situations',
  content: {
    sections: [
      { type: 'introduction', text: 'Welcome!' },
      { type: 'content', text: 'Lesson content here' }
    ]
  },
  difficulty_level: 'beginner',
  subject_category: 'child-safety',
  learning_objectives: [
    'Identify safe vs unsafe touch',
    'Understand body boundaries'
  ]
});
```

### 2. Tracking Engagement

```typescript
// Start engagement
const engagement = await analyticsService.startEngagement({
  session_id: 'user-session-123',
  lesson_id: lesson.lesson_id,
  completion_status: 'partial',
  interaction_count: 0,
  scroll_depth_percentage: 0
});

// Update as user progresses
await analyticsService.updateEngagement(engagement.engagement_id, {
  session_end_time: new Date().toISOString(),
  duration_seconds: 450,
  completion_status: 'completed',
  interaction_count: 25,
  scroll_depth_percentage: 95,
  quiz_attempts: 2,
  quiz_scores: [
    { score: 8, max_score: 10, timestamp: new Date().toISOString() }
  ]
});

// Update metrics after engagement
await analyticsService.updatePerformanceMetrics(lesson.lesson_id);
```

### 3. Collecting Feedback

```typescript
await analyticsService.submitFeedback({
  session_id: 'user-session-123',
  lesson_id: lesson.lesson_id,
  rating: 5,
  written_feedback: 'Great lesson! Very helpful.',
  difficulty_perception: 'just_right',
  clarity_rating: 5
});
```

### 4. Viewing Analytics

```typescript
// Get summary for all lessons
const summary = await analyticsService.getLessonAnalyticsSummary();

// Get top performers
const topLessons = await analyticsService.getTopPerformingLessons(5);

// Get lessons needing work
const needsWork = await analyticsService.getLessonsNeedingImprovement(5);

// Get specific lesson metrics
const metrics = await analyticsService.getPerformanceMetrics(lesson.lesson_id);
```

### 5. Exporting for GPT Analysis

```typescript
const exportData = await analyticsService.exportDataForGPTAnalysis({
  subject_category: 'child-safety',
  date_from: '2025-10-01',
  date_to: '2025-10-27'
});

// Convert to JSON and save
const json = JSON.stringify(exportData, null, 2);
// Download or send to GPT API
```

---

## Sample Data Generation

Use the `SampleDataGenerator` utility to create test data:

```typescript
import { SampleDataGenerator } from './utils/sampleDataGenerator';

// Generate full sample dataset
await SampleDataGenerator.generateSampleData();

// Generate quick test data (2 lessons)
await SampleDataGenerator.generateQuickTestData();
```

Access via browser console:
```javascript
// Full dataset
await window.SampleDataGenerator.generateSampleData();

// Quick test
await window.SampleDataGenerator.generateQuickTestData();
```

---

## Dashboard Component

### EducationalAnalyticsDashboard

Located in: `src/components/EducationalAnalyticsDashboard.tsx`

**Features:**
- Overview metrics (total lessons, users, completion rate, avg rating)
- Top performing lessons visualization
- Lessons needing improvement
- Comprehensive lessons table with filtering
- Export to JSON for GPT analysis

**Usage:**
```typescript
import { EducationalAnalyticsDashboard } from './components/EducationalAnalyticsDashboard';

function App() {
  return <EducationalAnalyticsDashboard />;
}
```

---

## GPT Analysis Integration

The export function generates a comprehensive JSON file containing:

```typescript
{
  lessons: [...],              // All lesson data
  engagement_data: [...],      // Engagement records
  feedback_data: [...],        // User feedback
  performance_metrics: [...],  // Aggregated metrics
  summary: [...],              // Analytics summary
  export_timestamp: "..."      // Export date/time
}
```

### Example GPT Prompts

**Analyze lesson performance:**
```
Analyze this educational analytics data and identify:
1. Top 3 performing lessons and why they succeed
2. Bottom 3 lessons needing improvement
3. Common patterns in successful lessons
4. Specific recommendations for each struggling lesson
```

**Content optimization:**
```
Based on this engagement data, suggest:
1. Optimal lesson duration
2. Ideal content structure
3. Best practices for quiz design
4. Ways to improve completion rates
```

---

## Migration Details

Migration file: `supabase/migrations/20251027000000_educational_analytics_schema.sql`

The migration is idempotent and safe to run multiple times. It includes:
- Table creation with IF NOT EXISTS
- Index creation
- RLS policies
- Helper functions
- Triggers for automatic timestamp updates

---

## Best Practices

### 1. Engagement Tracking
- Start engagement when lesson loads
- Update regularly during session
- Mark completion status accurately
- Track quiz attempts and scores

### 2. Performance Metrics
- Update after each engagement session
- Recalculate periodically for accuracy
- Use aggregated data for dashboards

### 3. Data Privacy
- All data is anonymous (session-based)
- No personally identifiable information
- RLS policies enforce access control

### 4. Query Optimization
- Use indexes for filtering
- Leverage JSONB GIN indexes
- Use the analytics summary view for dashboards

### 5. GPT Integration
- Export filtered data for specific analysis
- Include date ranges for trend analysis
- Combine with qualitative feedback

---

## Troubleshooting

### Common Issues

**Issue:** "A database is already setup for this project"
- **Solution:** The migration has already been applied. Check existing tables.

**Issue:** Empty analytics dashboard
- **Solution:** Generate sample data using `SampleDataGenerator`

**Issue:** Metrics not updating
- **Solution:** Call `updatePerformanceMetrics(lessonId)` after engagements

**Issue:** RLS policy errors
- **Solution:** Ensure anonymous access is configured in Supabase

---

## API Reference

See TypeScript types in `src/types/analytics.ts` for complete type definitions.

---

## Support

For questions or issues:
1. Check migration files for database schema
2. Review service layer for API usage
3. Inspect dashboard component for UI examples
4. Use sample data generator for testing
