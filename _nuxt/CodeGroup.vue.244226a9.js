import b from"./TabsHeader.a8da7918.js";import{a as o,a3 as t}from"./entry.9864e5b4.js";const i=(n,r)=>n.type&&n.type.tag&&n.type.tag===r,f=o({data(){return{activeTabIndex:0,counter:0}},render(){var d,s;const n=((s=(d=this.$slots)==null?void 0:d.default)==null?void 0:s.call(d))||[],r=n.filter(e=>i(e,"code-block")||i(e,"code")).map((e,p)=>{var a,c,v;return{label:((a=e==null?void 0:e.props)==null?void 0:a.filename)||((c=e==null?void 0:e.props)==null?void 0:c.label)||`${p}`,active:((v=e==null?void 0:e.props)==null?void 0:v.active)||!1,component:e}});return t("div",{class:{"code-group":!0,"first-tab":this.activeTabIndex===0}},[t(b,{ref:"tabs-header",activeTabIndex:this.activeTabIndex,tabs:r,"onUpdate:activeTabIndex":e=>this.activeTabIndex=e}),t("div",{class:"code-group-content",text:this.activeTabIndex},n.map((e,p)=>{var a,c;return t("div",{style:{display:p===this.activeTabIndex?"block":"none"},class:{"":!i(e,"code")}},[i(e,"code")?e:t("div",{class:{"preview-canvas":!0}},[((c=(a=e.children)==null?void 0:a.default)==null?void 0:c.call(a))||t("div")])])}))])}});export{f as _};
