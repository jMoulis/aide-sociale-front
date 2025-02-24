export interface Resource {
  id: string
  name: string
  // any other fields needed
}

export enum TimelineViewScale {
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  DAY = 'DAY',
  YEAR = 'YEAR'
}