import Model from "../../lib/data/Model";

/**
 * The type of a single {@link BlockContent}
 * - FreeText: a free text input
 * - Checkbox: a checkbox input
 * - BulletPoint: a bullet point input
 */
export enum BlockContentInputType {
  FreeText = "free-text-input-field",
  Checkbox = "checkbox-input-field",
  BulletPoint = "bullet-point-input-field",
}

/**
 * A single block of the {@link EditorModel}
 */
export interface BlockContent {
  title: string;
  inputType: BlockContentInputType;
  inputValue: string;
  documentId: string; // doc id in AppWrite
}

/**
 * The model of the editor at a specific date.
 */
export default class EditorModel extends Model {
  day: Date;
  blockContents: Array<BlockContent>;

  constructor(day: Date, blockContents: Array<BlockContent>) {
    super();
    this.day = day;
    this.blockContents = blockContents;
  }
}
