import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { Button } from '@src/app/shared/components/button/button';
import { useClickOutside } from '@src/app/shared/hooks/useClickOutside';
import { useIsMobile } from '@src/app/shared/hooks/useMobile';
import React, { useRef, useState } from 'react'

interface DropdownMenuProps {
    dropDownButton: React.ReactNode;
    dropDownItem: React.ReactNode;
}

const Dropdown = ({ dropDownButton, dropDownItem }: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const isMobile = useIsMobile()
    const containerRef = useRef<HTMLDivElement>(null)

    useClickOutside({
        ref: containerRef as React.RefObject<HTMLElement>,
        handler: () => setIsOpen(false),
        eventListener: 'mouseleave',
        listenOn: 'ref',
        enabled: !isMobile && isOpen,
    })

    if (isMobile) {
        return (
            <div>
                <button onClick={() => setIsOpen(true)}>
                    {dropDownButton}
                </button>

                <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                    <div className="fixed inset-0 flex items-end justify-center">
                        <DialogPanel className="w-full rounded-t-2xl bg-white p-4">
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
            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="primary"
                color='on-primary'
            >
                {dropDownButton}
            </Button>

            {isOpen && (
                <div className="absolute left-0 top-full z-10 w-[200px] pt-1">
                    <div className="rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5">
                        {dropDownItem}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dropdown
