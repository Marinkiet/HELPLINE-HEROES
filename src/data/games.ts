export interface Game {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  image_url: string;
  age_group_id: string;
  topic_id: string;
  sections: Section[];
  game_identifier: string;
}

export interface Section {
  id: string;
  title: Record<string, string>;
  game_id: string;
  order: number;
  questions: Question[];
  completion_message?: Record<string, string>;
}

export interface Question {
  id: string;
  text: Record<string, string>;
  section_id: string;
  order: number;
  type: string;
  options: Record<string, string>[];
  correct_answer: string;
  feedback: {
    correct: Record<string, string>;
    incorrect: Record<string, string>;
    explanation?: Record<string, string>;
    completion?: Record<string, string>;
  };
}
