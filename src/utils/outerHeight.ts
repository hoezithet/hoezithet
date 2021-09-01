export default function getOuterHeight(node: HTMLElement): number|null {
    if (typeof window !== "undefined" && node instanceof Element) {
        const style = getComputedStyle(node);
        return node.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
    } else {
        return null;
    }
}