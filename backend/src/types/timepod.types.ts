/* eslint-disable no-unused-vars */
export enum TimePodStatus {
  Updated = 'updated',
  Created = 'created',
  Closed = 'closed',
  Error = 'error',
  Unauthorized = 'unauthorized',
  CompanyNotFound = 'company_not_found',
  NoCompany = 'no_company',
  NoTimePodNr = 'no_timepod_nr',
  NewBadge = 'new_badge',
  CarNotFound = 'car_not_found',
  MultipleCarsActive = 'multiple_cars_active',
}

export type TimePodResponse = {
  status: TimePodStatus
  data?: {
    [x: string]: string | number | string[] | boolean | TimePodResponse['data']
  }
  error?: string
}
