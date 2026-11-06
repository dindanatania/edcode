export interface PretestQuestion {
  id: number;
  question: string;
  context: string; // Skenario kontekstual dunia nyata (Inquiry)
  ctPillar: 'Dekomposisi' | 'Pengenalan Pola' | 'Abstraksi' | 'Perancangan Algoritma';
  options: {
    key: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
}

export interface LearningProgressState {
  pretestCompleted: boolean;
  pretestScore: number;
  pretestAnswers: Record<number, string>;
  
  // Modul Stack
  stackLessonsCompleted: string[]; // ['01', '02', ...]
  stackScore: number;
  
  // Modul Queue
  queueLessonsCompleted: string[]; // ['01', '02', ...]
  queueScore: number;
  
  // Post-test
  posttestCompleted: boolean;
  posttestScore: number;
  
  lastUpdated: string;
}

