import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getAgeGroups = async () => {
  const { data, error } = await supabase.from('age_groups').select('*');
  if (error) throw error;
  return data;
};

export const getGamesByAgeGroup = async (ageGroupId: string) => {
  const { data, error } = await supabase
    .from('games')
    .select('*, sections(*, questions(*))')
    .eq('age_group_id', ageGroupId);
  if (error) throw error;
  return data;
};

export const getTopics = async () => {
  const { data, error } = await supabase.from('topics').select('*');
  if (error) throw error;
  return data;
};
