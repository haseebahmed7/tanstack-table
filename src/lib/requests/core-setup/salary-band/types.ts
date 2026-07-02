export interface Grade {
  id: number;
  title: string;
}

export interface GradeResponse {
  count: number;
  results: Grade[];
}
