var ie=Object.defineProperty;var ae=(e,t,o)=>t in e?ie(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o;var A=(e,t,o)=>ae(e,typeof t!="symbol"?t+"":t,o);var _="__framer_force_showing_editorbar_since",h="2147483647";var M=300;var b=12,B="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAApNJREFUSA2tlUtLlFEYgEe7mtFFQ8NLFBG1SJAwahtiLVy5ceVSEPQH1LZf0Lp9FO1bdYNyI7gyBFcS2kAzilYq3sfxeYZ55Zv6FGfohWfOd97vnPd23u9MXeZoaeb1Q7gPHXAFzsAS5GACxiEPqVKXqs1kmtAPQi+cAtedToz1PJ8ExxPwDl7CAlRImoN7rBiF86ABHTiGAzMIh8n3O+ifwWc4EL0n5TGTYQijvjNSxbUadozInUeGZ3nuh1WYgpIkM+hGMwYajAgdrfUn+AaLoLTCAxiAOxCZxL4RdB+gZMjxEjwHo4hS8Jh5DR9hz0mKaNizegoNEI7Wee6FXJTISG6AUgDr+QImoAiHie+mwZJow/PRps4uwnsnRj8Epqc4voVJJ8eULOtW4BFYYjPpgjc+3IWI2sh/wFeoVl6xYQ48dDGLfjOwc/ygQqz595hUMVouS9QHBm4l6k3HWpnBLqicgVrlCxujSbR1Swd+UDpQYRS/oVaZZ2MWwlZBB9Zdxf+QTYw8SRgq6sAvz7vH6JULEB9USVHFjzZskgPRQR4ayxoXXIdaHdg9HrB2rErByWxZERnYtrWUzD0esDbtTmXPhzXwHrKLxEUbYGbVyDkWWwkdadfqbPmwDXZSCyh2VAf8BM/nOOJH5Y0QopMt2I5U/KO4DZZJB47XwEX+ex0mGroMV8sLwp56gyuGwiyW4SZ4c8bt2cZzO7jBNeqtsRHbeZ1g9krsMbhfYPv/c5gecA+4yAVuitFszE5Hjva872OMdXagF19JIoOYWyozMTI3J0tmA6gLvXPfO1cc/XOqOLe/HbjwD8yCXRD3VNJROEgatiRZMJsKsbZHia3nAdphtq8fkiWyXJbBe8uM1aXKPouNnz2Bm1kwAAAAAElFTkSuQmCC",S="__framer-editorbar-container",E="__framer-editorbar-label",x="__framer-editorbar-button",v="__framer-editorbar-loading-spinner",T="__framer-editorbar-button-tooltip-visible",se=`
#${S} {
    align-items: center;
    bottom: 50%;
    display: flex;
    gap: 8px;
    position: fixed;
    right: 10px;
    transform: translateY(50%);
    z-index: calc(${h});
}

#${E} {
    background-color: #111;
    border-radius: 8px;
    font-family: "Inter", "Inter-Regular", system-ui, Arial, sans-serif;
    font-size: 12px;
    height: fit-content;
    opacity: 0;
    padding: 4px 8px;
    transition: opacity 0.4s ease-out;
    font-weight: 500;
}

#${x} {
    all: unset;
    align-items: center;
    border-radius: 15px;
    cursor: pointer;
    display: flex;
    height: 30px;
    justify-content: center;
    width: 30px;
}

#${E}.${T} {
    opacity: 1;
}

#${E}, #${x} {
    backdrop-filter: blur(10px);
    background-color: rgba(34, 34, 34, 0.8);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(0, 0, 0, 0.05) 0px 1px 0px 0px, rgba(255, 255, 255, 0.15) 0px 0px 0px 1px;
    color: #fff;
}

#${v} {
    width: ${b}px;
    height: ${b}px;
    -webkit-mask: url(${B});
    mask: url(${B});
    -webkit-mask-size: ${b}px;
    mask-size: ${b}px;
    background-color: #fff;


    animation-duration: 800ms;
    animation-iteration-count: infinite;
    animation-name: __framer-loading-spin;
    animation-timing-function: linear;
}

@keyframes __framer-loading-spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
`,U=document.createElement("style");U.innerHTML=se;document.head.appendChild(U);var N;(a=>(a.isTouch="ontouchstart"in window||navigator.maxTouchPoints>0,a.isChrome=navigator.userAgent.toLowerCase().includes("chrome/"),a.isWebKit=navigator.userAgent.toLowerCase().includes("applewebkit/"),a.isSafari=a.isWebKit&&!a.isChrome,a.isSafariDesktop=a.isSafari&&!a.isTouch,a.isWindows=/Win/u.test(navigator.platform),a.isMacOS=/Mac/u.test(navigator.platform),a.isAndroidWebView=a.isChrome&&navigator.userAgent.toLowerCase().includes("; wv)"),a.isIosWebView=a.isWebKit&&!navigator.userAgent.toLowerCase().includes("safari/"),a.isWebView=a.isAndroidWebView||a.isIosWebView))(N||={});var w=class extends Promise{constructor(){let o,r;super((n,i)=>{o=n,r=i});A(this,"_state","initial");A(this,"resolve");A(this,"reject");this.resolve=n=>{this._state="fulfilled",o(n)},this.reject=n=>{this._state="rejected",r(n)}}get state(){return this._state}pending(){return this._state="pending",this}isResolved(){return this._state==="fulfilled"||this._state==="rejected"}};w.prototype.constructor=Promise;var W="framer_",p="editSite";function I(e){let t=window.__framer_editorBarDependencies;if(!t)throw new Error("Dependencies not found");if(t.__version<1||t.__version>2)throw new Error("Unsupported version");let o=t[e];if(!o)throw new Error("Dependency not found");return o}var{createElement:k,memo:V,useCallback:j,useEffect:m,useRef:P,useState:u}=I("react");var{createPortal:z}=I("react-dom");var Y="autoplay";function l(e,t,o){let{children:r,...n}=t??{};return o!==void 0&&(n.key=o),k(e,n,r)}function O(e,t,o){let{children:r,...n}=t??{};return o!==void 0&&(n.key=o),k(e,n,...r)}function H({isLoading:e,isEditorVisible:t,onClick:o}){let[r,n]=u(!1),[i,s]=u(t);return i!==t&&(s(t),t||n(!1)),O("div",{id:S,dir:"ltr",children:[l("span",{"aria-label":"Edit Framer Content",id:E,className:r?T:void 0,children:"Edit Content"}),l("button",{type:"button","aria-labelledby":E,id:x,onClick:o,onMouseMove:()=>{n(!0)},onMouseLeave:()=>{n(!1)},children:e?l(ue,{}):l(ce,{})})]})}function ce(){return O("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",fill:"none",children:[l("path",{d:"M8.75 2.25a1.77 1.77 0 0 1 2.5 0h0c.69.69.69 1.81 0 2.5l-7 7h-2.5v-2.5Z",fill:"transparent",strokeWidth:"1.5",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round"}),l("path",{d:"M8 11.75h3.75",fill:"transparent",strokeWidth:"1.5",stroke:"currentColor",strokeLinecap:"round"})]})}function ue(){return l("div",{id:v})}var y="data-original-href",X="link[rel*='icon']",le=`${X}:not([${y}])`,de="https://framerusercontent.com/sites/icons/writing-hand-favicon.png";function Z(){document.querySelectorAll(le).forEach(e=>{e instanceof HTMLLinkElement&&(e.setAttribute(y,e.href),e.setAttribute("href",de))})}function G(){document.querySelectorAll(X).forEach(e=>{e instanceof HTMLLinkElement&&e.getAttribute(y)&&(e.setAttribute("href",e.getAttribute(y)??""),e.removeAttribute(y))})}function C(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function $(e,t){let[o,r]=u(!1);return m(()=>{let n=i=>{if(i.origin!==e||!C(i.data))return;let{apiVersion:s,type:c,component:d}=i.data;s===1&&c==="initializeComponent"&&d===t&&r(!0)};return window.addEventListener("message",n),()=>{window.removeEventListener("message",n)}},[e,t]),o}var D="default";var{useCurrentRoute:J,useLocaleInfo:q,useRouter:K}=I("framer");function Q(){let e=J(),t=q()?.activeLocale??void 0,{collectionUtils:o}=K(),[r,n]=u(),i=e?.id,s=e?.collectionId,c=e?.pathVariables;return m(()=>{if(!i)return;let d=!1;return fe(t,s,o,c).then(f=>{d||n({collectionItemNodeId:f,webPageNodeId:i,activeLocaleId:t?.id??D})}).catch(()=>{d||n({collectionItemNodeId:void 0,webPageNodeId:i,activeLocaleId:t?.id??D})}),()=>{d=!0}},[t,s,o,c,i]),r}async function fe(e,t,o,r){if(!t)return;let n=Object.values(r??{}),[i]=n;if(n.length!==1||!i||typeof i!="string")return;let s=o?.[t];return(await s?.())?.getRecordIdBySlug(i,e)}function ee(e,t){let o=Q(),r=$(t,"OnPageActiveRouteStore");m(()=>{r&&e.current?.contentWindow?.postMessage({apiVersion:1,type:"updateNodeIds",nodeIds:o},t)},[e,o,t,r])}var pe=Date.now();function me(){return window.self!==window.top}var ge=`
#__framer-editorbar {
    /* https://sergeyski.com/css-color-scheme-and-iframes-lessons-learned-from-disqus-background-bug */
    color-scheme: light dark;
    overflow: hidden;
    position: fixed;
    border: none;
    z-index: calc(${h});
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    touch-action: manipulation;
}

@supports (height: 100dvh) {
    #__framer-editorbar {
        height: 100dvh;
    }
}

#__framer-editorbar.status_hidden {
    display: none;
}

#__framer-editorbar.status_visually_hidden {
    clip-path: circle(1px at calc(100% - 20px) calc(50% + 4px));
    z-index: calc(${h} - 1);
}

#__framer-editorbar.status_measuring {
    clip-path: unset;
}
`,oe=document.createElement("style");oe.innerHTML=ge;document.head.appendChild(oe);var R=new URL(import.meta.url).origin;function he(){if(localStorage[_])return te(),!0;let e=new URL(window.location.href),t=e.searchParams.has(p),o=e.searchParams.has(p.toLowerCase());if(!t&&!o)return!1;let r=t?p:p.toLowerCase(),n=e.searchParams.get(r);if(n!==""&&n!==null)return!1;for(let i of e.searchParams.keys())if(i!==p&&i!==p.toLowerCase()&&!i.startsWith(W))return!1;return te(),localStorage[_]=new Date().toString(),!0}function te(){let e=new URL(window.location.href);e.searchParams.has(p)&&(e.searchParams.delete(p),e.searchParams.delete(p.toLowerCase()),window.history.replaceState({},"",e.toString()))}var L=(()=>{try{return he()}catch(e){return console.error(e),!1}})();function ne(){return null}function Ee(){let e=document.getElementsByClassName("lenis-scrolling");for(let t of e)t.classList.remove("lenis-scrolling")}function Ie(e){let[t,o]=u(e),r=j(()=>{"requestIdleCallback"in window?requestIdleCallback(()=>{o(!0)}):setTimeout(()=>{o(!0)},300)},[]);return m(()=>{if(!t)if(document.readyState==="complete")r();else{let n=()=>{document.readyState==="complete"&&r()};return document.addEventListener("readystatechange",n,{once:!0}),()=>{document.removeEventListener("readystatechange",n)}}},[t,r]),t}function _e(e,t){let[o,r]=u(t),[n,i]=u(!0),[s,c]=u(!1),[d,f]=u("hidden"),a=P();return a.current??=new w,m(()=>{function F(g){if(g.origin===R&&typeof g.data=="object"&&g.data?.apiVersion===1)if(g.data.type==="accessResult"&&g.data.data.status==="success"){r(!0);try{localStorage[_]=new Date().toString()}catch(re){console.error(re)}}else g.data.type==="exitFullscreen"?(document.body.style.overflow="auto",window.scrollTo({behavior:"instant",top:g.data.position?.top??0}),f("hidden")):g.data.type==="sandboxReadyState"&&g.data.data.status==="ready"&&(i(!1),setTimeout(()=>{a.current?.resolve()},50))}return window.addEventListener("message",F),()=>{window.removeEventListener("message",F)}},[]),{showEntrypointButton:o,entrypointButtonLoading:s?n:!1,iframeState:d,onEditContent:()=>{e.current?.contentWindow?.postMessage({apiVersion:1,type:"enterOnPageEditing"},R),f("fullscreen"),c(!0),a.current?.then(()=>{e.current?.contentWindow?.postMessage({apiVersion:1,type:"showCanvas",position:{top:window.scrollY}},R),setTimeout(()=>{document.body.style.overflow="hidden"},M),c(!1)}),Ee()}}}function we({framerSiteId:e,features:t,iframeRef:o,className:r}){ee(o,R);let n=new URL(import.meta.url),i=n.pathname.lastIndexOf("/");if(i<0)throw new Error("Invalid pathname");let s=t?.editorBarDisableFrameAncestorsSecurity?"fake-domain.example":window.location.hostname;return n.pathname=n.pathname.slice(0,i),n.searchParams.set("framerSiteId",e),n.searchParams.set("source",s),n.searchParams.set("features",JSON.stringify(t||{})),n.searchParams.set("loadStart",pe.toString()),L&&n.searchParams.set("forceShow","true"),l("iframe",{id:"__framer-editorbar",ref:o,src:n.href,"aria-hidden":"true",allow:Y,tabIndex:-1,className:r})}function ye({framerSiteId:e,features:t}){let o=P(null),r=Ie(L),n=L||r,{showEntrypointButton:i,entrypointButtonLoading:s,iframeState:c,onEditContent:d}=_e(o,L);if(m(()=>{if(c!=="fullscreen")return;let a=document.title;return document.title="Editing Page\u2026",Z(),()=>{document.title=a,G()}},[c]),!n)return null;let f;return c==="fullscreen"?f="fullscreen":i?f="status_visually_hidden":f="status_hidden",z([i?l(H,{isLoading:s,onClick:d,isEditorVisible:c==="fullscreen"},"button"):null,l(we,{framerSiteId:e,features:t,iframeRef:o,className:f},"iframe")],document.body)}function It(){return me()?(console.log("[Framer On-Page Editing] Unavailable because site is embedded in iframe"),ne):N.isWebView?(console.log("[Framer On-Page Editing] Unavailable because running in WebView"),ne):V(ye)}export{It as createEditorBar};
//# sourceMappingURL=https://app.framerstatic.com/editorbar-initializer.5DI4RKW5.mjs.map
