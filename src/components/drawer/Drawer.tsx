'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import React, { JSX } from 'react';

const _SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const;

type Props = {
  side: (typeof _SHEET_SIDES)[number];
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  Trigger?: JSX.Element;
  modal?: boolean;
};
export function Drawer({ side, children, Trigger, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{Trigger ? Trigger : 'Open Dialog'}</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>lool</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
