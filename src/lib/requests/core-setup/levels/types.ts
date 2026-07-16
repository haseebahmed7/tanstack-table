import { Location } from "../locations/types";
import { Grade } from "../salary-band/types";

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

export interface RateRule {
  id: number;
  rate: number;
  days: string[];
  priority: number;
  level: number | Level;
  grade: Grade | null;
  shiftTypes: number[] | { id: number; title: string }[];
  locations: number[] | Location[];
}

export interface RateRulePayload {
  rate: number;
  days: string[];
  priority: number;
  level: number;
  grade?: number | null;
  shiftTypes: number[];
  locations: number[];
}

export interface UpdateRateRulePayload extends RateRulePayload {
  id: number;
}
