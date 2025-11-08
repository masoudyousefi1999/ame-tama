import { useState, useEffect, useMemo } from "react";
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
import citiesData from "@/lib/cities";

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
  const [defaultAddressUuid, setDefaultAddressUuid] = useState<string>("");
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const provinceOptions = useMemo(
    () => citiesData.map((item) => item.province),
    []
  );

  const cityOptions = useMemo(() => {
    if (!addressForm.province) {
      return [];
    }
    const provinceEntry = citiesData.find(
      (item) => item.province === addressForm.province
    );
    return provinceEntry?.cities ?? [];
  }, [addressForm.province]);

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

  const handleUserFormChange = (e: any) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };
  const handleUpdateUser = async (e: any) => {
    e.preventDefault();
    setIsUpdatingUser(true);
    try {
      const res = await customFetch("/users/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: userForm.firstName,
          last_name: userForm.lastName,
          email: userForm.email,
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
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "province" ? { city: "" } : {}),
    }));
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
      <DialogContent className="max-w-lg w-full bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-[0_20px_60px_-30px_rgba(59,130,246,0.6)] p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="flex gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step === 1
                  ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white/10 text-white/60"
              }`}
            >
              1
            </div>
            <div className="h-1 w-10 bg-white/10 rounded" />
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step === 2
                  ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white/10 text-white/60"
              }`}
            >
              2
            </div>
          </div>
        </div>
        {step === 1 &&
          (userStepConfirmed ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <div className="text-lg font-bold text-green-500 text-center">
                {userStepConfirmed === "already"
                  ? "اطلاعات حساب کاربری شما تکمیل است"
                  : "اطلاعات حساب کاربری شما تکمیل شد"}
              </div>
            </div>
          ) : (
            <Card className="bg-slate-900/60 border border-white/10 shadow-xl backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  تکمیل اطلاعات کاربری
                </CardTitle>
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
                      className="mt-1 bg-slate-900/60 border border-white/10 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 rounded-xl"
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
                      className="mt-1 bg-slate-900/60 border border-white/10 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">ایمیل (اختیاری)</Label>
                    <Input
                      id="email"
                      name="email"
                      value={userForm.email}
                      onChange={handleUserFormChange}
                      className="mt-1 bg-slate-900/60 border border-white/10 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 rounded-xl"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/25"
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
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <div className="text-lg font-bold text-green-500 text-center">
                آدرس شما تکمیل و انتخاب شد
              </div>
            </div>
          ) : (
            <Card className="bg-slate-900/60 border border-white/10 shadow-xl backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  انتخاب یا ثبت آدرس
                </CardTitle>
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
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="province">استان</Label>
                            <select
                              id="province"
                              name="province"
                              value={addressForm.province}
                              onChange={handleAddressFormChange}
                              required
                              className="w-full rounded-xl border border-white/10 px-3 py-2 bg-slate-950/60 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 transition-all"
                            >
                              <option value="">انتخاب استان...</option>
                              {provinceOptions.map((province) => (
                                <option key={province} value={province}>
                                  {province}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="city">شهر</Label>
                            <select
                              id="city"
                              name="city"
                              value={addressForm.city}
                              onChange={handleAddressFormChange}
                              required
                              className="w-full rounded-xl border border-white/10 px-3 py-2 bg-slate-950/60 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 transition-all"
                              disabled={!addressForm.province}
                            >
                              <option value="">
                                {addressForm.province
                                  ? "انتخاب شهر..."
                                  : "ابتدا استان را انتخاب کنید"}
                              </option>
                              {cityOptions.length > 0 ? (
                                cityOptions.map((city) => (
                                  <option key={city} value={city}>
                                    {city}
                                  </option>
                                ))
                              ) : (
                                <option value="__empty" disabled>
                                  {addressForm.province
                                    ? "شهری برای این استان ثبت نشده است"
                                    : "ابتدا استان را انتخاب کنید"}
                                </option>
                              )}
                            </select>
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
                              className="mt-1 bg-slate-900/60 border border-white/10 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 rounded-xl"
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
                              className="mt-1 bg-slate-900/60 border border-white/10 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 rounded-xl"
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
                            className="mt-1 bg-slate-900/60 border border-white/10 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">آدرس</Label>
                          <Textarea
                            id="address"
                            name="address"
                            value={addressForm.address}
                            onChange={handleAddressFormChange}
                            required
                            rows={2}
                            className="mt-1 rounded-xl border border-white/10 bg-slate-900/60 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 transition-all"
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/25"
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
