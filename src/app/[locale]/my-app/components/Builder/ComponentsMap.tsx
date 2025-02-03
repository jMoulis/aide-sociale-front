import Input from '@/components/form/Input';
import { ENUM_COMPONENTS } from '../interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import React, { PropsWithChildren } from 'react';

interface PropsWithChildrenAndContext extends PropsWithChildren {
  context: any;
  props: any;
}
type ComponentMapProps = {
  [key: string]: (params: PropsWithChildrenAndContext) => React.ReactNode;
};
export const ComponentsMap: ComponentMapProps = {
  [ENUM_COMPONENTS.TEXT]: ({ props, context }) => {
    const CustomTag = `${context.as || 'p'}`;
    return <CustomTag {...props}>{context.textContent}</CustomTag>;
  },
  [ENUM_COMPONENTS.INPUT]: ({ props }) => <Input {...props} />,
  [ENUM_COMPONENTS.BLOCK]: ({ props, children, context }) => {
    const { className, ...rest } = props;
    const CustomTag = `${context.as || 'div'}`;
    return (
      <CustomTag className={cn('p-1', className)} {...rest}>
        {children}
      </CustomTag>
    );
  }
};
