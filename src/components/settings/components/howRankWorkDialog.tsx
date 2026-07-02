"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HelpCircle, TrendingUp, TrendingDown } from "lucide-react";

interface HowRanksWorkDialogProps {
  open: boolean;
  onClose: () => void;
}

interface PointRuleProps {
  action: string;
  description: string;
  points: number;
  type: "positive" | "negative";
}

const POINT_RULES: PointRuleProps[] = [
  {
    action: "Completed shift",
    description: "Candidate completes and attends the shift",
    points: 200,
    type: "positive",
  },
  {
    action: "Timeout",
    description: "Candidate doesn't respond in time when shift is offered",
    points: -30,
    type: "negative",
  },
  {
    action: "Decline a shift",
    description: "Candidate declines when offered a shift",
    points: -50,
    type: "negative",
  },
  {
    action: "Cancel a shift",
    description: "Candidate cancels after accepting a shift",
    points: -100,
    type: "negative",
  },
  {
    action: "Not attended",
    description: "Candidate does not show up for a booked shift",
    points: -100,
    type: "negative",
  },
];

export function HowRanksWorkDialog({ open, onClose }: HowRanksWorkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <HelpCircle className="text-primary h-5 w-5" />
            How Ranks Work
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Ranks help you recognise and reward reliable candidates. Each
            candidate has a <strong>rank score</strong> that changes based on
            their shift activity. Higher scores unlock higher ranks. You can
            define custom ranks with minimum score thresholds – use the Add Rank
            and Edit buttons to configure them.
          </p>

          <div>
            <h4 className="mb-3 font-medium">Points by Action</h4>
            <div className="space-y-2">
              {POINT_RULES.map((rule, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">{rule.action}</p>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                      {rule.description}
                    </p>
                  </div>
                  <div
                    className={`flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 font-semibold ${
                      rule.type === "positive"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {rule.type === "positive" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>
                      {rule.points > 0 ? "+" : ""}
                      {rule.points}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
            <h4 className="mb-2 font-medium text-blue-900">
              Want to amend ranks?
            </h4>
            <p className="text-sm text-blue-800">
              Use the <strong>Add Rank</strong> button to create new ranks, or
              click the edit icon on an existing rank to change its name,
              minimum score, or icon. Ranks are ordered by minimum score –
              candidates are assigned the highest rank whose minimum score they
              meet or exceed.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
