export const ShiftStatus = {
  OPEN: "open",
  PENDING: "pending",
  BOOKED: "booked",
  WORKED: "worked",
  CANCELLED: "cancelled",
  DECLINED: "declined",
  NOT_ASSIGNED: "not_assigned",
  TIMED_OUT: "timed_out",
  NOT_ATTENDED: "not_attended",
  INVITATION: "invitation",
} as const;

export type ShiftStatus = (typeof ShiftStatus)[keyof typeof ShiftStatus];

export const statusBadgeClasses = {
  [ShiftStatus.OPEN]: "bg-[#FFE7CB] text-[#bd6203]",
  [ShiftStatus.PENDING]: "bg-[#fff6e5] text-[#9e5f00]",
  [ShiftStatus.BOOKED]: "bg-[#e0f2fe] text-[#075985]",
  [ShiftStatus.WORKED]: "bg-[#dbfce7] text-[#166630]",
  [ShiftStatus.CANCELLED]: "bg-[#fee2e2] text-[#991b1b]",
  [ShiftStatus.DECLINED]: "bg-[#F3E8FF] text-[#6E25C7]",
  [ShiftStatus.NOT_ASSIGNED]: "bg-[#ffe0eb] text-[#C6005C]",
  [ShiftStatus.TIMED_OUT]: "bg-[#81F7F5] text-[#065958]",
  [ShiftStatus.NOT_ATTENDED]: "bg-[#DBEAFF] text-[#1072FF]",
  [ShiftStatus.INVITATION]: "bg-[#91E9E6] text-[#156664]",
};

export const getStatusLabel = (status: ShiftStatus) => {
  const labels = {
    [ShiftStatus.OPEN]: "Open",
    [ShiftStatus.PENDING]: "Pending",
    [ShiftStatus.BOOKED]: "Booked",
    [ShiftStatus.WORKED]: "Worked",
    [ShiftStatus.CANCELLED]: "Cancelled",
    [ShiftStatus.DECLINED]: "Declined",
    [ShiftStatus.NOT_ASSIGNED]: "Not Assigned",
    [ShiftStatus.TIMED_OUT]: "Timed Out",
    [ShiftStatus.NOT_ATTENDED]: "Not Attended",
    [ShiftStatus.INVITATION]: "Invitation",
  };
  return labels[status] || status;
};

export const ShiftStatusOptions = (Object.values(ShiftStatus) as string[])
  // Exclude client-only OPEN pseudo-status from server filters
  .filter((value) => value !== ShiftStatus.OPEN)
  .map((value) => ({
    value,
    label: getStatusLabel(value as ShiftStatus),
  }));

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

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  // PREFER_NOT_SAY = 'prefer_not_say',
}

export const GenderLabels: Record<Gender, string> = {
  [Gender.MALE]: "Male",
  [Gender.FEMALE]: "Female",
  // [Gender.PREFER_NOT_SAY]: 'Prefer Not Say',
};

export const GenderOptions = Object.values(Gender).map((value) => ({
  value,
  label: GenderLabels[value],
}));
