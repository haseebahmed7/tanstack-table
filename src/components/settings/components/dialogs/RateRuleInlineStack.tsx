"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetGrades } from "@/lib/requests/core-setup/salary-band/api";
import { useGetLocations } from "@/lib/requests/core-setup/locations/api";
import {
  useCreateRateRule,
  useUpdateRateRule,
} from "@/lib/requests/core-setup/levels/api";
import { Location } from "@/lib/requests/core-setup/locations/types";
import { Grade } from "@/lib/requests/core-setup/salary-band/types";
import { Form } from "@/components/ui/form";
import CustomButton from "@/components/ui/custom/custom-button";
import { Field } from "@/components/hook-form/fields";
import { useEffect, useState } from "react";
import {
  RateRule,
  RateRulePayload,
} from "@/lib/requests/core-setup/levels/types";
import { Trash2 } from "lucide-react";
import { useGetShiftTypes } from "@/lib/requests/core-setup/shift-preferences/api";
import { ShiftType } from "@/lib/requests/core-setup/shift-preferences/types";

const singleRateRuleSchema = z.object({
  rate: z.number().min(0, "Rate must be a positive number"),
  days: z
    .array(z.object({ day: z.string(), isAvailable: z.boolean() }))
    .refine((days) => days.some((d) => d.isAvailable), {
      message: "At least one day must be selected",
    }),
  priority: z.coerce.number().min(0),
  grade: z.string().optional().nullable(),
  shiftTypes: z.array(z.string()).min(1),
  locations: z.array(z.string()).min(1),
});

const rateRuleSchema = z.object({
  rules: z.array(singleRateRuleSchema),
});

type RateRuleFormValues = z.infer<typeof singleRateRuleSchema>;
type RateRuleForm = { rules: RateRuleFormValues[] };

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const getDays = (selected: string[] = []) =>
  DAY_ORDER.map((day) => ({
    day,
    isAvailable: selected.includes(day),
  }));

const defaultValues: RateRuleFormValues = {
  rate: 0,
  priority: 0,
  grade: null,
  shiftTypes: [],
  locations: [],
  days: getDays(),
};

interface RateRuleInlineStackProps {
  levelId: number;
  levelTitle: string;
  isGradeRequired: boolean;
  existingRulesCount: number;
  onClose: () => void;
  editingRule: RateRule | null;
}

export function RateRuleInlineStack({
  levelId,
  levelTitle,
  isGradeRequired,
  onClose,
  existingRulesCount,
  editingRule,
}: RateRuleInlineStackProps) {
  const { mutateAsync: createRateRule, isPending: isCreating } =
    useCreateRateRule();
  const { mutateAsync: updateRateRule, isPending: isUpdating } =
    useUpdateRateRule();
  const { data: shiftTypesData } = useGetShiftTypes();
  const { data: gradesData } = useGetGrades();
  const { data: locationsData } = useGetLocations();

  const form = useForm<RateRuleForm>({
    resolver: zodResolver(rateRuleSchema),
    defaultValues: {
      rules: [defaultValues],
    },
  });

  useEffect(() => {
    if (!editingRule) return;

    form.reset({
      rules: [
        {
          rate: editingRule.rate,
          priority: editingRule.priority,
          grade:
            typeof editingRule.grade === "object"
              ? editingRule.grade?.id.toString()
              : null,
          shiftTypes: editingRule.shiftTypes.map((s) =>
            typeof s === "object" ? s.id.toString() : s.toString(),
          ),
          locations: editingRule.locations.map((l) =>
            typeof l === "object" ? l.id.toString() : l.toString(),
          ),
          days: getDays(editingRule.days),
        },
      ],
    });
  }, [editingRule, form]);

  const onSubmit = async (values: RateRuleForm) => {
    try {
      await Promise.all(
        values.rules.map((rule, index) => {
          const payload: RateRulePayload = {
            level: levelId,
            rate: rule.rate,
            priority: existingRulesCount + index,
            days: rule.days.filter((d) => d.isAvailable).map((d) => d.day),
            grade: isGradeRequired
              ? rule.grade
                ? Number(rule.grade)
                : null
              : null,
            shiftTypes: rule.shiftTypes.map(Number),
            locations: rule.locations.map(Number),
          };

          if (editingRule) {
            return updateRateRule({
              id: editingRule.id,
              ...payload,
            });
          }

          return createRateRule(payload);
        }),
      );

      form.reset({
        rules: [
          {
            ...defaultValues,
            days: getDays(),
          },
        ],
      });

      onClose();
    } catch (error) {
      console.error("Failed to create rate rules:", error);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  const gradeOptions =
    gradesData?.data?.results?.map((g: Grade) => ({
      label: g.title,
      value: g.id.toString(),
    })) ?? [];

  const shiftTypeOptions =
    shiftTypesData?.data?.results?.map((s: ShiftType) => ({
      label: s.title,
      value: s.id.toString(),
    })) ?? [];

  const locationOptions =
    locationsData?.data?.results?.map((l: Location) => ({
      label: l.title,
      value: l.id.toString(),
    })) ?? [];

  const handleAddAnother = async () => {
    const isValid = await form.trigger();

    if (!isValid) {
      return;
    }

    append({
      ...defaultValues,
      days: getDays(),
      shiftTypes: [],
      locations: [],
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Top Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg">Create rate rules</h3>

              <p className="text-sm text-muted-foreground">
                Level: {levelTitle}
              </p>
            </div>

            <CustomButton
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-8 px-3"
            >
              Close
            </CustomButton>
          </div>

          {/* Rules */}
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-xl border p-6 mb-6 shadow-sm"
            >
              {/* Rule Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground font-medium">
                  Rate rule {index + 1}
                </p>

                {fields.length > 1 && (
                  <CustomButton
                    type="button"
                    variant="ghost"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </CustomButton>
                )}
              </div>

              <Field.DaySelector name={`rules.${index}.days`} label="Days" />

              <div className="mb-4">
                <Field.MultiSelectField
                  name={`rules.${index}.shiftTypes`}
                  label="Shift Types"
                  options={shiftTypeOptions}
                />
              </div>

              {isGradeRequired ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <Field.MultiSelectField
                      name={`rules.${index}.locations`}
                      label="Locations"
                      options={locationOptions}
                    />
                  </div>

                  <Field.Select
                    name={`rules.${index}.grade`}
                    label="Salary Band"
                    options={gradeOptions}
                    className="h-12"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <Field.MultiSelectField
                    name={`rules.${index}.locations`}
                    label="Locations"
                    options={locationOptions}
                  />
                </div>
              )}

              <Field.Text
                name={`rules.${index}.rate`}
                label="Rate per hour"
                type="number"
              />
            </div>
          ))}

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6">
            {editingRule ? (
              <>
                <CustomButton type="button" variant="outline" onClick={onClose}>
                  Cancel
                </CustomButton>

                <CustomButton type="submit" loading={isUpdating}>
                  Update
                </CustomButton>
              </>
            ) : (
              <>
                <CustomButton
                  type="button"
                  variant="outline"
                  onClick={handleAddAnother}
                >
                  Add Another
                </CustomButton>

                <CustomButton type="submit" loading={isCreating}>
                  Save All
                </CustomButton>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
