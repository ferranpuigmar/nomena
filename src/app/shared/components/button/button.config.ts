import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
    `focus-visible:shadow-none inline-flex items-center justify-center gap-2 
    whitespace-nowrap rounded-md font-medium transition-all disabled:cursor-not-allowed 
    disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-4 
    shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring 
    focus-visible:ring-ring/50 focus-visible:ring-[3px] 
    cursor-pointer`,
    {
        variants: {
            variant: {
                default: 'bg-accent-primary hover:bg-accent-primary-hover text-text-on-accent',
                danger: 'bg-error hover:bg-error/90 text-text-on-accent',
                ghost: 'bg-transparent hover:bg-bg-surface-hover text-text-primary border border-border-default',
                'ghost-accent': 'bg-transparent hover:bg-accent-primary/10 text-accent-primary border border-accent-primary',
                link: 'bg-transparent hover:text-accent-primary text-text-primary',
                'link-accent': 'bg-transparent hover:text-accent-primary-hover text-accent-primary',
            },
            size: {
                sm: 'px-3 py-1.5 text-sm',
                default: 'px-4 py-2 text-sm',
                md: 'px-6 py-3 text-md',
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

export interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    to?: string;
    end?: boolean;
    isActive?: boolean;
    activeVariant?: VariantProps<typeof buttonVariants>['variant'];
}
