"use client";

// Inspired by react-hot-toast library
import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 2000; // Reduced to 2000ms (2 seconds)

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  duration?: number;
  variant?:
    | "default"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "login"
    | "cart"
    | "wishlist"
    | "anime";
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string, duration?: number) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, duration || TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        const toast = state.toasts.find((t) => t.id === toastId);
        addToRemoveQueue(toastId, toast?.duration);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id, toast.duration);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

function toast({ duration = 2000, ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      duration,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  // Auto-dismiss after duration
  setTimeout(() => {
    dismiss();
  }, duration);

  return {
    id: id,
    dismiss,
    update,
  };
}

// Convenience functions for different toast types
function successToast(props: Omit<Toast, "variant">) {
  return toast({
    ...props,
    variant: "success",
    duration: props.duration || 2000,
  });
}

function errorToast(props: Omit<Toast, "variant">) {
  return toast({
    ...props,
    variant: "error",
    duration: props.duration || 2000,
  });
}

function warningToast(props: Omit<Toast, "variant">) {
  return toast({
    ...props,
    variant: "warning",
    duration: props.duration || 2000,
  });
}

function infoToast(props: Omit<Toast, "variant">) {
  return toast({ ...props, variant: "info", duration: props.duration || 2000 });
}

function loginToast(props: Omit<Toast, "variant">) {
  return toast({
    ...props,
    variant: "login",
    duration: props.duration || 2000,
  });
}

function cartToast(props: Omit<Toast, "variant">) {
  return toast({ ...props, variant: "cart", duration: props.duration || 2000 });
}

function wishlistToast(props: Omit<Toast, "variant">) {
  return toast({
    ...props,
    variant: "wishlist",
    duration: props.duration || 2000,
  });
}

function animeToast(props: Omit<Toast, "variant">) {
  return toast({
    ...props,
    variant: "anime",
    duration: props.duration || 2000,
  });
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    successToast,
    errorToast,
    warningToast,
    infoToast,
    loginToast,
    cartToast,
    wishlistToast,
    animeToast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export {
  useToast,
  toast,
  successToast,
  errorToast,
  warningToast,
  infoToast,
  loginToast,
  cartToast,
  wishlistToast,
  animeToast,
};
