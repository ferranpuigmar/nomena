import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { Button } from '@src/app/shared/components/button/button';
import { useClickOutside } from '@src/app/shared/hooks/useClickOutside';
import { useIsMobile } from '@src/app/shared/hooks/useMobile';
import React, { useRef, useState } from 'react'
import ArrowDown from '@src/assets/icons/chevron-down.svg?react'
import FilterIcon from '@src/assets/icons/filter.svg?react'
import type { ButtonSize } from '@src/app/shared/components/button/button.config';

interface DropdownMenuProps {
    dropDownButton: React.ReactNode;
    dropDownItem: React.ReactNode;
    className?: string;
}

interface DropdownItemProps {
    children: React.ReactNode;
    onClick: () => void;
    icon?: React.ReactNode;
    isOpen: boolean;
    size?: ButtonSize;
    className?: string;
}

const DropDownButton = ({ children, onClick, icon, isOpen, size, className }: DropdownItemProps) => {
    return (
        <Button variant="secondary" onClick={onClick} className={`flex gap-0.5 ${className}`} size={size}>
            {icon && <span className="mr-2 text-accent-primary">{icon}</span>}
            {children}
            <ArrowDown className={`ml-2 transition-transform text-accent-primary ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
    );
}

const Dropdown = ({ dropDownButton, dropDownItem, className }: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const isMobile = useIsMobile()
    const containerRef = useRef<HTMLDivElement>(null)

    useClickOutside({
        ref: containerRef as React.RefObject<HTMLElement>,
        handler: () => setIsOpen(false),
        eventListener: isMobile ? 'touchstart' : 'mouseleave',
        listenOn: 'ref',
        enabled: !isMobile && isOpen,
    })

    if (isMobile) {
        return (
            <div>
                <DropDownButton isOpen={isOpen} onClick={() => setIsOpen(true)} size='sm' className={className}>
                    {dropDownButton}
                </DropDownButton>
                <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                    <DialogBackdrop 
                        transition
                        className="fixed inset-0 bg-black/30 transition-opacity duration-300 ease-in-out data-closed:opacity-0" 
                    />
                    <div className="fixed inset-0 flex items-end justify-center">
                        <DialogPanel 
                            transition
                            className="w-full rounded-t-2xl bg-white p-4 transition-transform duration-300 ease-in-out data-closed:translate-y-full"
                        >
                            {dropDownItem}
                        </DialogPanel>
                    </div>
                </Dialog>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="relative inline-block text-left"
        >
            <DropDownButton isOpen={isOpen} onClick={() => setIsOpen(true)} icon={<FilterIcon />} size='sm' className={className}>
                {dropDownButton}
            </DropDownButton>

            {isOpen && (
                <div className="absolute left-0 top-full z-10 w-[200px] pt-1">
                    {dropDownItem}
                </div>
            )}
        </div>
    )
}

export default Dropdown
