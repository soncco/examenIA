export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface ExamResult {
  name: string;
  major: string;
  score: number;
  date: string;
}

export type ViewState = 'landing' | 'student-reg' | 'exam' | 'teacher-login' | 'teacher-dashboard' | 'exam-finished';
