# GPT-4 Turbo Data Customization Guide

## Current Data Sent to GPT

Here's exactly what data GPT-4 Turbo receives to generate "Identified Learning Gaps":

### 1. Date Range
```typescript
dateRange: {
  start: "2025-10-27T00:00:00Z",
  end: "2025-11-26T00:00:00Z",
  days: 30
}
```

### 2. Overall Metrics
```typescript
overallMetrics: {
  totalStudents: 150,           // Unique players/sessions
  totalGamesPlayed: 487,        // Total game sessions
  totalQuestionsAnswered: 3241, // Total responses
  overallAccuracy: 68.5,        // Overall % correct
  avgSessionDuration: 342       // Average seconds per session
}
```

### 3. Performance by Category (Top 10 Lowest)
```typescript
performanceByCategory: [
  {
    category: "Body Safety",
    ageGroup: "5-7",
    province: "Gauteng",
    totalResponses: 247,
    correctResponses: 84,
    accuracyRate: 34.0,          // % correct
    avgResponseTime: 12.5,       // seconds
    avgAttempts: 1.8             // tries per question
  },
  {
    category: "Stranger Danger",
    ageGroup: "8-10",
    province: "Western Cape",
    totalResponses: 189,
    correctResponses: 98,
    accuracyRate: 51.9,
    avgResponseTime: 8.3,
    avgAttempts: 1.4
  }
  // ... up to 10 categories
]
```

### 4. Performance by Age Group
```typescript
performanceByAgeGroup: [
  {
    category: "5-7",
    totalResponses: 856,
    correctResponses: 512,
    accuracyRate: 59.8
  },
  {
    category: "8-10",
    totalResponses: 1243,
    correctResponses: 891,
    accuracyRate: 71.7
  },
  {
    category: "11-13",
    totalResponses: 742,
    correctResponses: 598,
    accuracyRate: 80.6
  }
]
```

### 5. Performance by Province
```typescript
performanceByProvince: [
  {
    category: "Eastern Cape",
    totalResponses: 342,
    correctResponses: 198,
    accuracyRate: 57.9
  },
  {
    category: "Gauteng",
    totalResponses: 1456,
    correctResponses: 1087,
    accuracyRate: 74.7
  }
  // ... all provinces with data
]
```

### 6. Top 5 Most Difficult Questions
```typescript
difficultQuestions: [
  {
    questionId: "q_body_safety_7",
    questionText: "Which touch makes you feel uncomfortable?",
    questionCategory: "Body Safety",
    totalAttempts: 124,
    correctAttempts: 23,
    accuracyRate: 18.5,
    avgResponseTime: 15.8,
    retryRate: 42.7,              // % who needed multiple attempts
    hintUsageRate: 31.5           // % who used hints
  }
  // ... up to 5 questions
]
```

---

## How to Add More Data

### Option 1: Add Time-Based Trends

**What it does:** Shows if performance is improving or declining over time

**Code to add** (in `generateGPTAnalysis` method):

```typescript
// After line 627, before performanceData object
const trendsData = await this.getPerformanceTrends(startDate, endDate);

// Then add to performanceData:
performanceData.trends = trendsData;
```

**New method to add:**

```typescript
async getPerformanceTrends(startDate: Date, endDate: Date) {
  const midDate = new Date((startDate.getTime() + endDate.getTime()) / 2);

  // First half
  const { data: firstHalf } = await supabase
    .from('detailed_question_responses')
    .select('is_correct, question_category')
    .gte('created_at', startDate.toISOString())
    .lt('created_at', midDate.toISOString());

  // Second half
  const { data: secondHalf } = await supabase
    .from('detailed_question_responses')
    .select('is_correct, question_category')
    .gte('created_at', midDate.toISOString())
    .lte('created_at', endDate.toISOString());

  // Calculate trend by category
  const calculateAccuracy = (data: any[]) => {
    if (!data || data.length === 0) return {};
    const byCategory: any = {};
    data.forEach(r => {
      if (!byCategory[r.question_category]) {
        byCategory[r.question_category] = { total: 0, correct: 0 };
      }
      byCategory[r.question_category].total++;
      if (r.is_correct) byCategory[r.question_category].correct++;
    });
    return Object.entries(byCategory).map(([cat, stats]: [string, any]) => ({
      category: cat,
      accuracy: (stats.correct / stats.total) * 100
    }));
  };

  const firstAccuracy = calculateAccuracy(firstHalf || []);
  const secondAccuracy = calculateAccuracy(secondHalf || []);

  // Compare periods
  return firstAccuracy.map(first => {
    const second = secondAccuracy.find(s => s.category === first.category);
    return {
      category: first.category,
      earlyAccuracy: first.accuracy,
      recentAccuracy: second?.accuracy || first.accuracy,
      trend: second ? second.accuracy - first.accuracy : 0
    };
  }).sort((a, b) => a.trend - b.trend);
}
```

---

### Option 2: Add Completion Rates

**What it does:** Shows which games/categories students abandon

**Code to add:**

```typescript
// Query for completion data
const { data: completionData } = await supabase
  .from('game_sessions')
  .select('game_id, completed')
  .gte('created_at', startDate.toISOString());

const completionRates = completionData?.reduce((acc: any, session: any) => {
  if (!acc[session.game_id]) {
    acc[session.game_id] = { total: 0, completed: 0 };
  }
  acc[session.game_id].total++;
  if (session.completed) acc[session.game_id].completed++;
  return acc;
}, {});

const completionByGame = Object.entries(completionRates || {}).map(([gameId, stats]: [string, any]) => ({
  gameId,
  completionRate: (stats.completed / stats.total) * 100,
  totalSessions: stats.total
})).sort((a: any, b: any) => a.completionRate - b.completionRate);

// Add to performanceData
performanceData.completionRates = completionByGame;
```

---

### Option 3: Add Response Time Analysis

**What it does:** Identifies questions where students struggle with time (either too fast = guessing, or too slow = confused)

**Already partially available in `difficultQuestions`**, but you can expand:

```typescript
const { data: timeData } = await supabase
  .from('detailed_question_responses')
  .select('question_category, response_time_seconds, is_correct')
  .gte('created_at', startDate.toISOString());

const timeAnalysis = timeData?.reduce((acc: any, response: any) => {
  const cat = response.question_category;
  if (!acc[cat]) {
    acc[cat] = {
      fastWrong: 0,      // < 3 seconds and wrong
      slowWrong: 0,      // > 15 seconds and wrong
      totalWrong: 0,
      avgTime: 0,
      count: 0
    };
  }

  acc[cat].count++;
  acc[cat].avgTime += response.response_time_seconds;

  if (!response.is_correct) {
    acc[cat].totalWrong++;
    if (response.response_time_seconds < 3) acc[cat].fastWrong++;
    if (response.response_time_seconds > 15) acc[cat].slowWrong++;
  }
  return acc;
}, {});

// Calculate rates
const timeInsights = Object.entries(timeAnalysis || {}).map(([cat, stats]: [string, any]) => ({
  category: cat,
  avgResponseTime: stats.avgTime / stats.count,
  guessingRate: (stats.fastWrong / stats.totalWrong) * 100,  // Fast wrong answers
  confusionRate: (stats.slowWrong / stats.totalWrong) * 100  // Slow wrong answers
}));

performanceData.timeInsights = timeInsights;
```

---

### Option 4: Add Hint Usage Patterns

**What it does:** Shows which topics need better scaffolding

```typescript
const { data: hintData } = await supabase
  .from('detailed_question_responses')
  .select('question_category, hints_used, is_correct')
  .gte('created_at', startDate.toISOString());

const hintAnalysis = hintData?.reduce((acc: any, response: any) => {
  const cat = response.question_category;
  if (!acc[cat]) {
    acc[cat] = {
      withHints: 0,
      withHintsCorrect: 0,
      withoutHints: 0,
      withoutHintsCorrect: 0
    };
  }

  if (response.hints_used > 0) {
    acc[cat].withHints++;
    if (response.is_correct) acc[cat].withHintsCorrect++;
  } else {
    acc[cat].withoutHints++;
    if (response.is_correct) acc[cat].withoutHintsCorrect++;
  }
  return acc;
}, {});

const hintInsights = Object.entries(hintAnalysis || {}).map(([cat, stats]: [string, any]) => ({
  category: cat,
  hintUsageRate: (stats.withHints / (stats.withHints + stats.withoutHints)) * 100,
  successWithHints: (stats.withHintsCorrect / stats.withHints) * 100,
  successWithoutHints: (stats.withoutHintsCorrect / stats.withoutHints) * 100,
  hintEffectiveness: ((stats.withHintsCorrect / stats.withHints) - (stats.withoutHintsCorrect / stats.withoutHints)) * 100
}));

performanceData.hintAnalysis = hintInsights;
```

---

### Option 5: Add Demographic Cross-Analysis

**What it does:** Shows how different demographics perform in different categories

```typescript
const { data: crossData } = await supabase
  .from('detailed_question_responses')
  .select(`
    question_category,
    is_correct,
    players!inner(age_group, province, gender)
  `)
  .gte('created_at', startDate.toISOString());

// Group by category + demographic
const crossAnalysis = crossData?.reduce((acc: any, r: any) => {
  const key = `${r.question_category}|${r.players.age_group}|${r.players.province}`;
  if (!acc[key]) {
    acc[key] = {
      category: r.question_category,
      ageGroup: r.players.age_group,
      province: r.players.province,
      total: 0,
      correct: 0
    };
  }
  acc[key].total++;
  if (r.is_correct) acc[key].correct++;
  return acc;
}, {});

const demographicInsights = Object.values(crossAnalysis || {}).map((stats: any) => ({
  ...stats,
  accuracyRate: (stats.correct / stats.total) * 100
})).filter((s: any) => s.total >= 10) // Minimum sample size
  .sort((a: any, b: any) => a.accuracyRate - b.accuracyRate);

performanceData.demographicBreakdown = demographicInsights.slice(0, 20); // Top 20 worst
```

---

### Option 6: Add Learning Velocity

**What it does:** Shows how quickly students improve with repeated exposure

```typescript
const { data: progressData } = await supabase
  .from('detailed_question_responses')
  .select('question_id, player_id, attempt_number, is_correct, created_at')
  .gte('created_at', startDate.toISOString())
  .order('created_at', { ascending: true });

// Track improvement per student
const learningVelocity = progressData?.reduce((acc: any, r: any) => {
  const key = `${r.player_id}|${r.question_id}`;
  if (!acc[key]) {
    acc[key] = {
      attempts: [],
      improved: false
    };
  }
  acc[key].attempts.push(r.is_correct);

  // Check if they improved (wrong -> right)
  if (acc[key].attempts.length >= 2) {
    const firstWrong = !acc[key].attempts[0];
    const laterRight = acc[key].attempts.slice(1).some((a: boolean) => a);
    if (firstWrong && laterRight) acc[key].improved = true;
  }
  return acc;
}, {});

const improvementRate = Object.values(learningVelocity || {})
  .filter((v: any) => v.attempts.length > 1).length;
const improvedCount = Object.values(learningVelocity || {})
  .filter((v: any) => v.improved).length;

performanceData.learningMetrics = {
  studentsWithMultipleAttempts: improvementRate,
  studentsWhoImproved: improvedCount,
  improvementRate: (improvedCount / improvementRate) * 100
};
```

---

## Complete Enhanced Data Structure

Here's what GPT receives with ALL enhancements:

```typescript
{
  // CORE DATA (current)
  dateRange: { start, end, days },
  overallMetrics: { totalStudents, totalGamesPlayed, ... },
  performanceByCategory: [...],
  performanceByAgeGroup: [...],
  performanceByProvince: [...],
  difficultQuestions: [...],

  // NEW ENHANCEMENTS
  trends: [...],                    // Option 1
  completionRates: [...],           // Option 2
  timeInsights: [...],              // Option 3
  hintAnalysis: [...],              // Option 4
  demographicBreakdown: [...],      // Option 5
  learningMetrics: {...}            // Option 6
}
```

---

## How to Implement

### Step 1: Choose which data to add

Pick from Options 1-6 based on what insights you want.

### Step 2: Add methods to `educationalAnalysisService.ts`

Add the new methods (like `getPerformanceTrends`) to the class.

### Step 3: Update `generateGPTAnalysis` method

Add the new data to the `performanceData` object around line 607-628.

### Step 4: Update GPT prompt (optional)

If you want GPT to specifically analyze the new data, update the prompt in `openaiService.ts` line ~70 to mention the new fields:

```typescript
Please provide a structured analysis considering:
- Performance trends over time
- Completion and abandonment rates
- Response time patterns (guessing vs confusion)
- Hint usage effectiveness
- Demographic disparities
- Learning velocity and improvement rates
```

---

## Quick Implementation Example

Here's a complete example adding Trends (Option 1):

```typescript
// 1. Add method to class (after line 695)
async getPerformanceTrends(startDate: Date, endDate: Date) {
  // ... code from Option 1 above ...
}

// 2. Update generateGPTAnalysis (around line 627)
const patterns = await this.getPerformanceByCategory();
const questionInsights = await this.getQuestionInsights('all');
const trends = await this.getPerformanceTrends(startDate, endDate); // NEW

// ... existing code ...

const performanceData = {
  dateRange: { ... },
  overallMetrics: { ... },
  performanceByCategory: patterns.slice(0, 10),
  performanceByAgeGroup: this.aggregateByDemographic(responseData || [], 'age_group'),
  performanceByProvince: this.aggregateByDemographic(responseData || [], 'province'),
  difficultQuestions: questionInsights.slice(0, 5),
  trends: trends.slice(0, 10) // NEW - Top 10 biggest changes
};
```

---

## Testing Your Changes

```typescript
// Test in browser console
const analysis = await educationalAnalysisService.generateGPTAnalysis(30);
console.log('Data sent to GPT:', analysis);
```

---

## What GPT Does With This Data

GPT-4 Turbo analyzes ALL the data and produces:

1. **Executive Summary**
   - Synthesizes key findings
   - Highlights critical issues
   - Recommends immediate actions

2. **Identified Issues**
   - One issue per learning gap
   - Root cause analysis
   - Affected demographics
   - Severity rating

3. **Recommendations**
   - Specific interventions for each issue
   - Implementation steps
   - Resource requirements
   - Success metrics

4. **Trend Analysis**
   - Improving areas
   - Declining areas
   - Stable areas

5. **Best Practices**
   - What's working well
   - Should be replicated

---

## Recommended Additions

For most useful insights, I recommend adding:

1. **Trends** (Option 1) - Shows progress over time
2. **Completion Rates** (Option 2) - Identifies frustration points
3. **Time Insights** (Option 3) - Distinguishes guessing from confusion

These three additions give GPT the most context to provide actionable recommendations.