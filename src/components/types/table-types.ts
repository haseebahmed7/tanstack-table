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

export type Candidate = {
  id: string;
  name: string;
  level: string;
  location: { title: string };
  rankTitle: string;
  rankScore: string;
  availability: string;
  status: string;
  documents: string;
  reason?: string;
  details?: string;
  reporting?: string;
};
