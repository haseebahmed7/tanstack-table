import { apiRequest } from "@/lib/api-request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ToastService } from "@/lib/toast/toast-service";
import { getSuccessMessage } from "@/lib/error-handler";
import {
  ShiftAmendTimePayload,
  ShiftCancelPayload,
  ShiftDeclinePayload,
  ShiftParams,
  ShiftPayload,
  ShiftResponse,
} from "./types";
import { fDate, formatStr } from "@/lib/format-date";
import { Shift } from "@/components/types/table-types";
// export const useGetShifts = ({
//   status,
//   searchKey,
//   type,
//   levels,
//   locations,
//   date,
//   page,
//   pageSize,
//   candidate,
//   ...extraParams
// }: ShiftParams) => {
//   let levelsParam: number[] | string | undefined;
//   if (levels) {
//     if (typeof levels === "string" && levels.includes(",")) {
//       levelsParam = levels;
//     } else if (Array.isArray(levels)) {
//       levelsParam = levels.map((l) =>
//         typeof l === "string" ? Number(l) : Number(l),
//       );
//     } else {
//       levelsParam =
//         typeof levels === "string" ? [Number(levels)] : [levels as number];
//     }
//   }

//   let locationsParam: number[] | string | undefined;
//   if (locations) {
//     if (typeof locations === "string" && locations.includes(",")) {
//       locationsParam = locations;
//     } else if (Array.isArray(locations)) {
//       locationsParam = locations.map((l) =>
//         typeof l === "string" ? Number(l) : Number(l),
//       );
//     } else {
//       locationsParam =
//         typeof locations === "string"
//           ? [Number(locations)]
//           : [locations as number];
//     }
//   }

//   const dateRange =
//     typeof date === "object" && date !== null && "from" in date
//       ? (date as { from: Date | string; to?: Date | string })
//       : null;

//   const params = {
//     candidate,
//     searchKey,
//     status,
//     type,
//     levels: levelsParam,
//     locations: locationsParam,
//     page,
//     pageSize,
//     ...extraParams,
//     ...(dateRange?.from && {
//       dateAfter: fDate(dateRange.from, formatStr.date),
//       ...(dateRange.to && { dateBefore: fDate(dateRange.to, formatStr.date) }),
//     }),
//   };

//   const query = useQuery<ShiftResponse>({
//     queryKey: ["shifts", params],
//     queryFn: () => apiRequest<ShiftResponse>("get", "/shifts/", params),
//     retry: 1,
//     refetchOnWindowFocus: false,
//   });

//   return query;
// };

export const useGetShifts = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["shifts", page, pageSize],
    queryFn: () =>
      apiRequest("get", "/shifts/", {
        page,
        pageSize,
      }),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useGetShiftById = (shiftId: number | null | undefined) =>
  useQuery<Shift>({
    queryKey: ["shift-types", shiftId],
    queryFn: () => apiRequest<Shift>("get", `/shifts/${shiftId}/`),
    enabled: !!shiftId,
    retry: 1,
  });

export const useCreateShiftType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShiftPayload & Record<string, unknown>) => {
      const isBulk = payload.bulkDates;
      const path = isBulk ? "/shifts/bulk/" : "/shifts/";

      // API ko _isDirectBooking nahi bhejna
      const { _isDirectBooking, ...apiPayload } = payload;

      return apiRequest("post", path, apiPayload);
    },
    onSuccess: (data, payload) => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });

      const message = payload._isDirectBooking
        ? "Candidate booked successfully!"
        : getSuccessMessage(data);

      ToastService.show(message, {
        type: "success",
      });
    },
  });
};

export const useUpdateShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShiftPayload & Record<string, unknown>) =>
      apiRequest("put", `/shifts/${payload.id}/`, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });

      ToastService.show(getSuccessMessage(data), {
        type: "success",
      });
    },
  });
};

export const useAmendTimeShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShiftAmendTimePayload & Record<string, unknown>) =>
      apiRequest("patch", `/shifts/${payload.id}/amend_time/`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });

      ToastService.show("Shift time amended successfully!", {
        type: "success",
      });
    },
  });
};

export const useAcceptShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shiftId: number) =>
      apiRequest("post", `/shifts/${shiftId}/accept/`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });

      ToastService.show(getSuccessMessage(data), {
        type: "success",
      });
    },
  });
};

export const useCancelShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShiftCancelPayload) => {
      const { shiftId, ...rest } = payload;

      return apiRequest("post", `/shifts/${shiftId}/cancel/`, rest);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });

      ToastService.show(getSuccessMessage(data), {
        type: "success",
      });
    },
  });
};

export const useDeclineShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShiftDeclinePayload) => {
      const { shiftId, declineReason, declineReasonInfo } = payload;
      const body =
        declineReason !== undefined && declineReasonInfo !== undefined
          ? { declineReason, declineReasonInfo }
          : {};
      return apiRequest("post", `/shifts/${shiftId}/decline/`, body);
    },
    onSuccess: (_response, payload) => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });

      const message =
        payload.declineReason === undefined ||
        payload.declineReasonInfo === undefined
          ? "Shift ignored!"
          : "Shift declined!";

      ToastService.show(message, {
        type: "success",
      });
    },
  });
};
