"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  createdAt: string;
}

interface WalletTransactionsProps {
  transactions: Transaction[];
}

export function WalletTransactions({ transactions }: WalletTransactionsProps) {
  return (
    <Card
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-gray-200 dark:border-gray-700"
      dir="rtl"
    >
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          تراکنش‌های اخیر
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                    نوع
                  </TableHead>
                  <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                    توضیحات
                  </TableHead>
                  <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                    مبلغ
                  </TableHead>
                  <TableHead className="sticky top-0 bg-gray-50/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 font-medium">
                    تاریخ
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow
                    key={transaction.id}
                    className={`border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50/50 dark:bg-gray-700/25"
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center">
                        {transaction.type === "income" ? (
                          <ArrowUpCircle className="h-4 w-4 text-green-600 dark:text-green-400 ml-2" />
                        ) : (
                          <ArrowDownCircle className="h-4 w-4 text-red-600 dark:text-red-400 ml-2" />
                        )}
                        <Badge
                          className={`${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                          }`}
                        >
                          {transaction.type === "income" ? "درآمد" : "هزینه"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">
                      {transaction.description}
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toLocaleString("fa-IR")}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {new Date(transaction.createdAt).toLocaleDateString(
                        "fa-IR"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
