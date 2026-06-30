"use client";

import { useState } from "react";
import { Location } from "../types/core-setup-types";

type OnDeleteFn = (id: number) => Promise<any>;

export function useConfirmDelete(onDelete: OnDeleteFn) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Location | null>(null);

  const askDelete = (row: Location) => {
    setSelected(row);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setSelected(null);
  };

  const confirm = async () => {
    if (!selected) return;

    await onDelete(selected.id);
    close();
  };

  return {
    open,
    askDelete,
    close,
    confirm,
    selected,
  };
}
