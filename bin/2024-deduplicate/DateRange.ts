export class DateRange {
  static readonly millisecondsPerDay = 1000 * 60 * 60 * 24;

  private constructor(
    private readonly startdate: Date,
    private readonly enddate: Date,
    private readonly lengthindays: number,
    private readonly wasASpecificDate: Date|boolean = false,
  ) {}

  static create(date1: Date, date2: Date, wasASpecificDate:Date|boolean = false) {
    if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
      throw new Error("Invalid date(s) provided.");
    }

    const start =
      date1.getTime() > date2.getTime() ? new Date(date2) : new Date(date1);
    const end =
      date1.getTime() > date2.getTime() ? new Date(date1) : new Date(date2);
    end.setDate(end.getDate() + 1);
    return new DateRange(
      start,
      end,
      DateRange.calculateLengthInDays(start, end),
      wasASpecificDate
    );
  }

  private static calculateLengthInDays(start: Date, end: Date): number {
    return (end.getTime() - start.getTime()) / DateRange.millisecondsPerDay;
  }

  getLength() {
    return this.lengthindays;
  }
  getStartDate() {
    return new Date(this.startdate);
  }
  getEndDate() {
    return new Date(this.enddate);
  }

  hasOverlap(otherrange: DateRange) {
    return !(
      this.enddate <= otherrange.startdate ||
      this.startdate >= otherrange.enddate
    );
  }

  overlap(otherrange: DateRange) {
    if (!this.hasOverlap(otherrange)) {
      throw new Error("Ranges do not overlap.");
    }
    const start =
      this.startdate > otherrange.startdate
        ? this.startdate
        : otherrange.startdate;
    const end =
      this.enddate < otherrange.enddate ? this.enddate : otherrange.enddate;
    return DateRange.calculateLengthInDays(start, end);
  }
  withinDateRange(otherrange:DateRange){
    return this.equals(this.overlapAsDateRange(otherrange))
  }
  overlapAsDateRange(otherrange: DateRange) {
    if (!this.hasOverlap(otherrange)) {
      throw new Error("Ranges do not overlap.");
    }
    const start =
      this.startdate > otherrange.startdate
        ? this.startdate
        : otherrange.startdate;
    const end =
      this.enddate < otherrange.enddate ? this.enddate : otherrange.enddate;
    return new DateRange(
      start,
      end,
      DateRange.calculateLengthInDays(start, end)
    );
  }

  getBetweenDateRange(otherrange: DateRange){
    if(this.hasOverlap(otherrange)){
      throw new Error("have overlap")
    }
    const [early,late] = this.sortDateRange(otherrange)
    const start = early.enddate, end = late.startdate
    return new DateRange(
      start,
      end,
      DateRange.calculateLengthInDays(start,end)
    );
  }
  uniteDateRange(otherrange: DateRange) {
    if(!this.hasOverlap(otherrange)) {
      throw new Error("dont have overlap")
    }
    const [early,late] = this.sortDateRange(otherrange)
    return new DateRange(
      early.startdate,
      late.enddate,
      DateRange.calculateLengthInDays(early.startdate,late.enddate)
    ) 
  }
  sortDateRange(otherrange: DateRange): DateRange[] {
    if (this.startdate === otherrange.startdate) {
      return this.enddate < otherrange.enddate ? [this,otherrange] : [otherrange,this]
    }
    return this.startdate < otherrange.startdate ? [this,otherrange] : [otherrange,this]
  }
  rangeLengthDisparity(otherrange: DateRange) {
    return this.getLength() - otherrange.getLength();
  }
  equals(otherrange:DateRange): boolean{
      
    return this === otherrange || 
      this.startdate.getMilliseconds() === otherrange.startdate.getMilliseconds() &&
      this.enddate.getMilliseconds() === otherrange.enddate.getMilliseconds() &&
      this.lengthindays === otherrange.lengthindays  
  }
  inbetween(otherrange1: DateRange, otherrange2: DateRange){
    if (this.hasOverlap(otherrange1) || this.hasOverlap(otherrange2) || otherrange1.hasOverlap(otherrange2)){
      throw new Error("has overlap")
    }
    const [earlyrange,laterange]:DateRange[] = otherrange1.sortDateRange(otherrange2)
    return this.enddate > earlyrange.enddate && this.enddate < laterange.enddate
  }
}
