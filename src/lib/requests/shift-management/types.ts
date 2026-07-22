export interface ShiftNotAttended {
  status: string;
  shiftId?: number;
}

export type ShiftNotAttendedPayload = ShiftNotAttended;

export type ShiftCancelPayload = {
  shiftId?: number;
  cancellationReason: number;
  cancellationReasonInfo: string;
};

export type ShiftDeclinePayload = {
  shiftId: number;
  declineReason?: number;
  declineReasonInfo?: string;
};
