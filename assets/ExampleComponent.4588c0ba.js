var o=Object.defineProperty;var l=(n,e,t)=>e in n?o(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var a=(n,e,t)=>(l(n,typeof e!="symbol"?e+"":e,t),t);import{W as s}from"./index.d79f7ff9.js";const i="",c=`<div class="red containter">
  <h1></h1>
  <div>Count: <span id="count">0</span></div>
  <button>Click here!</button>
</div>
`;class m extends s{constructor(t){super(c,i);a(this,"exampleState");a(this,"onButtonClicked",()=>{this.exampleState.value.count++});a(this,"onModelChanged",t=>{this.select("#count").innerHTML=`${this.exampleState.value.count}`,this.select("h1").innerHTML=`Hello ${this.exampleState.value.name}!`});this.exampleState=t}get htmlTagName(){return"example-component"}onCreate(){this.querySelector("h1").innerHTML=`Hello ${this.exampleState.value.name}!`,this.select("#count").innerHTML=`${this.exampleState.value.count}`,this.select("button").addEventListener("click",this.onButtonClicked),this.exampleState.addEventListener("change",this.onModelChanged)}}export{m as default};
