# Available Data for GPT Analysis

## Quick Reference: All Database Tables

### 1. **players** - Student Demographics
```sql
SELECT
  player_id,
  age_group,              -- '5-7', '8-10', '11-13', '14+'
  province,               -- South African provinces
  city,
  school_code,            -- Anonymous school identifier
  preferred_language,
  total_score,
  created_at,
  last_active_at
FROM players;
```

**Use for:**
- Demographic breakdowns
- Regional performance analysis
- Age-group comparisons
- Language preference patterns

---

### 2. **game_sessions** - Overall Game Performance
```sql
SELECT
  session_id,
  game_id,
  player_id,
  points_earned,
  duration_seconds,
  completed,              -- true/false
  completion_rate,        -- 0-100%
  created_at
FROM game_sessions;
```

**Use for:**
- Completion rates
- Average session duration
- Points distribution
- Drop-off analysis

---

### 3. **detailed_question_responses** - Question-Level Data
```sql
SELECT
  response_id,
  game_session_id,
  player_id,
  question_id,
  question_text,
  question_category,      -- Main topic/concept
  selected_answer,
  correct_answer,
  is_correct,             -- true/false
  response_time_seconds,  -- Time to answer
  attempt_number,         -- Retry count
  hints_used,             -- Number of hints
  created_at
FROM detailed_question_responses;
```

**Use for:**
- Accuracy by question
- Response time analysis
- Hint usage patterns
- Retry behavior
- Category performance

---

### 4. **game_performance_summary** - Pre-Aggregated Stats
```sql
SELECT
  game_id,
  game_name,
  age_group,
  province,
  language,
  date,
  total_sessions,
  unique_players,
  avg_score,
  avg_completion_rate,
  avg_duration_minutes,
  total_questions_answered,
  total_correct_answers,
  accuracy_rate
FROM game_performance_summary;
```

**Use for:**
- Fast aggregated queries
- Historical trends
- Daily/weekly reports
- Comparative analysis

---

### 5. **schools** - Institution Data
```sql
SELECT
  school_id,
  school_code,            -- Anonymous
  province,
  city,
  school_type,            -- primary, secondary, combined
  enrollment_size,        -- small, medium, large
  created_at
FROM schools;
```

**Use for:**
- School-level analysis
- Enrollment size impact
- Regional school performance

---

### 6. **learning_insights** - Previous AI Insights
```sql
SELECT
  insight_id,
  game_id,
  age_group,
  insight_type,           -- difficulty_spike, common_error, etc.
  insight_data,           -- JSON with details
  severity,               -- low, medium, high
  recommendation,
  detected_at,
  resolved
FROM learning_insights;
```

**Use for:**
- Track previous recommendations
- See what's been addressed
- Historical insight trends

---

## Current GPT Data (Default)

### What GPT Gets Now:

```typescript
{
  // Time period
  dateRange: {
    start: "2025-10-27",
    end: "2025-11-26",
    days: 30
  },

  // Overall numbers
  overallMetrics: {
    totalStudents: 150,
    totalGamesPlayed: 487,
    totalQuestionsAnswered: 3241,
    overallAccuracy: 68.5,
    avgSessionDuration: 342
  },

  // Worst performing categories
  performanceByCategory: [
    {
      category: "Body Safety",
      ageGroup: "5-7",
      province: "Gauteng",
      totalResponses: 247,
      correctResponses: 84,
      accuracyRate: 34.0,
      avgResponseTime: 12.5,
      avgAttempts: 1.8
    }
    // ... top 10 lowest
  ],

  // Age group breakdown
  performanceByAgeGroup: [
    {
      category: "5-7",
      totalResponses: 856,
      correctResponses: 512,
      accuracyRate: 59.8
    }
    // ... all age groups
  ],

  // Regional breakdown
  performanceByProvince: [
    {
      category: "Gauteng",
      totalResponses: 1456,
      correctResponses: 1087,
      accuracyRate: 74.7
    }
    // ... all provinces
  ],

  // Hardest questions
  difficultQuestions: [
    {
      questionId: "q_body_safety_7",
      questionText: "Which touch makes you feel uncomfortable?",
      questionCategory: "Body Safety",
      totalAttempts: 124,
      correctAttempts: 23,
      accuracyRate: 18.5,
      avgResponseTime: 15.8,
      retryRate: 42.7,
      hintUsageRate: 31.5
    }
    // ... top 5 hardest
  ]
}
```

---

## Additional Data You Can Add

### 1. **Time Trends** (Recommended)

**Query:**
```sql
-- Compare first half vs second half of period
SELECT
  question_category,
  DATE_TRUNC('week', created_at) as week,
  COUNT(*) as total,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct
FROM detailed_question_responses
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY question_category, week
ORDER BY week, question_category;
```

**Tells GPT:**
- Which areas are improving over time
- Which areas are declining
- Effectiveness of previous changes

---

### 2. **Completion Rates by Game**

**Query:**
```sql
SELECT
  gs.game_id,
  COUNT(*) as total_sessions,
  SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed_sessions,
  AVG(completion_rate) as avg_completion_rate,
  AVG(duration_seconds) as avg_duration
FROM game_sessions gs
WHERE gs.created_at >= NOW() - INTERVAL '30 days'
GROUP BY gs.game_id
ORDER BY avg_completion_rate ASC;
```

**Tells GPT:**
- Which games students abandon
- Where frustration occurs
- Engagement patterns

---

### 3. **Response Time Patterns**

**Query:**
```sql
SELECT
  question_category,
  age_group,
  AVG(response_time_seconds) as avg_time,
  -- Fast wrong (< 3 sec = guessing)
  SUM(CASE WHEN response_time_seconds < 3 AND NOT is_correct THEN 1 ELSE 0 END) as fast_wrong,
  -- Slow wrong (> 15 sec = confused)
  SUM(CASE WHEN response_time_seconds > 15 AND NOT is_correct THEN 1 ELSE 0 END) as slow_wrong,
  COUNT(*) as total
FROM detailed_question_responses dqr
JOIN players p ON dqr.player_id = p.player_id
WHERE dqr.created_at >= NOW() - INTERVAL '30 days'
GROUP BY question_category, age_group;
```

**Tells GPT:**
- Guessing behavior (too fast)
- Confusion (too slow)
- Appropriate difficulty level

---

### 4. **Hint Usage Effectiveness**

**Query:**
```sql
SELECT
  question_category,
  -- With hints
  AVG(CASE WHEN hints_used > 0 AND is_correct THEN 1 ELSE 0 END) as success_with_hints,
  SUM(CASE WHEN hints_used > 0 THEN 1 ELSE 0 END) as used_hints,
  -- Without hints
  AVG(CASE WHEN hints_used = 0 AND is_correct THEN 1 ELSE 0 END) as success_no_hints,
  SUM(CASE WHEN hints_used = 0 THEN 1 ELSE 0 END) as no_hints
FROM detailed_question_responses
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY question_category;
```

**Tells GPT:**
- Whether hints are helpful
- Which topics need better hints
- Scaffolding effectiveness

---

### 5. **Multi-Attempt Analysis**

**Query:**
```sql
SELECT
  question_category,
  age_group,
  -- First attempt success
  AVG(CASE WHEN attempt_number = 1 AND is_correct THEN 1 ELSE 0 END) * 100 as first_attempt_rate,
  -- Learning rate (wrong -> right)
  COUNT(CASE WHEN attempt_number > 1 AND is_correct THEN 1 END) as improved_on_retry,
  COUNT(CASE WHEN attempt_number > 1 THEN 1 END) as total_retries
FROM detailed_question_responses dqr
JOIN players p ON dqr.player_id = p.player_id
WHERE dqr.created_at >= NOW() - INTERVAL '30 days'
GROUP BY question_category, age_group;
```

**Tells GPT:**
- First-attempt success rates
- Learning from feedback
- Persistence patterns

---

### 6. **School-Level Performance** (if you have school data)

**Query:**
```sql
SELECT
  s.school_type,
  s.enrollment_size,
  s.province,
  COUNT(DISTINCT p.player_id) as students,
  AVG(CASE WHEN dqr.is_correct THEN 1 ELSE 0 END) * 100 as accuracy,
  AVG(gs.completion_rate) as avg_completion
FROM schools s
JOIN players p ON s.school_code = p.school_code
JOIN game_sessions gs ON p.player_id = gs.player_id
JOIN detailed_question_responses dqr ON gs.session_id = dqr.game_session_id
WHERE dqr.created_at >= NOW() - INTERVAL '30 days'
GROUP BY s.school_type, s.enrollment_size, s.province;
```

**Tells GPT:**
- School type impact
- School size effects
- Resource availability indicators

---

### 7. **Language Impact**

**Query:**
```sql
SELECT
  p.preferred_language,
  dqr.question_category,
  COUNT(*) as responses,
  AVG(CASE WHEN dqr.is_correct THEN 1 ELSE 0 END) * 100 as accuracy,
  AVG(dqr.response_time_seconds) as avg_time
FROM detailed_question_responses dqr
JOIN players p ON dqr.player_id = p.player_id
WHERE dqr.created_at >= NOW() - INTERVAL '30 days'
GROUP BY p.preferred_language, dqr.question_category;
```

**Tells GPT:**
- Translation quality issues
- Language-specific challenges
- Localization effectiveness

---

### 8. **Engagement Patterns**

**Query:**
```sql
SELECT
  p.age_group,
  p.province,
  COUNT(DISTINCT DATE(gs.created_at)) as days_active,
  COUNT(gs.session_id) as total_sessions,
  AVG(gs.duration_seconds) as avg_duration,
  MAX(p.last_active_at) as last_seen
FROM players p
JOIN game_sessions gs ON p.player_id = gs.player_id
WHERE gs.created_at >= NOW() - INTERVAL '30 days'
GROUP BY p.player_id, p.age_group, p.province
HAVING COUNT(gs.session_id) >= 3;
```

**Tells GPT:**
- Retention patterns
- Engagement frequency
- Active user behavior

---

## Recommended Minimal Enhancement

For maximum insight with minimal complexity, add these 3:

```typescript
performanceData = {
  // ... existing data ...

  // 1. Time trends (improving/declining)
  trends: await this.getPerformanceTrends(startDate, endDate),

  // 2. Completion rates (engagement)
  completionRates: await this.getCompletionRates(startDate, endDate),

  // 3. Response time patterns (guessing vs confusion)
  timePatterns: await this.getResponseTimePatterns(startDate, endDate)
}
```

---

## Sample Enhanced GPT Output

With the additional data, GPT provides deeper insights:

**Before (basic data):**
> "Students struggle with Body Safety questions (34% accuracy)."

**After (enhanced data):**
> "Students aged 5-7 in Gauteng struggle with Body Safety questions, showing 34% accuracy with declining performance over the past 2 weeks (-8% trend). Analysis of response times reveals 42% are answering in under 3 seconds (guessing behavior), while 28% take over 15 seconds (confusion). Only 18% complete the Body Safety module, suggesting frustration-based abandonment. Despite 65% hint usage, success rate with hints is only 41%, indicating hints are ineffective. Recommendation: Redesign content with age-appropriate visuals and improve hint quality with step-by-step scaffolding."

---

## Quick Implementation

### Minimal Code (3 enhancements)

Add to `generateGPTAnalysis` method:

```typescript
// After line 593
const trends = await this.getPerformanceTrends(startDate, endDate);
const completionRates = await this.getCompletionRates(startDate, endDate);
const timePatterns = await this.getResponseTimePatterns(startDate, endDate);

// Update performanceData (line 607)
const performanceData = {
  // ... existing fields ...
  trends: trends.slice(0, 10),
  completionRates: completionRates.slice(0, 10),
  timePatterns: timePatterns.slice(0, 10)
};
```

See `GPT_DATA_CUSTOMIZATION.md` for full method implementations.

---

## Testing Queries

Test your queries in Supabase SQL Editor:

```sql
-- Check available data
SELECT COUNT(*) FROM detailed_question_responses;
SELECT DISTINCT question_category FROM detailed_question_responses;
SELECT DISTINCT age_group FROM players;

-- Test performance query
SELECT
  question_category,
  COUNT(*) as total,
  AVG(CASE WHEN is_correct THEN 1 ELSE 0 END) * 100 as accuracy
FROM detailed_question_responses
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY question_category
ORDER BY accuracy ASC;
```