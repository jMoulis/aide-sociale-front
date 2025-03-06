import { nanoid } from 'nanoid';

interface Slot {
  from: string
  to: string
}

interface DaySchedule {
  enabled: boolean
  slots: Slot[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface WeeklySchedule extends Array<DaySchedule> { }

interface ProfessionalSchedule {
  _id: string
  name: string
  timeIncrement: number
  weeklySchedule: WeeklySchedule
}

export const mockProfessionals: ProfessionalSchedule[] = [
  {
    _id: "dspZ0fIdslmEguBJKw3ce",
    name: 'John Doe',
    timeIncrement: 30,
    weeklySchedule: [
      { enabled: false, slots: [] }, // Sunday
      { enabled: true, slots: [{ from: '09:00', to: '12:00' }, { from: '14:00', to: '18:00' }] }, // Monday
      { enabled: true, slots: [{ from: '10:00', to: '16:00' }] }, // Tuesday
      { enabled: true, slots: [{ from: '09:00', to: '12:00' }, { from: '13:00', to: '17:00' }] }, // Wednesday
      { enabled: true, slots: [{ from: '11:00', to: '15:00' }] }, // Thursday
      { enabled: true, slots: [{ from: '09:00', to: '12:00' }] }, // Friday
      { enabled: false, slots: [] }, // Saturday
    ]
  },
  {
    _id: "dspZ0fIdvxcvslmEguBJKw3ce",
    name: 'Jane Smith',
    timeIncrement: 60,
    weeklySchedule: [
      { enabled: false, slots: [] }, // Sunday
      { enabled: true, slots: [{ from: '08:00', to: '12:00' }] }, // Monday
      { enabled: false, slots: [] }, // Tuesday
      { enabled: true, slots: [{ from: '14:00', to: '18:00' }] }, // Wednesday
      { enabled: true, slots: [{ from: '09:00', to: '12:00' }] }, // Thursday
      { enabled: true, slots: [{ from: '10:00', to: '16:00' }] }, // Friday
      { enabled: false, slots: [] }, // Saturday
    ]
  }
]
