export interface Option {
  t: string;
  ok: boolean;
}

export interface Question {
  text: string;
  opts: Option[];
}

export interface ExamQuestion extends Question {
  shuffledOpts: Option[];
}

export interface Answer {
  question: string;
  selected: string;
  isCorrect: boolean;
  correctAnswer: string;
}

export interface ExamResult {
  id: string;
  name: string;
  career: string;
  score: number;
  correct: number;
  incorrect: number;
  date: string;
  time: string;
  answers: Answer[];
}
