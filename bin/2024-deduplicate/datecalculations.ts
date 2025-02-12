export class DateRange {
  private readonly startdate: Date;
  private readonly enddate: Date;
  private readonly lengthindays: number;
  constructor(date1: Date, date2: Date) {
    if (date1.getTime() > date2.getTime()) {
      this.startdate = new Date(date2);
      this.enddate = new Date(date1);
      this.enddate.setDate(this.enddate.getDate() + 1);
    } else {
      this.startdate = new Date(date1);
      this.enddate = new Date(date2);
      this.enddate.setDate(this.enddate.getDate() + 1);
    }
    this.lengthindays = this.millisecondsindays(
      this.enddate.getTime() - this.startdate.getTime()
    );
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
