import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

export const tagVariants = cva(
    'py-0.5 px-2 rounded text-xs inline-flex items-center ',
    {
        variants: {
            variant: {
                default: 'text-neutral-500',
                'gender-female': 'text-gender-plum bg-gender-plum-light',
                'gender-unisex': 'bg-green-100 text-green-800',
                'gender-male': 'bg-blue-100 text-blue-800',
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
);

export type TagVariant = VariantProps<typeof tagVariants>['variant'];

export interface TagProps extends Omit<React.ComponentProps<"div">, "color">, VariantProps<typeof tagVariants> {
    variant?: VariantProps<typeof tagVariants>['variant'];
    children: React.ReactNode;
}