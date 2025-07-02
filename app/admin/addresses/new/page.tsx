import { AddressForm } from "@/components/admin/addresses/address-form";

export default function NewAddressPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          ایجاد آدرس جدید
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          آدرس جدید برای مشتری ایجاد کنید
        </p>
      </div>

      <AddressForm />
    </div>
  );
}
