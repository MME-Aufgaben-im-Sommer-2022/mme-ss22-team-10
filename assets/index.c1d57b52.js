var C=Object.defineProperty;var S=(r,e,t)=>e in r?C(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var i=(r,e,t)=>(S(r,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerpolicy&&(o.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?o.credentials="include":n.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();class x extends HTMLElement{constructor(t,s){super();i(this,"html");i(this,"css");this.html=t!=null?t:"",this.css=s!=null?s:"",this.attachShadow({mode:"open"})}notifyAll(t,s){const n=new CustomEvent(t,{detail:s});this.dispatchEvent(n)}get root(){if(this.shadowRoot)return this.shadowRoot;throw new Error("WebComponent.root is not available yet")}select(t){return this.root.querySelector(t)}selectAll(t){return this.root.querySelectorAll(t)}async connectedCallback(){this.loadStylesheet(),this.loadHtml(),this.onCreate()}loadStylesheet(){if(this.css!==""){const t=document.createElement("style");t.innerHTML=this.css,this.root.appendChild(t)}}loadHtml(){if(this.html!==""){const t=document.createElement("template");t.innerHTML=this.html,this.root.appendChild(t.content.cloneNode(!0))}}}const T=`p{display:inline-block;color:#ff871e}.red{color:red}.containter{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh}
`,A=`<div class="red containter">
  <h1></h1>
  <div>Count: <span id="count">0</span></div>
  <button>Click here!</button>
</div>
`;class p extends x{constructor(t){super(A,T);i(this,"exampleState");i(this,"onButtonClicked",()=>{this.exampleState.value.count++});i(this,"onModelChanged",t=>{this.select("#count").innerHTML=`${this.exampleState.value.count}`});this.exampleState=t}get htmlTagName(){return"example-component"}onCreate(){this.root.querySelector("h1").innerHTML=`Hello ${this.exampleState.value.name}!`,this.select("#count").innerHTML=`${this.exampleState.value.count}`,this.select("button").addEventListener("click",this.onButtonClicked),this.exampleState.addEventListener("change",this.onModelChanged)}}const b=Object.freeze(Object.defineProperty({__proto__:null,default:p},Symbol.toStringTag,{value:"Module"})),w="modulepreload",L=function(r){return"/"+r},m={},M=function(e,t,s){return!t||t.length===0?e():Promise.all(t.map(n=>{if(n=L(n),n in m)return;m[n]=!0;const o=n.endsWith(".css"),a=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${n}"]${a}`))return;const l=document.createElement("link");if(l.rel=o?"stylesheet":w,o||(l.as="script",l.crossOrigin=""),l.href=n,document.head.appendChild(l),o)return new Promise((E,g)=>{l.addEventListener("load",E),l.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${n}`)))})})).then(()=>e())},h=class{static async loadAll(){const e=Object.assign({"../../components/ExampleComponent/ExampleComponent.ts":()=>M(()=>Promise.resolve().then(()=>b),void 0)}),t=Object.keys(e);for(const s of t){const n=await e[s](),o=n.default;if(o&&o.prototype.htmlTagName){const a=new P(o.prototype.htmlTagName,o);h.addComponentDefinition(a)}}h.defineAll()}static addComponentDefinition(e){this.componentDefinitions.push(e)}static defineAll(){this.componentDefinitions.forEach(e=>e.defineSelf())}};let d=h;i(d,"componentDefinitions",[]);class P{constructor(e,t){i(this,"name");i(this,"componentConstructor");this.name=e,this.componentConstructor=t}defineSelf(){customElements.define(this.name,this.componentConstructor)}}class H{constructor(e,t){i(this,"type");i(this,"data");this.type=e,this.data=t,Object.freeze(this)}}class N{constructor(){i(this,"listener",{})}addEventListener(e,t){this.listener[e]===void 0&&(this.listener[e]=[]),this.listener[e].push(t)}removeEventListener(e,t){if(this.listener[e]!==void 0){for(let s=0;s<this.listener[e].length;s++)if(this.listener[e][s]===t){this.listener[e].splice(s,1);return}}}notifyAll(e,t){const s=new H(e,t);if(this.listener[s.type]!==void 0)for(let n=0;n<this.listener[s.type].length;n++)this.listener[s.type][n](s)}clear(){this.listener={}}}const u=class extends N{constructor(t){super();i(this,"val");i(this,"id","");i(this,"proxyHandler",{set:(t,s,n)=>(t[s]!==n&&(t[s]=n,this.notifyAll(u.STATE_CHANGE_EVENT,n)),!0),get:(t,s)=>{if(s==="isProxy")return!0;const n=t[s];if(!(typeof n>"u"))return!n.isProxy&&typeof n=="object"?this.createProxy(n):n}});this.generateId(),this.setValue(t)}setValue(t){this.val=typeof t=="object"?this.createProxy(t):t}createProxy(t){return new Proxy(t,this.proxyHandler)}get value(){return this.val}set value(t){this.setValue(t),this.notifyAll(u.STATE_CHANGE_EVENT,this.val)}generateId(){const t=this.constructor.name;let s=u.stateCounts.get(t);s===void 0&&(s=0),u.stateCounts.set(t,s+1),this.id=t+"-"+s,Object.freeze(this.id)}};let c=u;i(c,"STATE_CHANGE_EVENT","change"),i(c,"stateCounts",new Map);class O{constructor(){i(this,"state")}toState(){return this.state||(this.state=new c(this)),this.state}}class y extends O{constructor(t,s){super();i(this,"name");i(this,"count");this.name=t,this.count=s}}class v{static async init(){}static async getExampleModel(){return new y("John",0)}}class f{static async init(){const e=await v.getExampleModel();this.addState(e.toState())}static addState(e){this.states.set(e.id,e)}static getStateById(e){return this.states.get(e)}static findState(e,t){for(const s of this.states.values())if(s.value instanceof t&&e(s.value))return s}static findStates(e,t){const s=[];for(const n of this.states.values())n.value instanceof t&&e(n.value)&&s.push(n);return s}}i(f,"states",new Map);const _=()=>{d.loadAll().then(()=>v.init()).then(()=>f.init()).then(()=>r());function r(){const e=f.findState(s=>s.name==="John",y),t=new p(e);document.querySelector("#app").append(t),e.addEventListener(c.STATE_CHANGE_EVENT,s=>{})}};_();
