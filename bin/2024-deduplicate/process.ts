import { DateRange } from "./DateRange";
import { Comparison, Person, Property, DatePropRecord, PropRecord, Stats, Person2 } from "./types";

type Add = (a: number, b: number) => number;
const add: Add = (a, b) => a + b;

type Square = (v: number) => number;
const square: Square = (v) => v * v;

type DotProduct = (a: number[], b: number[]) => number;
const dotProduct: DotProduct = (a, b) =>
  a.map((n, i) => n * b[i]).reduce(add, 0);

type Magnitude = (v: number[]) => number;
const magnitude: Magnitude = (v) => Math.sqrt(v.map(square).reduce(add, 0));

type StringToNGrams = (n: number, s: string) => string[];
const stringToNGrams: StringToNGrams = (n, input) => {
  const normalised = `${input}`
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ".repeat(n - 1))
    .replace(/^ *| *$/g, " ".repeat(n - 1));
  return normalised.length > n
    ? new Array(normalised.length - n)
        .fill(0)
        .map((_, i) => normalised.substring(i, i + n))
    : [normalised];
};

type AreStringsEqual = (a: string, b: string) => boolean;
const areStringsEqual: AreStringsEqual = (a, b) =>
  a === b ||
  (!!`${a}${b}`.match(/[\x80-\xff]/) &&
    a.localeCompare(b, "en", { sensitivity: "base" }) === 0);

type FirstOccurrence = <T>(item: T, index: number, collection: T[]) => boolean;
const firstOccurrence: FirstOccurrence = (item, index, collection) =>
  collection.indexOf(item) === index;

type CosineSimilarity = (a: string, b: string) => number;
const nGramCache: Record<string, Record<number, string[]>> = {};
const cosineSimilarity: CosineSimilarity = (a, b) => {
  const nGramLength = Math.max(2, Math.round(Math.log(a.length + b.length)));
  nGramCache[a] = nGramCache[a] ?? {};
  nGramCache[a][nGramLength] =
    (nGramCache[a] && nGramCache[a][nGramLength]) ||
    stringToNGrams(nGramLength, a).filter(firstOccurrence);
  const ngramsA = nGramCache[a][nGramLength];
  const ngramsB = stringToNGrams(nGramLength, b);
  const uniqueNGrams = [...ngramsA, ...ngramsB].filter(firstOccurrence);
  const [vectorA, vectorB] = [ngramsA, ngramsB].map((haystack) =>
    uniqueNGrams.map(
      (needle) =>
        haystack.filter((item) => areStringsEqual(item, needle)).length,
    ),
  );
  return dotProduct(vectorA, vectorB) / magnitude(vectorA) / magnitude(vectorB);
};
export const splitIntoWords = (s: string | number | null | undefined) =>
  `${s}`.split(/[^\p{L}\p{N}]+/gu).filter((x) => !!x);

type CompareStudents = (a: Person, b: Person) => Comparison;
const compareStudents: CompareStudents = (a, b) => ({
  idLow: a.person_id,
  idHigh: b.person_id,
  stats: Object.fromEntries(
    Object.entries(a)
      .filter(([k]) => k !== "person_id" && k in b)
      .map(([k, v]) => {
        const value = v as string[];
        return [
          k as Property,
          value
            .flatMap((va) =>
              (b[k as Property] ?? []).map((vb) =>
                cosineSimilarity(`${va}`, `${vb}`),
              ),
            )
            .reduce(
              (
                [sum, median, minimum, maximum, count],
                similarity,
                index,
                collection,
              ) => {
                const isLastItem = index === collection.length - 1;
                const accumulatedSimilarity = sum + similarity;
                const middleIndex = Math.floor(collection.length / 2);
                return [
                  accumulatedSimilarity / (isLastItem ? collection.length : 1),
                  median || collection.sort((a, b) => a - b)[middleIndex],
                  Math.min(minimum, similarity),
                  Math.max(maximum, similarity),
                  count || collection.length,
                ];
              },
              [0, 0, Infinity, 0, 0] as Stats,
            ),
        ];
      }),
  ) as Record<Property, Stats>,
});

type ReducePropertyRecordsToPeople = (records: PropRecord[]) => Person[];
export const reducePropertyRecordsToPeople: ReducePropertyRecordsToPeople = (
  records,
) => 
  Object.values(
    records.reduce(
      (accu: Record<string, Person>, item) => ({
        ...accu,
        [`${item.person_id}`]: {
          ...(accu[`${item.person_id}`] ?? {}),
          person_id: item.person_id,
          [item.property]: [
            ...((accu[`${item.person_id}`] ?? {})[item.property] ?? []),
            item.value,
          ],
        },
      }),
      {} as Record<string, Person>,
    ),
);
type ComputeStats = (people: Person[]) => Comparison[];
export const computeStats: ComputeStats = ([first, ...rest]) =>
  rest.map((other) => compareStudents(first, other));

type ReducePropertyRecordsToPeople2 = (records: DatePropRecord[]) => Person2[];
export const reducePropertyRecordsToPeople2: ReducePropertyRecordsToPeople2 = (
  records,
) => {
  return Object.values(
    records.reduce(
      (accu: Record<number, Person2>, item) => {
        const person = accu[item.person_id] ?? { person_id: item.person_id, bornranges: [] };
        person.bornranges?.push([item.born_on_or_after, item.born_on_or_before]);
        return {
          ...accu,
          [item.person_id]: person,
        };
      },
      {} as Record<number, Person2>,
    ),
  );
};



type ComputeBirthRangeStats = (people:any) => {idLow:number,idHigh:number,stats:Stats}[];
export const computeBirthRangeStats: ComputeBirthRangeStats = ([first, ...rest]) =>
  rest.map((other: { person_id: any; bornranges: DateRange[]; }) => {
    return {
    idLow: first.person_id,
    idHigh: other.person_id,
    stats: compare(first.bornranges, other.bornranges)
  }
});



export function compare(person1: DateRange[], person2: DateRange[]): Stats {
  let median: number = 0,
    minimum: number = Infinity,
    maximum: number = 0,
    count: number = 0;
  let array: number[] = person1.flatMap((n) => {
    const innermean = person2.map((e) => {
      let f;
      try {
        f = e.overlap(n) / e.uniteDateRange(n).getLength();
      } catch {
        f = 0;
      }
      count++;
      return f;
    });
    return innermean;
  });
  let mean: number = array.reduce((e, sum) => sum + e, 0) / count;
  array.sort((a, b) => a - b);
  minimum = Math.min(...array);
  maximum = Math.max(...array);
  median = array.length === 1 ? array[0] :
    array.length % 2
      ? (array[Math.floor(array.length / 2)] +
          array[Math.floor(array.length / 2) + 1]) /
        2
      : array[array.length / 2];
  return [mean, median, minimum, maximum, count];
}


export const personBirthRanges = (dates: Date[][]) => {
  const ranges: DateRange[] = [];
  dates.forEach((e) => {
    let after = new Date(e[0]),
      before = new Date(e[1]),
      originaldate: Date | boolean = false;
    if (after.getTime() == before.getTime()) {
      originaldate = new Date(before);
      before = new Date(before.getTime() - 180 * DateRange.millisecondsPerDay);
      after = new Date(after.getTime() + 179 * DateRange.millisecondsPerDay);
    }

    ranges.push(DateRange.create(after, before, originaldate));
  });
  return ranges;
};


export const convertStringsArraystoDateRanges = (persons: Person2[]) => {
  return persons.map((e) => ({
    person_id: e.person_id,
    bornranges: e.bornranges ? personBirthRanges(e.bornranges.map(range => [new Date(range[0]), new Date(range[1])])) : []
  }));
};
