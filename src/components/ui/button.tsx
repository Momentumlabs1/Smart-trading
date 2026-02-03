import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-[hsl(var(--glass-border)/0.08)] bg-transparent hover:bg-[hsl(var(--glass)/0.06)] hover:border-[hsl(var(--glass-border)/0.15)] text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-[hsl(var(--glass)/0.03)] hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Premium Hero Variants
        hero: "bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] hover:shadow-xl",
        heroOutline: "border border-[hsl(var(--glass-border)/0.08)] bg-transparent text-foreground hover:bg-[hsl(var(--glass)/0.03)] hover:border-primary/50 backdrop-blur-sm",
        // Glass Variants
        glass: "bg-[hsl(var(--glass)/0.03)] backdrop-blur-xl border border-[hsl(var(--glass-border)/0.08)] text-foreground hover:bg-[hsl(var(--glass)/0.06)] hover:border-[hsl(var(--glass-border)/0.15)]",
        // Accent Variants
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-[0_0_30px_hsl(var(--accent)/0.3)]",
        secondaryPurple: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-[0_0_30px_hsl(var(--secondary)/0.3)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
