export interface Level {
  title: string;
  parent: number | null;
  isGradeRequired: boolean;
  applySubLevel?: boolean;
  alternateLevel?: number | null;
}

export interface UpdateLevelPayload extends Level {
  id: number;
}

export interface LevelTree {
  id: number;
  title: string;
  parent: number | null;
  isGradeRequired: boolean;
  children?: LevelTree[];
}

export type LevelForest = LevelTree[];

export interface LevelResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Level[];
}

export interface DeleteLevelPayload {
  levelId: number;
  alternateLevel?: number | null;
}
