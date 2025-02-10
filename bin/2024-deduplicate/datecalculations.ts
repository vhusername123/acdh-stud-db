class DateRange{
    startdate: Date
    enddate: Date
    lengthindays: number
    constructor(date1:Date,date2:Date){
        if (date1.getTime() > date2.getTime()){
            this.startdate = date2
            date1.setDate(date1.getDate()+1)
            this.enddate = date1
        } else {
            this.startdate = date1;
            date2.setDate(date2.getDate()+1)
            this.enddate = date2;
        }
        this.lengthindays = this.millisecondsindays(this.enddate.getTime() - this.startdate.getTime())
    }
    millisecondsindays(milliseconds:number){
        return milliseconds/1000/60/60/24
    }
    hasOverlap(otherrange:DateRange){
        return !(this.enddate <= otherrange.startdate || this.startdate >= otherrange.enddate)
    }
    overlap(otherrange:DateRange){
        if (this.hasOverlap(otherrange)){
            let calculations:number[] = [
                this.enddate.getTime()-this.startdate.getTime(),
                this.enddate.getTime()-otherrange.startdate.getTime(),
                otherrange.enddate.getTime()-otherrange.startdate.getTime(),
                otherrange.enddate.getTime()-this.startdate.getTime()
            ]
            calculations.sort((a,b) => a-b)
            return this.millisecondsindays(calculations[0])
        }
        let calculations:number[] = [
            this.startdate.getTime() - otherrange.enddate.getTime(),
            otherrange.startdate.getTime() - this.enddate.getTime()
        ]
        calculations.sort((a,b) => a-b)
        return this.millisecondsindays(calculations[1]*-1)
    }
    getLength():number{
        return this.lengthindays
    }
    rangeddisparity(otherrange:DateRange){
        const aLength = this.getLength()
        const bLength = otherrange.getLength()
        return aLength<bLength ? aLength/bLength : bLength/aLength
    }
    
}


let firstguy = new DateRange(new Date("01.01.1900"),new Date("1900.12.30"))
let secondguy = new DateRange(new Date("01.01.1901"),new Date("1901.12.30"))


console.log(firstguy.rangeddisparity(secondguy))