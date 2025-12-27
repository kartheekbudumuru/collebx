import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        success: "border-transparent bg-success/10 text-success",
        warning: "border-transparent bg-warning/10 text-warning",
        accent: "border-transparent bg-accent/10 text-accent",
        ai: "border-transparent gradient-ai text-primary-foreground",
        web: "border-transparent gradient-web text-primary-foreground",
        iot: "border-transparent gradient-iot text-primary-foreground",
        cyber: "border-transparent gradient-cyber text-primary-foreground",
        skill: "border-border bg-muted/50 text-muted-foreground hover:bg-muted",
        skillHave: "border-transparent bg-success/15 text-success font-medium",
        skillNeed: "border-transparent bg-warning/15 text-warning font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
