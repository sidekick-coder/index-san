import{ah as R,aq as _,ac as N,aA as T,aB as x,aC as f,aa as C,aD as O,aE as U,aF as b,aG as k,b as A,aH as L}from"./entry.9864e5b4.js";import{r as y}from"./asyncData.6d9208f7.js";import J from"./ContentPreviewMode.6583c1c6.js";/* empty css                               */const F=(d,v,g)=>{const m=[...v||[]],r=[...g||[]],p=[...d||[]];for(const a of m)if(a.oldPath)if(r.splice(r.findIndex(i=>i.path===a.oldPath),1),m.find(i=>i.path===a.oldPath))p.push({path:a.path,parsed:a.parsed});else{const i=p.find(l=>l.path===a.oldPath);i&&(i.path=a.path,a.parsed?i.parsed=a.parsed:a.pathMeta&&["_file","_path","_id","_locale"].forEach(l=>{i.parsed[l]=a.pathMeta[l]}))}else if(a.new)p.push({path:a.path,parsed:a.parsed});else{const u=p.find(i=>i.path===a.path);u&&Object.assign(u,{path:a.path,parsed:a.parsed})}for(const a of r)p.splice(p.findIndex(u=>u.path===a.path),1);return p},D=x(()=>JSON.parse(JSON.stringify(C()))),M=()=>{const d=R(),v=_().public.studio||{},g=D();let m;const r=N("client-db",()=>null),p=async(e,t,s=!0)=>{const n=f("previewToken",{sameSite:"none",secure:!0}),c=await e.getKeys(`${n.value}:`);await Promise.all(c.map(o=>e.removeItem(o))),await e.setItem(`${n.value}$`,JSON.stringify({ignoreBuiltContents:s})),await Promise.all(t.map(o=>{var h;return e.setItem(`${n.value}:${(h=o.parsed)==null?void 0:h._id}`,JSON.stringify(o.parsed))}))},a=e=>{const t=T(d,C);O(t,e||g),U(t,e||g)},u=e=>{var s,n,c,o;const t=(o=(c=(n=(s=d==null?void 0:d.vueApp)==null?void 0:s._context)==null?void 0:n.config)==null?void 0:c.globalProperties)==null?void 0:o.$pinceauTheme;!t||!(t!=null&&t.updateTheme)||(m||(m=JSON.parse(JSON.stringify((t==null?void 0:t.theme.value)||{}))),T(d,t.updateTheme,[e||m]))},i=async e=>{const t=f("previewToken",{sameSite:"none",secure:!0}),s=await $fetch("api/projects/preview",{baseURL:v.apiURL,params:{token:t.value}}),n=F(s.files,s.additions,s.deletions),c=n.filter(w=>!w.path.startsWith(b));await p(e,c,(s.files||[]).length!==0);const o=n.find(w=>w.path===k.appConfig);a(o==null?void 0:o.parsed);const h=n.find(w=>w.path===k.tokensConfig);u(h==null?void 0:h.parsed)},l=async()=>{const e=f("previewToken",{sameSite:"none",secure:!0});await $fetch("api/projects/preview/sync",{baseURL:v.apiURL,method:"POST",params:{token:e.value}})},P=e=>{const t=f("previewToken",{sameSite:"none",secure:!0}),s=A(()=>!!e.value),n=document.createElement("div");n.id="__nuxt_preview_wrapper",document.body.appendChild(n),L(J,{previewToken:t,apiURL:v.apiURL,storageReady:s,refresh:()=>i(e.value).then(()=>y()),init:l}).mount(n)},S=async e=>{var n,c;const t=f("previewToken",{sameSite:"none",secure:!0});if(!e)return null;e=e.replace(/\/$/,"");let s=await((n=r.value)==null?void 0:n.getItem(`${t.value}:${e}`));return s||(s=await((c=r.value)==null?void 0:c.getItem(e))),s},$=e=>{var s;const t=f("previewToken",{sameSite:"none",secure:!0});!r.value||r.value.setItem(`${t.value}:${(s=e.parsed)==null?void 0:s._id}`,JSON.stringify(e.parsed))},I=async e=>{var s;const t=f("previewToken",{sameSite:"none",secure:!0});await((s=r.value)==null?void 0:s.removeItem(`${t.value}:${e}`))};return{apiURL:v.apiURL,contentStorage:r,syncPreview:i,syncPreviewFiles:p,syncPreviewAppConfig:a,syncPreviewTokensConfig:u,requestPreviewSynchronization:l,mountPreviewUI:P,findContentWithId:S,updateContent:$,removeContentWithId:I,requestRerender:()=>{T(d,y)}}};export{M as useStudio};
