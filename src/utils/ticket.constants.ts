import { TicketStatus } from '../types/ticket.type';

/**
 * @description 可用於編輯的狀態，但不給核銷
 */
export const validEditStatus = Object.keys(TicketStatus).filter(
  (status) => status !== TicketStatus.verified,
);
