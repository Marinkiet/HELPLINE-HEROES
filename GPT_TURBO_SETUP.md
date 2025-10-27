# GPT-4 Turbo Setup Guide

## Overview

The AI Educational Insights system is now powered by OpenAI's GPT-4 Turbo, providing sophisticated, context-aware analysis of student performance data with actionable recommendations.

---

## Quick Setup

### 1. Get Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to "API Keys" section
4. Click "Create new secret key"
5. Copy your API key (starts with `sk-...`)

### 2. Add API Key to Your Project

Open your `.env` file and add:

```env
VITE_OPENAI_API_KEY=sk-your-actual-key-here
```

**Important:** Keep this key secret! Never commit it to version control.

### 3. Restart Development Server

```bash
npm run dev
```

That's it! The AI Insights Panel will now use GPT-4 Turbo.

---

## Features

### GPT-4 Turbo Advantages

1. **Contextual Understanding**
   - Analyzes performance patterns within educational context
   - Considers developmental psychology for each age group
   - Recognizes cultural and regional nuances

2. **Evidence-Based Recommendations**
   - Draws from educational research and best practices
   - Tailored interventions for specific demographics
   - Prioritizes high-impact, feasible actions

3. **Sophisticated Analysis**
   - Identifies root causes, not just symptoms
   - Detects subtle patterns in data
   - Provides nuanced, multi-dimensional insights

4. **Natural Language Insights**
   - Clear, actionable problem statements
   - Detailed implementation guidance
   - Educator-friendly language

---

## How It Works

### Data Flow

```
Student Performance Data (Supabase)
        ↓
Educational Analysis Service
        ↓
Prepares structured data summary
        ↓
GPT-4 Turbo API (OpenAI)
        ↓
Comprehensive analysis with:
- Issue identification
- Root cause analysis
- Targeted recommendations
- Success metrics
        ↓
AI Insights Panel (UI)
        ↓
Educators & Administrators
```

### GPT-4 Turbo Prompt Structure

The system uses a sophisticated prompt with:

**System Prompt:**
- Expert educational consultant persona
- Expertise in child education (ages 5-14+)
- Data-driven, evidence-based approach
- Focus on actionable recommendations

**User Prompt:**
- Performance data by category, age group, province
- Overall metrics and trends
- Difficult questions
- Specific analysis requirements

**Response Format:**
- Structured JSON output
- Executive summary
- Identified issues array
- Recommendations array
- Trend analysis
- Best practices

---

## API Usage & Costs

### Pricing (as of 2024)

**GPT-4 Turbo:**
- Input: $10 per 1M tokens
- Output: $30 per 1M tokens

### Estimated Costs Per Analysis

| Data Volume | Input Tokens | Output Tokens | Cost |
|-------------|-------------|---------------|------|
| Small (< 100 students) | ~2,000 | ~3,000 | ~$0.11 |
| Medium (100-500 students) | ~4,000 | ~4,000 | ~$0.16 |
| Large (500+ students) | ~6,000 | ~5,000 | ~$0.21 |

**Monthly estimates:**
- Daily analysis: ~$6-7/month
- Weekly analysis: ~$1-2/month
- On-demand only: < $1/month

---

## Fallback Behavior

### No API Key Configured

If `VITE_OPENAI_API_KEY` is not set:
- System automatically falls back to rule-based analysis
- Still provides valuable insights
- No GPT-4 Turbo features
- Console warning displayed

### API Request Fails

If OpenAI API is unavailable or errors:
- Automatic fallback to rule-based analysis
- Error logged to console
- User sees standard analysis
- Seamless degradation

---

## Advanced Configuration

### Customize GPT Model

Edit `src/services/openaiService.ts`:

```typescript
private model = 'gpt-4-turbo-preview'; // Default

// Options:
// - 'gpt-4-turbo-preview' (latest, most capable)
// - 'gpt-4-0125-preview' (specific version)
// - 'gpt-4-1106-preview' (previous version)
```

### Adjust Temperature

Lower temperature (0.3-0.5) = More focused, consistent
Higher temperature (0.7-0.9) = More creative, diverse

```typescript
await this.chat([...], {
  temperature: 0.7, // Default
  maxTokens: 4000
});
```

### Enable JSON Mode

Already enabled by default for structured output:

```typescript
await this.chat([...], {
  jsonMode: true // Ensures valid JSON response
});
```

---

## API Methods

### Main Analysis Method

```typescript
await educationalAnalysisService.generateGPTAnalysis(daysBack?: number)
```

Returns comprehensive analysis powered by GPT-4 Turbo.

### Additional GPT Methods

```typescript
// Generate question-specific improvements
await openaiService.generateQuestionImprovements(questionData);

// Get content suggestions for specific topics
await openaiService.generateContentSuggestions(topic, ageGroup, accuracy);

// Analyze regional performance differences
await openaiService.analyzeRegionalDifferences(regionalData);
```

---

## Example GPT-4 Turbo Output

### Input Data (Simplified)

```json
{
  "overallMetrics": {
    "totalStudents": 150,
    "overallAccuracy": 62.5
  },
  "performanceByCategory": [
    {
      "category": "Body Safety",
      "ageGroup": "5-7",
      "accuracyRate": 34.2
    }
  ]
}
```

### GPT-4 Turbo Response

```json
{
  "executiveSummary": {
    "overallAssessment": "Students demonstrate strong performance in most areas, but significant challenges exist in Body Safety education for younger age groups (5-7). This critical gap requires immediate intervention.",
    "criticalIssues": [
      "Body Safety concepts show critically low comprehension (34.2%) among 5-7 year olds",
      "Abstract terminology may be developmentally inappropriate",
      "Visual support appears insufficient for concrete thinkers"
    ],
    "immediateActions": [
      "Redesign Body Safety content with age-appropriate visuals and storytelling",
      "Implement progressive scaffolding with simpler warm-up questions",
      "Add interactive elements (drag-and-drop body parts, scenario games)"
    ]
  },
  "identifiedIssues": [
    {
      "issueId": "body_safety_5_7_critical",
      "problemStatement": "5-7 year old students struggle significantly with Body Safety concepts, achieving only 34.2% accuracy. This represents a critical learning gap in essential safety education.",
      "affectedPopulation": {
        "ageGroups": ["5-7"],
        "totalStudents": 45,
        "sampleSize": 247
      },
      "metrics": {
        "currentAccuracy": 34.2,
        "targetAccuracy": 75.0,
        "performanceGap": 40.8
      },
      "severity": "critical",
      "rootCauses": [
        "Content uses abstract terminology not aligned with concrete operational thinking stage (Piaget)",
        "Insufficient visual scaffolding for pre-readers and early readers",
        "Questions assume contextual knowledge students may lack",
        "Sensitive topic may cause discomfort without proper framing",
        "Lack of familiar, relatable scenarios for this age group"
      ]
    }
  ],
  "recommendations": [
    {
      "issueId": "body_safety_5_7_critical",
      "recommendationType": "content",
      "priority": "immediate",
      "intervention": {
        "title": "Multi-Sensory Body Safety Storytelling Redesign",
        "description": "Transform abstract Body Safety concepts into concrete, story-based learning experiences using visual narratives, familiar characters, and interactive elements appropriate for 5-7 year olds' developmental stage.",
        "implementationSteps": [
          "Create a friendly character guide (e.g., 'Safety Sam') that children can identify with",
          "Develop 4-5 illustrated story scenarios showing safe vs. unsafe touch in everyday contexts",
          "Replace text-heavy questions with picture-based multiple choice (e.g., 'Which picture shows a safe touch?')",
          "Add audio narration for each scenario to support non-readers",
          "Include interactive 'point to' activities where children identify safe/unsafe touches in illustrations",
          "Implement positive reinforcement animations (stars, encouraging messages) after correct answers",
          "Pilot test with 10-15 students and gather feedback from educators and parents"
        ],
        "requiredResources": [
          "Child-friendly illustrator or graphic designer",
          "Voice actor for audio narration (age-appropriate voice)",
          "Educational content developer with child safety expertise",
          "Interactive learning platform developer",
          "Sample review by child psychologist or counselor"
        ],
        "estimatedCost": "medium",
        "timeframe": "4-6 weeks"
      },
      "expectedOutcome": {
        "description": "Students will demonstrate improved comprehension and retention of Body Safety concepts through visual, auditory, and interactive learning modalities aligned with their developmental stage. Expected accuracy improvement of 25-30 percentage points.",
        "estimatedImprovement": 28,
        "timeToImpact": "2-3 weeks after implementation"
      },
      "successMetrics": [
        {
          "metric": "Question Accuracy Rate",
          "currentValue": 34.2,
          "targetValue": 75.0,
          "measurementMethod": "Track weekly accuracy for Body Safety questions among 5-7 year olds over 4 weeks post-implementation"
        },
        {
          "metric": "First Attempt Success Rate",
          "currentValue": 0,
          "targetValue": 70.0,
          "measurementMethod": "Measure percentage of students who answer correctly on first attempt without hints"
        },
        {
          "metric": "Completion Rate",
          "currentValue": 0,
          "targetValue": 90.0,
          "measurementMethod": "Track percentage of students who complete all Body Safety questions without abandonment"
        },
        {
          "metric": "Parent/Teacher Feedback Score",
          "currentValue": 0,
          "targetValue": 4.5,
          "measurementMethod": "Collect satisfaction ratings (1-5 scale) from 20+ educators and parents post-implementation"
        }
      ]
    }
  ],
  "trendAnalysis": {
    "improvingAreas": [
      "Older age groups (11-13) showing consistent improvement",
      "Urban areas demonstrating steady engagement growth"
    ],
    "decliningAreas": [
      "Body Safety comprehension for youngest learners"
    ],
    "stableAreas": [
      "Stranger Danger awareness across all age groups",
      "Help-seeking behavior understanding"
    ]
  },
  "bestPractices": {
    "workingWell": [
      "Story-based learning for 8-10 year olds showing high engagement",
      "Scenario-based questions performing better than abstract definitions",
      "Positive reinforcement increasing completion rates"
    ],
    "recommendations": [
      "Replicate storytelling approach from successful modules to struggling areas",
      "Increase use of visual aids across all age groups",
      "Consider gamification elements (badges, progress tracking) to boost motivation"
    ]
  }
}
```

---

## Troubleshooting

### Issue: "OpenAI not configured" warning

**Solution:**
1. Check `.env` file has `VITE_OPENAI_API_KEY`
2. Ensure key starts with `sk-`
3. Restart dev server after adding key

### Issue: API request fails with 401 error

**Solution:**
1. Verify API key is correct
2. Check OpenAI account has available credits
3. Confirm key has not been revoked

### Issue: API request times out

**Solution:**
1. Check internet connection
2. Verify OpenAI API status: https://status.openai.com
3. Increase timeout if needed (currently 30s default)

### Issue: Response parsing fails

**Solution:**
- GPT may have returned invalid JSON
- System automatically falls back to rule-based analysis
- Check console for raw response
- Adjust temperature to be more consistent (lower value)

---

## Security Best Practices

### 1. Never Expose API Key

```bash
# ❌ DON'T commit .env file
git add .env

# ✅ DO add to .gitignore
echo ".env" >> .gitignore
```

### 2. Use Environment Variables

```typescript
// ✅ Correct - uses environment variable
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// ❌ Never hardcode
const apiKey = "sk-...";
```

### 3. Server-Side API Calls (Production)

For production, consider:
- Moving API calls to a backend server
- Using Supabase Edge Functions
- Implementing rate limiting
- Adding authentication checks

---

## Cost Optimization Tips

### 1. Cache Results

```typescript
// Cache analysis for 1 hour
const cacheKey = `analysis_${date}`;
const cached = localStorage.getItem(cacheKey);
if (cached) return JSON.parse(cached);

// ... make API call ...

localStorage.setItem(cacheKey, JSON.stringify(analysis));
```

### 2. Adjust Analysis Frequency

- Daily: For actively monitored programs
- Weekly: For stable programs
- On-demand: For budget-conscious scenarios

### 3. Reduce Token Usage

- Limit historical data (e.g., 7 days vs 30 days)
- Filter to most relevant categories
- Summarize before sending to GPT

### 4. Use Fallback First

For quick checks, use rule-based analysis. Use GPT for:
- Detailed reports
- Root cause investigation
- Strategic planning

---

## Testing

### Test GPT Integration

```typescript
import { openaiService } from './services/openaiService';

// Check if configured
console.log('OpenAI configured:', openaiService.isConfigured());

// Test simple request
const response = await openaiService.chat([
  { role: 'user', content: 'Hello, GPT-4!' }
]);

console.log('Response:', response);
```

### Test Analysis

```typescript
import { educationalAnalysisService } from './services/educationalAnalysisService';

// Generate analysis
const analysis = await educationalAnalysisService.generateGPTAnalysis(7);

console.log('Issues found:', analysis.identifiedIssues.length);
console.log('Recommendations:', analysis.recommendations.length);
```

---

## Support & Resources

- **OpenAI Documentation**: https://platform.openai.com/docs
- **GPT-4 Turbo Guide**: https://platform.openai.com/docs/models/gpt-4-turbo-and-gpt-4
- **API Reference**: https://platform.openai.com/docs/api-reference
- **Pricing**: https://openai.com/pricing
- **Status Page**: https://status.openai.com

---

## Files Modified

- `src/services/openaiService.ts` - GPT-4 Turbo integration
- `src/services/educationalAnalysisService.ts` - Added `generateGPTAnalysis()` method
- `src/components/AIInsightsPanel.tsx` - Updated to use GPT analysis
- `.env` - Added OpenAI API key configuration