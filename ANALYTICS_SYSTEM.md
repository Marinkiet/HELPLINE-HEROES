# Comprehensive Game Analytics System

## Overview

This document provides complete documentation for the game analytics database system, designed to capture detailed player performance data for educational games while maintaining privacy and compliance with regulations (POPIA, GDPR).

---

## Database Schema

### Core Tables

#### 1. **players**
Stores anonymized player demographic information.

| Column | Type | Description |
|--------|------|-------------|
| player_id | uuid | Primary key, anonymous identifier |
| session_id | text | Links to user_sessions table |
| age_group | text | '5-7', '8-10', '11-13', '14+' |
| province | text | South African province (nullable) |
| city | text | City name (nullable) |
| school_code | text | Anonymized school identifier (nullable) |
| preferred_language | text | Primary language preference |
| created_at | timestamptz | First session date |
| last_active_at | timestamptz | Last activity timestamp |
| total_score | integer | Cumulative score across all games |
| data_consent | boolean | Privacy consent flag |

**Indexes:**
- `idx_players_session_id` - Fast lookup by session
- `idx_players_age_group` - Age group filtering
- `idx_players_province` - Geographic queries
- `idx_players_school_code` - School-level analytics
- `idx_players_last_active` - Activity tracking

#### 2. **schools**
School information for institutional analytics.

| Column | Type | Description |
|--------|------|-------------|
| school_id | uuid | Primary key |
| school_code | text | Unique anonymized code (hash) |
| province | text | Province location |
| city | text | City location |
| school_type | text | 'primary', 'secondary', 'combined', 'unknown' |
| enrollment_size | text | 'small', 'medium', 'large', 'unknown' |
| created_at | timestamptz | Record creation |

#### 3. **detailed_question_responses**
Granular question-level analytics.

| Column | Type | Description |
|--------|------|-------------|
| response_id | uuid | Primary key |
| game_session_id | uuid | Links to game_sessions |
| player_id | uuid | Links to players |
| question_id | text | Question identifier |
| question_text | text | The question asked |
| question_category | text | Question topic/theme |
| selected_answer | text | Player's answer |
| correct_answer | text | The correct answer |
| is_correct | boolean | Whether answer was correct |
| response_time_seconds | integer | Time taken to answer |
| attempt_number | integer | Retry count (1 = first attempt) |
| hints_used | integer | Number of hints requested |
| created_at | timestamptz | Response timestamp |

#### 4. **game_performance_summary**
Pre-aggregated metrics for fast analytics queries.

| Column | Type | Description |
|--------|------|-------------|
| summary_id | uuid | Primary key |
| game_id | text | Game identifier |
| game_name | text | Human-readable game name |
| age_group | text | Age range ('5-7', '8-10', '11-13', '14+', 'all') |
| province | text | Geographic location |
| language | text | Language used |
| date | date | Aggregation date |
| total_sessions | integer | Number of sessions |
| unique_players | integer | Unique player count |
| avg_score | numeric | Average score |
| avg_completion_rate | numeric | Average completion % |
| avg_duration_minutes | numeric | Average session duration |
| total_questions_answered | integer | Total questions |
| total_correct_answers | integer | Total correct answers |
| accuracy_rate | numeric | Overall accuracy % |
| created_at | timestamptz | Record creation |
| updated_at | timestamptz | Last update |

#### 5. **learning_insights**
AI-ready insights for content optimization.

| Column | Type | Description |
|--------|------|-------------|
| insight_id | uuid | Primary key |
| game_id | text | Related game |
| age_group | text | Target age group |
| insight_type | text | 'difficulty_spike', 'common_error', 'engagement_drop', etc. |
| insight_data | jsonb | Detailed insight data |
| severity | text | 'low', 'medium', 'high' |
| recommendation | text | Suggested action |
| detected_at | timestamptz | Detection timestamp |
| resolved | boolean | Whether issue was addressed |

---

## Database Views

### 1. **game_analytics_dashboard**
Comprehensive game performance metrics.

```sql
SELECT * FROM game_analytics_dashboard
WHERE game_id = '1' AND age_group = '5-7';
```

**Returns:**
- Game identification (game_id, game_name)
- Demographics (age_group, province, language)
- Player metrics (unique_players, total_sessions)
- Performance (avg_score, max_score, completion_rate)
- Engagement (avg_duration_minutes)
- Question metrics (total_questions, total_correct, accuracy_percentage)
- Response time (avg_response_time)

### 2. **school_performance_analytics**
School-level performance aggregations.

```sql
SELECT * FROM school_performance_analytics
WHERE province = 'Gauteng'
ORDER BY overall_accuracy DESC;
```

**Returns:**
- School info (school_code, province, city, school_type, enrollment_size)
- Participation (total_players, total_game_sessions)
- Performance (avg_score, overall_accuracy)
- Engagement (avg_session_minutes, completed_sessions)

---

## Sample SQL Queries

### Analytics Use Cases

#### 1. Age Group Performance Comparison
```sql
SELECT
  age_group,
  AVG(avg_score) as average_score,
  AVG(accuracy_rate) as average_accuracy,
  SUM(total_sessions) as total_sessions,
  SUM(unique_players) as total_players
FROM game_performance_summary
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY age_group
ORDER BY average_score DESC;
```

#### 2. Regional Performance Analysis
```sql
SELECT
  province,
  COUNT(DISTINCT player_id) as total_players,
  AVG(total_score) as avg_cumulative_score,
  AVG(EXTRACT(EPOCH FROM (last_active_at - created_at)) / 3600) as avg_active_hours
FROM players
WHERE province IS NOT NULL
GROUP BY province
ORDER BY total_players DESC;
```

#### 3. Language Impact on Performance
```sql
SELECT
  language,
  game_id,
  AVG(avg_score) as average_score,
  AVG(avg_completion_rate) as avg_completion,
  SUM(unique_players) as total_players
FROM game_performance_summary
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY language, game_id
ORDER BY language, game_id;
```

#### 4. Difficult Questions by Age Group
```sql
SELECT
  question_id,
  question_text,
  question_category,
  COUNT(*) as total_responses,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_responses,
  ROUND((SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100), 2) as accuracy_percentage,
  AVG(response_time_seconds) as avg_response_time
FROM detailed_question_responses dqr
JOIN players p ON dqr.player_id = p.player_id
WHERE p.age_group = '5-7'
GROUP BY question_id, question_text, question_category
HAVING COUNT(*) >= 10
ORDER BY accuracy_percentage ASC
LIMIT 20;
```

#### 5. School Performance Rankings
```sql
SELECT
  s.school_code,
  s.province,
  s.city,
  COUNT(DISTINCT p.player_id) as total_students,
  AVG(p.total_score) as avg_student_score,
  COUNT(DISTINCT gs.id) as total_games_played,
  ROUND(AVG(CASE WHEN gs.completed THEN 1 ELSE 0 END) * 100, 2) as completion_rate
FROM schools s
JOIN players p ON p.school_code = s.school_code
JOIN user_sessions us ON us.session_id = p.session_id
JOIN game_sessions gs ON gs.session_id = us.session_id
GROUP BY s.school_code, s.province, s.city
HAVING COUNT(DISTINCT p.player_id) >= 5
ORDER BY avg_student_score DESC;
```

#### 6. Daily Trend Analysis
```sql
SELECT
  date,
  SUM(total_sessions) as daily_sessions,
  SUM(unique_players) as daily_players,
  AVG(avg_score) as daily_avg_score,
  AVG(accuracy_rate) as daily_accuracy
FROM game_performance_summary
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY date
ORDER BY date;
```

#### 7. Question Category Performance
```sql
SELECT
  question_category,
  COUNT(*) as total_responses,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_responses,
  ROUND((SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100), 2) as accuracy,
  AVG(response_time_seconds) as avg_time,
  AVG(attempt_number) as avg_attempts,
  AVG(hints_used) as avg_hints
FROM detailed_question_responses
GROUP BY question_category
ORDER BY accuracy ASC;
```

#### 8. Player Retention Analysis
```sql
SELECT
  age_group,
  COUNT(*) as total_players,
  AVG(EXTRACT(DAY FROM (last_active_at - created_at))) as avg_retention_days,
  SUM(CASE WHEN last_active_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 ELSE 0 END) as active_last_week,
  SUM(CASE WHEN last_active_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 ELSE 0 END) as active_last_month
FROM players
GROUP BY age_group;
```

---

## API Endpoints (TypeScript Service)

### Available Methods

#### 1. Player Management
```typescript
// Create or update player profile
const playerId = await gameAnalyticsService.createPlayerProfile({
  sessionId: 'session_123',
  ageGroup: '5-7',
  province: 'Gauteng',
  city: 'Johannesburg',
  schoolCode: 'school_abc123',
  preferredLanguage: 'en',
  dataConsent: true
});
```

#### 2. Game Session Recording
```typescript
// Record game completion
const gameSessionId = await gameAnalyticsService.recordGameSession('session_123', {
  gameId: '1',
  gameName: 'Safe Touch Detective',
  gameCategory: 'safety',
  score: 85,
  maxPossibleScore: 100,
  completionPercentage: 100,
  sessionDurationSeconds: 180,
  languageUsed: 'en',
  questionsAnswered: 10,
  correctAnswers: 8,
  startedAt: new Date('2025-10-27T10:00:00'),
  completedAt: new Date('2025-10-27T10:03:00')
});
```

#### 3. Question Response Tracking
```typescript
// Record individual question response
await gameAnalyticsService.recordQuestionResponse(
  'game_session_uuid',
  'player_uuid',
  {
    questionId: 'q1',
    questionText: 'What is a safe touch?',
    questionCategory: 'body_safety',
    selectedAnswer: 'A hug from a parent',
    correctAnswer: 'A hug from a parent',
    isCorrect: true,
    responseTimeSeconds: 5,
    attemptNumber: 1,
    hintsUsed: 0
  }
);

// Batch record multiple responses
await gameAnalyticsService.recordQuestionResponses(
  'game_session_uuid',
  'player_uuid',
  [
    { /* question 1 */ },
    { /* question 2 */ },
    { /* question 3 */ }
  ]
);
```

#### 4. Analytics Queries
```typescript
// Get game performance metrics
const performance = await gameAnalyticsService.getGamePerformance({
  gameId: '1',
  ageGroup: '5-7',
  province: 'Gauteng',
  language: 'en'
});

// Get school performance
const schoolPerf = await gameAnalyticsService.getSchoolPerformance('school_abc123');

// Get daily metrics
const dailyMetrics = await gameAnalyticsService.getDailyMetrics('1', 30);

// Get learning insights
const insights = await gameAnalyticsService.getLearningInsights({
  gameId: '1',
  severity: 'high',
  resolved: false
});

// Get difficult questions
const difficultQuestions = await gameAnalyticsService.getDifficultQuestions('1', 10);
```

#### 5. Aggregation (Run daily via cron)
```typescript
// Aggregate daily performance metrics
await gameAnalyticsService.aggregateDailyPerformance(new Date());
```

---

## Data Flow Diagram

```
Player Completes Game
        ↓
1. Create/Update Player Profile
   - Demographics (age, location, school)
   - Language preference
        ↓
2. Record Game Session
   - Game ID, name, category
   - Score and completion
   - Duration and engagement
        ↓
3. Record Question Responses (batch)
   - Individual question data
   - Response times
   - Attempt numbers
        ↓
4. Update Player Stats (automatic via trigger)
   - Total score
   - Last active time
        ↓
5. Daily Aggregation (scheduled)
   - Aggregate into performance_summary
   - Generate learning insights
        ↓
6. Analytics Dashboard
   - Query pre-aggregated data
   - Generate reports
   - Export for GPT analysis
```

---

## Data Privacy & Compliance

### Privacy Measures
1. **Anonymization**
   - Player IDs are UUIDs (not personally identifiable)
   - School codes are hashed
   - No names or personal identifiers stored

2. **Consent Management**
   - `data_consent` flag on player profiles
   - Can filter analytics by consented users only

3. **Data Retention**
   - Detailed responses: 2 years
   - Aggregated metrics: 5 years
   - Implement automated cleanup via `data_retention_log`

### Compliance Features
- **POPIA (South Africa)**: Minimal data collection, consent tracking
- **GDPR**: Right to be forgotten (cascade delete), data portability
- **FERPA (US)**: Education-focused, no student identifiers

---

## Performance Optimization

### Indexing Strategy
- All foreign keys indexed
- Composite indexes on common query patterns
- GIN indexes on JSONB columns for flexible queries

### Query Optimization
- Use materialized views for complex aggregations
- Pre-aggregate daily metrics via scheduled function
- Partition large tables by date (future enhancement)

### Caching Strategy
- Cache aggregated metrics (15-minute TTL)
- Use Redis for real-time dashboard queries
- Invalidate cache on data updates

---

## Integration Example

```typescript
// Complete game flow integration
async function onGameComplete(
  sessionId: string,
  gameData: any,
  questionResponses: any[]
) {
  // 1. Ensure player profile exists
  const playerId = await gameAnalyticsService.createPlayerProfile({
    sessionId,
    ageGroup: gameData.ageGroup,
    province: gameData.province,
    preferredLanguage: gameData.language
  });

  // 2. Record game session
  const gameSessionId = await gameAnalyticsService.recordGameSession(
    sessionId,
    {
      gameId: gameData.id,
      gameName: gameData.name,
      gameCategory: gameData.category,
      score: gameData.score,
      maxPossibleScore: gameData.maxScore,
      completionPercentage: 100,
      sessionDurationSeconds: gameData.duration,
      languageUsed: gameData.language,
      questionsAnswered: questionResponses.length,
      correctAnswers: questionResponses.filter(q => q.isCorrect).length,
      startedAt: gameData.startTime,
      completedAt: new Date()
    }
  );

  // 3. Record all question responses
  if (gameSessionId && playerId) {
    await gameAnalyticsService.recordQuestionResponses(
      gameSessionId,
      playerId,
      questionResponses
    );
  }
}
```

---

## Maintenance & Monitoring

### Daily Tasks
- Run `aggregate_game_performance()` function
- Check for data quality issues
- Monitor database performance

### Weekly Tasks
- Review learning insights
- Analyze difficult questions
- Generate performance reports

### Monthly Tasks
- Archive old detailed data
- Update retention policies
- Review and optimize slow queries

---

## Future Enhancements

1. **Real-time Analytics**
   - WebSocket updates for live dashboards
   - Real-time player count and activity

2. **Advanced ML Features**
   - Predictive difficulty adjustment
   - Personalized content recommendations
   - Automated insight generation

3. **Enhanced Privacy**
   - Differential privacy for aggregations
   - Federated learning support
   - Zero-knowledge proof integration

4. **API Gateway**
   - RESTful API for external consumers
   - GraphQL endpoint for flexible queries
   - Rate limiting and authentication