import { ShareCodeModel } from '../models/shareCode';
import moment from 'moment';
import { Types } from 'mongoose';

export class ShareCodeRepository {
  public findByShareCode = async (shareCode: string) => {
    return ShareCodeModel.findOne({
      shareCode: shareCode,
      isUsed: false,
      expiredAt: { $gt: moment().toDate() },
    });
  };

  public create = async (ticketId: Types.ObjectId, shareCode: string) =>
    await ShareCodeModel.create({
      ticketId: ticketId,
      shareCode: shareCode,
      expiredAt: moment().add(5, 'minute').toDate(),
      isUsed: false,
    });

  public update = async (ticketId: Types.ObjectId) =>
    await ShareCodeModel.updateOne({ ticketId: ticketId }, { isUsed: true });
}
