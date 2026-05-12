import { cva, type VariantProps } from "class-variance-authority";

export const textVariants = cva("", {
    variants: {
        variant: {
            "display": "text-[32px] leading-[37px] font-bold font-heading",
            h1: "text-[28px] leading-[34px] font-bold font-heading",
            h2: "text-[22px] leading-[28px] font-semibold font-heading",
            h3: "text-[20px] leading-[26px] font-bold font-heading",
            h4: "text-[18px] leading-[23px] font-bold font-heading",
            "subtitle-1": "text-[16px] leading-[22px] font-semibold [&_strong]:font-bold",
            "subtitle-2": "text-[15px] leading-[21px] font-semibold [&_strong]:font-bold",
            "body-1": "text-[14px] leading-[21px] font-medium [&_strong]:font-bold",
            "body-2": "text-[13px] leading-[19px] font-semibold [&_strong]:font-semibold",
            "caption": "text-[12px] leading-[17px] font-regular [&_strong]:font-semibold",
            "overline": "text-[11px] leading-[16px] font-medium [&_strong]:font-semibold",
        },
        font: {
            sans: "font-sans",
            heading: "font-heading",
        },
        color: {
            primary: "text-fg-primary",
            secondary: "text-fg-secondary",
            tertiary: "text-fg-tertiary",
            inverse: "text-fg-inverse",
        },
        defaultVariants: {
            color: "primary",
            variant: "body-1",
            font: "sans"
        }
    }
});

export type TextVariant = NonNullable<VariantProps<typeof textVariants>["variant"]>;
export type TextColor = NonNullable<VariantProps<typeof textVariants>["color"]>;
export type TextFont = NonNullable<VariantProps<typeof textVariants>["font"]>;

export interface TextProps extends React.ComponentProps<"span">, Omit<VariantProps<typeof textVariants>, "color" | "font"> {
  asChild?: boolean;
  color?: TextColor;
  font?: TextFont;
}