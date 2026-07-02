import { Reason } from "@/lib/requests/core-setup/reasons/type";
import React from "react";

interface RankDialogProps {
  open: boolean;
  onClose: () => void;
  rankDetails: Reason | null;
  setRankDetail: (value: Reason | null) => void;
}

export default function CompanyReasons() {
  return <div>company-reasons</div>;
}
