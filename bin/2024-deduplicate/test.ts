import { DateRange } from "./DateRange";
import { describe, expect, test } from "@jest/globals";
const exampledates = [
  "1900-01-01",
  "1900-12-31",
  "1900-06-01",
  "1901-05-30",
  "1900-06-00",
];

describe("DateRange", () => {
  test("initialize start and end dates", () => {
    const date1 = new Date(exampledates[0]); // 1900-01-01
    const date2 = new Date(exampledates[1]); // 1900-12-31
    const range = DateRange.create(date1, date2);

    expect(range.getStartDate().getUTCDate()).toBe(1);
    expect(range.getEndDate().getUTCDate()).toBe(1);
  });
  test("initialize start and end dates", () => {
    const date1 = new Date(exampledates[0]); // 1900-01-01
    const date2 = new Date(exampledates[2]); // 1900-06-01
    const range = DateRange.create(date1, date2);

    expect(range.getStartDate().getUTCDate()).toBe(1);
    expect(range.getEndDate().getUTCDate()).toBe(2);
  });
  test("initialize start and end dates", () => {
    const date1 = new Date(exampledates[3]); // 1901-05-30
    const date2 = new Date(exampledates[3]); // 1901-05-30
    const range = DateRange.create(date1, date2);

    expect(range.getStartDate().getUTCDate()).toBe(30);
    expect(range.getEndDate().getUTCDate()).toBe(31);
  });

  test("initialize start and end dates", () => {
    const date1 = new Date(exampledates[1]); // 1900-12-31
    const date2 = new Date(exampledates[2]); // 1900-06-01
    const range = DateRange.create(date1, date2);

    expect(range.getStartDate().getUTCDate()).toBe(1);
    expect(range.getEndDate().getUTCDate()).toBe(1);
  });
  test("initialize start and end dates", () => {
    const date1 = new Date(exampledates[2]); // 1900-06-01
    const date2 = new Date(exampledates[3]); // 1901-05-30
    const range = DateRange.create(date1, date2);

    expect(range.getStartDate().getUTCDate()).toBe(1);
    expect(range.getEndDate().getUTCDate()).toBe(31);
  });
  test("fail to initialise start and end dates", () => {
    const date1 = new Date(exampledates[3]); // 1901-05-30
    const date2 = new Date(exampledates[4]); // 1900-06-00
    const range = DateRange.create(date1, date2);

    expect(range).toBeInstanceOf(DateRange);
    expect(range.getStartDate().getUTCDate()).toBe(30);
    expect(NaN).toBe(date2.getUTCDate());
  });

  test("calculate length in days", () => {
    const date1 = new Date(exampledates[0]); // 1900-01-01
    const date2 = new Date(exampledates[1]); // 1900-12-31
    const range = DateRange.create(date1, date2);

    expect(range.getLength()).toBe(365);
  });

  test("identify overlapping ranges", () => {
    const range1 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[1]) // 1900-12-31
    );
    const range2 = DateRange.create(
      new Date(exampledates[2]), // 1900-06-01
      new Date(exampledates[3]) // 1901-05-30
    );

    expect(range1.hasOverlap(range2)).toBe(true);
  });

  test("identify non-overlapping ranges", () => {
    const range1 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[2]) // 1900-06-01
    );
    const range2 = DateRange.create(
      new Date(exampledates[3]), // 1901-05-30
      new Date(exampledates[3]) // 1901-05-30
    );

    expect(range1.hasOverlap(range2)).toBe(false);
  });

  test("calculate overlap in days", () => {
    const range1 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[1]) // 1900-12-31
    );
    const range2 = DateRange.create(
      new Date(exampledates[2]), // 1900-06-01
      new Date(exampledates[3]) // 1901-05-30
    );

    expect(range1.overlap(range2)).toBe(214);
    expect(range2.overlap(range1)).toBe(214);
  });

  test("calculate overlap percentage", () => {
    const range1 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[1]) // 1900-12-31
    );
    const range2 = DateRange.create(
      new Date(exampledates[2]), // 1900-06-01
      new Date(exampledates[3]) // 1901-05-30
    );

    const overlap = range1.overlap(range2);
    expect(range1.overlapPercentage(overlap)).toBeCloseTo(0.5863, 3);
    expect(range2.overlapPercentage(overlap)).toBeCloseTo(0.5879, 3);
  });

  test("calculate ranged disparity", () => {
    const range1 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[1]) // 1900-12-31
    );
    const range2 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[1]) // 1900-12-31
    );

    expect(range1.rangeLengthDisparity(range2)).toBe(0);
  });

  test("calculate ranged disparity", () => {
    const range1 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[1]) // 1900-12-31
    );
    const range2 = DateRange.create(
      new Date(exampledates[2]), // 1900-06-01
      new Date(exampledates[3]) // 1901-05-30
    );
    expect(range2.rangeLengthDisparity(range1)).toBe(-1);
  });
});
