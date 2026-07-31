export const WorkingType = {
  PERMANENT: "permanent",
  NON_PERMANENT: "non_permanent",
} as const;

export type WorkingType = (typeof WorkingType)[keyof typeof WorkingType];

export const workingTypeBadgeClasses = {
  [WorkingType.PERMANENT]: "bg-blue-100 text-blue-800",
  [WorkingType.NON_PERMANENT]: "bg-purple-100 text-purple-800",
};

export const getWorkingTypeLabel = (workingType: WorkingType) => {
  const labels = {
    [WorkingType.PERMANENT]: "Permanent",
    [WorkingType.NON_PERMANENT]: "Non-Permanent",
  };
  return labels[workingType] || workingType;
};

export const workingTypeOptions = Object.values(WorkingType).map(
  (workingType) => ({
    label: getWorkingTypeLabel(workingType),
    value: workingType,
  }),
);
