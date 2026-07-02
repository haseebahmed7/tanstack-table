"use client";

import { useState } from "react";

type DeleteConfig = {
  message: string;
  action: () => Promise<any>;
};

export function useConfirmDelete() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<DeleteConfig | null>(null);

  const askDelete = (config: DeleteConfig) => {
    setConfig(config);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setConfig(null);
  };

  const confirm = async () => {
    if (!config) return;

    try {
      setLoading(true);
      await config.action();
      close();
    } finally {
      setLoading(false);
    }
  };

  return {
    open,
    loading,
    message: config?.message,
    askDelete,
    close,
    confirm,
  };
}
