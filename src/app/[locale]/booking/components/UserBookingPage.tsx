'use client';

import { useState, useMemo, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { mockProfessionals } from './mockData';
import { isSameDay } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { createBooking } from './actions';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';

export default function UserBookingInterface() {
  const [selectedProfessional, setSelectedProfessional] = useState(
    mockProfessionals[0]
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [step, setStep] = useState<'selection' | 'confirmation' | 'success'>(
    'selection'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const availableDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 60 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return date;
    }).filter(
      (date) => selectedProfessional.weeklySchedule[date.getDay()].enabled
    );
  }, [selectedProfessional]);

  const fetchBookings = async (date: Date) => {
    const dayStart = new Date(date!);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date!);
    dayEnd.setHours(23, 59, 59, 999);
    const { data } = await client.list<any>(ENUM_COLLECTIONS.BOOKINGS, {
      professionalId: selectedProfessional._id,
      date: { $gte: dayStart, $lte: dayEnd }
    });
    return (data as any[]).map((booking) => booking.slot);
  };

  const handleSelectDate = async (date?: Date) => {
    if (!date) return;
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    setSelectedDate(date);
    setSelectedSlot('');
    setStep('selection');

    const daySchedule = selectedProfessional.weeklySchedule[date.getDay()];

    if (!daySchedule.enabled) {
      setAvailableSlots([]);
      return;
    }
    const bookedSlots = (await fetchBookings(date)) || [];

    const slots: string[] = [];
    daySchedule.slots.forEach(({ from, to }) => {
      let [fromHours, fromMinutes] = from.split(':').map(Number);
      const [toHours, toMinutes] = to.split(':').map(Number);

      while (
        fromHours < toHours ||
        (fromHours === toHours && fromMinutes < toMinutes)
      ) {
        const slot = `${String(fromHours).padStart(2, '0')}:${String(
          fromMinutes
        ).padStart(2, '0')}`;

        if (!bookedSlots.includes(slot)) {
          slots.push(slot);
        }

        fromMinutes += selectedProfessional.timeIncrement;
        if (fromMinutes >= 60) {
          fromMinutes -= 60;
          fromHours += 1;
        }
      }
    });

    setAvailableSlots(slots);
  };

  const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bookingDateTime = new Date(selectedDate!);
    const [hours, minutes] = selectedSlot.split(':').map(Number);

    bookingDateTime.setHours(hours, minutes, 0, 0);

    await createBooking({
      name,
      email,
      professionalId: selectedProfessional._id,
      date: bookingDateTime!,
      slot: selectedSlot,
      duration: selectedProfessional?.timeIncrement
    });
    setStep('success');
  };

  const handleReset = () => {
    setSelectedDate(undefined);
    setSelectedSlot('');
    setName('');
    setEmail('');
    setStep('selection');
  };
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto p-6'>
      <div className='col-span-1 space-y-4 p-4 border rounded-xl'>
        <h2 className='text-xl font-bold'>{selectedProfessional.name}</h2>
        <p className='text-muted-foreground'>
          {selectedProfessional.timeIncrement} min
        </p>
        <p className='text-sm'>Central European Time (CET)</p>

        <Select
          value={selectedProfessional.name}
          onValueChange={(name) => {
            const professional = mockProfessionals.find(
              (pro) => pro.name === name
            );
            if (professional) setSelectedProfessional(professional);
          }}>
          <SelectTrigger>{selectedProfessional.name}</SelectTrigger>
          <SelectContent>
            {mockProfessionals.map((pro) => (
              <SelectItem key={pro.name} value={pro.name}>
                {pro.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='col-span-2 space-y-6'>
        {step === 'selection' && (
          <>
            <Calendar
              selected={selectedDate}
              onSelect={handleSelectDate}
              mode='single'
              className='border rounded-xl'
              modifiers={{
                disabled: (date) =>
                  !availableDays.some((d) => isSameDay(d, date)),
                available: availableDays
              }}
              modifiersClassNames={{
                disabled: 'opacity-50 cursor-not-allowed',
                selected: 'bg-blue-500 text-white font-semibold rounded-full',
                available: 'bg-blue-100 text-blue-800 font-medium rounded-full'
              }}
            />

            {selectedDate && (
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>
                  Available Slots for {selectedDate.toDateString()}
                </h3>
                {availableSlots.length > 0 ? (
                  <div className='grid grid-cols-3 gap-2'>
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={
                          selectedSlot === slot ? 'secondary' : 'outline'
                        }
                        onClick={() => setSelectedSlot(slot)}>
                        {slot}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p>No available slots for this day.</p>
                )}
                {selectedSlot && (
                  <Button
                    className='w-full'
                    onClick={() => setStep('confirmation')}>
                    Next
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {step === 'confirmation' && (
          <>
            <button onClick={() => setStep('selection')}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <form className='space-y-4' onSubmit={handleConfirm}>
              <h3 className='text-lg font-semibold'>Enter Your Details</h3>
              <label htmlFor='name' className='text-lg font-semibold'>
                Name
              </label>
              <Input
                required
                id='name'
                placeholder='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor='email' className='text-lg font-semibold'>
                Email
              </label>
              <Input
                required
                type='email'
                id='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button className='w-full' type='submit'>
                Confirm Booking
              </Button>
            </form>
          </>
        )}

        {step === 'success' && (
          <div className='space-y-4 text-center'>
            <h3 className='text-2xl font-bold'>Booking Confirmed!</h3>
            <p>
              Thank you, {name}. Your appointment is scheduled for{' '}
              {selectedSlot} on {selectedDate?.toDateString()}.
            </p>
            <button type='button' onClick={handleReset}>
              Retour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
