import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle } from "lucide-react";
import { customFetch } from "@/lib/utils";

export function CommentUserInfoModal({
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
  const [userForm, setUserForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [stepConfirmed, setStepConfirmed] = useState<null | "already" | "just">(
    null
  );

  useEffect(() => {
    if (open) {
      if (!user?.firstName || !user?.lastName) {
        setStepConfirmed(null);
        setUserForm({
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
        });
      } else {
        setStepConfirmed("already");
        setTimeout(() => {
          onComplete();
        }, 1200);
      }
    }
  }, [open, user, onComplete]);

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
        }),
      });
      if (!res.ok) throw new Error("خطا در بروزرسانی اطلاعات کاربر");
      toast({ title: "اطلاعات با موفقیت بروزرسانی شد" });
      setStepConfirmed("just");
      setTimeout(() => {
        onComplete();
        onOpenChange(false);
      }, 1200);
    } catch (err: any) {
      toast({ title: "خطا", description: err.message, variant: "error" });
    } finally {
      setIsUpdatingUser(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full">
        {stepConfirmed ? (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-16 h-16 text-success mb-4 animate-bounceIn" />
            <div className="text-lg font-bold text-success text-center">
              {stepConfirmed === "already"
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
                <Button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
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
        )}
      </DialogContent>
    </Dialog>
  );
}
