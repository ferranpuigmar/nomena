import { textVariants, type TextProps } from "./text.config";
import { Slot } from "@radix-ui/react-slot";
import { cn } from '@src/lib/cn'

export const Text = ({ className, variant, color, font, asChild = false, ...props }: TextProps) => {
  const Comp = asChild ? Slot : "span";

  return <Comp data-slot="text" className={cn(textVariants({ variant, color, font }), className)} {...props} />;
};
