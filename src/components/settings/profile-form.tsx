"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  useGetUserProfile,
  useUpdateUserProfile,
} from "@/lib/requests/auth/auth-queries";
import { useEffect, useState } from "react";
import { useToast } from "../context/toast-context";
import { getErrorMessage } from "@/lib/error-handler";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Camera,
  Check,
  CreditCard,
  Package,
  Pencil,
  PoundSterling,
  Users,
  X,
} from "lucide-react";
import { useUser } from "../context/user-context";
import { PhoneNumberSettings } from "../common/phone-number";
import Button from "../ui/custom/custom-button";
import { Badge } from "../ui/badge";
import { Field } from "../hook-form/fields";
import { Form } from "../ui/form";

const schema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  photo: z.string().optional(),
});

type ProfileSchema = z.infer<typeof schema>;

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      photo: "",
    },
  });

  const toast = useToast();
  const { data: userProfile } = useGetUserProfile();
  const profile = userProfile?.data;

  const { mutateAsync: userProfileMut, isPending: IsUserProfileMutLoading } =
    useUpdateUserProfile();

  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const { setAvatarPhotoUrl } = useUser();

  useEffect(() => {
    if (!profile) return;

    form.reset({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      email: profile.email ?? "",
      phoneNumber: profile.phoneNumber ?? "",
      photo: profile.photo ?? "",
    });

    setPhotoUrl(profile.photo ?? "");

    if (profile.photo) {
      setAvatarPhotoUrl(profile.photo);
    }
  }, [profile, form, setAvatarPhotoUrl]);

  async function onSubmit(values: ProfileSchema) {
    try {
      await userProfileMut({ ...values, photo: photoUrl });
      form.reset({ ...values, photo: photoUrl });
      setIsEditing(false);
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  }

  function handleEditClick(e?: React.MouseEvent) {
    e?.preventDefault();
    setIsEditing(true);
  }

  function handleCancelClick(e?: React.MouseEvent) {
    e?.preventDefault();

    if (profile) {
      form.reset({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        email: profile.email ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        photo: profile.photo ?? "",
      });

      setPhotoUrl(profile.photo ?? "");
    }

    setIsEditing(false);
  }

  return (
    <div className="flex gap-4">
      <div className="w-[30%]">
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 cursor-pointer ring-4 ring-gray-100 transition-all duration-200 hover:ring-blue-300">
                  <AvatarImage
                    src={form.watch("photo")}
                    alt={`${form.watch("firstName")} ${form.watch("lastName") || "Profile photo"}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-lg font-semibold text-white">
                    {`${form.watch("firstName")?.[0]}${form.watch("lastName")?.[0] || ""}`}
                  </AvatarFallback>
                </Avatar>

                <div
                  className="absolute inset-0 flex cursor-pointer items-center justify-center"
                  onClick={() => {}}
                >
                  <div className="opacity-0 transition-opacity duration-200 hover:opacity-100">
                    <div className="rounded-full bg-white p-2 shadow-lg">
                      <Camera className="h-5 w-5 text-gray-700" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {`${form.watch("firstName")} ${form.watch("lastName") || ""}`}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Info Form */}
      <div className="w-[70%] space-y-4">
        <Card className="rounded-2xl shadow-lg">
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Account Owner</h2>
                  {!isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleEditClick}
                      className="flex min-w-10 items-center justify-center p-2"
                      icon={<Pencil className="h-4 w-4 text-black" />}
                    />
                  )}
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <Field.Text
                    name="firstName"
                    label="First Name"
                    placeholder="Enter first name"
                    disabled={!isEditing}
                  />
                  <Field.Text
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter last name"
                    disabled={!isEditing}
                  />
                  <Field.Text
                    type="email"
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                    disabled
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
                        disabled={!isEditing}
                      />
                    )}
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCancelClick}
                      className="flex min-w-15 items-center gap-2"
                      icon={<X className="h-4 w-4 text-black" />}
                    />

                    <Button
                      size="sm"
                      type="submit"
                      loading={IsUserProfileMutLoading}
                      disabled={IsUserProfileMutLoading}
                      className="flex min-w-15 items-center gap-2"
                      icon={<Check className="h-4 w-4 text-white" />}
                    />
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {profile?.billingDetail && (
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold">Billing Details</h2>
              </div>

              <div className="space-y-6">
                {/* Package Information */}
                <div className="rounded-lg border border-gray-200 bg-linear-to-br from-blue-50 to-purple-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-600">
                        Current Package
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700"
                    >
                      {profile.billingDetail.packageName || "N/A"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <PoundSterling className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {profile.billingDetail.packagePrice?.toLocaleString() ||
                            "0"}
                          <span className="ml-1 text-xs font-normal text-gray-500">
                            /{profile.billingDetail.packageInterval || "month"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">User Limit</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {profile.billingDetail.packageUsersLimit ||
                            "Unlimited"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Candidate Limit</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {profile.billingDetail.packageCandidatesLimit ||
                            "Unlimited"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Billing Email
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.billingDetail.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Billing Phone
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.billingDetail.phoneNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Billing Name
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.billingDetail.firstName &&
                      profile.billingDetail.lastName
                        ? `${profile.billingDetail.firstName} ${profile.billingDetail.lastName}`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Billing Address
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.billingDetail.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
