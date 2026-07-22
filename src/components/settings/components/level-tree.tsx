"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  Banknote,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useUpdateLevel } from "@/lib/requests/core-setup/levels/api";
import { LevelTree as LevelTreeType } from "@/lib/requests/core-setup/levels/types";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button"; // shadcn/default UI button
import CustomButton from "@/components/ui/custom/custom-button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field } from "@/components/hook-form/fields";
import RateRuleDialog from "./dialogs/add-rate-rule-dialog";

type LevelTreeProps = {
  levels: LevelTreeType[];
  onDelete?: (level: LevelTreeType) => void;
  onAdd: (parentId: number) => void;
  onRateRule?: (level: LevelTreeType) => void;
};

export default function LevelTreeTable({
  levels,
  onDelete,
  onAdd,
  onRateRule,
}: LevelTreeProps) {
  const [rateRuleLevel, setRateRuleLevel] = useState<LevelTreeType | null>(
    null,
  );
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const handleRateRule = (level: LevelTreeType) => {
    setRateRuleLevel(level);
  };

  return (
    <>
      <TableBody>
        {levels.map((level: LevelTreeType) => (
          <LevelRow
            key={level.id}
            level={level}
            expanded={expanded}
            toggleExpand={toggleExpand}
            onDelete={(level) => onDelete?.(level)}
            onAdd={onAdd}
            onRateRule={handleRateRule}
          />
        ))}
      </TableBody>
      {rateRuleLevel && (
        <RateRuleDialog
          open={!!rateRuleLevel}
          onClose={() => setRateRuleLevel(null)}
          levelId={rateRuleLevel.id}
          levelTitle={rateRuleLevel.title}
          isGradeRequired={rateRuleLevel.isGradeRequired}
        />
      )}
    </>
  );
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Level is required.",
  }),
  isGradeRequired: z.boolean().default(false).optional(),
});

type LevelRowProps = {
  level: LevelTreeType;
  depth?: number;
  expanded: Set<number>;
  toggleExpand: (id: number) => void;
  onDelete: (level: LevelTreeType) => void;
  onAdd: (parentId: number) => void;
  onRateRule: (level: LevelTreeType) => void;
};
function LevelRow({
  level,
  depth = 0,
  expanded,
  toggleExpand,
  onDelete,
  onAdd,
  onRateRule,
}: LevelRowProps) {
  const hasChildren = !!level.children && level.children.length > 0;
  const isExpanded = expanded.has(level.id);
  const [isEditing, setIsEditing] = useState(false);

  const { mutateAsync: updateLevel, isPending: isUpdateLevelLoading } =
    useUpdateLevel();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: level.title,
      isGradeRequired: level.isGradeRequired,
    },
  });

  const resetForm = () => {
    form.reset({
      title: level.title,
      isGradeRequired: level.isGradeRequired,
    });
  };

  const handleEdit = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  const handleEditSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateLevel({
        id: level.id,
        title: values.title,
        isGradeRequired: level.isGradeRequired,
        parent: level.parent,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update level:", error);
    }
  };

  return (
    <>
      {isEditing ? (
        <TableRow>
          <TableCell colSpan={4} className="p-3">
            <div className="rounded-2xl border p-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleEditSubmit)}
                  className="space-y-5"
                >
                  <Field.Text name="title" label="Title" />

                  <div className="flex justify-end gap-2">
                    <CustomButton
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </CustomButton>

                    <CustomButton type="submit" loading={isUpdateLevelLoading}>
                      Update
                    </CustomButton>
                  </div>
                </form>
              </Form>
            </div>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          {/* Level */}
          <TableCell>
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: `${depth * 24}px` }}
            >
              {hasChildren ? (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => toggleExpand(level.id)}
                >
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </Button>
              ) : (
                <div className="w-7" />
              )}

              <span className="text-[16px]">{level.title}</span>
            </div>
          </TableCell>

          {/* Salary Band */}
          <TableCell>
            {!hasChildren && (
              <Switch
                checked={level.isGradeRequired}
                className="cursor-not-allowed"
                disabled
              />
            )}
          </TableCell>

          {/* Rate Rule */}
          <TableCell>
            {!hasChildren && (
              <CustomButton
                icon={<Banknote className="h-4 w-4" />}
                onClick={() => onRateRule(level)}
                className="ml-4 flex h-8 w-8 items-center justify-center"
              />
            )}
          </TableCell>

          {/* Actions */}
          <TableCell>
            <div className="flex justify-end gap-2">
              {depth < 2 && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onAdd(level.id)}
                >
                  <Plus size={16} />
                </Button>
              )}

              <Button size="icon" variant="outline" onClick={handleEdit}>
                <Pencil size={16} />
              </Button>

              {!hasChildren && (
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    console.log("Row level", level);
                    onDelete(level);
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}

      {hasChildren &&
        isExpanded &&
        level.children?.map((child) => (
          <LevelRow
            key={child.id}
            level={child}
            depth={depth + 1}
            expanded={expanded}
            toggleExpand={toggleExpand}
            onDelete={onDelete}
            onAdd={onAdd}
            onRateRule={onRateRule}
          />
        ))}
    </>
  );
}
