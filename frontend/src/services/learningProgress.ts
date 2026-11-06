import { LearningProgressState, PretestQuestion } from '@/types/progress';

const PROGRESS_STORAGE_KEY = 'edcode_learning_progress';
export const PROGRESS_EVENT_NAME = 'edcode_progress_updated';

// 5 Pertanyaan Inquiry Pre-Test Mengasah Computational Thinking (SMK PPLG Kelas 10)
export const PRETEST_QUESTIONS: PretestQuestion[] = [
  {
    id: 1,
    context: 'Di bengkel perakitan komputer SMK PPLG, seorang teknisi menumpuk box motherboard satu per satu: Box A (pertama di lantai), lalu Box B (di atas A), lalu Box C (terakhir di paling atas).',
    question: 'Ketika teknisi ingin mengambil satu box motherboard untuk dirakit tanpa membongkar seluruh tumpukan dari bawah, box manakah yang akan diambil pertama kali?',
    ctPillar: 'Pengenalan Pola',
    options: [
      { key: 'A', text: 'Box A (karena ditaruh pertama kali)' },
      { key: 'B', text: 'Box B (karena berada di tengah)' },
      { key: 'C', text: 'Box C (karena berada di posisi paling atas)' },
      { key: 'D', text: 'Semua box harus diangkat bersamaan' },
    ],
    correctAnswer: 'C',
    explanation: 'Ini adalah pola tumpukan (Stack) berprinsip LIFO (Last In First Out). Barang yang terakhir kali ditaruh di tumpukan adalah yang pertama kali bisa diambil.'
  },
  {
    id: 2,
    context: 'Di lab komputer sekolah, ada 1 printer yang terhubung ke jaringan lokal. Rian mengirim perintah cetak pada pukul 08:00, Sinta pada pukul 08:01, dan Budi pada pukul 08:02.',
    question: 'Bagaimana urutan dokumen yang akan dicetak oleh printer secara adil sesuai sistem antrean komputer?',
    ctPillar: 'Pengenalan Pola',
    options: [
      { key: 'A', text: 'Budi ➔ Sinta ➔ Rian' },
      { key: 'B', text: 'Rian ➔ Sinta ➔ Budi' },
      { key: 'C', text: 'Sinta ➔ Rian ➔ Budi' },
      { key: 'D', text: 'Dicetak bersamaan di satu kertas' },
    ],
    correctAnswer: 'B',
    explanation: 'Printer menggunakan mekanisme antrean (Queue) berprinsip FIFO (First In First Out). Siapa yang pertama kali mengirim data cetak akan dilayani pertama kali.'
  },
  {
    id: 3,
    context: 'Saat menulis kode program di text editor (VS Code), kamu berturut-turut: (1) mengetik function, (2) menambahkan komentar, dan (3) menghapus baris kode.',
    question: 'Jika kamu menekan shortcut Undo (Ctrl + Z), aksi mana yang akan dibatalkan terlebih dahulu oleh editor?',
    ctPillar: 'Abstraksi',
    options: [
      { key: 'A', text: 'Aksi (1) Mengetik function' },
      { key: 'B', text: 'Aksi (2) Menambahkan komentar' },
      { key: 'C', text: 'Aksi (3) Menghapus baris kode' },
      { key: 'D', text: 'Semua histori pengetikan langsung hilang' },
    ],
    correctAnswer: 'C',
    explanation: 'Histori Undo pada editor program disimpan dalam struktur data Stack. Tindakan paling terakhir (terbaru) adalah yang pertama kali dibatalkan saat Undo dipanggil.'
  },
  {
    id: 4,
    context: 'Di loket pembayaran SPP sekolah, siswa baru yang datang selalu berbaris di posisi paling belakang (Rear), sedangkan siswa yang selesai bayar keluar dari pintu depan (Front).',
    question: 'Jika Anto berada di posisi ke-3 antrean, langkah logis apa yang harus terjadi agar Anto sampai ke loket dan dilayani?',
    ctPillar: 'Dekomposisi',
    options: [
      { key: 'A', text: 'Anto langsung menyela ke posisi pertama' },
      { key: 'B', text: 'Orang di posisi ke-1 dan ke-2 harus dilayani dan keluar terlebih dahulu' },
      { key: 'C', text: 'Orang di belakang Anto harus keluar dari barisan' },
      { key: 'D', text: 'Loket harus berpindah ke belakang posisi Anto' },
    ],
    correctAnswer: 'B',
    explanation: 'Prinsip antrean mengharuskan elemen di depan (front) keluar satu per satu sebelum elemen di belakangnya bisa maju menjadi elemen terdepan.'
  },
  {
    id: 5,
    context: 'Sebuah tabung silinder vertikal hanya memiliki 1 lubang di atas. Kamu memasukkan kelereng Merah, lalu Hijau, lalu Biru. Kemudian kamu mengeluarkan 1 kelereng, lalu memasukkan kelereng Kuning.',
    question: 'Kelereng apakah yang saat ini berada di posisi paling atas tabung dan siap diambil berikutnya?',
    ctPillar: 'Perancangan Algoritma',
    options: [
      { key: 'A', text: 'Kelereng Kuning' },
      { key: 'B', text: 'Kelereng Hijau' },
      { key: 'C', text: 'Kelereng Merah' },
      { key: 'D', text: 'Kelereng Biru' },
    ],
    correctAnswer: 'A',
    explanation: 'Penelusuran algoritma Stack: Push(Merah) ➔ Push(Hijau) ➔ Push(Biru). Pop() mengeluarkan Biru (sisa: Merah, Hijau). Lalu Push(Kuning). Maka elemen teratas (Top) sekarang adalah Kuning.'
  }
];

export const INITIAL_PROGRESS: LearningProgressState = {
  pretestCompleted: false,
  pretestScore: 0,
  pretestAnswers: {},
  stackLessonsCompleted: [],
  stackScore: 0,
  queueLessonsCompleted: [],
  queueScore: 0,
  posttestCompleted: false,
  posttestScore: 0,
  lastUpdated: new Date().toISOString(),
};

export const learningProgressService = {
  getProgress(): LearningProgressState {
    if (typeof window === 'undefined') return INITIAL_PROGRESS;
    try {
      const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!data) return INITIAL_PROGRESS;
      return { ...INITIAL_PROGRESS, ...JSON.parse(data) };
    } catch {
      return INITIAL_PROGRESS;
    }
  },

  saveProgress(state: LearningProgressState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent(PROGRESS_EVENT_NAME, { detail: state }));
    } catch (e) {
      console.error('Failed to save learning progress to localStorage', e);
    }
  },

  submitPretest(answers: Record<number, string>): { score: number; totalCorrect: number } {
    let correctCount = 0;
    PRETEST_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / PRETEST_QUESTIONS.length) * 100);
    const current = this.getProgress();

    const updated: LearningProgressState = {
      ...current,
      pretestCompleted: true,
      pretestScore: score,
      pretestAnswers: answers,
      // Saat pre-test selesai, secara otomatis membuka pelajaran pertama Stack jika belum
      stackLessonsCompleted: current.stackLessonsCompleted.length > 0 ? current.stackLessonsCompleted : ['01'],
      stackScore: current.stackScore + score,
      lastUpdated: new Date().toISOString(),
    };

    this.saveProgress(updated);
    return { score, totalCorrect: correctCount };
  },

  completeLesson(moduleName: 'stack' | 'queue', lessonId: string, scoreGained: number = 100): LearningProgressState {
    const current = this.getProgress();
    const listKey = moduleName === 'stack' ? 'stackLessonsCompleted' : 'queueLessonsCompleted';
    const scoreKey = moduleName === 'stack' ? 'stackScore' : 'queueScore';

    const currentList = current[listKey];
    if (currentList.includes(lessonId)) {
      return current; // already completed
    }

    const nextLessons = [...currentList, lessonId];
    const updated: LearningProgressState = {
      ...current,
      [listKey]: nextLessons,
      [scoreKey]: current[scoreKey] + scoreGained,
      lastUpdated: new Date().toISOString(),
    };

    this.saveProgress(updated);
    return updated;
  },

  isPretestDone(): boolean {
    return this.getProgress().pretestCompleted;
  },

  isStackUnlocked(): boolean {
    return this.isPretestDone();
  },

  isStackCompleted(): boolean {
    const progress = this.getProgress();
    // 10 Modul / Lessons Stack
    return progress.stackLessonsCompleted.length >= 10;
  },

  isQueueUnlocked(): boolean {
    return this.isStackCompleted();
  },

  getStackProgressPercent(): number {
    const progress = this.getProgress();
    return Math.min(100, Math.round((progress.stackLessonsCompleted.length / 10) * 100));
  },

  getQueueProgressPercent(): number {
    const progress = this.getProgress();
    return Math.min(100, Math.round((progress.queueLessonsCompleted.length / 10) * 100));
  },

  getTotalScore(): number {
    const progress = this.getProgress();
    return progress.stackScore + progress.queueScore + progress.posttestScore;
  },

  resetProgress(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT_NAME, { detail: INITIAL_PROGRESS }));
  }
};

