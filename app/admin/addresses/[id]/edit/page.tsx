import { AddressForm } from "@/components/admin/addresses/address-form"

// This would fetch from your API
async function getAddress(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/addresses/${id}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch address")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching address:", error)
    // Return a placeholder for error cases
    return {
      id,
      user: "کاربر نمونه",
      province: "تهران",
      city: "تهران",
      address: "خیابان نمونه",
      postalCode: "1234567890",
      houseNumber: "123",
      floorNumber: "2",
    }
  }
}

export default async function EditAddressPage({
  params,
}: {
  params: { id: string }
}) {
  const address = await getAddress(params.id)

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-vazirmatn">ویرایش آدرس</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-vazirmatn">اطلاعات آدرس را ویرایش کنید</p>
      </div>

      <AddressForm address={address} />
    </div>
  )
}
