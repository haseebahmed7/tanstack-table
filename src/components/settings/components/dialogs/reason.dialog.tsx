"use client";

import { useToast } from "@/components/context/toast-context";
import { Field } from "@/components/hook-form/fields";
import Button from "@/components/ui/custom/custom-button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { getErrorMessage, getSuccessMessage } from "@/lib/error-handler";
import {
  useCreateReason,
  useUpdateReason,
} from "@/lib/requests/core-setup/reasons/api";
import {
  Reason,
  ReasonTypeChoices,
} from "@/lib/requests/core-setup/reasons/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  id: z.number().optional(),
  message: z.string().min(1, { message: "Reason message is required" }),
  type: z.string().min(1, { message: "Reason type is required" }),
});

const defaultValues = {
  message: "",
  type: "",
};

const reasonTypeOptions = Object.entries(ReasonTypeChoices).map(
  ([key, value]) => {
    const formattedLabel = key
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const labelWithDash = formattedLabel.replace(/^(\w+)\s+/, "$1 - ");
    return {
      value,
      label: labelWithDash,
    };
  },
);

interface ReasonDialogProps {
  open: boolean;
  onClose: () => void;
  reasonDetail?: Reason | null;
  setReasonDetail?: (reason: Reason | null) => void;
  defaultType?: string;
  disabledType?: boolean;
}

export default function AddReasonDialog({
  open,
  onClose,
  reasonDetail,
  setReasonDetail,
  defaultType,
  disabledType,
}: ReasonDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutateAsync: createReasonMut, isPending: isCreateReasonLoading } =
    useCreateReason();
  const { mutateAsync: updateReasonMut, isPending: isUpdateReasonLoading } =
    useUpdateReason();

  const toast = useToast();

  // Cleanup when dialog closes
  const handleClose = () => {
    form.reset(defaultValues);
    onClose();
    setReasonDetail?.(null);
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (values.id) {
        const update = await updateReasonMut({
          id: values.id,
          message: values.message,
          type: values.type,
        });
        toast.success(getSuccessMessage(update));
      } else {
        const create = await createReasonMut({
          message: values.message,
          type: values.type,
        });
        toast.success(getSuccessMessage(create));
      }
      handleClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  // Reset form when dialog opens with reason details
  useEffect(() => {
    if (open && reasonDetail) {
      form.reset({
        id: reasonDetail.id,
        message: reasonDetail.message,
        type: reasonDetail.type,
      });
    } else if (open) {
      form.reset({ ...defaultValues, type: defaultType || defaultValues.type });
    }
  }, [open, reasonDetail, form, defaultType]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {reasonDetail?.id ? "Edit Reason" : "Add Reason"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <Field.Select
                key={`type-${reasonDetail?.id || "new"}`}
                name="type"
                label="Reason Type"
                placeholder="Select reason type"
                options={reasonTypeOptions}
                required
                disabled={disabledType}
              />

              <Field.Textarea
                key={`message-${reasonDetail?.id || "new"}`}
                name="message"
                label="Reason Message"
                placeholder="Enter reason message"
                maxlength={100}
                required
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isCreateReasonLoading || isUpdateReasonLoading}
                >
                  {reasonDetail?.id ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
