import {Stats} from './types'
import { DateRange } from "./DateRange";
//import { DateRangeComparisonStats } from "./types";
type Person = DateRange[];
const personBirthRanges = (dates:Date[][]) => {
    const ranges:Person = []
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

function compare(person1:Person, person2:Person):Stats{
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
    let mean:number = array.reduce((e,sum) => sum+e,0) / count;
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
const exampledates = {
exampledatesA : [
    [new Date("1900-03-01"),new Date("1900-03-01")],
    [new Date("1900-06-04"),new Date("1900-06-04")],
    [new Date("1900-01-01"),new Date("1900-12-31")],
    [new Date("1900-05-01"),new Date("1901-02-01")]
  ],
exampledatesB : [
    [new Date("1900-01-01"),new Date("1900-01-01")],
    [new Date("1900-06-01"),new Date("1900-12-31")],
  ],
exampledatesC : [
    [new Date("1900-01-01"),new Date("1900-12-31")],
    [new Date("1900-03-01"),new Date("1900-06-01")],
  ],
exampledatesD : [
    [new Date("1900-01-01"),new Date("1900-01-01")],
    [new Date("1900-01-01"),new Date("1900-01-01")],
  ]
}
type Persons = {
    personname: String,
    range: Person
}[]
const persons:Persons = 
[
    {
        personname: "PersonA",
        range: personBirthRanges(exampledates.exampledatesA)
    },
    {
        personname: "PersonB",
        range: personBirthRanges(exampledates.exampledatesB)
    },
    {
        personname: "PersonC",
        range: personBirthRanges(exampledates.exampledatesC)
    },
    {
        personname: "PersonD",
        range: personBirthRanges(exampledates.exampledatesD)
    }
]
let c = 0;
for(let i = 0; i< persons.length;i++){
    for(let j = i+1; j< persons.length;j++){
            console.log([
                persons[i].personname,
                persons[j].personname,
                compare(persons[i].range,persons[j].range)
                ])
    }
}
/*
*/