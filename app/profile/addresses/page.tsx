"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Home,
  Briefcase,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { customFetch } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import citiesData from "@/lib/cities";

// API Address interface
interface ApiAddress {
  createdAt: string;
  updatedAt: string;
  uuid: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  houseNumber: string;
  floorNumber: string;
  default: boolean;
}

// Extended address interface for UI compatibility
interface Address extends ApiAddress {
  id: number;
  title: string;
  recipient: string;
  phone: string;
  isDefault: boolean;
  type: "home" | "work" | "other";
}

// Form schema
const addressFormSchema = z.object({
  title: z.string().min(2, { message: "عنوان آدرس باید حداقل 2 کاراکتر باشد" }),
  recipient: z
    .string()
    .min(3, { message: "نام گیرنده باید حداقل 3 کاراکتر باشد" }),
  phone: z
    .string()
    .min(11, { message: "شماره تماس باید 11 رقم باشد" })
    .max(11, { message: "شماره تماس باید 11 رقم باشد" })
    .regex(/^09\d{9}$/, { message: "فرمت شماره تماس صحیح نیست" }),
  postalCode: z
    .string()
    .length(10, { message: "کد پستی باید 10 رقم باشد" })
    .regex(/^\d{10}$/, { message: "کد پستی باید فقط شامل اعداد باشد" }),
  province: z.string().min(2, { message: "استان را وارد کنید" }),
  city: z.string().min(2, { message: "شهر را وارد کنید" }),
  address: z.string().min(10, { message: "آدرس باید حداقل 10 کاراکتر باشد" }),
  houseNumber: z.string().optional(),
  floorNumber: z.string().optional(),
  type: z.enum(["home", "work", "other"], {
    message: "نوع آدرس را انتخاب کنید",
  }),
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

export default function AddressesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      title: "",
      recipient: "",
      phone: "",
      postalCode: "",
      province: "",
      city: "",
      address: "",
      houseNumber: "",
      floorNumber: "",
      type: "home",
      isDefault: false,
    },
  });

  const provinceOptions = useMemo(
    () => citiesData.map((item) => item.province),
    []
  );

  const selectedProvince = form.watch("province");

  const cityOptions = useMemo(() => {
    if (!selectedProvince) {
      return [];
    }
    const provinceEntry = citiesData.find(
      (item) => item.province === selectedProvince
    );
    return provinceEntry?.cities ?? [];
  }, [selectedProvince]);

  useEffect(() => {
    const currentCity = form.getValues("city");
    if (!selectedProvince) {
      if (currentCity) {
        form.setValue("city", "");
      }
      return;
    }

    if (currentCity && !cityOptions.includes(currentCity)) {
      form.setValue("city", "");
    }
  }, [selectedProvince, cityOptions, form]);

  // Fetch addresses from backend
  const fetchAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const response = await customFetch("/address");
      const data = await response.json();

      if (response.ok && data.addresses) {
        // Transform API addresses to UI format
        const transformedAddresses: Address[] = data.addresses.map(
          (apiAddress: ApiAddress, index: number) => ({
            ...apiAddress,
            id: index + 1,
            title: apiAddress.default ? "آدرس پیش‌فرض" : `آدرس ${index + 1}`,
            recipient: user?.firstName + " " + user?.lastName || "کاربر",
            phone: user?.phone || "",
            isDefault: apiAddress.default,
            type: "home" as const,
          })
        );

        setAddresses(transformedAddresses);
      } else {
        toast({
          title: "خطا در دریافت آدرس‌ها",
          description: "مشکلی در دریافت آدرس‌ها رخ داد",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast({
        title: "خطا در دریافت آدرس‌ها",
        description: "مشکلی در ارتباط با سرور رخ داد",
        variant: "error",
      });
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    } else if (user) {
      fetchAddresses();
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return null;
  }

  const openAddDialog = () => {
    setIsEditing(false);
    setCurrentAddress(null);
    form.reset({
      title: "",
      recipient: "",
      phone: "",
      postalCode: "",
      province: "",
      city: "",
      address: "",
      houseNumber: "",
      floorNumber: "",
      type: "home",
      isDefault: false,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    setIsEditing(true);
    setCurrentAddress(address);
    form.reset({
      title: address.title,
      recipient: address.recipient,
      phone: address.phone,
      postalCode: address.postalCode,
      province: address.province,
      city: address.city,
      address: address.address,
      houseNumber: address.houseNumber || "",
      floorNumber: address.floorNumber || "",
      type: address.type,
      isDefault: address.isDefault,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: AddressFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing && currentAddress) {
        // Update existing address
        const response = await customFetch(`/address/${currentAddress.uuid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            province: data.province,
            city: data.city,
            address: data.address,
            postalCode: data.postalCode,
            houseNumber: data.houseNumber || "0",
            floorNumber: data.floorNumber || "0",
            default: data.isDefault,
          }),
        });

        if (response.ok) {
          toast({
            title: "آدرس ویرایش شد",
            description: "آدرس با موفقیت ویرایش شد",
          });
          fetchAddresses(); // Refresh addresses
        } else {
          throw new Error("Failed to update address");
        }
      } else {
        // Add new address
        const response = await customFetch("/address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            province: data.province,
            city: data.city,
            address: data.address,
            postalCode: data.postalCode,
            houseNumber: data.houseNumber || "0",
            floorNumber: data.floorNumber || "0",
            default: data.isDefault,
          }),
        });

        if (response.ok) {
          toast({
            title: "آدرس اضافه شد",
            description: "آدرس جدید با موفقیت اضافه شد",
          });
          fetchAddresses(); // Refresh addresses
        } else {
          throw new Error("Failed to create address");
        }
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        title: "خطا در ذخیره آدرس",
        description: "مشکلی در ذخیره آدرس رخ داد",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAddress = async (uuid: string) => {
    try {
      const response = await customFetch(`/address/${uuid}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const addressToDelete = addresses.find((addr) => addr.uuid === uuid);
        toast({
          title: "آدرس حذف شد",
          description: `آدرس "${addressToDelete?.title}" با موفقیت حذف شد`,
        });
        fetchAddresses(); // Refresh addresses
      } else {
        throw new Error("Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast({
        title: "خطا در حذف آدرس",
        description: "مشکلی در حذف آدرس رخ داد",
        variant: "error",
      });
    }
  };

  const setAsDefault = async (uuid: string) => {
    try {
      const response = await customFetch(`/address/${uuid}/default`, {
        method: "PUT",
      });

      if (response.ok) {
        toast({
          title: "آدرس پیش‌فرض تنظیم شد",
          description: "آدرس با موفقیت به عنوان پیش‌فرض تنظیم شد",
        });
        fetchAddresses(); // Refresh addresses
      } else {
        throw new Error("Failed to set default address");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast({
        title: "خطا در تنظیم آدرس پیش‌فرض",
        description: "مشکلی در تنظیم آدرس پیش‌فرض رخ داد",
        variant: "error",
      });
    }
  };

  if (isLoadingAddresses) {
    return (
      <div className="container py-8 lg:mt-20">
        <div className="flex justify-center items-center min-h-[50vh]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 lg:mt-20" dir="rtl">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "پروفایل", href: "/profile" },
          { label: "آدرس‌ها", href: "/profile/addresses", isCurrent: true },
        ]}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">آدرس‌های من</h1>
          <p className="text-muted-foreground mt-1">
            آدرس‌های خود را مدیریت کنید
          </p>
        </div>
        <Button onClick={openAddDialog} className="rounded-full">
          <Plus className="ml-2 h-4 w-4" />
          افزودن آدرس جدید
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">هیچ آدرسی یافت نشد</h3>
            <p className="text-muted-foreground mb-4">
              برای شروع خرید، ابتدا یک آدرس اضافه کنید
            </p>
            <Button onClick={openAddDialog} className="rounded-full">
              <Plus className="ml-2 h-4 w-4" />
              افزودن آدرس جدید
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.uuid} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    {address.type === "home" && (
                      <Home className="ml-2 h-4 w-4" />
                    )}
                    {address.type === "work" && (
                      <Briefcase className="ml-2 h-4 w-4" />
                    )}
                    {address.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {address.isDefault && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/20 dark:text-green-400">
                        <Check className="ml-1 h-3 w-3" />
                        پیش‌فرض
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription>
                  {address.recipient} • {address.phone}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="flex items-start">
                    <MapPin className="ml-2 h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span>
                      {address.province}، {address.city}
                    </span>
                  </p>
                  <p className="mr-6">{address.address}</p>
                  <p className="mr-6">
                    کد پستی: {address.postalCode} | پلاک: {address.houseNumber}{" "}
                    | طبقه: {address.floorNumber}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(address)}
                    className="flex-1"
                  >
                    <Edit2 className="ml-2 h-3 w-3" />
                    ویرایش
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAsDefault(address.uuid)}
                      className="flex-1"
                    >
                      <Check className="ml-2 h-3 w-3" />
                      پیش‌فرض
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteAddress(address.uuid)}
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Address Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "ویرایش آدرس" : "افزودن آدرس جدید"}
            </DialogTitle>
            <DialogDescription>اطلاعات آدرس خود را وارد کنید</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان آدرس</FormLabel>
                    <FormControl>
                      <Input placeholder="مثل: منزل، محل کار" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام گیرنده</FormLabel>
                    <FormControl>
                      <Input placeholder="نام و نام خانوادگی" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شماره تماس</FormLabel>
                    <FormControl>
                      <Input placeholder="09123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>استان</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("city", "");
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="استان را انتخاب کنید" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {provinceOptions.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>شهر</FormLabel>
                      <Select
                        key={selectedProvince || "city-select"}
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!selectedProvince}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                selectedProvince
                                  ? "شهر را انتخاب کنید"
                                  : "ابتدا استان را انتخاب کنید"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cityOptions.length > 0 ? (
                            cityOptions.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="__empty" disabled>
                              {selectedProvince
                                ? "شهری برای این استان ثبت نشده است"
                                : "ابتدا استان را انتخاب کنید"}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>کد پستی</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="houseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>پلاک</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="floorNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>طبقه</FormLabel>
                      <FormControl>
                        <Input placeholder="2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع آدرس</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-x-reverse">
                          <FormControl>
                            <RadioGroupItem value="home" />
                          </FormControl>
                          <FormLabel className="font-normal">منزل</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-x-reverse">
                          <FormControl>
                            <RadioGroupItem value="work" />
                          </FormControl>
                          <FormLabel className="font-normal">محل کار</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-x-reverse">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">سایر</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-x-reverse rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>تنظیم به عنوان آدرس پیش‌فرض</FormLabel>
                      <FormDescription>
                        این آدرس به عنوان آدرس پیش‌فرض برای سفارشات آینده تنظیم
                        می‌شود
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>آدرس کامل</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="آدرس کامل خود را وارد کنید"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  انصراف
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" />
                  ) : isEditing ? (
                    "ویرایش آدرس"
                  ) : (
                    "افزودن آدرس"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
