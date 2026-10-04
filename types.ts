export interface Token {
  /** The word exactly as it appeared in the input. */
  raw: string;
  /** Lowercased, normalized form used for matching and counting. */
  norm: string;
  start: number;
  end: number;
  isStopword: boolean;
  isNumeric: boolean;
}

export interface AnalysisOptions {
  removeStopwords: boolean;
  minLength: number;
  maxKeywords: number;
}

export interface Keyword {
  rank: number;
  word: string;
  frequency: number;
  /** Share of all meaningful words, 0-100. */
  percentage: number;
  /** Frequency relative to the top keyword, 0-100. */
  importance: number;
}

export interface StopwordEntry {
  word: string;
  count: number;
}

export interface TextStats {
  totalCharacters: number;
  totalWords: number;
  uniqueWords: number;
  stopwordsFound: number;
  uniqueStopwords: number;
  stopwordsRemoved: number;
  filteredWords: number;
  meaningfulWords: number;
  uniqueKeywords: number;
  reductionPercentage: number;
  mostFrequentKeyword: Keyword | null;
}

export interface AnalysisResult {
  options: AnalysisOptions;
  tokens: Token[];
  filteredTokens: Token[];
  filteredText: string;
  stopwords: StopwordEntry[];
  /** Every keyword candidate, ranked. */
  candidates: Keyword[];
  /** The strongest keywords (candidates limited to `maxKeywords`). */
  keywords: Keyword[];
  wordCounts: Map<string, number>;
  stats: TextStats;
  summary: string;
}

export type LookupStatus =
  | 'keyword'
  | 'below-cutoff'
  | 'stopword'
  | 'filtered'
  | 'not-found'
  | 'invalid';

export interface LookupResult {
  query: string;
  word: string;
  status: LookupStatus;
  frequency: number;
  percentage: number | null;
  rank: number | null;
  message: string;
}
