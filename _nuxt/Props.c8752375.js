import $ from"./ProseTh.f191ace6.js";import V from"./ProseTr.3d664fa6.js";import g from"./ProseThead.5f524849.js";import R from"./ProseCodeInline.3d05d738.js";import C from"./ProseTd.f2f58e2e.js";import b from"./ProseTbody.c3cc7999.js";import N from"./ProseTable.d66f4708.js";import{u as p}from"./asyncData.e46a4025.js";import{y as A,e as S,a8 as Y,a as c,o,c as l,h as e,j as r,D as d,k as s,i as j,R as E,Y as F,B as m}from"./entry.e9f9588e.js";/* empty css                    *//* empty css                    *//* empty css                       *//* empty css                            *//* empty css                    *//* empty css                       */const G=S({props:{of:{type:String,default:void 0},required:{type:Boolean,default:void 0},values:{type:Boolean,default:void 0},description:{type:Boolean,default:void 0},default:{type:Boolean,default:void 0}},async setup(t){const k=`/api/component-meta/${Y(t.of)}`,{data:h}=await p(t.of,()=>$fetch(k),"$ycviAwGRrT"),f=c(()=>h.value.props.filter(a=>{var n;return!((n=a.tags)!=null&&n.ignore.includes(a))})),w=c(()=>{var a;return t.required!==void 0?t.required:(a=f.value)==null?void 0:a.find(n=>n.required!==void 0)}),v=c(()=>{var a;return t.values!==void 0?t.values:(a=f.value)==null?void 0:a.find(n=>n.values)}),i=c(()=>{var a;return t.description!==void 0?t.description:(a=f.value)==null?void 0:a.find(n=>n.description)}),y=c(()=>{var a;return t.default!==void 0?t.default:(a=f.value)==null?void 0:a.find(n=>n.default)});return{meta:h,properties:f,showRequired:w,showValues:v,showDescription:i,showDefault:y}}});function I(t,k,h,f,w,v){var q,D,P;const i=$,y=V,a=g,n=R,_=C,T=b,B=N;return t.meta&&((q=t.meta)!=null&&q.props)&&((P=(D=t.meta)==null?void 0:D.props)!=null&&P.length)?(o(),l(B,{key:0},{default:e(()=>[r(a,null,{default:e(()=>[r(y,null,{default:e(()=>[r(i,null,{default:e(()=>[d("Prop")]),_:1}),r(i,null,{default:e(()=>[d("Type")]),_:1}),t.showRequired?(o(),l(i,{key:0},{default:e(()=>[d(" Required ")]),_:1})):s("",!0),t.showDefault?(o(),l(i,{key:1},{default:e(()=>[d(" Default ")]),_:1})):s("",!0),t.showValues?(o(),l(i,{key:2},{default:e(()=>[d(" Values ")]),_:1})):s("",!0),t.showDescription?(o(),l(i,{key:3},{default:e(()=>[d(" Description ")]),_:1})):s("",!0)]),_:1})]),_:1}),r(T,null,{default:e(()=>[(o(!0),j(E,null,F(t.properties,u=>(o(),l(y,{key:u.name},{default:e(()=>[r(_,null,{default:e(()=>[r(n,null,{default:e(()=>[d(m((u==null?void 0:u.name)||"?"),1)]),_:2},1024)]),_:2},1024),r(_,null,{default:e(()=>[r(n,null,{default:e(()=>[d(m((u==null?void 0:u.type)||"?"),1)]),_:2},1024)]),_:2},1024),t.showRequired?(o(),l(_,{key:0},{default:e(()=>[r(n,null,{default:e(()=>[d(m(u.required==="?"?"?":u.required?"Yes":"No"),1)]),_:2},1024)]),_:2},1024)):s("",!0),t.showDefault?(o(),l(_,{key:1},{default:e(()=>[u.default?(o(),l(n,{key:0},{default:e(()=>[d(m((u==null?void 0:u.default)||"?"),1)]),_:2},1024)):s("",!0)]),_:2},1024)):s("",!0),t.showValues?(o(),l(_,{key:2},{default:e(()=>[u.values?(o(),l(n,{key:0},{default:e(()=>[d(m((u==null?void 0:u.values)||"?"),1)]),_:2},1024)):(o(),l(n,{key:1},{default:e(()=>[d(" - ")]),_:1}))]),_:2},1024)):s("",!0),t.showDescription?(o(),l(_,{key:3},{default:e(()=>[r(n,null,{default:e(()=>[d(m(u.description),1)]),_:2},1024)]),_:2},1024)):s("",!0)]),_:2},1024))),128))]),_:1})]),_:1})):s("",!0)}const ne=A(G,[["render",I]]);export{ne as default};
