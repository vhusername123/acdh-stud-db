const { DateRange } = require("./DateRange");
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
    expect(range.getEndDate().getUTCDate()).toBeNaN();
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
  test("succesfully get datenrange inbetween 2 range",() => {
    const range1 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[2]) // 1900-06-01
    );
    const range2 = DateRange.create(
      new Date(exampledates[3]), // 1901-05-30
      new Date(exampledates[3]) // 1901-05-30
    );
    const range3 = range1.getBetweenDateRange(range2)
    expect(range3).toBeInstanceOf(DateRange);
    expect(range3.getStartDate()).toStrictEqual(range1.getEndDate());
    expect(range3.getEndDate()).toStrictEqual(range2.getStartDate());
  });
  test("succesfully get datenrange inbetween 2 range",() => {
    const range1 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[2]) // 1900-06-01
    );
    const range2 = DateRange.create(
      new Date("1900-06-02"), // 1900-06-01
      new Date(exampledates[3]) // 1901-05-30
    );
    
    const range3 = range1.getBetweenDateRange(range2)
    expect(range3).toBeInstanceOf(DateRange);
    expect(range3.getStartDate()).toStrictEqual(range1.getEndDate());
    expect(range3.getEndDate()).toStrictEqual(range2.getStartDate());
    expect(range3.getEndDate()).toStrictEqual(range3.getStartDate());
    expect(range3.getLength()).toBe(0)
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

  test("succesfully unite 2 ranges", () => {
    const range1 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[1]) // 1900-12-31
    );
    const range2 = DateRange.create(
      new Date(exampledates[2]), // 1900-06-01
      new Date(exampledates[3]) // 1901-05-30
    );
    const range3 = range1.uniteDateRange(range2);
    expect(range3).toBeInstanceOf(DateRange)
    expect(range3?.getStartDate()).toStrictEqual(range1.getStartDate())
    expect(range3?.getEndDate()).toStrictEqual(range2.getEndDate())

  })

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

  test("successfully create new DateRange from overlapping ranges", () => {
    const range1 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[1]) // 1900-12-31
    );
    const range2 = DateRange.create(
      new Date(exampledates[2]), // 1900-06-01
      new Date(exampledates[3]) // 1901-05-30
    );
    const overlap = range1.overlapAsDateRange(range2);
    expect(overlap.getStartDate()).toStrictEqual(range2.getStartDate())
    expect(overlap.getEndDate()).toStrictEqual(range1.getEndDate())
  });

  test("fail to create new DateRange from non-overlapping ranges", () => {
    const range1 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[2]) // 1900-06-01
    );
    const range2 = DateRange.create(
      new Date(exampledates[3]), // 1901-05-30
      new Date(exampledates[3]) // 1901-05-30
    );
    expect(() => range1.overlapAsDateRange(range2)).toThrow();
  });
  test("find out if DateRange is within Daterange", () => {
    const range1 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[2]) // 1900-06-01
    );
    const range2 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[1]) // 1900-12-31
    )
    expect(range1.withinDateRange(range2)).toBeTruthy();
  })
  test("find out which DateRange comes first", () => {
    const range1 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[2]) // 1900-06-01
    )
    const range2 = DateRange.create(
      new Date(exampledates[2]),
      new Date(exampledates[1]) // 1900-12-31
    )
    expect(range1.equals(range2.sortDateRange(range1)[0])).toBeTruthy();
  })
  test("find out which DateRange comes first", () => {
    const range1 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date(exampledates[2]) // 1900-06-01
    )
    const range2 = DateRange.create(
      new Date(exampledates[2]),
      new Date(exampledates[1]) // 1900-12-31
    )
    expect(range2.equals(range2.sortDateRange(range1)[0])).toBeFalsy();
  })
  test("find out that daterange is inbetween", () => {
    const range1 = DateRange.create(
      new Date(exampledates[1]), // 1900-12-31
      new Date(exampledates[2]) // 1900-06-01
    )
    const range2 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date("1900-04-03")
    )
    const range3 = DateRange.create(
      new Date(exampledates[3]), // 1901-05-30
      new Date(exampledates[3]) // 1901-05-30
    );
    expect(range1.inbetween(range2,range3)).toBeTruthy()
  });
  test("find out that daterange is not inbetween", () => {
    const range1 = DateRange.create(
      new Date(exampledates[1]), // 1900-12-31
      new Date(exampledates[2]) // 1900-06-01
    )
    const range2 = DateRange.create(
      new Date(exampledates[0]), // 1900-01-01
      new Date("1900-04-03")
    )
    const range3 = DateRange.create(
      new Date(exampledates[3]), // 1901-05-30
      new Date(exampledates[3]) // 1901-05-30
    );
    expect(range3.inbetween(range1,range2)).toBeFalsy()
  });
});
