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
import TabsComponent from './Tabs/TabsComponent';
import TabsContentComponent from './Tabs/TabsContentComponent';
import TabsListComponent from './Tabs/TabsListComponent';
import TabsTriggerComponent from './Tabs/TabsTriggerComponent';
import ImageComponent from './media/ImageComponent';
import DialogComponent from './collapsable/Dialog/DialogComponent';
import DialogTriggerComponent from './collapsable/Dialog/DialogTriggerComponent';
import DialogContentComponent from './collapsable/Dialog/DialogContentComponent';
import CollapseComponent from './collapsable/Collapse/CollapseComponent';
import CollapseContentComponent from './collapsable/Collapse/CollapseContentComponent';
import CollapseTriggerComponent from './collapsable/Collapse/CollapseTriggerComponent';
import SchedulerComponent from './SchedulerComponent';
import SchedulerFormComponent from './SchedulerFormComponent';

type ComponentMapProps = {
  [key: string]: (params: PropsWithChildrenAndContext) => React.ReactNode;
};
export const ComponentsMap: ComponentMapProps = {
  [ENUM_COMPONENTS.BLOCK]: BlockComponent,
  [ENUM_COMPONENTS.BUTTON]: ButtonComponent,
  [ENUM_COMPONENTS.CHECKBOX]: CheckboxComponent,
  [ENUM_COMPONENTS.COLLAPSE]: CollapseComponent,
  [ENUM_COMPONENTS.COLLAPSECONTENT]: CollapseContentComponent,
  [ENUM_COMPONENTS.COLLAPSETRIGGER]: CollapseTriggerComponent,
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
  [ENUM_COMPONENTS.DIALOG]: DialogComponent,
  [ENUM_COMPONENTS.DIALOGTRIGGER]: DialogTriggerComponent,
  [ENUM_COMPONENTS.DIALOGCONTENT]: DialogContentComponent,
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
  [ENUM_COMPONENTS.IMAGE]: ImageComponent,
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
  [ENUM_COMPONENTS.SCHEDULER]: SchedulerComponent,
  [ENUM_COMPONENTS.SCHEDULER_FORM]: SchedulerFormComponent,
  [ENUM_COMPONENTS.SELECT]: SelectComponent,
  [ENUM_COMPONENTS.TABS]: TabsComponent,
  [ENUM_COMPONENTS.TABSCONTENT]: TabsContentComponent,
  [ENUM_COMPONENTS.TABSLIST]: TabsListComponent,
  [ENUM_COMPONENTS.TABSTRIGGER]: TabsTriggerComponent,
  [ENUM_COMPONENTS.TEXT]: TextComponent,
  [ENUM_COMPONENTS.TEXTAREA]: TextareaComponent,
  [ENUM_COMPONENTS.TIME]: ({ props, ...rest }) => {
    return <InputComponent {...rest} props={{ ...props, type: 'time' }} />;
  },
  [ENUM_COMPONENTS.TOGGLE]: ToggleComponent
};
