"use client";

import { Button } from "@/components/ui/button";
import {
  toast,
  successToast,
  errorToast,
  warningToast,
  infoToast,
  loginToast,
  cartToast,
  wishlistToast,
  animeToast,
} from "@/components/ui/use-toast";

export function ToastDemo() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <Button
        onClick={() => {
          toast({
            title: "Default Toast",
            description: "This is a default toast with 2-second duration",
            duration: 2000,
          });
        }}
      >
        Default Toast
      </Button>

      <Button
        onClick={() => {
          successToast({
            title: "Success Toast",
            description: "This is a success toast with 2-second duration",
            duration: 2000,
          });
        }}
      >
        Success Toast
      </Button>

      <Button
        onClick={() => {
          errorToast({
            title: "Error Toast",
            description: "This is an error toast with 2-second duration",
            duration: 2000,
          });
        }}
      >
        Error Toast
      </Button>

      <Button
        onClick={() => {
          warningToast({
            title: "Warning Toast",
            description: "This is a warning toast with 2-second duration",
            duration: 2000,
          });
        }}
      >
        Warning Toast
      </Button>

      <Button
        onClick={() => {
          infoToast({
            title: "Info Toast",
            description: "This is an info toast with 2-second duration",
            duration: 2000,
          });
        }}
      >
        Info Toast
      </Button>

      <Button
        onClick={() => {
          loginToast({
            title: "Login Toast",
            description: "This is a login toast with 2-second duration",
            duration: 2000,
          });
        }}
      >
        Login Toast
      </Button>

      <Button
        onClick={() => {
          cartToast({
            title: "Cart Toast",
            description: "This is a cart toast with 2-second duration",
            duration: 2000,
          });
        }}
      >
        Cart Toast
      </Button>

      <Button
        onClick={() => {
          wishlistToast({
            title: "Wishlist Toast",
            description: "This is a wishlist toast with 2-second duration",
            duration: 2000,
          });
        }}
      >
        Wishlist Toast
      </Button>

      <Button
        onClick={() => {
          animeToast({
            title: "Anime Toast",
            description: "This is an anime toast with 2-second duration",
            duration: 2000,
          });
        }}
      >
        Anime Toast
      </Button>

      <Button
        onClick={() => {
          toast({
            title: "Custom Duration Test",
            description: "This toast should last 4 seconds",
            duration: 4000,
          });
        }}
      >
        Custom Duration (4s)
      </Button>

      <Button
        onClick={() => {
          toast({
            title: "No Duration Test",
            description: "This toast should use default 2-second duration",
          });
        }}
      >
        No Duration (Default 2s)
      </Button>
    </div>
  );
}
