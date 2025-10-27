# Game Analytics System - Quick Start Guide

## Overview
This guide provides a quick start for implementing the comprehensive game analytics system in your educational games.

---

## 1. Setup

The analytics system is already configured and connected to your Supabase database. No additional setup required!

**Database Tables Created:**
- ✅ `players` - Player demographics
- ✅ `schools` - School information
- ✅ `detailed_question_responses` - Question-level analytics
- ✅ `game_performance_summary` - Pre-aggregated metrics
- ✅ `learning_insights` - AI-ready insights

---

## 2. Basic Implementation

### Step 1: Import the Service

```typescript
import { gameAnalyticsService } from './services/gameAnalyticsService';
```

### Step 2: Create Player Profile (on first play)

```typescript
// When player starts their first game
const playerId = await gameAnalyticsService.createPlayerProfile({
  sessionId: userSessionId, // from existing session tracking
  ageGroup: '5-7', // or '8-10', '11-13', '14+'
  province: 'Gauteng', // optional
  city: 'Johannesburg', // optional
  schoolCode: 'school_hash_123', // optional, use hashed value
  preferredLanguage: 'en',
  dataConsent: true
});
```

### Step 3: Record Game Completion

```typescript
// When game is completed
const gameSessionId = await gameAnalyticsService.recordGameSession(
  sessionId,
  {
    gameId: '1',
    gameName: 'Safe Touch Detective',
    gameCategory: 'safety',
    score: playerScore,
    maxPossibleScore: maxScore,
    completionPercentage: 100,
    sessionDurationSeconds: timeInSeconds,
    languageUsed: selectedLanguage,
    questionsAnswered: totalQuestions,
    correctAnswers: correctCount,
    startedAt: startTime,
    completedAt: new Date()
  }
);
```

### Step 4: Record Question Responses (batch)

```typescript
// Prepare question response data
const responses = gameQuestions.map(q => ({
  questionId: q.id,
  questionText: q.text,
  questionCategory: q.category, // e.g., 'body_safety', 'stranger_danger'
  selectedAnswer: q.playerAnswer,
  correctAnswer: q.correctAnswer,
  isCorrect: q.playerAnswer === q.correctAnswer,
  responseTimeSeconds: q.timeSpent,
  attemptNumber: q.attempts || 1,
  hintsUsed: q.hintsRequested || 0
}));

// Record all at once
if (gameSessionId && playerId) {
  await gameAnalyticsService.recordQuestionResponses(
    gameSessionId,
    playerId,
    responses
  );
}
```

---

## 3. Complete Integration Example

```typescript
// In your game component
async function handleGameComplete() {
  const sessionId = getCurrentSessionId(); // your session tracking

  // 1. Ensure player profile exists
  const playerId = await gameAnalyticsService.createPlayerProfile({
    sessionId,
    ageGroup: selectedAgeGroup,
    province: userProvince,
    city: userCity,
    schoolCode: schoolId ? hashSchoolId(schoolId) : undefined,
    preferredLanguage: currentLanguage,
    dataConsent: true
  });

  // 2. Collect game data
  const gameData = {
    gameId: game.id,
    gameName: game.name,
    gameCategory: game.category,
    score: calculateScore(),
    maxPossibleScore: game.maxScore,
    completionPercentage: 100,
    sessionDurationSeconds: getElapsedSeconds(),
    languageUsed: currentLanguage,
    questionsAnswered: questions.length,
    correctAnswers: questions.filter(q => q.isCorrect).length,
    startedAt: gameStartTime,
    completedAt: new Date()
  };

  // 3. Record game session
  const gameSessionId = await gameAnalyticsService.recordGameSession(
    sessionId,
    gameData
  );

  // 4. Record question responses
  if (gameSessionId && playerId) {
    const questionResponses = questions.map(q => ({
      questionId: q.id,
      questionText: q.text,
      questionCategory: q.category,
      selectedAnswer: q.playerAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect: q.isCorrect,
      responseTimeSeconds: q.responseTime,
      attemptNumber: q.attemptNumber,
      hintsUsed: q.hintsUsed
    }));

    await gameAnalyticsService.recordQuestionResponses(
      gameSessionId,
      playerId,
      questionResponses
    );
  }

  // 5. Show completion screen
  showGameComplete();
}
```

---

## Resources

- **Full Documentation**: See `ANALYTICS_SYSTEM.md`
- **Migration File**: `supabase/migrations/20251027150000_comprehensive_game_analytics.sql`
- **Service Code**: `src/services/gameAnalyticsService.ts`