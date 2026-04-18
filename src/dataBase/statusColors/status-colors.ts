export const statusColors: Record<string, { bg: string; text: string }> = {
  Worked: { bg: "bg-[#dbfce7]", text: "text-[#166630]" }, // green
  Pending: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" }, // yellow
  Booked: { bg: "bg-[#e0f2fe]", text: "text-[#075985]" }, // blue
  Cancelled: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" }, // red
  Decline: { bg: "bg-[#ffedd5]", text: "text-[#9a3412]" }, // orange
  "Not Assigned": { bg: "bg-[#f1f5f9]", text: "text-[#334155]" }, // gray
  "Not Attended": { bg: "bg-[#fce7f3]", text: "text-[#9d174d]" }, // pink
};
