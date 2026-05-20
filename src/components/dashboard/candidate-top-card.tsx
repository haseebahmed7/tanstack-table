"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CandidateTopCards(props: any) {
  const { chartTitle, solidColor, lightColor, chartValue } = props;

  return (
    <Card className={`gap-0`} style={{ backgroundColor: `${lightColor}` }}>
      <CardHeader className="px-6 pt-6">
        <CardTitle style={{ color: solidColor }}>{chartTitle}</CardTitle>
      </CardHeader>
      <CardContent className="h-20 overflow-hidden rounded-b-xl p-2">
        <h1
          className={`p-4 text-4xl font-semibold`}
          style={{ color: solidColor }}
        >
          {chartValue}
        </h1>
      </CardContent>
    </Card>
  );
}
