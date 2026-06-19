import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-sm text-[14px] font-medium whitespace-nowrap outline-none transition-all duration-150 ease-out disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 focus-visible:outline-none disabled:bg-muted/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[var(--geist-gray-900)] border border-transparent",
        destructive:
          "bg-destructive text-white hover:bg-[var(--geist-red-800)] border border-transparent",
        outline:
          "border border-[var(--border)] bg-[var(--geist-background-100)] shadow-sm hover:border-[var(--geist-gray-500)] hover:bg-[var(--geist-gray-100)] hover:text-foreground",
        secondary: "bg-[var(--geist-gray-100)] text-foreground hover:bg-[var(--geist-gray-200)] border border-[var(--border)]",
        ghost: "hover:bg-[var(--geist-gray-100)] hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-[10px] py-2 has-[>svg]:px-[8px]",
        xs: "h-8 gap-1 rounded-sm px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-sm px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-sm px-6 has-[>svg]:px-[14px]",
        icon: "h-10 w-10 rounded-sm",
        "icon-xs": "h-8 w-8 rounded-sm [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "h-8 w-8 rounded-sm",
        "icon-lg": "h-12 w-12 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
