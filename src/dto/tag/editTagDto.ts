import { ICreateTagReq } from '../../types/tag.type';

export class EditTagDTO {
  private readonly _tagId: string;
  private readonly _name: string;

  get name() {
    return this._name;
  }

  get tagId() {
    return this._tagId;
  }

  constructor(req: ICreateTagReq) {
    this._name = req.body.name;
    this._tagId = req.params.tagId;
  }
}
