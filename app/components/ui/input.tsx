import * as React from "react"

import {cn} from "app/utils"
import {cva, VariantProps} from "class-variance-authority";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
    VariantProps<typeof inputVariants>;


const inputVariants = cva("flex  w-full rounded-md bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50", {
    variants: {
        variant: {
            default: "h-9 focus-visible:ring-1 focus-visible:ring-ring border border-input shadow-sm",
            ghost: ""
        }
    },
    defaultVariants: {
        variant: "default"
    }
})


const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, variant, type, ...props}, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    inputVariants({variant}),
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export {Input}
