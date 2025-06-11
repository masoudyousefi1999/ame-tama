"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { BackButton } from "@/components/ui/back-button"

// Sample address data - updated to match API schema
const sampleAddresses = [
  {
    createdAt: "2023-01-15T10:35:00.000Z",
    updatedAt: "2025-05-30T02:10:00.000Z",
    uuid: "addr-58b1f289-be86-4344-8d07-3a55a01badbe",
    province: "تهران",
    city: "تهران",
    address: "خیابان ولیعصر، بالاتر از میدان ونک",
    postalCode: "1234567890",
    houseNumber: "123",
    floorNumber: "4",
    // Additional fields for UI compatibility
    id: 1,
    title: "منزل",
    recipient: "علی محمدی",
    phone: "09123456789",
    isDefault: true,
    type: "home",
  },
  {
    createdAt: "2023-02-20T14:50:00.000Z",
    updatedAt: "2025-05-30T02:15:00.000Z",
    uuid: "addr-7c877e90-bcc0-4fe6-8d5d-8fcae85f0066",
    province: "تهران",
    city: "تهران",
    address: "خیابان شریعتی، نرسیده به میدان قدس",
    postalCode: "9876543210",
    houseNumber: "45",
    floorNumber: "2",
    // Additional fields for UI compatibility
    id: 2,
    title: "محل کار",
    recipient: "علی محمدی",
    phone: "09123456789",
    isDefault: false,
    type: "work",
  },
]

// Form schema
const addressFormSchema = z.object({
  title: z.string().min(2, { message: "عنوان آدرس باید حداقل 2 کاراکتر باشد" }),
  recipient: z.string().min(3, { message: "نام گیرنده باید حداقل 3 کاراکتر باشد" }),
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
  type: z.enum(["home", "work", "other"], { message: "نوع آدرس را انتخاب کنید" }),
  isDefault: z.boolean().default(false),
})

type AddressFormValues = z.infer<typeof addressFormSchema>

export default function AddressesPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [addresses, setAddresses] = useState(sampleAddresses)
  const [isEditing, setIsEditing] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<(typeof sampleAddresses)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
      type: "home",
      isDefault: false,
    },
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return null
  }

  const openAddDialog = () => {
    setIsEditing(false)
    setCurrentAddress(null)
    form.reset({
      title: "",
      recipient: "",
      phone: "",
      postalCode: "",
      province: "",
      city: "",
      address: "",
      type: "home",
      isDefault: false,
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (address: (typeof sampleAddresses)[0]) => {
    setIsEditing(true)
    setCurrentAddress(address)
    form.reset({
      title: address.title,
      recipient: address.recipient,
      phone: address.phone,
      postalCode: address.postalCode,
      province: address.province,
      city: address.city,
      address: address.address,
      type: address.type as "home" | "work" | "other",
      isDefault: address.isDefault,
    })
    setIsDialogOpen(true)
  }

  const onSubmit = (data: AddressFormValues) => {
    if (isEditing && currentAddress) {
      // Update existing address
      setAddresses(
        addresses.map((addr) => {
          if (addr.id === currentAddress.id) {
            return {
              ...addr,
              ...data,
            }
          }
          // If this address is set as default, remove default from others
          if (data.isDefault && addr.id !== currentAddress.id) {
            return { ...addr, isDefault: false }
          }
          return addr
        }),
      )
      toast({
        title: "آدرس ویرایش شد",
        description: "آدرس با موفقیت ویرایش شد",
      })
    } else {
      // Add new address
      const newAddress = {
        id: addresses.length > 0 ? Math.max(...addresses.map((a) => a.id)) + 1 : 1,
        ...data,
      }

      // If this address is set as default or it's the first address, remove default from others
      if (data.isDefault || addresses.length === 0) {
        setAddresses([newAddress, ...addresses.map((addr) => ({ ...addr, isDefault: false }))])
      } else {
        setAddresses([newAddress, ...addresses])
      }

      toast({
        title: "آدرس اضافه شد",
        description: "آدرس جدید با موفقیت اضافه شد",
      })
    }
    setIsDialogOpen(false)
  }

  const deleteAddress = (id: number) => {
    const addressToDelete = addresses.find((addr) => addr.id === id)
    setAddresses(addresses.filter((addr) => addr.id !== id))

    toast({
      title: "آدرس حذف شد",
      description: `آدرس "${addressToDelete?.title}" با موفقیت حذف شد`,
    })

    // If the deleted address was default and we have other addresses, set the first one as default
    if (addressToDelete?.isDefault && addresses.length > 1) {
      const remainingAddresses = addresses.filter((addr) => addr.id !== id)
      setAddresses(
        remainingAddresses.map((addr, index) => ({
          ...addr,
          isDefault: index === 0,
        })),
      )
    }
  }

  const setAsDefault = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    )

    toast({
      title: "آدرس پیش‌فرض تغییر کرد",
      description: "آدرس انتخاب شده به عنوان آدرس پیش‌فرض تنظیم شد",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <BackButton href="/profile" label="بازگشت به پروفایل" />
        </div>
        <Breadcrumb
          items={[
            { label: "پروفایل", href: "/profile" },
            { label: "آدرس‌های من", href: "/profile/addresses", isCurrent: true },
          ]}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-vazirmatn">آدرس‌های من</CardTitle>
            <CardDescription className="font-vazirmatn">آدرس‌های ثبت شده برای ارسال سفارش‌ها</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
                onClick={openAddDialog}
              >
                <Plus className="ml-2 h-4 w-4" />
                افزودن آدرس جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle className="font-vazirmatn">{isEditing ? "ویرایش آدرس" : "افزودن آدرس جدید"}</DialogTitle>
                <DialogDescription className="font-vazirmatn">
                  {isEditing
                    ? "اطلاعات آدرس را ویرایش کنید و سپس دکمه ذخیره را بزنید"
                    : "اطلاعات آدرس جدید را وارد کنید"}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-vazirmatn">عنوان آدرس</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: منزل، محل کار" {...field} className="font-vazirmatn" />
                          </FormControl>
                          <FormMessage className="font-vazirmatn" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="font-vazirmatn">نوع آدرس</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4 space-x-reverse"
                            >
                              <FormItem className="flex items-center space-x-3 space-x-reverse">
                                <FormControl>
                                  <RadioGroupItem value="home" />
                                </FormControl>
                                <FormLabel className="font-vazirmatn flex items-center">
                                  <Home className="ml-1 h-4 w-4" />
                                  منزل
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-x-reverse">
                                <FormControl>
                                  <RadioGroupItem value="work" />
                                </FormControl>
                                <FormLabel className="font-vazirmatn flex items-center">
                                  <Briefcase className="ml-1 h-4 w-4" />
                                  محل کار
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-x-reverse">
                                <FormControl>
                                  <RadioGroupItem value="other" />
                                </FormControl>
                                <FormLabel className="font-vazirmatn">سایر</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage className="font-vazirmatn" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="recipient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-vazirmatn">نام و نام خانوادگی گیرنده</FormLabel>
                          <FormControl>
                            <Input placeholder="نام گیرنده" {...field} className="font-vazirmatn" />
                          </FormControl>
                          <FormMessage className="font-vazirmatn" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-vazirmatn">شماره موبایل</FormLabel>
                          <FormControl>
                            <Input placeholder="09123456789" {...field} className="font-vazirmatn" />
                          </FormControl>
                          <FormDescription className="font-vazirmatn text-xs">
                            شماره موبایل باید 11 رقم و با 09 شروع شود
                          </FormDescription>
                          <FormMessage className="font-vazirmatn" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-vazirmatn">استان</FormLabel>
                          <FormControl>
                            <Input placeholder="استان" {...field} className="font-vazirmatn" />
                          </FormControl>
                          <FormMessage className="font-vazirmatn" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-vazirmatn">شهر</FormLabel>
                          <FormControl>
                            <Input placeholder="شهر" {...field} className="font-vazirmatn" />
                          </FormControl>
                          <FormMessage className="font-vazirmatn" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-vazirmatn">کد پستی</FormLabel>
                          <FormControl>
                            <Input placeholder="کد پستی 10 رقمی" {...field} className="font-vazirmatn" />
                          </FormControl>
                          <FormMessage className="font-vazirmatn" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-vazirmatn">آدرس کامل</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="آدرس دقیق شامل خیابان، کوچه، پلاک و واحد"
                            {...field}
                            className="font-vazirmatn"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage className="font-vazirmatn" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-vazirmatn">تنظیم به عنوان آدرس پیش‌فرض</FormLabel>
                          <FormDescription className="font-vazirmatn text-xs">
                            این آدرس به صورت پیش‌فرض برای ارسال سفارش‌ها استفاده می‌شود
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
                    >
                      {isEditing ? "ذخیره تغییرات" : "افزودن آدرس"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border rounded-lg p-5 relative ${
                    address.isDefault ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10" : ""
                  }`}
                >
                  {address.isDefault && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-800/20 dark:text-purple-400 font-vazirmatn">
                        <Check className="ml-1 h-3 w-3" />
                        پیش‌فرض
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-start mb-3">
                    <div
                      className={`p-2 rounded-full mr-2 ${
                        address.type === "home"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                          : address.type === "work"
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {address.type === "home" ? (
                        <Home className="h-5 w-5" />
                      ) : address.type === "work" ? (
                        <Briefcase className="h-5 w-5" />
                      ) : (
                        <MapPin className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg font-vazirmatn">{address.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-vazirmatn">
                        {address.recipient} | {address.phone}
                      </p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-vazirmatn">
                      <span className="font-medium ml-1">استان:</span>
                      {address.province}، <span className="font-medium ml-1">شهر:</span>
                      {address.city}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-vazirmatn">
                      <span className="font-medium ml-1">کد پستی:</span>
                      {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 font-vazirmatn">{address.address}</p>
                  </div>
                  <div className="flex justify-end space-x-2 space-x-reverse mt-4">
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-800 dark:hover:bg-purple-900/20 font-vazirmatn"
                        onClick={() => setAsDefault(address.id)}
                      >
                        <Check className="ml-1 h-4 w-4" />
                        تنظیم به عنوان پیش‌فرض
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-vazirmatn"
                      onClick={() => openEditDialog(address)}
                    >
                      <Edit2 className="ml-1 h-4 w-4" />
                      ویرایش
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-900/20 font-vazirmatn"
                      onClick={() => deleteAddress(address.id)}
                    >
                      <Trash2 className="ml-1 h-4 w-4" />
                      حذف
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium mb-2 font-vazirmatn">هنوز آدرسی ثبت نکرده‌اید</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 font-vazirmatn">
                برای ثبت سفارش نیاز به حداقل یک آدرس دارید
              </p>
              <Button
                className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 font-vazirmatn"
                onClick={openAddDialog}
              >
                <Plus className="ml-2 h-4 w-4" />
                افزودن آدرس جدید
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
