"use client";

import { useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

export interface IAddress {
  uuid: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  houseNumber: string;
  floorNumber: string;
  default: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  phone: string;
  avatar: string;
  addresses: IAddress[];
}

interface UsersTableProps {
  data: {
    users: IUser[];
    total: number;
    page: number;
    limit: number;
  };
}

export function UsersTable({ data }: UsersTableProps) {
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  const handleViewAddress = useCallback((address: IAddress) => {
    setSelectedAddress(address);
    setIsAddressDialogOpen(true);
  }, []);

  return (
    <>
      <div className="overflow-x-auto" dir="rtl">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-transparent">
              <TableHead className="text-right text-gray-300 font-medium px-4 py-3">
                نام
              </TableHead>
              <TableHead className="text-right text-gray-300 font-medium px-4 py-3">
                موبایل
              </TableHead>
              <TableHead className="text-right text-gray-300 font-medium px-4 py-3">
                نقش
              </TableHead>
              <TableHead className="text-right text-gray-300 font-medium px-4 py-3">
                آدرس
              </TableHead>
              <TableHead className="text-right text-gray-300 font-medium px-4 py-3">
                تاریخ ایجاد
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.users.map((user) => (
              <TableRow
                key={user.uuid}
                className="border-gray-700 hover:bg-gray-700/30 transition-colors"
              >
                <TableCell className="text-right font-medium text-white px-4 py-3">
                  {`${user.firstName || "-"} ${user.lastName || "-"}`}
                </TableCell>
                <TableCell className="text-right text-gray-400 px-4 py-3">
                  {user.phone}
                </TableCell>
                <TableCell className="text-right px-4 py-3">
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className={
                      user.role === "admin"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-300"
                    }
                  >
                    {user.role === "ADMIN" ? "مدیر" : "کاربر"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-gray-400 px-4 py-3">
                  {user.addresses && user.addresses.length > 0 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewAddress(user.addresses[0])}
                      className="hover:bg-gray-700 text-gray-300"
                    >
                      <MapPin className="h-4 w-4 ml-1" />
                      مشاهده
                    </Button>
                  ) : (
                    <span className="text-gray-500 text-sm">ندارد</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-gray-400 px-4 py-3">
                  {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Address Details Modal */}
        <Dialog
          open={isAddressDialogOpen}
          onOpenChange={setIsAddressDialogOpen}
        >
          <DialogContent
            className="bg-gray-800 border-gray-700 max-w-2xl"
            dir="rtl"
          >
            <DialogHeader className="pr-10">
              <DialogTitle className="text-white text-lg flex-wrap">
                جزئیات آدرس
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                اطلاعات کامل آدرس کاربر
              </DialogDescription>
            </DialogHeader>

            {selectedAddress && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">آدرس</div>
                    <div className="text-sm text-white bg-gray-700/50 p-2.5 rounded">
                      {selectedAddress.address}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">شهر</div>
                    <div className="text-sm text-white bg-gray-700/50 p-2.5 rounded">
                      {selectedAddress.city}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">استان</div>
                    <div className="text-sm text-white bg-gray-700/50 p-2.5 rounded">
                      {selectedAddress.province}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">کد پستی</div>
                    <div className="text-sm text-white bg-gray-700/50 p-2.5 rounded font-mono">
                      {selectedAddress.postalCode}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">شماره پلاک</div>
                    <div className="text-sm text-white bg-gray-700/50 p-2.5 rounded">
                      {selectedAddress.houseNumber}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">طبقه</div>
                    <div className="text-sm text-white bg-gray-700/50 p-2.5 rounded">
                      {selectedAddress.floorNumber}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    {selectedAddress.default && (
                      <Badge className="bg-green-600 text-white">
                        آدرس پیش‌فرض
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    ثبت شده در:{" "}
                    {new Date(selectedAddress.createdAt).toLocaleDateString(
                      "fa-IR"
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
