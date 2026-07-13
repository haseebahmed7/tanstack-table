import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Grade } from "@/lib/requests/core-setup/salary-band/types";
import {
  useCreateGrade,
  useUpdateGrade,
} from "@/lib/requests/core-setup/salary-band/api";
import { Field } from "@/components/hook-form/fields";
import Button from "@/components/ui/custom/custom-button";

interface AddGradeDialogProps {
  open: boolean;
  onClose: () => void;
  gradeDetail?: Grade | null;
  setGradeDetail: (value: Grade | null) => void;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Salary Band name is required.",
  }),
});
const defaultValues = {
  title: "",
};

export function AddGradeDialog({
  open,
  onClose,
  gradeDetail,
  setGradeDetail,
}: AddGradeDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutateAsync: createGrade, isPending: IscreateGradeLoading } =
    useCreateGrade();
  const { mutateAsync: updateGrade, isPending: IsUpdateGradeLoading } =
    useUpdateGrade();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (gradeDetail?.id) {
        await updateGrade({ id: gradeDetail.id, title: values.title });
        form.reset(defaultValues);
        setGradeDetail(null);
        onClose();
        return;
      }
      await createGrade(values);
      form.reset(defaultValues);
      setGradeDetail(null);
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (gradeDetail?.id) {
      form.reset({
        title: gradeDetail.title,
      });
    }
  }, [gradeDetail, form]);

  const loading = IscreateGradeLoading || IsUpdateGradeLoading;
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {gradeDetail?.id ? "Edit Salary Band" : "Add Salary Band"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Field.Text name="title" label="Name" />

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  form.reset(defaultValues);
                  setGradeDetail(null);
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                loading={loading}
                disabled={loading}
              >
                {gradeDetail?.id ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
