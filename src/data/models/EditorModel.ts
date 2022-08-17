import Model from "../../lib/data/Model";

export enum BlockContentInputType {
  FreeText = "free-text-input-field",
  Checkbox = "checkbox-input-field",
  BulletPoint = "bullet-point-input-field",
}

export interface BlockContent {
  title: string;
  inputType: BlockContentInputType;
  inputValue: string;
}

export default class EditorModel extends Model {
  day: Date;
  blockContents: Array<BlockContent>;

  constructor(day: Date, blockContents: Array<BlockContent>) {
    super();
    this.day = day;
    this.blockContents = blockContents;
  }
}
