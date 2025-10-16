import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-royal-700 text-white shadow-royal hover:bg-royal-800 hover:shadow-royal-lg hover:-translate-y-0.5 transform",
        destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
        outline:
          "border-2 border-royal-700 text-royal-700 bg-white hover:bg-royal-700 hover:text-white",
        secondary:
          "bg-brown-700 text-white shadow-royal hover:bg-brown-800 hover:shadow-royal-lg hover:-translate-y-0.5 transform",
        ghost: "text-royal-700 hover:bg-royal-100 hover:text-royal-900",
        link: "text-royal-700 underline-offset-4 hover:underline",
        luxury:
          "bg-gradient-to-r from-royal-700 to-brown-700 text-white shadow-royal-lg hover:shadow-royal-xl hover:-translate-y-1 transform",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      // When asChild is true, clone the child element and apply button styles
      const childClassName = (children.props as { className?: string })
        .className;
      return React.cloneElement(children, {
        className: cn(
          buttonVariants({ variant, size }),
          childClassName,
          className
        ),
        ref,
        ...props,
      } as React.HTMLAttributes<HTMLElement>);
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
