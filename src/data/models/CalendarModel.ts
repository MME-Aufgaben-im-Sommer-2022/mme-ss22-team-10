import Model from "../../lib/data/Model";

export default class CalendarModel extends Model {
  today: Date;
  noteDays: Array<Date>;

  constructor(today: Date, noteDays: Array<Date>) {
    super();
    this.today = today;
    this.noteDays = noteDays;
  }
}
