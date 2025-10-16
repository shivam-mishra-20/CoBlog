import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-royal-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-royal-100 text-royal-800 hover:bg-royal-200",
        secondary: "bg-brown-100 text-brown-800 hover:bg-brown-200",
        destructive: "bg-red-100 text-red-800 hover:bg-red-200",
        outline: "border border-royal-300 text-royal-700 hover:bg-royal-50",
        luxury:
          "bg-gradient-to-r from-royal-100 to-brown-100 text-royal-900 font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
