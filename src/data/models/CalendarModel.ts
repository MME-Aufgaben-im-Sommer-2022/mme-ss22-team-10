import Model from "../../lib/data/Model";

/**
 * An array of days (only the number of the day within a month)
 * @example
 * ["1", "3", "8", "19"]
 */
type Days = Array<string>;

/**
 * An array of months, consisting of {@link Days}
 * @example
 * "1": ["1","3"],
 */
export interface Months {
  [key: string]: Days;
}

/**
 * An array of years, consisting of {@link Months}
 * @example
 * "2022": {
 *   "1": ["1","3"],
 *  "2": ["8","19"],
 * },
 */
export interface Years {
  [key: string]: Months;
}

/**
 * @class CalendarModel
 * A model to store the dates of notes taken
 */
export default class CalendarModel extends Model {
  // Today's date
  today: Date;
  // Dates, on which notes were taken
  noteDays: Years;

  constructor(today: Date, years: Years) {
    super();
    this.today = today;
    this.noteDays = years;
  }

  /**
   * returns a date object of the specified date f it exists in the noteDays property
   * @param year
   * @param month
   * @param day
   */
  getAsDate(year: string, month: string, day: string): Date | null {
    if (
      this.noteDays[year] &&
      this.noteDays[year][month] &&
      this.noteDays[year][month].includes(day)
    ) {
      return new Date(`${month}/${day}/${year}`);
    }
    return null;
  }
}
