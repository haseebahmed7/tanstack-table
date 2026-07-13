"use client";

import Button from "@/components/ui/custom/custom-button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useCreateLevel,
  useGetLevelForest,
} from "@/lib/requests/core-setup/levels/api";
import { Field } from "@/components/hook-form/fields";
import { Level, LevelForest } from "@/lib/requests/core-setup/levels/types";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { NestedOption } from "@/components/hook-form/select-group-field";

const formSchema = z.object({
  title: z.string().min(1, { message: "Level is required" }),
  isGradeRequired: z.boolean().default(false).optional(),
  action: z.enum(["alternateLevel", "applySubLevel"]).optional(),
  alternateLevel: z.string().optional(),
});

const defaultValues: z.infer<typeof formSchema> = {
  title: "",
  isGradeRequired: false,
  action: undefined,
  alternateLevel: undefined,
};

interface AddLevelDialogProps {
  open: boolean;
  onClose: () => void;
  parent?: number | null;
}

export function AddLevelDialog({ open, onClose, parent }: AddLevelDialogProps) {
  const { mutateAsync: createLevel, isPending: isCreateLevelLoading } =
    useCreateLevel();
  const { data: levelTree = [] } = useGetLevelForest();

  const [createError, setCreateError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const action = form.watch("action");

  useEffect(() => {
    if (action !== "alternateLevel") {
      form.setValue("alternateLevel", undefined);
    }
  }, [action, form]);

  useEffect(() => {
    if (!open) {
      setCreateError(null);
    }
  }, [open]);

  useEffect(() => {
    if (createError && open) {
      form.clearErrors("action");
    }
  }, [createError, open, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (createError || values.action) {
        if (!values.action) {
          form.setError("action", {
            type: "manual",
            message: "Please select an action",
          });
          return;
        }

        if (values.action === "alternateLevel" && !values.alternateLevel) {
          form.setError("alternateLevel", {
            type: "manual",
            message: "Please select alternate level",
          });

          return;
        }
      }

      const payload: Level = {
        title: values.title,
        parent: parent ?? null,
        isGradeRequired: values.isGradeRequired ?? false,

        ...(values.action === "alternateLevel" &&
          values.alternateLevel && {
            alternateLevel: Number(values.alternateLevel),
            applySubLevel: false,
          }),

        ...(values.action === "applySubLevel" && {
          applySubLevel: true,
        }),
      };

      await createLevel(payload);

      form.reset(defaultValues);

      setCreateError(null);

      onClose();
    } catch (error: any) {
      setCreateError(error.message);
    }
  };

  const handleClose = () => {
    form.reset(defaultValues);
    onClose();
  };

  const transformLevelToOptions = (
    apiData: LevelForest | any,
  ): NestedOption[] => {
    if (!apiData) return [];

    // Handle wrapped response structure (e.g., { results: [...] })
    const dataArray = Array.isArray(apiData)
      ? apiData
      : apiData.results || apiData.data || [];

    if (!Array.isArray(dataArray) || dataArray.length === 0) return [];

    return dataArray.map((item) => ({
      value: item.id.toString(),
      label: item.title,
      is_grade_required: item.isGradeRequired,
      children: transformLevelToOptions(item.children || []),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{parent ? "Add Sub Level" : "Add Level"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {createError && (
              <Alert className="border-blue-500 bg-blue-50 text-blue-800">
                <Info className="h-4 w-4" />

                <AlertDescription>{createError}</AlertDescription>
              </Alert>
            )}

            {createError && (
              <Field.RadioGroup
                name="action"
                label="Action"
                direction="vertical"
                options={[
                  {
                    value: "alternateLevel",
                    label: "Apply alternate level as substitute",
                  },
                  {
                    value: "applySubLevel",
                    label: "Apply new sub-level as substitute",
                  },
                ]}
              />
            )}

            {createError && action === "alternateLevel" && (
              <Field.NestedSelect
                name="alternateLevel"
                label="Alternate Level"
                options={transformLevelToOptions(levelTree)}
              />
            )}

            <Field.Text
              name="title"
              label="Title"
              placeholder="Enter level title"
            />

            <Field.Switch
              name="isGradeRequired"
              label="Is Salary Band Required?"
              description="If enabled, a salary band must be assigned to this level."
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>

              <Button type="submit" loading={isCreateLevelLoading}>
                {parent ? "Create Sub Level" : "Create Level"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
