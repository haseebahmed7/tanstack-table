export interface Rank {
  id?: number;
  title: string;
  icon: string;
  minScore: number;
  iconUrl?: string;
}
export interface RankResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rank[];
}

export type RankPayload = Record<string, unknown> & Rank;
