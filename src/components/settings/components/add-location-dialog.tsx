"use client";
import { Field } from "@/components/hook-form/fields";

import { MapPin } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useCallback, useEffect, useState } from "react";
import { PhoneNumberSettings } from "@/components/phone-number";
import { GoogleMapsProvider } from "@/components/providers/google-map-provider";
import {
  useCreateLocation,
  useUpdateLocation,
} from "@/lib/requests/company/api";
import { LatLng, Location, PlaceDetails } from "@/lib/requests/company/types";
import { useToast } from "@/components/context/toast-context";
import { getErrorMessage, getSuccessMessage } from "@/lib/error-handler";
import Button from "@/components/ui/custom/custom-button";
import { AddressAutocomplete } from "./address-autocomplete";
import { MapWithMarker } from "./map-with-marker";

const formSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(1, { message: "Location Title / Site Name is required" }),
  address: z.string().min(1, { message: "Address Line 1 is required" }),
  additionalInfo: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().min(1, { message: "Postal Code / ZIP Code is required" }),
  country: z.string().optional(),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});
type LocationForm = z.infer<typeof formSchema>;

const defaultValues: z.infer<typeof formSchema> = {
  title: "",
  address: "",
  additionalInfo: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  phoneNumber: "",
  latitude: null,
  longitude: null,
};

interface LocationDrawerProps {
  open: boolean;
  onClose: () => void;
  locationDetail?: Location | null;
  setLocationDetail?: (loc: Location | null) => void;
}
export default function AddLocationDialog({
  open,
  onClose,
  locationDetail,
  setLocationDetail,
}: LocationDrawerProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutateAsync: createLocation, isPending: isCreateLoading } =
    useCreateLocation();
  const { mutateAsync: updateLocation, isPending: isUpdateLoading } =
    useUpdateLocation();

  const [mapCenter, setMapCenter] = useState<LatLng | null>(null);

  const toast = useToast();

  const handlePlaceSelect = useCallback(
    (details: PlaceDetails) => {
      setMapCenter({ lat: details.lat, lng: details.lng });
      form.setValue("latitude", details.lat, { shouldValidate: true });
      form.setValue("longitude", details.lng, { shouldValidate: true });
      if (details.postalCode)
        form.setValue("zipCode", details.postalCode, { shouldValidate: true });
      if (details.city)
        form.setValue("city", details.city, { shouldValidate: true });
      if (details.state)
        form.setValue("state", details.state, { shouldValidate: true });
      if (details.country)
        form.setValue("country", details.country, { shouldValidate: true });
    },
    [form],
  );

  const handleMarkerPositionChange = useCallback(
    (
      lat: number,
      lng: number,
      address: string,
      details: {
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
      },
    ) => {
      form.setValue("address", address, { shouldValidate: true });
      form.setValue("latitude", lat, { shouldValidate: true });
      form.setValue("longitude", lng, { shouldValidate: true });
      if (details.postalCode)
        form.setValue("zipCode", details.postalCode, { shouldValidate: true });
      if (details.city)
        form.setValue("city", details.city, { shouldValidate: true });
      if (details.state)
        form.setValue("state", details.state, { shouldValidate: true });
      if (details.country)
        form.setValue("country", details.country, { shouldValidate: true });
      setMapCenter({ lat, lng });
    },
    [form],
  );

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const basePayload = {
        title: values.title,
        address: values.address,
        additionalInfo: values.additionalInfo || null,
        city: values.city || null,
        state: values.state || null,
        country: values.country || null,
        zipCode: values.zipCode || null,
        phoneNumber: values.phoneNumber,
        latitude: values.latitude ?? null,
        longitude: values.longitude ?? null,
      };
      if (values.id != null) {
        const editRespone = await updateLocation({
          id: values.id,
          data: basePayload,
        });
        toast.success(getSuccessMessage(editRespone));
      } else {
        const createRespone = await createLocation(basePayload);
        toast.success(getSuccessMessage(createRespone));
      }
      form.reset(defaultValues);
      onClose();
      setLocationDetail?.(null);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const handleClose = () => {
    setTimeout(() => {
      form.reset(defaultValues);
      // setMapCenter(null);
      setLocationDetail?.(null);
    }, 200);
    onClose();
  };

  useEffect(() => {
    if (open && locationDetail) {
      form.reset({
        id: locationDetail.id,
        title: locationDetail.title,
        address: locationDetail.address,
        additionalInfo: locationDetail.additionalInfo ?? "",
        city: locationDetail.city ?? "",
        state: locationDetail.state ?? "",
        country: locationDetail.country ?? "",
        zipCode: locationDetail.zipCode ?? "",
        phoneNumber: locationDetail.phoneNumber,
        latitude: locationDetail.latitude ?? null,
        longitude: locationDetail.longitude ?? null,
      });
      if (locationDetail.latitude != null && locationDetail.longitude != null) {
        setMapCenter({
          lat: locationDetail.latitude,
          lng: locationDetail.longitude,
        });
      } else {
        setMapCenter(null);
      }
    } else if (open) {
      form.reset(defaultValues);
      setMapCenter(null);
    }
  }, [open, locationDetail, form]);

  return (
    <Drawer
      direction="right"
      open={open}
      onOpenChange={(value) => !value && handleClose()}
      handleOnly
    >
      <DrawerContent className="max-w-none!">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="h-5 w-5 text-primary" strokeWidth={2} />
            {locationDetail?.id ? "Edit Location" : "Add Location"}
          </DrawerTitle>
        </DrawerHeader>
        <GoogleMapsProvider>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="p-4 space-y-4">
                <Field.Text
                  name="title"
                  label="Title / Site Name"
                  placeholder="e.g. Main Campus"
                  required
                />
                <Controller
                  name="address"
                  control={form.control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <AddressAutocomplete
                      value={value}
                      onChange={onChange}
                      onPlaceSelect={handlePlaceSelect}
                      label="Address Line 1"
                      placeholder="Search address..."
                      required
                      disabled={isCreateLoading || isUpdateLoading}
                      error={error?.message}
                    />
                  )}
                />
                <Field.Text
                  name="additionalInfo"
                  label="Address Line 2"
                  placeholder="Suit, unit, building, floor, etc."
                />
                <div className="grid grid-cols-3 gap-2 items-start">
                  <Field.Text
                    name="city"
                    label="City / Locality"
                    placeholder="e.g. London"
                  />
                  <Field.Text
                    name="state"
                    label="State / Province / Region"
                    placeholder="e.g. California"
                  />
                  <Field.Text
                    name="zipCode"
                    label="Postal Code / Zip Code"
                    placeholder="e.g. 12345"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 items-start">
                  <Field.Text
                    name="country"
                    label="Country"
                    placeholder="e.g. United Kingdom"
                  />
                  <Controller
                    name="phoneNumber"
                    control={form.control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <PhoneNumberSettings
                        value={value}
                        onChange={onChange}
                        error={error?.message}
                        required
                      />
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
          <div className="mt-4 px-0">
            <MapWithMarker
              center={mapCenter}
              onMarkerPositionChange={handleMarkerPositionChange}
              className="w-full"
              height={450}
            />
          </div>
        </GoogleMapsProvider>

        <DrawerFooter className="gap-2 border-t sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isCreateLoading || isUpdateLoading}>
            {locationDetail?.id ? "Update" : "Create"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
