import {
    jsx as _jsx
} from "react/jsx-runtime";
import {
    addPropertyControls,
    ControlType
} from "framer";
const DEFAULT_COLOR = "#1570EF";
const DEFAULT_SVG = `<svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="m13.076 12.21 3.098 3.098a1.25 1.25 0 0 0 1.768 0l3.424-3.424a1.25 1.25 0 0 0 0-1.768l-3.424-3.424a1.25 1.25 0 0 0-1.768 0L13.076 9.79l4.902.903c.341.063.341.552 0 .614l-4.902.903Zm-3.206.786-3.178 3.178a1.25 1.25 0 0 0 0 1.768l3.424 3.424a1.25 1.25 0 0 0 1.768 0l3.424-3.424a1.25 1.25 0 0 0 0-1.768l-3.043-3.043-.878 4.768c-.063.34-.552.34-.615 0l-.902-4.903ZM6.692 4.058a1.25 1.25 0 0 0 0 1.768l3.177 3.178.903-4.903c.063-.34.552-.34.615 0l.878 4.768 3.043-3.043a1.25 1.25 0 0 0 0-1.768L11.884.634a1.25 1.25 0 0 0-1.768 0L6.692 4.058ZM.634 10.116a1.25 1.25 0 0 0 0 1.768l3.424 3.424a1.25 1.25 0 0 0 1.768 0l3.123-3.122-4.768-.879c-.341-.063-.341-.552 0-.614l4.768-.879-3.123-3.122a1.25 1.25 0 0 0-1.768 0L.634 10.116Z" fill="#1570EF"/></svg>`;
const DEFAULT_STROKE_WIDTH = 1.5;
/*
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 *
 * @framerIntrinsicHeight 24
 * @framerIntrinsicWidth 24
 */
export default function FramerIcons(props) {
    const customizedSvg = getCustomizedSVG(props.svg, props.color, props.strokeWidth);
    return /*#__PURE__*/ _jsx("div", {
        "aria-hidden": "true",
        style: {
            display: "flex",
            maxWidth: "100%",
            maxHeight: "100%",
            alignItems: "center",
            justifyContent: "center",
            ...props.style
        },
        dangerouslySetInnerHTML: {
            __html: customizedSvg
        }
    });
}
addPropertyControls(FramerIcons, {
    svg: {
        title: "SVG",
        type: ControlType.String,
        defaultValue: DEFAULT_SVG
    },
    strokeWidth: {
        type: ControlType.Number,
        step: .25,
        min: .5,
        max: 2,
        defaultValue: DEFAULT_STROKE_WIDTH,
        hidden: props => hideStrokeWidth(props.svg)
    },
    color: {
        type: ControlType.Color,
        defaultValue: DEFAULT_COLOR,
        description: "By [FramerIcons](https://www.framericons.com?utm=FramerIconComponent)"
    }
}); // hide if no stroke-width or all stroke-widths are 0
function hideStrokeWidth(svg) {
    const strokeWidthMatch = svg.match(/stroke-width="([^"]+)"/g);
    return !strokeWidthMatch || strokeWidthMatch.every(match => match === "0");
}

function getCustomizedSVG(svg, color = DEFAULT_COLOR, strokeWidth = DEFAULT_STROKE_WIDTH) {
    let svgAttributes = svg.match(/<svg[^>]*>/) ? .[0];
    if (!svgAttributes) {
        svg = DEFAULT_SVG;
        svgAttributes = svg.match(/<svg[^>]*>/) ? .[0];
    }
    const width = svgAttributes.match(/width="([^"]*)"/) ? .[1];
    const height = svgAttributes.match(/height="([^"]*)"/) ? .[1];
    const viewBox = svgAttributes.match(/viewBox="([^"]*)"/) ? .[1] ? .split(" ");
    const viewBoxWidth = viewBox ? .[2];
    const viewBoxHeight = viewBox ? .[3];
    if (width && height) {
        svg = svg.replace(/width="([^"]*)"/, `width="100%"`);
        svg = svg.replace(/height="([^"]*)"/, `height="100%"`);
    } else {
        svg = svg.replace(/<svg/, `<svg width="100%" height="100%"`);
    }
    let hasElementsWithValidColors = false;
    if (svg.includes('fill="') || svg.includes('stroke="')) {
        svg = svg.replace(/(fill|stroke)="([^"]+)"/g, (match, attr, value) => {
            if (value === "none" || value === "transparent") {
                return match;
            } // For iconsax -> Crypto -> Bulk
            if (value === "white") {
                return "";
            }
            hasElementsWithValidColors = true;
            return `${attr}="${color}"`;
        });
    }
    if (!hasElementsWithValidColors) {
        svg = svg.replace(/<(path|circle|rect|line|polygon|polyline) /g, match => `<${match.slice(1)} fill="${color}" `);
    }
    svg = svg.replace(/stroke-width="([^"]+)"/g, (match, value) => {
        if (value === "0") {
            return match;
        }
        return `stroke-width="${strokeWidth}"`;
    });
    return svg;
}
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "FramerIcons",
            "slots": [],
            "annotations": {
                "framerSupportedLayoutHeight": "fixed",
                "framerIntrinsicWidth": "24",
                "framerDisableUnlink": "*",
                "framerIntrinsicHeight": "24",
                "framerSupportedLayoutWidth": "fixed",
                "framerContractVersion": "1"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./FramerIcon.map