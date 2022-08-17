import Model from "../../lib/data/Model";

export default class EditorModel extends Model {
  day: Date;
  blockContents: Array<{
    title: string;
    inputType: string;
    inputValue: string;
  }>;

  constructor(
    day: Date,
    blockContents: Array<{
      title: string;
      inputType: string;
      inputValue: string;
    }>
  ) {
    super();
    this.day = day;
    this.blockContents = blockContents;
  }
}
