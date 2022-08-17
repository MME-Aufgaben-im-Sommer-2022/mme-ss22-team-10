import Model from "../../lib/data/Model";

// Example instance of this model:

//new CalendarModel(new Date(),
// {
//  "2022": {
//    "1": ["1","3"],
//    "2": ["8","19"],
//    },
//  }
//)
// -> notes were taken on 1.1.2022, 3.1.2022, 8.2.2022, 19.2.2022

// A guide on how to iterate over Object properties can be found here:
// TODO: Add link to guide

type Days = Array<string>;

export interface Months {
  [key: string]: Days;
}

export interface Years {
  [key: string]: Months;
}

export default class CalendarModel extends Model {
  today: Date;
  noteDays: Years;

  constructor(today: Date, years: Years) {
    super();
    this.today = today;
    this.noteDays = years;
  }

  // returns a date object of the specified date,
  // if it exists in the noteDays property
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
