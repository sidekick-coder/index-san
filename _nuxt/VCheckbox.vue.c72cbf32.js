import d from"./VIcon.d3ba8c2e.js";import{a as p,o as t,f as c,z as f,A as _,u as a,j as y,B as k,c as u,k as b,l as V,C as h,i as x}from"./entry.9864e5b4.js";import{u as B}from"./use-variant.f8589428.js";import{u as C}from"./v-model.33915231.js";const g={class:"flex items-center cursor-pointer w-full"},S={key:2,class:"text-t-secondary block font-bold ml-2"},v={inheritAttrs:!0},D=p({...v,__name:"VCheckbox",props:{modelValue:{type:[String,Number,Boolean],default:null},label:{type:String,default:null},color:{type:String,default:"accent"}},emits:["update:modelValue"],setup(s,{emit:i}){const l=s,e=C(l,"modelValue",i),o=B(l,"color",{accent:"text-accent",_shared:"cursor-pointer"});return(z,n)=>{const r=d;return t(),c("label",g,[f(y("input",{"onUpdate:modelValue":n[0]||(n[0]=m=>k(e)?e.value=m:null),type:"checkbox",class:"hidden"},null,512),[[_,a(e)]]),a(e)?(t(),u(r,{key:0,class:b(a(o).classes),style:V(a(o).styles),name:"square-check"},null,8,["class","style"])):(t(),u(r,{key:1,name:"fa-regular fa-square",class:"text-t-secondary"})),s.label?(t(),c("span",S,h(s.label),1)):x("",!0)])}}});export{D as _};
