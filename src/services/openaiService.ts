/**
 * OpenAI GPT-4 Turbo Service
 * Powers AI-driven educational insights and recommendations
 */

interface GPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GPTResponse {
  success: boolean;
  data?: any;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';
  private model = 'gpt-o3';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';

    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Set VITE_OPENAI_API_KEY in .env file.');
    }
  }

  /**
   * Check if OpenAI is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  /**
   * Send a request to GPT-4 Turbo
   */
  async chat(messages: GPTMessage[], options?: {
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
  }): Promise<GPTResponse> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.'
      };
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 4000,
          response_format: options?.jsonMode ? { type: 'json_object' } : undefined
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API request failed');
      }

      const data = await response.json();

      return {
        success: true,
        data: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        }
      };
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to communicate with OpenAI'
      };
    }
  }

  /**
   * Analyze educational performance data with GPT-4 Turbo
   */
  async analyzeEducationalData(performanceData: any): Promise<GPTResponse> {
    const systemPrompt = `You are an expert educational consultant and data analyst specializing in child education and learning outcomes. Your role is to analyze student performance data and provide actionable, evidence-based recommendations to improve learning outcomes.

You have expertise in:
- Educational psychology and child development (ages 5-14+)
- Curriculum design and instructional strategies
- Assessment and evaluation methods
- Educational technology and gamification
- Differentiated instruction for diverse learners
- Data-driven educational interventions

When analyzing data:
1. Identify specific patterns and trends
2. Consider developmental appropriateness for each age group
3. Recognize cultural and regional context
4. Prioritize high-impact, feasible interventions
5. Base recommendations on educational research and best practices
6. Provide clear, measurable success criteria

Your recommendations should be:
- Specific and actionable
- Evidence-based
- Resource-conscious
- Time-bound
- Measurable`;

    const userPrompt = `Analyze the following educational performance data and provide comprehensive insights:

## Performance Data
${JSON.stringify(performanceData, null, 2)}

## Required Analysis

Please provide a structured analysis in JSON format with the following sections:

1. **Executive Summary**
   - Overall assessment of performance
   - Most critical issues (top 3)
   - Immediate action items

2. **Identified Issues** (Array of issues)
   For each issue:
   - issueId: unique identifier
   - problemStatement: clear description
   - affectedPopulation: {ageGroups, provinces, totalStudents, sampleSize}
   - metrics: {currentAccuracy, targetAccuracy, performanceGap}
   - severity: "low" | "medium" | "high" | "critical"
   - rootCauses: array of potential reasons

3. **Recommendations** (Array of interventions)
   For each recommendation:
   - issueId: reference to issue
   - recommendationType: "content" | "pedagogy" | "assessment" | "support"
   - priority: "immediate" | "short-term" | "long-term"
   - intervention: {
       title: string
       description: string
       implementationSteps: array of 5-7 specific steps
       requiredResources: array of resources
       estimatedCost: "low" | "medium" | "high"
       timeframe: string
     }
   - expectedOutcome: {
       description: string
       estimatedImprovement: number (percentage)
       timeToImpact: string
     }
   - successMetrics: array of {
       metric: string
       currentValue: number
       targetValue: number
       measurementMethod: string
     }

4. **Trend Analysis**
   - improvingAreas: array of areas showing positive trends
   - decliningAreas: array of areas needing attention
   - stableAreas: array of consistent performance areas

5. **Best Practices**
   - What's working well and should be replicated
   - Successful strategies by age group or region

Respond ONLY with valid JSON. Be specific, practical, and evidence-based in your recommendations.`;

    return await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], {
      temperature: 0.7,
      maxTokens: 4000,
      jsonMode: true
    });
  }

  /**
   * Generate specific question improvement suggestions
   */
  async generateQuestionImprovements(questionData: any): Promise<GPTResponse> {
    const systemPrompt = `You are an expert in educational assessment design and question development for children aged 5-14. Analyze question performance data and suggest specific improvements to make questions more effective, engaging, and age-appropriate.`;

    const userPrompt = `Analyze these underperforming questions and suggest improvements:

${JSON.stringify(questionData, null, 2)}

For each question, provide:
1. Why students might be struggling
2. Specific rewording suggestions
3. Visual aid recommendations
4. Scaffolding strategies
5. Alternative question formats

Respond in JSON format with an array of question improvements.`;

    return await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], {
      temperature: 0.8,
      maxTokens: 3000,
      jsonMode: true
    });
  }

  /**
   * Generate age-appropriate content suggestions
   */
  async generateContentSuggestions(topic: string, ageGroup: string, currentAccuracy: number): Promise<GPTResponse> {
    const systemPrompt = `You are a creative educational content developer specializing in engaging, age-appropriate learning materials for children.`;

    const userPrompt = `Create engaging content suggestions for:
- Topic: ${topic}
- Age Group: ${ageGroup}
- Current Performance: ${currentAccuracy}% accuracy

Suggest:
1. 3 storytelling approaches
2. 5 interactive activity ideas
3. Visual content recommendations
4. Real-world connection examples
5. Gamification strategies

Respond in JSON format.`;

    return await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], {
      temperature: 0.9,
      maxTokens: 2000,
      jsonMode: true
    });
  }

  /**
   * Analyze regional performance differences
   */
  async analyzeRegionalDifferences(regionalData: any): Promise<GPTResponse> {
    const systemPrompt = `You are an educational equity analyst specializing in understanding and addressing regional disparities in educational outcomes. Consider socioeconomic factors, resource availability, and cultural context.`;

    const userPrompt = `Analyze these regional performance differences:

${JSON.stringify(regionalData, null, 2)}

Provide:
1. Key regional disparities identified
2. Potential contributing factors (resource gaps, training needs, etc.)
3. Targeted interventions for underperforming regions
4. Strategies to replicate success from high-performing regions
5. Equity-focused recommendations

Respond in JSON format.`;

    return await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], {
      temperature: 0.7,
      maxTokens: 3000,
      jsonMode: true
    });
  }
}

export const openaiService = new OpenAIService();