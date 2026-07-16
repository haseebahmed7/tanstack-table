export interface ShiftType {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakDuration: number;
  isBreakDurationIncludedInCost?: boolean;
}

export interface ShiftTypeResponse {
  count: number;
  results: ShiftType[];
}
