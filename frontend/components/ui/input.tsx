import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring",
        className
      )}
      {...props}
    />
  )
}

export { Input }
