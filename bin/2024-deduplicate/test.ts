import { DateRange } from "./datecalculations";
const exampledates = [
  "1900-01-01", 
  "1900-12-31", 
  "1900-06-01", 
  "1901-05-30",
  "1900-06-00" 
];

describe("DateRange", () => {
  test("should correctly initialize start and end dates", () => {
    const date1 = new Date(exampledates[0]); // 1900-01-01
    const date2 = new Date(exampledates[1]); // 1900-12-31

    date2.setDate(date2.getDate() + 1);
    const range = new DateRange(date1, date2);

    expect(range.startdate).toBe(date1);
    expect(range.enddate).toBe(date2);
  });
  test("should correctly initialize start and end dates", () => {
    const date1 = new Date(exampledates[0]); // 1900-01-01
    const date2 = new Date(exampledates[2]); // 1900-06-01
      

    date2.setDate(date2.getDate() + 1);
    const range = new DateRange(date1, date2);

    expect(range.startdate).toBe(date1);
    expect(range.enddate).toBe(date2);
  });
  test("should correctly initialize start and end dates", () => {
    const date1 = new Date(exampledates[3]); // 1901-05-30
    const date2 = new Date(exampledates[3]); // 1901-05-30
      

    date2.setDate(date2.getDate() + 1);
    const range = new DateRange(date1, date2);

    expect(range.startdate).toBe(date1);
    expect(range.enddate).toBe(date2);
  });
  test("should correctly initialize start and end dates", () => {
    const date1 = new Date(exampledates[1]); // 1900-12-31
    const date2 = new Date(exampledates[2]); // 1900-06-01
    date1.setDate(date1.getDate() + 1);
    const range = new DateRange(date1, date2);

    expect(range.startdate).toBe(date2);
    expect(range.enddate).toBe(date1);
  });
  test("should correctly initialize start and end dates", () => {
    const date1 = new Date(exampledates[2]); // 1900-06-01
    const date2 = new Date(exampledates[3]); // 1901-05-30
    date2.setDate(date2.getDate() + 1);
    const range = new DateRange(date1, date2);

    expect(range.startdate).toBe(date1);
    expect(range.enddate).toBe(date2);
  });
  test("should correctly fail to initialise start and end dates", () => {
    const date1 = new Date(exampledates[3]); // 1901-05-30
    const date2 = new Date(exampledates[4]); // 1900-06-00
    const range = new DateRange(date1, date2);

    expect(range).toBeInstanceOf(DateRange);
    expect(range.startdate).toBe(date1);
    expect(NaN).toBe(date2.getDate());
  });

  test("should correctly calculate length in days", () => {
    const date1 = new Date(exampledates[0]); // 1900-01-01
    const date2 = new Date(exampledates[1]); // 1900-12-31
    const range = new DateRange(date1, date2);

    expect(range.lengthindays).toBe(365);
  });

  test("should correctly identify overlapping ranges", () => {
    const range1 = new DateRange(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[1]) // 1900-12-31
    );
    const range2 = new DateRange(
      new Date(exampledates[2]), // 1900-06-01
      new Date(exampledates[3]) // 1901-05-30
    );

    expect(range1.hasOverlap(range2)).toBe(true);
  });

  test("should correctly identify non-overlapping ranges", () => {
    const range1 = new DateRange(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[2]) // 1900-06-01
    );
    const range2 = new DateRange(
      new Date(exampledates[3]), // 1901-05-30
      new Date(exampledates[3]) // 1901-05-30
    );

    expect(range1.hasOverlap(range2)).toBe(false);
  });

  test("should correctly calculate overlap in days", () => {
    const range1 = new DateRange(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[1]) // 1900-12-31
    );
    const range2 = new DateRange(
      new Date(exampledates[2]), // 1900-06-01
      new Date(exampledates[3]) // 1901-05-30
    );

    expect(range1.overlap(range2)).toBe(214);
    expect(range2.overlap(range1)).toBe(214);
  });

  test("should correctly calculate overlap percentage", () => {
    const range1 = new DateRange(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[1]) // 1900-12-31
    );
    const range2 = new DateRange(
      new Date(exampledates[2]), // 1900-06-01
      new Date(exampledates[3]) // 1901-05-30
    );

    const overlap = range1.overlap(range2);
    expect(range1.overlapPercentage(overlap)).toBeCloseTo(0.5863, 3);
    expect(range2.overlapPercentage(overlap)).toBeCloseTo(0.5879, 3);
  });

  test("should correctly calculate ranged disparity", () => {
    const range1 = new DateRange(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[1]) // 1900-12-31
    );
    const range2 = new DateRange(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[1]) // 1900-12-31
    );

    expect(range1.rangeLengthDisparity(range2)).toBe(0);
  });

  test("should correctly calculate ranged disparity", () => {
    const range1 = new DateRange(
        new Date(exampledates[0]), // 1900-01-01
        new Date(exampledates[1]) // 1900-12-31
    );
    const range2 = new DateRange(
        new Date(exampledates[2]), // 1900-06-01
        new Date(exampledates[3]) // 1901-05-30
    );
    expect(range2.rangeLengthDisparity(range1)).toBe(-1);
  });
});
