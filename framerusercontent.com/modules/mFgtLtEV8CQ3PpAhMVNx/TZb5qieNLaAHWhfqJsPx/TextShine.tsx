import { useEffect } from "react"
import type { Override } from "framer"
export const TextShine: Override = (props) => {
    useEffect(() => {
        const style = document.createElement("style")
        style.innerHTML = `
@keyframes shine {
0% { -webkit-mask-position: 200%; }
100% { -webkit-mask-position: -100%; }
}
        .shine {
            -webkit-mask-image: linear-gradient(to right, transparent 30%, #EEE 50%, transparent 70%);
            -webkit-mask-size: 150% auto;
            animation: shine 5s ease-in-out infinite;
        }
    `
        document.head.appendChild(style)
    }, [])

    return {
        ...props,
        style: {
            ...props.style, // existing styles
        },
        children: <span className="shine">{props.children}</span>,
    }
}
