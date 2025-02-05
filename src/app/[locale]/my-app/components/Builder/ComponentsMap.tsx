'use client';

import { ENUM_COMPONENTS } from '../interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import React from 'react';
import Button from '@/components/buttons/Button';
import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import FormComponent from './Components/FormComponent';
import { useFormContext } from './Components/FormContext';
import InputComponent from './Components/InputComponent';
import RepeatComponent from './Components/RepeatComponent';

type ComponentMapProps = {
  [key: string]: (params: PropsWithChildrenAndContext) => React.ReactNode;
};
export const ComponentsMap: ComponentMapProps = {
  [ENUM_COMPONENTS.TEXT]: ({ props, context }) => {
    const { getFormFieldValue } = useFormContext();
    const value = getFormFieldValue(context.dataset);
    const CustomTag = `${context.as || 'p'}`;
    return <CustomTag {...props}>{value || context.textContent}</CustomTag>;
  },
  [ENUM_COMPONENTS.INPUT]: InputComponent,
  [ENUM_COMPONENTS.BLOCK]: ({ props, children, context }) => {
    const { className, ...rest } = props;
    const CustomTag = `${context.as || 'div'}` as any;
    return (
      <CustomTag className={cn('p-1', className)} {...rest}>
        {children}
      </CustomTag>
    );
  },
  [ENUM_COMPONENTS.FORM]: FormComponent,
  [ENUM_COMPONENTS.BUTTON]: ({ props, children }) => {
    return <Button {...props}>{children}</Button>;
  },
  [ENUM_COMPONENTS.REPEAT]: RepeatComponent
};
