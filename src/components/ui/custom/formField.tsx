import { ReactNode } from "react";
import { Label } from "../label";
import { FieldError } from "react-hook-form";

type Props = {
  label: string;
  error?: FieldError;
  required?: boolean;
  children: ReactNode;
};

export default function FormField({ label, error, required, children }: Props) {
  return (
    <div className="space-y-1">
      <Label className="font-semibold [&>span]:font-normal">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error?.message && (
        <p className="text-red-500 text-sm">{error.message}</p>
      )}
    </div>
  );
}
