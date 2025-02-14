export class DateRange {
  private readonly millisecondsPerDay = 1000 * 60 * 60 * 24;

  private constructor(
    private readonly startdate: Date,
    private readonly enddate: Date,
    private readonly lengthindays: number
  ) {}

  static create(date1: Date, date2: Date) {
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
      DateRange.calculateLengthInDays(start, end)
    );
  }

  private static calculateLengthInDays(start: Date, end: Date): number {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return (end.getTime() - start.getTime()) / millisecondsPerDay;
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
    return this.equals(this.overlapAsDateRange(otherrange)) ? true : false;
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
      throw new Error("Ranges Overlap")
    }
    
    let start:Date
    let end:Date

    if(this.startdate === otherrange.enddate){
      start = this.startdate
      end = this.startdate
    }else if(this.enddate === otherrange.startdate){
      start = this.enddate
      end = this.enddate
    }else if(this.startdate > otherrange.enddate){
      start = otherrange.enddate
      end = this.startdate
    }else{
      start = this.enddate
      end = otherrange.startdate
    }

    return new DateRange(
      start,
      end,
      DateRange.calculateLengthInDays(start,end)
    );

  }
  uniteDateRange(otherrange: DateRange) {
    if(!this.hasOverlap(otherrange)){
      throw new Error("ranges dont overlap.");
    }
    const start = 
      this.startdate < otherrange.startdate
        ? this.startdate
        : otherrange.startdate;
    const end =
      this.enddate > otherrange.enddate 
      ? this.enddate 
      : otherrange.enddate;
    return new DateRange(
      start,
      end,
      DateRange.calculateLengthInDays(start,end)
    ) 
  }
  
  rangeLengthDisparity(otherrange: DateRange) {
    return this.getLength() - otherrange.getLength();
  }
  equals(otherrange:DateRange): boolean{
      
    return this.startdate.getMilliseconds() === otherrange.startdate.getMilliseconds() &&
      this.enddate.getMilliseconds() === otherrange.enddate.getMilliseconds() &&
      this.lengthindays === otherrange.lengthindays
    
      
  }
}
