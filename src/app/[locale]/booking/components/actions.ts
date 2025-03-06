'use server';

import { nanoid } from 'nanoid';
import clientMongoServer from "@/lib/mongo/initMongoServer";
import { ENUM_COLLECTIONS } from "@/lib/mongo/interfaces";


interface Booking {
  name: string;
  email: string;
  professionalId: string;
  date: Date;
  duration: number;
  slot: string;
}

export const createBooking = async (booking: Booking) => {
  const { data } = await clientMongoServer.get(ENUM_COLLECTIONS.BOOKINGS, {
    professionalId: booking.professionalId,
    date: booking.date,
    slot: booking.slot,
  });

  if (data) {
    throw new Error('This slot is already booked.');
  }

  await clientMongoServer.create(ENUM_COLLECTIONS.BOOKINGS, {
    _id: nanoid(),
    ...booking,
    createdAt: new Date(),
    status: 'confirmed',
  });
};