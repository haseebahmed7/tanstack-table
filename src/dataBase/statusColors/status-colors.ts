export const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-[#FFF6E5]", text: "text-[#854d0e]" },
  booked: { bg: "bg-[#e0f2fe]", text: "text-[#075985]" },
  worked: { bg: "bg-[#dbfce7]", text: "text-[#166630]" },
  cancelled: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  declined: { bg: "bg-[#F3E8FF]", text: "text-[#6E25C7]" },
  not_assigned: { bg: "bg-[#FFE0EB]", text: "text-[#C6005C]" },
  time_out: { bg: "bg-[#81F7F5]", text: "text-[#065958]" },
  not_attended: { bg: "bg-[#DBEAFF]", text: "text-[#1072FF]" },
  invitation: { bg: "bg-[#91E9E6]", text: "text-[#156664]" },
};
