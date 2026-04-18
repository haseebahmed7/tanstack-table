export type Shift = {
  id: string;
  shiftType: string;
  location: { title: string };
  date: string;
  startDatetime: string;
  endDatetime: string;
  level: string;
  status: string;
  candidate: { fullName: string };
  reason?: string;
  details?: string;
  reporting?: string;
  isAutomated: boolean;
};
