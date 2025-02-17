import { textSpanOverlap } from "typescript";
import { DateRange } from "./DateRange";
//import { DateRangeComparisonStats } from "./types";

const personBirthRanges = ([bornafter,bornbefore]:Date[][]) => {
    const ranges:DateRange[] = []
    for(let i = 0; i<bornafter.length;i++) {
        let after = bornafter[i],before = bornbefore[i],originaldate:Date|boolean = false;
        if(after === before) {
            originaldate = new Date(before)
            before = new Date(before.getTime() - 180 *DateRange.millisecondsPerDay)
            after = new Date(after.getTime() + 179 *DateRange.millisecondsPerDay)
        }

        ranges.push(DateRange.create(after,before,originaldate))
    }
    return ranges
}
const exampledates = [
    new Date("1900-01-01"),
    new Date("1900-12-31"),
    new Date("1900-06-01"),
    new Date("1901-05-30"),
    new Date("1900-06-20"),
  ];

function compare(person1:DateRange[], person2:DateRange[]){
    const comparison: DateRangeComparisonStats[] = 
        person1.flatMap((e,i,a) => {
            return person2.map((e2) => {
                const comparison1:DateRangeComparisonStats = {
                    overlap: 0,
                    overlapPercentage: 0,
                    lengthdisparity: 0
                };
                try {
                    comparison1.overlap = e2.overlap(e)
                    comparison1.overlapPercentage = e2.overlap(e) / e2.getLength()
                }catch{}
                comparison1.lengthdisparity = e2.rangeLengthDisparity(e)
                return comparison1
            })
        })
    return comparison
}

const testperson:DateRange[] = personBirthRanges([exampledates,exampledates])
const testperson2:DateRange[] = personBirthRanges([exampledates,exampledates])
console.log(testperson)
console.log(testperson2)
type DateRangeComparisonStats = {
    overlap: number;
    overlapPercentage: number;
    lengthdisparity: number;
  }
type DateRangeComparisonBools = {
    hasOverlap: boolean,
    inside: boolean,

}