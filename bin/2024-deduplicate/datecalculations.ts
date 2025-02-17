import { textSpanOverlap } from "typescript";
import { DateRange } from "./DateRange";
//import { DateRangeComparisonStats } from "./types";
const exampledates = [
    "1900-01-01",
    "1900-12-31",
    "1900-06-01",
    "1901-05-30",
    "1900-06-20",
  ];

function compare(person1:DateRange[], person2:DateRange[]){
    const comparison: DateRangeComparisonStats[][] = 
        person1.map((e,i,a) => {
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
const testperson = exampledates.map((e,i,a) => DateRange.create(new Date(e),new Date(a[a.length-1-i])))
const testperson2 = exampledates.map ((e,i,a) => DateRange.create(new Date(a[a.length-1-i]),new Date(a[a.length-1])))
console.log(compare(testperson,testperson2))

type DateRangeComparisonStats = {
    overlap: number;
    overlapPercentage: number;
    lengthdisparity: number;
  }