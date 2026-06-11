import React from 'react';
import { FORMS } from '@/constants';
import { cn } from '@/lib/utils';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  readOnly?: boolean;
}

export function TextArea({ label, className, readOnly, ...props }: TextAreaProps) {
  return (
    <div>
      {label && <label className={FORMS.label}>{label}</label>}
      <textarea
        readOnly={readOnly}
        className={cn(readOnly ? FORMS.textareaReadOnly : FORMS.textarea, className)}
        {...props}
      />
    </div>
  );
}
