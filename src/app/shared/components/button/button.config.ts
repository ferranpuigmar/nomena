import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
    `focus-visible:shadow-none inline-flex items-center justify-center gap-2 
    whitespace-nowrap rounded-md font-body font-medium transition-all disabled:cursor-not-allowed 
    disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-4 
    shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring 
    focus-visible:ring-ring/50 focus-visible:ring-[3px] 
    cursor-pointer`,
    {
        variants: {
            variant: {
                default: 'bg-brand-700 hover:bg-brand-900 text-fg-on-accent font-semibold',
                danger: 'bg-error hover:bg-error/90 text-fg-on-accent',
                ghost: 'bg-transparent text-brand-700 hover:bg-canvas-surface-hover hover:text-brand-900',
                'ghost-accent': 'bg-transparent hover:bg-accent-primary/10 text-accent-primary border border-accent-primary',
                link: 'bg-transparent hover:text-accent-primary text-fg-primary',
                'link-accent': 'bg-transparent hover:text-accent-primary-hover text-accent-primary',
                secondary: 'bg-canvas-primary border border-neutral-400 text-fg-primary font-semibold hover:bg-neutral-200',
            },
            size: {
                sm: 'px-3 py-1.5 text-sm',
                default: 'px-6 py-3 text-[15px]',
                md: 'px-6 py-3 text-md',
            },
            color: {
                default: '',
                'on-primary': 'text-black hover:text-white',
            },
            isSelected: {
                true: '',
                false: '',
            },
        },
        compoundVariants: [
            {
                variant: 'default',
                isSelected: true,
                className: 'bg-brand-900 hover:bg-brand-900',
            },
            {
                variant: 'secondary',
                isSelected: true,
                className: 'bg-brand-700 border-brand-700 text-fg-on-accent hover:bg-brand-900 hover:text-fg-on-accent',
            },
            {
                variant: 'ghost',
                isSelected: true,
                className: 'bg-brand-700 text-fg-on-accent hover:bg-brand-900 hover:text-fg-on-accent',
            },
        ],
        defaultVariants: {
            color: 'default',
            variant: "default",
            size: "default",
            isSelected: false,
        }
    }
);

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
export type ButtonSize    = VariantProps<typeof buttonVariants>['size'];
export type ButtonColor   = VariantProps<typeof buttonVariants>['color'];

export interface ButtonProps extends Omit<React.ComponentProps<"button">, "color">, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    to?: string;
    end?: boolean;
    isActive?: boolean;
    activeVariant?: VariantProps<typeof buttonVariants>['variant'];
    isSelected?: boolean;
}
