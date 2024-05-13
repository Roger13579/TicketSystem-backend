import { TUpdateGroupReq } from '../types/group.type';

export class UpdateGroupDto {
  private readonly _groupId: string;
  private readonly _title: string;
  private readonly _content?: string;

  get title() {
    return this._title;
  }
  get content() {
    return this._content;
  }
  get groupId() {
    return this._groupId;
  }

  constructor(req: TUpdateGroupReq) {
    this._groupId = req.params['groupId'];
    this._title = req.body.title;
    this._content = req.body.content;
  }
}
