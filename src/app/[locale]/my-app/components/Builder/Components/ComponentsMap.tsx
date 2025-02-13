'use client';

import { ENUM_COMPONENTS } from '../../interfaces';
import React from 'react';
import { PropsWithChildrenAndContext } from '@/lib/interfaces/interfaces';
import FormComponent from './form/FormComponent';
import InputComponent from './form/inputs/InputComponent';
import ListComponent from './ListComponent';
import TextComponent from './TextComponent';
import TextareaComponent from './form/inputs/TextareaComponent';
import RangeComponent from './form/RangeComponent';
import RatingComponent from './form/RatingComponent';
import SelectComponent from './form/SelectComponent';
import ToggleComponent from './form/ToggleComponent';
import RadioComponent from './form/inputs/RadioComponent';
import DateComponent from './form/date/DateComponent';
import DateRangePickerComponent from './form/date/DateRangePickerComponent';
import DateTimeComponent from './form/date/DateTimeComponent';
import CheckboxComponent from './form/inputs/CheckboxComponent';
import InputFileComponent from './form/inputs/InputFileComponent';
import BlockComponent from './BlockComponent';
import ButtonComponent from './ButtonComponent';
import LinkComponent from './LinkComponent';

type ComponentMapProps = {
  [key: string]: (params: PropsWithChildrenAndContext) => React.ReactNode;
};
export const ComponentsMap: ComponentMapProps = {
  [ENUM_COMPONENTS.BLOCK]: BlockComponent,
  [ENUM_COMPONENTS.BUTTON]: ButtonComponent,
  [ENUM_COMPONENTS.CHECKBOX]: CheckboxComponent,
  [ENUM_COMPONENTS.COLOR]: ({ props, context, ...rest }) => {
    return (
      <InputComponent
        {...rest}
        props={{ ...props, type: 'color' }}
        context={context}
      />
    );
  },
  [ENUM_COMPONENTS.DATE]: DateComponent,
  [ENUM_COMPONENTS.DATETIME]: DateTimeComponent,
  [ENUM_COMPONENTS.DATERANGE]: DateRangePickerComponent,
  [ENUM_COMPONENTS.EMAIL]: ({ props, context, node }) => (
    <InputComponent
      node={node}
      props={{
        ...props,
        type: 'email'
      }}
      context={context}
    />
  ),
  [ENUM_COMPONENTS.FILE]: InputFileComponent,
  [ENUM_COMPONENTS.FORM]: FormComponent,
  [ENUM_COMPONENTS.INPUT]: InputComponent,
  [ENUM_COMPONENTS.LINK]: LinkComponent,
  [ENUM_COMPONENTS.NUMERIC]: ({ props, context, node }) => (
    <InputComponent
      node={node}
      props={{
        ...props,
        type: 'number'
      }}
      context={context}
    />
  ),
  [ENUM_COMPONENTS.RADIO]: RadioComponent,
  [ENUM_COMPONENTS.RANGE]: RangeComponent,
  [ENUM_COMPONENTS.RATING]: RatingComponent,
  [ENUM_COMPONENTS.LIST]: ListComponent,
  [ENUM_COMPONENTS.SELECT]: SelectComponent,
  [ENUM_COMPONENTS.TEXT]: TextComponent,
  [ENUM_COMPONENTS.TEXTAREA]: TextareaComponent,
  [ENUM_COMPONENTS.TIME]: ({ props, ...rest }) => {
    return <InputComponent {...rest} props={{ ...props, type: 'time' }} />;
  },
  [ENUM_COMPONENTS.TOGGLE]: ToggleComponent
};
