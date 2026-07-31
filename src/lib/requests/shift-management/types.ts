import { WorkingType } from "../candidate/utils";
import { Grade } from "../core-setup/salary-band/types";
import { ShiftStatus } from "./utils";

export interface Shift {
  id: number;
  no: string;
  date: string;
  isAutomated: boolean;
  description: string;
  reportingDetails: string;
  location: ShiftLocation;
  status: ShiftStatus;
  grade: Grade;
  level: Level | string | any;
  levelHierarchy?: string[];
  gender: string | null;
  shiftType: ShiftTypeExtended | number | string | null;
  shiftTypeTitle: string;
  startDatetime: string;
  endDatetime: string;
  breakDuration: number;
  candidate: Candidate | null;
  excludedCandidates: any[];
  cancelledBy: CancelledBy | null;
  createdBy: CreatedBy | null;
  cancellationReason: Reason | null;
  cancellationReasonInfo: string;
  declineReason: Reason | null;
  declineReasonInfo: string;
  reason: Reason | null;
  isHistoric: boolean;
  timeoutAfterShiftCreate?: string;
  acceptTill?: Date | string;
  hourlyRate?: number | null;
  isHourlyRateCustom?: boolean;
  /** Total shifts on this shift's day; only set by the capped rota feed. */
  dayShiftCount?: number | null;
}

export interface ShiftLocation {
  id: number;
  created?: string;
  modified?: string;
  title: string;
  address: string;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  zipCode?: string | null;
  street?: string | null;
  buildingNumber?: string | null;
  floor?: string | null;
  apartmentNumber?: string | null;
  phoneNumber: string;
  additionalInfo?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Level {
  id: number;
  title: string;
}

export interface Candidate {
  id: number;
  fullName: string;
  photo: string;
  workingType?: WorkingType | null;
}

export interface CancelledBy {
  id: number;
  fullName: string;
  type: string;
}

export interface CreatedBy {
  id: number;
  fullName: string;
  type: string;
}

export interface Reason {
  id: number;
  message: string;
  type: string;
}

export interface ShiftPayload {
  id?: number;
  date: Date | string;
  startDate: Date | string;
  endDate: Date | string;
  bulkDates: Date[] | string[];
  isAutomated: boolean;
  description: string;
  reportingDetails: string;
  level: number;
  location: number;
  shiftType: number;
  candidate?: number;
  grade?: number;
  shiftReason?: number;
  isHistoric?: boolean;
  timeoutAfterShiftCreate?: string;
  hourlyRate?: number | null;
  isHourlyRateCustom?: boolean;
  no_candidates?: number;
  _isDirectBooking?: boolean;
}

export interface ShiftAmendTimePayload {
  startDatetime: Date | string;
  endDatetime: Date | string;
  breakDuration: number;
}

export interface ShiftTypeExtended {
  id: number;
  created?: string;
  modified?: string;
  title: string;
  startTime?: string;
  endTime?: string;
  breakDuration?: number;
  isBreakDurationIncludedInCost?: boolean;
}

export interface ShiftResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Shift[];
}

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

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type ShiftParams = Record<string, unknown> &
  PaginationParams & {
    searchKey?: string;
    status?: string;
    type?: string;
    levels?: number | number[] | string | string[];
    locations?: number | number[] | string | string[];
    date?: string | { from: Date | string; to?: Date | string };
    endDate?: string;
    candidate?: string;
  };
