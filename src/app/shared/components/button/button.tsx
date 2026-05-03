import { NavLink } from 'react-router-dom'
import { cn } from '@src/lib/cn'
import { buttonVariants, type ButtonProps } from "./button.config";


export const Button = ({ variant = 'default', size = 'default', className, children, to, end, activeVariant, ...rest }: ButtonProps) => {
  if (to !== undefined) {
    return (
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          cn(buttonVariants({ variant: isActive && activeVariant ? activeVariant : variant, size }), className)
        }
      >
        {children}
      </NavLink>
    )
  }

  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
