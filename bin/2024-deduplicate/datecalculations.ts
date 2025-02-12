export class DateRange {
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
      DateRange.calculatelengthindaysDays(start, end)
    );
  }

  private static calculatelengthindaysDays(start: Date, end: Date): number {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return (end.getTime() - start.getTime()) / millisecondsPerDay;
  }

  millisecondsindays(milliseconds: number) {
    return milliseconds / 1000 / 60 / 60 / 24;
  }
  hasOverlap(otherrange: DateRange) {
    return !(
      this.enddate <= otherrange.startdate ||
      this.startdate >= otherrange.enddate
    );
  }
  overlap(otherrange: DateRange) {
    if (this.hasOverlap(otherrange)) {
      let calculations: number[] = [
        this.enddate.getTime() - this.startdate.getTime(),
        this.enddate.getTime() - otherrange.startdate.getTime(),
        otherrange.enddate.getTime() - otherrange.startdate.getTime(),
        otherrange.enddate.getTime() - this.startdate.getTime(),
      ];
      calculations.sort((a, b) => a - b);
      return this.millisecondsindays(calculations[0]);
    }
    let calculations: number[] = [
      this.startdate.getTime() - otherrange.enddate.getTime(),
      otherrange.startdate.getTime() - this.enddate.getTime(),
    ];
    calculations.sort((a, b) => a - b);
    return this.millisecondsindays(calculations[1] * -1);
  }
  getLength() {
    return this.lengthindays;
  }
  overlapPercentage(overlap: number) {
    const a = this.getLength();
    return a < overlap ? a / overlap : overlap / a;
  }
  rangeLengthDisparity(otherrange: DateRange) {
    return this.getLength() - otherrange.getLength();
  }
  getStartDate() {
    return new Date(this.startdate);
  }
  getEndDate() {
    return new Date(this.enddate);
  }
}
