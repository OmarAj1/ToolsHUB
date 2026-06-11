import React from 'react';
import { LAYOUT } from '@/constants';
import { cn } from '@/lib/utils';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ToolContainer({ children, className, ...props }: Props) {
  return (
    <div className={cn(LAYOUT.container, className)} {...props}>
      <div className={LAYOUT.contentWrapper}>
        {children}
      </div>
    </div>
  );
}
