import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ekmwsrkocelwfhtoipgt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbXdzcmtvY2Vsd2ZodG9pcGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MjQxMTMsImV4cCI6MjA3NDUwMDExM30.ueudSV3FBtixD6Q3Qqv1C_6PX4N-l1W0CbKkEmvkxcc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log('Checking Supabase database...\n');
  
  // Check user_sessions
  console.log('=== USER_SESSIONS TABLE ===');
  const { data: userSessions, error: userError } = await supabase
    .from('user_sessions')
    .select('*')
    .limit(5);
  
  if (userError) {
    console.error('Error fetching user_sessions:', userError);
  } else {
    console.log('Row count:', userSessions?.length || 0);
    if (userSessions && userSessions.length > 0) {
      console.log('Sample row:', JSON.stringify(userSessions[0], null, 2));
      console.log('Columns:', Object.keys(userSessions[0]));
    }
  }
  
  console.log('\n=== GAME_SESSIONS TABLE ===');
  const { data: gameSessions, error: gameError } = await supabase
    .from('game_sessions')
    .select('*')
    .limit(5);
  
  if (gameError) {
    console.error('Error fetching game_sessions:', gameError);
  } else {
    console.log('Row count:', gameSessions?.length || 0);
    if (gameSessions && gameSessions.length > 0) {
      console.log('Sample row:', JSON.stringify(gameSessions[0], null, 2));
      console.log('Columns:', Object.keys(gameSessions[0]));
    }
  }
  
  console.log('\n=== QUESTION_RESPONSES TABLE ===');
  const { data: questionResponses, error: questionError } = await supabase
    .from('question_responses')
    .select('*')
    .limit(5);
  
  if (questionError) {
    console.error('Error fetching question_responses:', questionError);
  } else {
    console.log('Row count:', questionResponses?.length || 0);
    if (questionResponses && questionResponses.length > 0) {
      console.log('Sample row:', JSON.stringify(questionResponses[0], null, 2));
      console.log('Columns:', Object.keys(questionResponses[0]));
    }
  }
  
  console.log('\n=== PLAYERS TABLE ===');
  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('*')
    .limit(5);
  
  if (playersError) {
    console.error('Error fetching players:', playersError);
  } else {
    console.log('Row count:', players?.length || 0);
    if (players && players.length > 0) {
      console.log('Sample row:', JSON.stringify(players[0], null, 2));
      console.log('Columns:', Object.keys(players[0]));
    }
  }
}

checkDatabase().catch(console.error);
