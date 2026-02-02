import { useMemo, useState } from 'react'

export interface PopoverHook {
  readonly open: boolean
  setOpen(open: boolean): void
  /** @alias setOpen */
  onOpenChange(open: boolean): void
}

export function usePopover(): PopoverHook {
  const [open, setOpen] = useState(false)
  return useMemo(() => ({
    open,
    setOpen,
    onOpenChange: setOpen,
  }), [open, setOpen])
}
