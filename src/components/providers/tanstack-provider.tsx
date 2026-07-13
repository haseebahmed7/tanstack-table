"use client";

import { ToastService } from "@/lib/toast/toast-service";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      ToastService.show(error.message, {
        type: "error",
      });
    },
  }),
});

export const TanstackProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
