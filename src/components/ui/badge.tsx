import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-orange-500 text-white',
        secondary: 'border-transparent bg-white/10 text-white',
        destructive: 'border-transparent bg-red-500 text-white',
        outline: 'border-orange-500/50 text-orange-400',
        power: 'border-transparent bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold',
        blue: 'border-transparent bg-gradient-to-r from-blue-500 to-cyan-400 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
