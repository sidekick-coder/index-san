import{a as v,aa as a,b as f,v as y,ab as w}from"./entry.9864e5b4.js";const q=v({props:{owner:{type:String,default:()=>{var e,t;return(t=(e=a())==null?void 0:e.github)==null?void 0:t.owner},required:!1},repo:{type:String,default:()=>{var e,t;return(t=(e=a())==null?void 0:e.github)==null?void 0:t.repo},required:!1},branch:{type:String,default:()=>{var e,t;return(t=(e=a())==null?void 0:e.github)==null?void 0:t.branch},required:!1},dir:{type:String,default:()=>{var e,t;return(t=(e=a())==null?void 0:e.github)==null?void 0:t.dir},required:!1},source:{type:String,required:!1,default:void 0},page:{type:Object,required:!1,default:void 0},contentDir:{type:String,required:!1,default:"content"},edit:{type:Boolean,required:!1,default:!0}},setup(e){if(!e.owner||!e.repo||!e.branch)throw new Error("If you want to use `GithubLink` component, you must specify: `owner`, `repo` and `branch`.");const t=f(()=>{var h,s;let{repo:r,owner:i,branch:c,contentDir:l}=e,d="";if((s=(h=a())==null?void 0:h.public)!=null&&s.content){let n;const{sources:b}=a().public.content;for(const g in b||[])if(e.page._id.startsWith(g)){n=b[g];break}(n==null?void 0:n.driver)==="github"&&(r=n.repo||e.repo||"",i=n.owner||e.owner||"",c=n.branch||e.branch||"main",l=n.dir||e.contentDir||"",d=n.prefix||"")}return{repo:r,owner:i,branch:c,contentDir:l,prefix:d}}),u=f(()=>w("https://github.com",`${t.value.owner}/${t.value.repo}`)),o=f(()=>{var i;const r=[];return(i=e==null?void 0:e.page)!=null&&i._path?(t.value.contentDir&&r.push(t.value.contentDir),r.push(e.page._file.substring(t.value.prefix.length)),r):(e.dir&&r.push(e.dir),e.source&&r.push(e.source),r)});return{url:f(()=>{var i;const r=[u.value];return e.edit?r.push("edit"):r.push("tree"),r.push(((i=t==null?void 0:t.value)==null?void 0:i.branch)||"",...o.value),r.filter(Boolean).join("/")})}},render(e){var o;const{url:t}=e,u=y();return(o=u==null?void 0:u.default)==null?void 0:o.call(u,{url:t})}});export{q as _};
