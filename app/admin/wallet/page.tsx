import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletTransactions } from "@/components/admin/wallet/wallet-transactions"
import { Wallet, TrendingUp, TrendingDown } from "lucide-react"

// This would fetch from your API
async function getWalletData() {
  // Simulate API call - replace with actual API call
  return {
    balance: 1234.56,
    totalIncome: 5678.9,
    totalExpenses: 4444.34,
    transactions: [
      {
        id: "1",
        type: "income",
        amount: 100.0,
        description: "پرداخت دریافت شده",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        type: "expense",
        amount: 50.0,
        description: "بازپرداخت انجام شده",
        createdAt: new Date().toISOString(),
      },
    ],
  }
}

export default async function WalletPage() {
  const walletData = await getWalletData()

  return (
    <div className="space-y-6" dir="rtl">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-vazirmatn">کیف پول</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-vazirmatn">مدیریت موجودی کیف پول و تراکنش‌ها</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 font-vazirmatn">
              موجودی فعلی
            </CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Wallet className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white font-vazirmatn">
              ${walletData.balance.toLocaleString("fa-IR")}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-vazirmatn">موجودی قابل استفاده</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 font-vazirmatn">
              کل درآمد
            </CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 font-vazirmatn">
              ${walletData.totalIncome.toLocaleString("fa-IR")}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-vazirmatn">درآمد کل زمان</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 font-vazirmatn">
              کل هزینه‌ها
            </CardTitle>
            <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 font-vazirmatn">
              ${walletData.totalExpenses.toLocaleString("fa-IR")}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-vazirmatn">هزینه کل زمان</p>
          </CardContent>
        </Card>
      </div>

      <WalletTransactions transactions={walletData.transactions as any} />
    </div>
  )
}
