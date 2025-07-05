import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle } from "lucide-react";
import { customFetch } from "@/lib/utils";
import clsx from "clsx";

export function PreCheckoutModal({
  open,
  onOpenChange,
  user,
  onComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onComplete: () => void;
}) {
  const [step, setStep] = useState(1);
  const [userForm, setUserForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [addressList, setAddressList] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [addressForm, setAddressForm] = useState({
    province: "",
    city: "",
    address: "",
    postalCode: "",
    houseNumber: "",
    floorNumber: "",
  });
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isCreatingAddress, setIsCreatingAddress] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [userStepConfirmed, setUserStepConfirmed] = useState<
    null | "already" | "just"
  >(null);
  const [addressStepConfirmed, setAddressStepConfirmed] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [provinceLoading, setProvinceLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [defaultAddressUuid, setDefaultAddressUuid] = useState<string>("");
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  useEffect(() => {
    if (open) {
      if (!user?.firstName || !user?.lastName) {
        setStep(1);
        setUserStepConfirmed(null);
      } else {
        setStep(1);
        setUserStepConfirmed("already");
        setTimeout(() => {
          setStep(2);
          setUserStepConfirmed(null);
        }, 1200);
      }
    }
  }, [open, user]);

  useEffect(() => {
    if (open && step === 2) {
      setIsLoadingAddresses(true);
      customFetch("/address", { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          const addresses = Array.isArray(data.addresses) ? data.addresses : [];
          setAddressList(addresses);
          setShowAddressForm(!addresses || addresses.length === 0);
          const def = addresses.find((a: any) => a.default);
          setDefaultAddressUuid(def ? def.uuid : "");
          setSelectedAddress(def ? def.uuid : "");
        })
        .catch(() => {
          setAddressList([]);
          setShowAddressForm(true);
        })
        .finally(() => setIsLoadingAddresses(false));
    }
  }, [open, step]);

  useEffect(() => {
    if (open && showAddressForm) {
      setProvinceLoading(true);
      customFetch("/address/province", { method: "GET" })
        .then((res) => res.json())
        .then((data) => setProvinces(Array.isArray(data) ? data : []))
        .catch(() => setProvinces([]))
        .finally(() => setProvinceLoading(false));
    }
  }, [open, showAddressForm]);

  useEffect(() => {
    if (showAddressForm && addressForm.province) {
      setCityLoading(true);
      customFetch(
        `/address/city?province=${encodeURIComponent(addressForm.province)}`,
        { method: "GET" }
      )
        .then((res) => res.json())
        .then((data) => setCities(Array.isArray(data) ? data : []))
        .catch(() => setCities([]))
        .finally(() => setCityLoading(false));
    } else {
      setCities([]);
    }
  }, [showAddressForm, addressForm.province]);

  const handleUserFormChange = (e: any) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };
  const handleUpdateUser = async (e: any) => {
    e.preventDefault();
    setIsUpdatingUser(true);
    try {
      const res = await customFetch("/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: userForm.firstName,
          last_name: userForm.lastName,
          email: userForm.email,
          avatar: userForm.avatar,
        }),
      });
      if (!res.ok) throw new Error("خطا در بروزرسانی اطلاعات کاربر");
      toast({ title: "اطلاعات با موفقیت بروزرسانی شد" });
      setUserStepConfirmed("just");
      setTimeout(() => {
        setStep(2);
        setUserStepConfirmed(null);
      }, 1200);
    } catch (err: any) {
      toast({ title: "خطا", description: err.message, variant: "error" });
    } finally {
      setIsUpdatingUser(false);
    }
  };
  const handleAddressFormChange = (e: any) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
    if (e.target.name === "province") {
      setAddressForm((prev) => ({ ...prev, city: "" }));
    }
  };
  const handleCreateAddress = async (e: any) => {
    e.preventDefault();
    setIsCreatingAddress(true);
    try {
      const res = await customFetch("/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });
      if (!res.ok) throw new Error("خطا در ثبت آدرس");
      const data = await res.json();
      setSelectedAddress(data.uuid);
      setShowAddressForm(false);
      setIsLoadingAddresses(true);
      const res2 = await customFetch("/address", { method: "GET" });
      const data2 = await res2.json();
      const addresses = Array.isArray(data2.addresses) ? data2.addresses : [];
      setAddressList(addresses);
      toast({ title: "آدرس با موفقیت ثبت شد" });
      await customFetch(`/address/default/${data.uuid}`, { method: "POST" });
      setAddressStepConfirmed(true);
      setTimeout(() => {
        setAddressStepConfirmed(false);
        onComplete();
      }, 1200);
    } catch (err: any) {
      toast({ title: "خطا", description: err.message, variant: "error" });
    } finally {
      setIsCreatingAddress(false);
      setIsLoadingAddresses(false);
    }
  };
  const handleSelectAddress = (uuid: string) => {
    setSelectedAddress(uuid);
  };
  const handleContinueWithAddress = async () => {
    setAddressStepConfirmed(true);
    if (selectedAddress && selectedAddress !== defaultAddressUuid) {
      setIsSettingDefault(true);
      try {
        await customFetch(`/address/default/${selectedAddress}`, {
          method: "POST",
        });
      } catch {}
      setIsSettingDefault(false);
    }
    setTimeout(() => {
      setAddressStepConfirmed(false);
      onComplete();
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="flex gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                step === 1 ? "bg-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <div className="h-1 w-8 bg-muted rounded" />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                step === 2 ? "bg-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
          </div>
        </div>
        {step === 1 &&
          (userStepConfirmed ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounceIn" />
              <div className="text-lg font-bold text-green-500 text-center">
                {userStepConfirmed === "already"
                  ? "اطلاعات حساب کاربری شما تکمیل است"
                  : "اطلاعات حساب کاربری شما تکمیل شد"}
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>تکمیل اطلاعات کاربری</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">نام</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={userForm.firstName}
                      onChange={handleUserFormChange}
                      required
                      autoFocus
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">نام خانوادگی</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={userForm.lastName}
                      onChange={handleUserFormChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">ایمیل</Label>
                    <Input
                      id="email"
                      name="email"
                      value={userForm.email}
                      readOnly
                      disabled
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                    disabled={isUpdatingUser}
                  >
                    {isUpdatingUser ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      "ذخیره و ادامه"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        {step === 2 &&
          (addressStepConfirmed ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounceIn" />
              <div className="text-lg font-bold text-green-500 text-center">
                آدرس شما تکمیل و انتخاب شد
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>انتخاب یا ثبت آدرس</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingAddresses ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="md" />
                  </div>
                ) : (
                  <>
                    {addressList.length > 0 && !showAddressForm && (
                      <>
                        <div className="mb-2 text-sm text-muted-foreground">
                          آدرس مورد نظر خود را انتخاب کنید. آدرس پیش‌فرض با رنگ
                          متفاوت نمایش داده شده است.
                        </div>
                        <RadioGroup
                          value={selectedAddress}
                          onValueChange={handleSelectAddress}
                          className="mb-4 flex flex-col gap-2 "
                        >
                          {addressList.map((addr: any) => (
                            <label
                              key={addr.uuid}
                              className={clsx(
                                "flex items-start gap-3 p-3 border rounded-lg transition-colors cursor-pointer",
                                addr.uuid === defaultAddressUuid
                                  ? "border-green-500 bg-green-900/40"
                                  : "bg-card border-border",
                                addr.uuid === selectedAddress &&
                                  "ring-2 ring-primary"
                              )}
                              htmlFor={`address-radio-${addr.uuid}`}
                            >
                              <RadioGroupItem
                                id={`address-radio-${addr.uuid}`}
                                value={addr.uuid}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-base text-primary">
                                    {addr.city}
                                  </span>
                                  {addr.uuid === defaultAddressUuid && (
                                    <span className="text-xs px-2 py-0.5 rounded bg-green-800 text-green-200">
                                      آدرس پیش‌فرض
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-foreground mb-1">
                                  {addr.address}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {addr.province}{" "}
                                  {addr.postalCode && `- ${addr.postalCode}`}
                                </div>
                              </div>
                            </label>
                          ))}
                        </RadioGroup>
                        <Button
                          variant="outline"
                          className="w-full mb-2"
                          onClick={() => setShowAddressForm(true)}
                        >
                          ثبت آدرس جدید
                        </Button>
                        <Button
                          className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 mt-2"
                          onClick={handleContinueWithAddress}
                          disabled={!selectedAddress || isSettingDefault}
                        >
                          {isSettingDefault ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            "ادامه به پرداخت"
                          )}
                        </Button>
                      </>
                    )}
                    {(addressList.length === 0 || showAddressForm) && (
                      <form
                        onSubmit={handleCreateAddress}
                        className="space-y-2 mb-4"
                      >
                        <div>
                          <Label htmlFor="address">آدرس</Label>
                          <Textarea
                            id="address"
                            name="address"
                            value={addressForm.address}
                            onChange={handleAddressFormChange}
                            required
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="province">استان</Label>
                            <select
                              id="province"
                              name="province"
                              value={addressForm.province}
                              onChange={handleAddressFormChange}
                              required
                              className="w-full rounded-md border px-2 py-2 bg-background"
                              disabled={provinceLoading}
                            >
                              <option value="">انتخاب استان...</option>
                              {provinces.map((prov) => (
                                <option key={prov.name} value={prov.name}>
                                  {prov.name}
                                </option>
                              ))}
                            </select>
                            {provinceLoading && (
                              <div className="text-xs text-muted-foreground mt-1">
                                در حال بارگذاری استان‌ها...
                              </div>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="city">شهر</Label>
                            <select
                              id="city"
                              name="city"
                              value={addressForm.city}
                              onChange={handleAddressFormChange}
                              required
                              className="w-full rounded-md border px-2 py-2 bg-background"
                              disabled={!addressForm.province || cityLoading}
                            >
                              <option value="">
                                {addressForm.province
                                  ? "انتخاب شهر..."
                                  : "ابتدا استان را انتخاب کنید"}
                              </option>
                              {cities.map((city) => (
                                <option key={city.name} value={city.name}>
                                  {city.name}
                                </option>
                              ))}
                            </select>
                            {cityLoading && (
                              <div className="text-xs text-muted-foreground mt-1">
                                در حال بارگذاری شهرها...
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="postalCode">کد پستی</Label>
                            <Input
                              id="postalCode"
                              name="postalCode"
                              value={addressForm.postalCode}
                              onChange={handleAddressFormChange}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="houseNumber">پلاک</Label>
                            <Input
                              id="houseNumber"
                              name="houseNumber"
                              value={addressForm.houseNumber}
                              onChange={handleAddressFormChange}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="floorNumber">طبقه</Label>
                          <Input
                            id="floorNumber"
                            name="floorNumber"
                            value={addressForm.floorNumber}
                            onChange={handleAddressFormChange}
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                          disabled={isCreatingAddress}
                        >
                          {isCreatingAddress ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            "ثبت آدرس و ادامه"
                          )}
                        </Button>
                      </form>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))}
      </DialogContent>
    </Dialog>
  );
}
