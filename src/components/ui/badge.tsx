import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-royal-500 dark:focus:ring-royal-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-royal-100 dark:bg-royal-800/40 text-royal-800 dark:text-royal-200 hover:bg-royal-200 dark:hover:bg-royal-800/60",
        secondary:
          "bg-brown-100 dark:bg-brown-800/40 text-brown-800 dark:text-brown-200 hover:bg-brown-200 dark:hover:bg-brown-800/60",
        destructive:
          "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/60",
        outline:
          "border border-royal-300 dark:border-royal-700 text-royal-700 dark:text-royal-300 hover:bg-royal-50 dark:hover:bg-royal-800/20",
        luxury:
          "bg-gradient-to-r from-royal-100 to-brown-100 dark:from-royal-800/50 dark:to-brown-800/50 text-royal-900 dark:text-royal-100 font-semibold",
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
