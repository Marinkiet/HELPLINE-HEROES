import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekmwsrkocelwfhtoipgt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbXdzcmtvY2Vsd2ZodG9pcGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MjQxMTMsImV4cCI6MjA3NDUwMDExM30.ueudSV3FBtixD6Q3Qqv1C_6PX4N-l1W0CbKkEmvkxcc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const gameCategories = [
  'Safe Touch',
  'Trusted Adults',
  'Speaking Up',
  'Online Safety',
  'Body Safety',
  'Personal Boundaries',
  'Bullying Prevention',
  'Friend Safety'
];

const ageGroups = ['5-7', '8-12', 'teen'];

async function generateSampleData() {
  console.log('Fetching existing user sessions...');
  
  const { data: sessions, error: sessionError } = await supabase
    .from('user_sessions')
    .select('session_id, age_group');
  
  if (sessionError) {
    console.error('Error fetching sessions:', sessionError);
    return;
  }
  
  console.log(`Found ${sessions.length} user sessions`);
  
  const questionResponses = [];
  
  for (const session of sessions.slice(0, 20)) {
    const questionsPerSession = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < questionsPerSession; i++) {
      const category = gameCategories[Math.floor(Math.random() * gameCategories.length)];
      const isCorrect = Math.random() > 0.3;
      const responseTime = Math.floor(Math.random() * 30) + 5;
      const attemptNumber = Math.random() > 0.7 ? 2 : 1;
      
      questionResponses.push({
        session_id: session.session_id,
        game_id: String(Math.floor(Math.random() * 8) + 1),
        question_id: `q_${category.toLowerCase().replace(/\s+/g, '_')}_${i}`,
        question_text: `Sample question about ${category}`,
        question_category: category,
        user_answer: isCorrect ? 'correct_answer' : 'wrong_answer',
        correct_answer: 'correct_answer',
        is_correct: isCorrect,
        response_time_seconds: responseTime,
        attempt_number: attemptNumber,
        hints_used: attemptNumber > 1 ? 1 : 0
      });
    }
  }
  
  console.log(`Generated ${questionResponses.length} question responses`);
  console.log('Inserting into database...');
  
  const batchSize = 50;
  for (let i = 0; i < questionResponses.length; i += batchSize) {
    const batch = questionResponses.slice(i, i + batchSize);
    const { error } = await supabase
      .from('question_responses')
      .insert(batch);
    
    if (error) {
      console.error('Error inserting batch:', error);
    } else {
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}`);
    }
  }
  
  console.log('Sample data generation complete!');
  
  const { data: count } = await supabase
    .from('question_responses')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Total question responses in database: ${count}`);
}

generateSampleData().catch(console.error);
