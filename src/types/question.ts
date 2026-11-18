export interface Question {
  id: string;
  category: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  xp: number;
}
