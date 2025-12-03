import * as React from "react"

// Utility function for conditionally joining classNames together
import { cn } from "@/lib/utils"
/**
 * Props for the Textarea component.
 * Extends standard textarea HTML attributes.
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, ...rest }: TextareaProps,
    ref: React.ForwardedRef<HTMLTextAreaElement>
  ) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...rest}
      />
    );
  }
);

// Set displayName for better debugging and React DevTools integration
Textarea.displayName = "Textarea";

export { Textarea };
