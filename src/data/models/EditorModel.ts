import Model from "../../lib/data/Model";

export interface BlockContent {
  title: string;
  inputType: string;
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
