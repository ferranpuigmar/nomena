import { cn } from '@src/lib/cn';
import { tagVariants, type TagProps } from './tag.config';

const Tag = ({ variant = 'default', children, className, ...props }: TagProps) => {
  return (
    <div className={cn(tagVariants({ variant }), className)} {...props}>
      {children}
    </div>
  )
}

export default Tag