export interface Question {
  id: number;
  title: string;
  domain: 'Technical' | 'HR' | 'Behavioural' | 'System Design';
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expected_duration_sec: number;
  ideal_points: string[];
  star_framework_needed: boolean;
  sample_answer: string;
  created_at?: string;
}

export interface QuestionResponse {
  id?: number;
  session_id: number;
  question_id?: number;
  question_title: string;
  domain: string;
  order_index: number;
  transcript: string;
  input_method: 'voice' | 'typed' | 'hybrid';
  duration_sec: number;
  word_count: number;
  wpm: number;
  filler_count: number;
  filler_words_breakdown: Record<string, number>;
  repeated_words: string[];
  relevance_score: number;
  structure_score: number;
  overall_score: number;
  star_breakdown: {
    has_situation?: boolean;
    has_task?: boolean;
    has_action?: boolean;
    has_result?: boolean;
  };
  what_worked: string[];
  tighten_this: string[];
  try_this_next_time: string;
  created_at?: string;
}

export interface InterviewSession {
  id: number;
  user_id: string;
  student_name: string;
  student_email: string;
  domain: string;
  target_role: string;
  difficulty: string;
  question_count: number;
  status: 'in_progress' | 'completed';
  overall_score: number;
  communication_score: number;
  content_score: number;
  structure_score: number;
  pacing_score: number;
  avg_wpm: number;
  total_filler_words: number;
  filler_rate_percent: number;
  summary_notes: string;
  created_at: string;
  completed_at?: string;
  responses?: QuestionResponse[];
}

export interface PlacementAdminStats {
  total_sessions: number;
  completed_sessions: number;
  total_responses: number;
  avg_overall_score: number;
  avg_wpm: number;
  total_fillers_detected: number;
  placement_readiness_rate: number;
  domain_averages: {
    domain: string;
    interviews: number;
    avg_score: number;
  }[];
  recent_sessions: InterviewSession[];
}
