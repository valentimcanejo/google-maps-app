import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

function classNames(...args: (string | boolean | null | undefined)[]): string {
  return args
    .filter((arg) => arg != null && arg !== false && arg !== "")
    .join(" ");
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  asChild?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "success" | "error" | "standard" | "alert" | "primary";
  fullWidth?: boolean;
}

const ButtonRoot = ({
  children = "",
  asChild = false,
  size = "md",
  variant = "primary",
  fullWidth = false,
  ...rest
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={clsx(
        "flex justify-center items-center rounded-l-lg rounded-r-lg shadow-xl",
        {
          "w-full": fullWidth,
          "px-1 py-1 gap-1": size === "xs",
          "px-4 py-1 gap-1": size === "sm",
          "px-6 py-3 gap-3": size === "md",
          "px-8 py-3 gap-4 text-base font-bold": size === "lg",
          "px-8 py-7 gap-4 text-base font-bold": size === "xl",
          "bg-blue-500": variant === "primary",
          "bg-error": variant === "error",
          "bg-green-400": variant === "success",
          "bg-orange-500": variant === "alert",
          "bg-neutral-600": variant === "standard",
        }
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
};

export interface ButtonTextProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const ButtonText = ({ children, size = "md" }: ButtonTextProps) => {
  return (
    <span
      className={clsx("font-sans text-white", {
        "text-sm": size === "sm",
        "text-md": size === "md",
        "text-lg": size === "lg",
        "text-xl": size === "xl",
      })}
    >
      {children}
    </span>
  );
};

export interface ButtonIconProps extends ButtonTextProps {
  size?: "sm" | "md";
}

const ButtonIcon = ({ children, size = "md" }: ButtonIconProps) => {
  return (
    <span
      className={clsx("text-white", {
        "h-4 w-4 ": size === "sm",
        "h-6 w-6 -m-1": size === "md",
      })}
    >
      {children}
    </span>
  );
};

export const Button = {
  Root: ButtonRoot,
  Text: ButtonText,
  Icon: ButtonIcon,
};
