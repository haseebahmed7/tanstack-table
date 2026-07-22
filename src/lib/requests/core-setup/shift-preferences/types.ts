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

export interface ShiftNotAttended {
  status: string;
  shiftId?: number;
}

export type ShiftTypePayload = Omit<ShiftType, "id">;
export type UpdateShiftTypePayload = ShiftType;

export interface TimeoutRule {
  id: number;
  shiftStartsWithin: string | null;
  timeoutAfterShiftCreate: string;
}

export interface TimeoutRuleResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TimeoutRule[];
}

export interface TimeoutRulePayload {
  shiftStartsWithin?: string | null;
  timeoutAfterShiftCreate: string;
}

export interface UpdateTimeoutRulePayload {
  id: number;
  shiftStartsWithin?: string | null;
  timeoutAfterShiftCreate: string;
}
