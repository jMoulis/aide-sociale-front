import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { cn } from '@/lib/utils/shadcnUtils';

import React from 'react';

type Props = {
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};
function CardComponent({ title, description, children, className }: Props) {
  return (
    <Card className={cn('m-4', className)}>
      {title || description ? (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      ) : null}
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default CardComponent;
