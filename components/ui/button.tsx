import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "ghost"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, ...props }, ref) => {
    return (
      <button
        className={`rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          variant === "outline"
            ? "border border-input bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
            : variant === "ghost"
              ? "hover:bg-accent hover:text-accent-foreground"
              : "bg-[#FFD600] text-black shadow-sm hover:bg-[#FFE600]"
        } ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"

