import h from"./DocumentDrivenEmpty.f152228a.js";import L from"./ContentRenderer.044115ea.js";import x from"./DocumentDrivenNotFound.cad899ef.js";import{a9 as F,e as m,aw as C,N as k,ax as N,a as R,u as o,ay as d,az as g,aA as i,T as j,G as w,L as A,ah as B,o as c,i as D,j as p,h as l,c as _}from"./entry.e9f9588e.js";import"./ContentRendererMarkdown.fd83f5e7.js";import"./ButtonLink.1654f885.js";import"./ContentSlot.300f3820.js";/* empty css                       *//* empty css                                   */const E=m({name:"LayoutLoader",inheritAttrs:!1,props:{name:String},async setup(s,t){const n=await d[s.name]().then(e=>e.default||e);return()=>w(n,t.attrs,t.slots)}}),T=m({name:"NuxtLayout",inheritAttrs:!1,props:{name:{type:[String,Boolean,Object],default:null}},setup(s,t){const n=C("_route"),e=n===k()?N():n,a=R(()=>o(s.name)??e.meta.layout??"default");return()=>{const u=a.value&&a.value in d,r=e.meta.layoutTransition??g;return i(j,u&&r,{default:()=>i(E,u&&{key:a.value,name:a.value,...t.attrs},t.slots).default()}).default()}}}),$={class:"document-driven-page"},V=m({__name:"document-driven",setup(s){const{page:t,layout:n}=A();return t.value,B(t),(e,a)=>{const u=h,r=L,f=x,y=T;return c(),D("div",$,[p(y,{name:o(n)||"default"},{default:l(()=>[o(t)?(c(),_(r,{key:o(t)._id,value:o(t)},{empty:l(({value:v})=>[p(u,{value:v},null,8,["value"])]),_:1},8,["value"])):(c(),_(f,{key:1}))]),_:1},8,["name"])])}}});export{V as default};
