var a=Object.defineProperty;var h=(e,r,t)=>r in e?a(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t;var n=(e,r,t)=>(h(e,typeof r!="symbol"?r+"":r,t),t);import{W as u}from"./index.d79f7ff9.js";import i from"./CalendarDay.248e4a9f.js";import"./EventBus.722142c1.js";const m='<div class="calendar-month">\r    <div class="entry-container" ></div>\r</div>',c=`calendar-month{display:flex;flex-grow:1}.entry-container{display:grid;grid-column-gap:var(--spacing-medium);grid-row-gap:var(--spacing-medium);grid-template-columns:repeat(auto-fit,minmax(130px,130px))}
`;class C extends u{constructor(t,o,s){super(m,c);n(this,"entriesForCurrentMonth");n(this,"currentMonthNumber");n(this,"currentMonthNumberText");n(this,"currentYear");n(this,"$entryContainer");this.entriesForCurrentMonth=t,this.currentMonthNumber=o,this.currentYear=s}get htmlTagName(){return"calendar-month"}onCreate(){this.$initHtml(),this.formatMonth(),this.appendCalenderEntry()}$initHtml(){this.$entryContainer=this.select(".entry-container")}formatMonth(){this.currentMonthNumber<10?this.currentMonthNumberText="0"+this.currentMonthNumber:this.currentMonthNumberText=this.currentMonthNumber.toString()}appendCalenderEntry(){for(let t=0;t<this.entriesForCurrentMonth.length;t++)parseInt(this.entriesForCurrentMonth[t])<10?this.$entryContainer.append(new i("0"+this.entriesForCurrentMonth[t]+"."+this.currentMonthNumberText+"."+this.currentYear)):this.$entryContainer.append(new i(this.entriesForCurrentMonth[t]+"."+this.currentMonthNumberText+"."+this.currentYear))}}export{C as default};