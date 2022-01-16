const COLORS = {
    BLACK: "#000000",
    BLUE: "#357EDD",
    DARK_BLUE: "#00449E",
    DARK_GRAY: "#555555",
    DARK_GREEN: "#137752",
    DARK_PINK: "#D5008F",
    DARK_RED: "#E7040F",
    GOLD: "#FFB700",
    GRAY: "#9A9A9A",
    GREEN: "#19A974",
    HOT_PINK: "#FF41B4",
    LIGHT_BLUE: "#96CCFF",
    LIGHTEST_BLUE: "#CDECFF",
    LIGHT_GRAY: "#D3D3D3",
    LIGHT_GREEN: "#9EEBCF",
    LIGHT_PINK: "#FFA3D7",
    LIGHT_PURPLE: "#A463F2",
    LIGHT_RED: "#FF725C",
    LIGHT_YELLOW: "#FBF1A9",
    NAVY: "#001B44",
    NEAR_WHITE: "#F4F4F4",
    ORANGE: "#FF6300",
    PINK: "#FF80CC",
    PURPLE: "#5E2CA5",
    RED: "#FF4136",
    WASHED_BLUE: "#F6FFFE",
    WASHED_GREEN: "#E8FDF5",
    WASHED_RED: "#FFDFDF",
    WASHED_YELLOW: "#FFFCEB",
    YELLOW: "#FFDE37",
};

export const hexToRGB = (hex, alpha) => {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
};

export const getColor = (color, alpha=1.0) => {
    const ucColor = color.toUpperCase();
    return ucColor in COLORS ? hexToRGB(COLORS[ucColor], alpha) : color;
};

export default COLORS;
