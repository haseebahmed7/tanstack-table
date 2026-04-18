export const shiftTypes = ["Morning Shift", "Evening Shift", "Night Shift"];
export const locations = ["Lahore", "Karachi", "Islamabad", "Multan"];
export const shiftTimings = {
  "Morning Shift": { start: "09:00 AM", end: "05:00 PM" },
  "Evening Shift": { start: "05:00 PM", end: "01:0 AM" },
  "Night Shift": { start: "01:00 AM", end: "09:00 AM" },
};
export const levels = [
  "MRI",
  "CT",
  "General",
  "X-Ray",
  "Ultrasound",
  "Lab",
  "Pharmacy",
  "Cardiology",
  "Emergency",
];
export const statuses = [
  "Pending",
  "Booked",
  "Worked",
  "Cancelled",
  "Decline",
  "Not Assigned",
  "Not Attended",
];
export const names = [
  "Ali Khan",
  "Sara Ali",
  "Usman Shah",
  "Hina Khan",
  "Bilal Ahmed",
  "Ayesha Iqbal",
  "Zain Malik",
  "Fatima Noor",
  "Omar Farooq",
  "Sadia Rehman",
  "Hassan Tariq",
  "Michael",
  "Ahmed Raza",
];

export const shiftData = [
  // Fixed original entries
  ...Array.from({ length: 100 }, (_, i) => {
    const idNum = i + 1;

    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const day = String(1 + (i % 30)).padStart(2, "0");

    return {
      id: `REQ-${String(idNum).padStart(3, "0")}`,
      shiftType: random(shiftTypes),
      location: { title: random(locations) },
      date: `${day}-04-2026`,
      startDatetime: `${String(6 + (i % 12)).padStart(2, "0")}:00:00`,
      endDatetime: `${String((14 + (i % 12)) % 24).padStart(2, "0")}:00:00`,
      level: random(levels),
      status: random(statuses),
      isAutomated: Math.random() < 0.5,
      candidate: { fullName: random(names) },
    };
  }),
];
