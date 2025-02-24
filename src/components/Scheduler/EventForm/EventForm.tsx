// Example usage in a component
import React, { useEffect, useState } from 'react';
import { useCalendarStore } from '../store/useCalendarStore';
import { CalendarEvent } from '../interfaces';
import { v4 as uuid } from 'uuid';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger
} from '@/components/ui/sheet';
import { CalendarIcon, UsersIcon, MapPinIcon } from 'lucide-react';
import FormLabel from '../../form/FormLabel';
import Input from '../../form/Input';
import Textarea from '../../form/Textarea';
import { Switch } from '../../ui/switch';
import CancelButton from '../../buttons/CancelButton';
import SaveButton from '../../buttons/SaveButton';
import { removeObjectFields } from '@/lib/utils/utils';
import Button from '@/components/buttons/Button';
import { DateTimePicker } from '@/components/form/Date/DateTimePicker';
import { DatePicker } from '@/components/form/Date/DatePicker';
import DeleteButton from '@/components/buttons/DeleteButton';

const defaultEvent = () => ({
  _id: uuid(),
  summary: 'New Event',
  start: new Date(),
  end: new Date(new Date().getTime() + 60 * 60 * 1000),
  attendees: [],
  allDay: false,
  color: '#4285f4',
  title: 'New Event',
  new: true
});

type Props = {
  customForm?: React.ReactNode | null;
  ref?: any;
};
export const EventForm: React.FC<Props> = ({ customForm }) => {
  const {
    addEvent,
    upsertEvent,
    selectedEvent,
    setSelectedEvent,
    eventsCallbacks
  } = useCalendarStore();

  const [newEvent, setNewEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (selectedEvent) {
      const parsedFormEvent = removeObjectFields(selectedEvent, [
        'startCol',
        'endCol',
        'rowIndex'
      ] as any);
      setNewEvent(parsedFormEvent as CalendarEvent);
    }
  }, [selectedEvent, addEvent]);

  const handeInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewEvent((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleChangeDate = (date: Date | null, name: string) => {
    // const { name, value } = e.target;
    // const date = new Date(value);
    setNewEvent((prev) => (prev ? { ...prev, [name]: date } : null));
  };

  const handleAllDayChange = (checked: boolean) => {
    setNewEvent((prev) => (prev ? { ...prev, allDay: checked } : null));
  };

  const handleSave = async () => {
    if (!newEvent) return;
    if (!customForm) {
      upsertEvent(newEvent._id, newEvent);
    }

    await eventsCallbacks?.onUpsertEvent?.(newEvent._id, newEvent);
    setSelectedEvent(null);
    setNewEvent(defaultEvent);
  };

  const handleCreateEvent = () => {
    const event = defaultEvent();
    addEvent(event);
    setSelectedEvent(event);
  };

  const handleDelete = async () => {};

  const handleOpenChange = (state: boolean) => {
    if (!state) {
      setSelectedEvent(null);
    }
  };

  return (
    <div className='p-4'>
      <Sheet open={Boolean(selectedEvent)} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button onClick={handleCreateEvent}>+ Create Event</Button>
        </SheetTrigger>

        <SheetContent
          side='right'
          className='w-[400px] sm:w-[480px] flex flex-col'>
          <SheetHeader>
            <SheetTitle>Event Details</SheetTitle>
            <SheetDescription>Create or edit a calendar event</SheetDescription>
          </SheetHeader>

          {/* FORM FIELDS */}
          {customForm || (
            <div className='flex-1 overflow-auto space-y-4 py-4'>
              <div>
                <FormLabel htmlFor='title' className='mb-1'>
                  Title
                </FormLabel>
                <Input
                  id='title'
                  name='title'
                  placeholder='Add title'
                  value={newEvent?.title || ''}
                  onChange={handeInputChange}
                />
              </div>

              {/* All Day Switch */}
              <div className='flex items-center justify-between'>
                <FormLabel
                  htmlFor='allDay'
                  className='flex items-center space-x-2'>
                  <span>All Day</span>
                </FormLabel>
                <Switch
                  id='allDay'
                  checked={newEvent?.allDay}
                  onCheckedChange={(checked) => handleAllDayChange(!!checked)}
                />
              </div>

              {/* Start/End */}
              <div className='space-y-2'>
                <FormLabel className='flex items-center space-x-2'>
                  <CalendarIcon className='w-4 h-4' />
                  <span>
                    {newEvent?.allDay ? 'Start Date' : 'Start Date/Time'}
                  </span>
                </FormLabel>
                {newEvent?.allDay ? (
                  <DatePicker
                    date={newEvent?.start}
                    onChange={(date) => handleChangeDate(date || null, 'start')}
                  />
                ) : (
                  <DateTimePicker
                    date={newEvent?.start}
                    onChange={(date) => handleChangeDate(date || null, 'start')}
                  />
                )}
                <FormLabel className='flex items-center space-x-2'>
                  <CalendarIcon className='w-4 h-4' />
                  <span>{newEvent?.allDay ? 'End Date' : 'End Date/Time'}</span>
                </FormLabel>
                {newEvent?.allDay ? (
                  <DatePicker
                    date={newEvent?.end}
                    onChange={(date) => handleChangeDate(date || null, 'end')}
                  />
                ) : (
                  <DateTimePicker
                    date={newEvent?.end}
                    onChange={(date) => handleChangeDate(date || null, 'end')}
                  />
                )}
              </div>

              {/* Location */}
              <div>
                <FormLabel
                  htmlFor='location'
                  className='flex items-center space-x-2'>
                  <MapPinIcon className='w-4 h-4' />
                  <span>Location</span>
                </FormLabel>
                <Input
                  id='location'
                  name='location'
                  placeholder='Where is it?'
                  value={newEvent?.location}
                  onChange={handeInputChange}
                />
              </div>
              <div>
                <FormLabel
                  htmlFor='attendees'
                  className='flex items-center space-x-2'>
                  <UsersIcon className='w-4 h-4' />
                  <span>Attendees</span>
                </FormLabel>
                {/* <Input
                id='attendees'
                name='attendees'
                placeholder='john@doe.com, jane@doe.com'
                value={newEvent.attendees}
                onChange={handeInputChange}
              /> */}
              </div>

              {/* Description */}
              <div>
                <FormLabel htmlFor='description'>Description</FormLabel>
                <Textarea
                  id='description'
                  name='description'
                  placeholder='Add details or notes...'
                  value={newEvent?.description}
                  onChange={handeInputChange}
                />
              </div>

              {/* Color */}
              <div className='flex items-center space-x-2'>
                <FormLabel>Color</FormLabel>
                <Input
                  name='color'
                  type='color'
                  value={newEvent?.color}
                  onChange={handeInputChange}
                  className='w-10 p-1'
                />
                <span>{newEvent?.color}</span>
              </div>
            </div>
          )}

          {/* FOOTER */}

          <SheetFooter className='flex justify-end space-x-2'>
            <SaveButton onClick={handleSave} />
            <CancelButton onClick={() => setSelectedEvent(null)} />
            <DeleteButton onClick={handleDelete} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
