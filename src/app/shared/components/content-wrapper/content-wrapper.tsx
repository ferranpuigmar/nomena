type ContentWrapperProps = {
  children: React.ReactNode
  className?: string
  hasFullLayout?: boolean
}

const defaultClassname = 'mx-auto w-full max-w-7xl px-4 py-8';
const fullClassname = 'w-full h-full';

export function ContentWrapper({ children, className, hasFullLayout }: ContentWrapperProps) {
  return (
    <div className={`${hasFullLayout ? fullClassname : defaultClassname} ${className ?? ''}`}>
      {children}
    </div>
  )
}
