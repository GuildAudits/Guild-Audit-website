import{a as N}from"https://app.framerstatic.com/chunk-FJ3VJUIB.mjs";import{k as V}from"https://app.framerstatic.com/chunk-ZQUNXESX.mjs";import{a as x}from"https://app.framerstatic.com/chunk-NIDOI5EE.mjs";import{c as f,e as p}from"https://app.framerstatic.com/chunk-AHQIRSXG.mjs";var d=f(g=>{"use strict";var E=N();g.useSubscription=function(e){return E.useSyncExternalStore(e.subscribe,e.getCurrentValue)}});var m=f((O,S)=>{"use strict";S.exports=d()});var a=p(x()),w=p(m());var r=new Map,l=new Set;window.addEventListener("storage",e=>{if(!(e.storageArea!==localStorage||e.key===null))try{if(e.newValue===null)r.set(e.key,null);else if(e.oldValue!==e.newValue){let t=JSON.parse(e.newValue);r.set(e.key,t)}for(let t of l)t(e.key)}catch{}});function b(e,t){if(t===null)r.set(e,null),localStorage.removeItem(e);else{r.set(e,t);let o=JSON.stringify(t);localStorage.setItem(e,o)}for(let o of l)o(e)}function I(e,t){let o=(0,a.useMemo)(()=>{function u(){if(r.has(e))return r.get(e);let n=localStorage.getItem(e);if(n)try{let s=JSON.parse(n);return r.set(e,s),s}catch{}return null}function i(n){function s(C){C===e&&n()}return l.add(s),()=>l.delete(s)}return{getCurrentValue:u,subscribe:i}},[e]),c=(0,w.useSubscription)(o)??t,h=(0,a.useCallback)(u=>{try{if(V(u)){let i=r.get(e),n=r.has(e)&&i!==null?i:c,s=u(n);b(e,s)}else b(e,u)}catch{}},[c,e]);return[c,h]}export{b as a,I as b};
/*! Bundled license information:

use-subscription/cjs/use-subscription.production.min.js:
  (**
   * @license React
   * use-subscription.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=https://app.framerstatic.com/chunk-IBD76ZDY.mjs.map
