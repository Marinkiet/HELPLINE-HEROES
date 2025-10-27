# Educational Analytics - Quick Start Guide

## 🚀 Getting Started (5 minutes)

### 1. Database Setup ✅

The database schema is already created! The migration file at:
```
supabase/migrations/20251027000000_educational_analytics_schema.sql
```

Contains:
- 4 tables: lessons, lesson_engagement, lesson_feedback, lesson_performance_metrics
- 1 view: lesson_analytics_summary
- Indexes, RLS policies, and helper functions

### 2. Generate Sample Data

Open your browser console and run:

```javascript
// Quick test (2 lessons, 3 engagements each)
await window.SampleDataGenerator.generateQuickTestData();

// OR Full dataset (5 lessons, 5-20 engagements each)
await window.SampleDataGenerator.generateSampleData();
```

### 3. View the Dashboard

Add the dashboard to your app:

```typescript
import { EducationalAnalyticsDashboard } from './components/EducationalAnalyticsDashboard';

// In your router or main component
<EducationalAnalyticsDashboard />
```

### 4. Start Tracking (Example)

```typescript
import { analyticsService } from './services/analyticsService';

// Create a lesson
const lesson = await analyticsService.createLesson({
  title: 'My First Lesson',
  description: 'An introduction to...',
  content: { sections: [] },
  difficulty_level: 'beginner',
  subject_category: 'child-safety',
  learning_objectives: ['Learn X', 'Understand Y']
});

// Track engagement
const engagement = await analyticsService.startEngagement({
  session_id: 'user-123',
  lesson_id: lesson.lesson_id
});

// Update on completion
await analyticsService.updateEngagement(engagement.engagement_id, {
  session_end_time: new Date().toISOString(),
  duration_seconds: 300,
  completion_status: 'completed',
  interaction_count: 20,
  scroll_depth_percentage: 90
});

// Collect feedback
await analyticsService.submitFeedback({
  session_id: 'user-123',
  lesson_id: lesson.lesson_id,
  rating: 5,
  difficulty_perception: 'just_right',
  clarity_rating: 5
});

// Update metrics
await analyticsService.updatePerformanceMetrics(lesson.lesson_id);
```

### 5. Export for GPT Analysis

From the dashboard, click "Export for GPT" button, or programmatically:

```typescript
const data = await analyticsService.exportDataForGPTAnalysis();
console.log(JSON.stringify(data, null, 2));
```

---

## 📊 Key Features

### Service Layer Functions

**Lessons:**
- `createLesson()` - Create new lesson
- `getLesson()` - Get by ID
- `getAllLessons()` - List with filters
- `updateLesson()` - Update lesson
- `deleteLesson()` - Soft delete

**Engagement:**
- `startEngagement()` - Begin tracking
- `updateEngagement()` - Update progress
- `getEngagementsByLesson()` - Get all for lesson
- `getEngagementsBySession()` - Get all for user

**Feedback:**
- `submitFeedback()` - Submit user feedback
- `getFeedbackByLesson()` - Get feedback

**Analytics:**
- `getLessonAnalyticsSummary()` - Overview stats
- `getTopPerformingLessons()` - Best lessons
- `getLessonsNeedingImprovement()` - Struggling lessons
- `getEngagementTrends()` - Time-based trends
- `updatePerformanceMetrics()` - Recalculate metrics
- `exportDataForGPTAnalysis()` - Export JSON

---

## 🎯 Common Use Cases

### Track a Video Lesson

```typescript
// User starts video
const engagement = await analyticsService.startEngagement({
  session_id: getCurrentSessionId(),
  lesson_id: videoLessonId
});

// Update every 30 seconds
setInterval(async () => {
  await analyticsService.updateEngagement(engagement.engagement_id, {
    duration_seconds: getCurrentPlaybackTime(),
    scroll_depth_percentage: getVideoProgress(),
    interaction_count: getInteractionCount()
  });
}, 30000);

// On completion
await analyticsService.updateEngagement(engagement.engagement_id, {
  session_end_time: new Date().toISOString(),
  completion_status: 'completed',
  duration_seconds: getTotalDuration()
});
```

### Track a Quiz

```typescript
const quizScores = [];

// After each attempt
quizScores.push({
  score: userScore,
  max_score: 10,
  timestamp: new Date().toISOString(),
  quiz_id: 'quiz-1'
});

await analyticsService.updateEngagement(engagement.engagement_id, {
  quiz_attempts: quizScores.length,
  quiz_scores: quizScores
});
```

### Analyze with Filters

```typescript
// Get child safety lessons from last 30 days
const lessons = await analyticsService.getLessonAnalyticsSummary({
  subject_category: 'child-safety',
  date_from: new Date(Date.now() - 30*24*60*60*1000).toISOString()
});

// Get only completed engagements
const completedEngagements = await analyticsService.getEngagementsByLesson(
  lessonId,
  { completion_status: 'completed' }
);
```

---

## 🔧 Debugging

### Check if tables exist

Open Supabase dashboard → SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'lesson%';
```

### View sample data

```sql
-- Count lessons
SELECT COUNT(*) FROM lessons;

-- View engagements
SELECT * FROM lesson_engagement LIMIT 10;

-- Check metrics
SELECT * FROM lesson_performance_metrics;

-- Use the summary view
SELECT * FROM lesson_analytics_summary;
```

### Reset sample data

```sql
-- Delete all test data
DELETE FROM lesson_engagement WHERE session_id LIKE 'sample-%' OR session_id LIKE 'test-%';
DELETE FROM lesson_feedback WHERE session_id LIKE 'sample-%' OR session_id LIKE 'test-%';
DELETE FROM lesson_performance_metrics;
DELETE FROM lessons;
```

---

## 📈 Dashboard Features

The `EducationalAnalyticsDashboard` component shows:

1. **Key Metrics Cards**
   - Total lessons
   - Unique users
   - Average completion rate
   - Average rating

2. **Top Performing Lessons**
   - Highest rated lessons
   - Completion counts
   - Subject categories

3. **Needs Improvement**
   - Low-rated lessons
   - High dropout rates
   - Improvement opportunities

4. **All Lessons Table**
   - Filterable by subject/difficulty
   - Completion rates
   - Duration and ratings
   - User counts

5. **Export Functionality**
   - One-click JSON export
   - GPT-ready format
   - Filtered exports

---

## 🤖 GPT Integration

### Export Format

```json
{
  "lessons": [...],
  "engagement_data": [...],
  "feedback_data": [...],
  "performance_metrics": [...],
  "summary": [...],
  "export_timestamp": "2025-10-27T..."
}
```

### Example GPT Prompts

**Performance Analysis:**
```
I have educational analytics data. Analyze the lessons with
completion rates below 60% and suggest specific improvements
for content, pacing, and engagement.
```

**Content Optimization:**
```
Based on this engagement data, what patterns do you see in
successful lessons? Recommend optimal lesson duration,
structure, and interactive elements.
```

**Personalization:**
```
Analyze user feedback sentiment and quiz performance.
Suggest how to personalize content for different skill levels.
```

---

## 📝 Type Definitions

All types are in `src/types/analytics.ts`:

- `Lesson`
- `LessonEngagement`
- `LessonFeedback`
- `LessonPerformanceMetrics`
- `LessonAnalyticsSummary`
- `CreateLessonInput`
- `CreateEngagementInput`
- `CreateFeedbackInput`
- `UpdateEngagementInput`
- `AnalyticsFilters`
- `GPTAnalysisExport`

---

## 🎓 Next Steps

1. ✅ Generate sample data
2. ✅ View dashboard
3. 🔄 Integrate tracking into your lessons
4. 📊 Analyze performance
5. 🤖 Use GPT for insights
6. 🚀 Optimize based on data

For detailed documentation, see `ANALYTICS_SETUP.md`
