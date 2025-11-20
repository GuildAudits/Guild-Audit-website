import { useEffect } from "react"
import type { ComponentType } from "react"

export function withFrameShine(Component: ComponentType): ComponentType {
    return (props) => {
        useEffect(() => {
            const style = document.createElement("style")
            style.innerHTML = `
              @keyframes maskShine {
                0% { -webkit-mask-position: 200%; }
                100% { -webkit-mask-position: -100%; }
              }
              .maskShine {
                -webkit-mask-image: linear-gradient(to right, transparent 30%, #EEE 50%, transparent 70%);
                -webkit-mask-size: 150% auto;
                animation: maskShine 5s ease-in-out infinite;
              }
            `
            document.head.appendChild(style)
        }, [])

        const { className, ...rest } = props
        const combinedClassName = [className, "maskShine"]
            .filter(Boolean)
            .join(" ")

        return <Component {...rest} className={combinedClassName} />
    }
}
