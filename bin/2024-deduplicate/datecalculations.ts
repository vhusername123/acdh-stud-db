import {Stats} from './types'
import { DateRange } from "./DateRange";
//import { DateRangeComparisonStats } from "./types";

const personBirthRanges = (dates:Date[][]) => {
    const ranges:DateRange[] = []
    dates.forEach((e) => {
        let after = new Date(e[0]),before = new Date(e[1]),originaldate:Date|boolean = false;
        if(after.getTime() == before.getTime()) {
            originaldate = new Date(before)
            before = new Date(before.getTime() - 180 *DateRange.millisecondsPerDay)
            after = new Date(after.getTime() + 179 *DateRange.millisecondsPerDay)
        }

        ranges.push(DateRange.create(after,before,originaldate))
    })
    return ranges
}

function compare(person1:DateRange[], person2:DateRange[]):Stats{
    let median:number = 0,minimum:number = Infinity,maximum:number = 0,count:number=0;
    let array:number[] = person1.flatMap((n) => {
        const innermean = person2.map((e) => {
            let f;
            try {
                f = e.overlap(n) / e.uniteDateRange(n).getLength()
            }catch{
                f = 0;
            }
            count++;
            return f;
          })
        return innermean
    })
    let mean:number = array.reduce((sum,e) => sum+e,0) / count;
    array.sort((a,b) => a-b)
    minimum = Math.min(...array)
    maximum = Math.max(...array)
    median = array.length % 2 
        ? (array[Math.floor(array.length/2)] + array[Math.floor(array.length/2)+1]) / 2
        : array[array.length/2]
    return [
        mean,
        median,
        minimum,
        maximum,
        count
    ]
}

const exampledates = [
    [new Date("1902-01-01"),new Date("1900-01-01")],
    [new Date("1904-01-01"),new Date("1900-01-01")],
    [new Date("1901-03-01"),new Date("1900-02-01")],
    [new Date("1905-01-01"),new Date("1900-01-01")]
  ];
const exampledates2 = [
    [new Date("1900-01-01"),new Date("1900-01-01")],
    [new Date("1900-01-01"),new Date("1900-01-01")],
  ];

const testperson:DateRange[] = personBirthRanges(exampledates)
const testperson2:DateRange[] = personBirthRanges(exampledates2)


console.log(testperson)
console.log(testperson2)
console.log(compare(testperson,testperson2))
console.log(compare(testperson2,testperson))
/*
*/