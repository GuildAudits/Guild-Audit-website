import{jsx as _jsx}from"react/jsx-runtime";import{useEffect}from"react";export const TextShine=props=>{useEffect(()=>{const style=document.createElement("style");style.innerHTML=`
@keyframes shine {
0% { -webkit-mask-position: 200%; }
100% { -webkit-mask-position: -100%; }
}
        .shine {
            -webkit-mask-image: linear-gradient(to right, transparent 30%, #EEE 50%, transparent 70%);
            -webkit-mask-size: 150% auto;
            animation: shine 5s ease-in-out infinite;
        }
    `;document.head.appendChild(style);},[]);return{...props,style:{...props.style},children:/*#__PURE__*/_jsx("span",{className:"shine",children:props.children})};};import{useContext as __legacyOverrideHOC_useContext}from"react";import{DataObserverContext as __legacyOverrideHOC_DataObserverContext}from"framer";export function withTextShine(C){return props=>{__legacyOverrideHOC_useContext(__legacyOverrideHOC_DataObserverContext);return _jsx(C,{...props,...TextShine(props)});};}withTextShine.displayName="TextShine";
export const __FramerMetadata__ = {"exports":{"TextShine":{"type":"override","name":"TextShine","annotations":{"framerContractVersion":"1"}},"withTextShine":{"type":"reactHoc","name":"withTextShine","annotations":{"framerContractVersion":"1"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./TextShine.map