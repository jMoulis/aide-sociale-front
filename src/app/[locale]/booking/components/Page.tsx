'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { format } from 'date-fns';

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];
const id = 'dspZ0fIdslmEguBJKw3ce';

export default function AdminBookingPage() {
  const [schedule, setSchedule] = useState(
    days.map((day) => ({
      day,
      enabled: day !== 'Sunday' && day !== 'Saturday',
      slots: [{ from: '09:00', to: '17:00' }]
    }))
  );
  const [timeIncrement, setTimeIncrement] = useState(60);
  const [bookings, setBookings] = useState<any>([]);

  useEffect(() => {
    client
      .list<any>(ENUM_COLLECTIONS.BOOKINGS, { professionalId: id })
      .then(({ data }) => {
        setBookings(data || []);
      });
  }, []);

  const updateSlot = (
    dayIndex: number,
    slotIndex: number,
    key: 'from' | 'to',
    value: string
  ) => {
    setSchedule((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              slots: day.slots.map((slot, j) =>
                j === slotIndex ? { ...slot, [key]: value } : slot
              )
            }
          : day
      )
    );
  };

  const addSlot = (dayIndex: number) => {
    setSchedule((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              slots: [...day.slots, { from: '09:00', to: '17:00' }]
            }
          : day
      )
    );
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    setSchedule((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              slots: day.slots.filter((_, j) => j !== slotIndex)
            }
          : day
      )
    );
  };

  const toggleDay = (dayIndex: number) => {
    setSchedule((prev) =>
      prev.map((day, i) =>
        i === dayIndex ? { ...day, enabled: !day.enabled } : day
      )
    );
  };

  const handleSave = () => {
    console.log({ schedule, timeIncrement });
  };

  return (
    <div className='max-w-3xl p-6 space-y-6 flex flex-1 jus'>
      <div className='space-y-4'>
        <h2 className='text-2xl font-bold'>Bookings</h2>
        <div className='border rounded-lg overflow-hidden'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='p-2 text-left'>Date</th>
                <th className='p-2 text-left'>Time</th>
                <th className='p-2 text-left'>Name</th>
                <th className='p-2 text-left'>Email</th>
                <th className='p-2 text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking: any, index: number) => (
                <tr key={index} className='border-t'>
                  <td className='p-2'>
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className='p-2'>
                    {format(new Date(booking.date), 'HH:mm')}
                  </td>
                  <td className='p-2'>{booking.name}</td>
                  <td className='p-2'>{booking.email}</td>
                  <td className='p-2'>{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='flex-1 space-y-4'>
        <h1 className='text-2xl font-bold'>Weekly Availability</h1>

        <div className='space-y-2'>
          <label className='font-semibold'>Time Increment (minutes)</label>
          <Select
            value={String(timeIncrement)}
            onValueChange={(value) => setTimeIncrement(Number(value))}>
            <SelectTrigger>{timeIncrement} min</SelectTrigger>
            <SelectContent>
              <SelectItem value='15'>15 min</SelectItem>
              <SelectItem value='30'>30 min</SelectItem>
              <SelectItem value='45'>45 min</SelectItem>
              <SelectItem value='60'>60 min</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {schedule.map((day, dayIndex) => (
          <div key={day.day} className='border p-4 rounded-xl space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='font-semibold'>{day.day}</span>
              <Switch
                checked={day.enabled}
                onCheckedChange={() => toggleDay(dayIndex)}
              />
            </div>
            {day.enabled && (
              <div className='space-y-2'>
                {day.slots.map((slot, slotIndex) => (
                  <div key={slotIndex} className='flex items-center gap-2'>
                    <Input
                      type='time'
                      value={slot.from}
                      onChange={(e) =>
                        updateSlot(dayIndex, slotIndex, 'from', e.target.value)
                      }
                    />
                    <span>-</span>
                    <Input
                      type='time'
                      value={slot.to}
                      onChange={(e) =>
                        updateSlot(dayIndex, slotIndex, 'to', e.target.value)
                      }
                    />
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => removeSlot(dayIndex, slotIndex)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button size='sm' onClick={() => addSlot(dayIndex)}>
                  + Add Slot
                </Button>
              </div>
            )}
          </div>
        ))}
        <Button className='w-full' onClick={handleSave}>
          Save Schedule
        </Button>
      </div>
    </div>
  );
}
