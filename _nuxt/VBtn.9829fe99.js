import{r as m,a as l,b as g,e as v,w as x,f as w,o as p,c as C,h as B,i as S,j as V,k as j,l as k,m as y,p as z,u as h,q as O,s as $}from"./entry.e9f9588e.js";function b(s,t,i={}){const o=m(i);function d(e){o.value=e}function a(e){const r=o.value[e],n={classes:"",styles:""};return r?(typeof r=="string"&&(n.classes=r),typeof r=="function"&&Object.assign(n,r(s[t])),n):null}const u=l(()=>{const e=[],r=a(s[t]),n=a("_shared"),c=a("_empty");return n&&e.push(n.classes),r&&e.push(r.classes),!r&&c&&e.push(c.classes),e.join(" ")}),f=l(()=>{const e=[],r=a(s[t]),n=a("_shared"),c=a("_empty");return n&&e.push(n.styles),r&&e.push(r.styles),!r&&c&&e.push(c.styles),e.join(" ")});return g({classes:u,styles:f,setOptions:d})}class N{isColor(t){return["#","rgb","rgba","hsl"].some(o=>t&&t.startsWith(o))}isUnit(t){return/(px|em|rem|deg|%)/.test(t)}toMeasurement(t){return typeof t=="number"?`${t}px`:this.isUnit(t)?t:/[0-9]/.test(t)?`${t}px`:t}}const U=new N;function _(){return U}const q={key:0,class:"absolute flex items-center justify-center"},E=v({__name:"VBtn",props:{mode:{type:String,default:"default"},size:{type:String,default:"md"},type:{type:String,default:"button"},color:{type:String,default:"accent"},text:{type:Boolean,default:!1},rounded:{type:Boolean,default:!1},tile:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},to:{type:String,default:null},href:{type:String,default:null},loading:{type:Boolean,default:!1}},setup(s){const t=s,i=_(),o=b(t,"color");function d(){if(t.mode==="text")return o.setOptions({accent:"hover:border-accent/5 hover:bg-accent/5 hover:text-accent",danger:"hover:border-danger/5 hover:bg-danger/5 hover:text-danger",warn:"hover:border-warn/5 hover:bg-warn/5 hover:text-warn",info:"hover:border-info/5 hover:bg-info/5 hover:text-info","b-primary":"hover:border-b-primary/5 hover:bg-b-primary/5 hover:text-t-primary",_shared:"border border-transparent",_empty:e=>i.isColor(e)?{styles:`--color:${e}`,classes:["hover:border-[var(--color)]","hover:bg-[var(--color)]","hover:text-[var(--color)]"].join(" ")}:{classes:e}});o.setOptions({accent:"bg-accent hover:bg-accent/75",danger:"bg-danger hover:bg-danger/75",info:"bg-info hover:bg-info/75",warn:"bg-warn hover:bg-warn/75","b-primary":"bg-b-primary hover:bg-b-primary/75","b-secondary":"bg-b-secondary hover:bg-b-secondary/75",_shared:"text-t-primary",_empty:e=>i.isColor(e)?{styles:`--color:${e}`,classes:"bg-[var(--color)]"}:{classes:e}})}x(()=>t.mode,d,{immediate:!0});const a=b(t,"size",{none:"",xs:"px-2 py-1 text-xs",sm:"px-3 py-1 text-xs",md:"px-4 py-2 text-sm"}),u=l(()=>{const e=["transition-all flex items-center justify-center overflow-hidden cursor-pointer","outline-none focus:outline-none"];return t.disabled&&e.push("opacity-60 pointer-events-none"),t.tile||e.push(t.rounded?"rounded-full":"rounded"),e.concat(o.classes).concat(a.classes)}),f=l(()=>o.styles);return(e,r)=>{const n=w("v-icon");return p(),C($(s.to?"router-link":s.href?"a":"button"),{to:s.to,href:s.href,target:s.href?"_blank":void 0,class:y(h(u)),style:O(h(f)),disabled:s.disabled,type:s.type},{default:B(()=>[s.loading?(p(),S("div",q,[V(n,{name:"spinner",class:"animate-spin"})])):j("",!0),k("div",{class:y([s.loading?"opacity-0":""])},[z(e.$slots,"default")],2)]),_:3},8,["to","href","target","class","style","disabled","type"])}}});export{E as default};
