export const ReasonTypeChoices = {
  COMPANY_DOCUMENT_REJECTED: "document_rejected",
  COMPANY_SHIFT_CANCELLED: "shift_cancelled_client",
  COMPANY_SHIFT_REASON: "shift_reason",
  CANDIDATE_SHIFT_CANCELLED: "shift_cancelled_candidate",
  CANDIDATE_SHIFT_DECLINED: "shift_declined",
  CANDIDATE_SHIFT_REPORT_REASON: "shift_report_reason",
} as const;

export type ReasonType =
  (typeof ReasonTypeChoices)[keyof typeof ReasonTypeChoices];

export interface Reason {
  id?: number;
  message: string;
  type: ReasonType;
}
export interface ReasonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Reason[];
}
