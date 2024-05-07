export interface ITimestamp {
  createdAt: Date;
  updatedAt: Date;
}

export enum Status {
  active = 'active',
  disabled = 'disabled',
}
