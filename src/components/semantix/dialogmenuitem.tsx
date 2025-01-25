// components/dialog-menu-item.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DialogMenuItemProps } from "@/types/typescomponents";

export function DialogMenuItem({
  icon,
  title,
  dialogTitle,
  dialogDescription,
  children,
  onOpen,
}: DialogMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            setIsOpen(true);
            onOpen?.();
          }}
        >
          {icon}
          <span>{title}</span>
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {dialogDescription && (
            <DialogDescription>{dialogDescription}</DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
