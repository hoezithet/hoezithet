import React from 'react';
import { createTheme, Theme } from '@mui/material/styles';
import COLORS from 'colors';
import 'fontsource-quicksand';



declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}



const theme = createTheme({
    typography: {
        fontFamily: [
            'Quicksand',
            'sans-serif',
        ].join(','),
    },
    palette: {
        primary: {
            main: COLORS.GOLD,
        },
        secondary: {
            main: COLORS.DARK_BLUE,
        },
        error: {
            main: COLORS.DARK_RED,
        },
        warning: {
            main: COLORS.ORANGE,
        },
        info: {
            main: COLORS.LIGHT_BLUE,
        },
        success: {
            main: COLORS.GREEN,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: COLORS.NEAR_WHITE,
                    fontSize: "1rem",
                    lineHeight: 1.5,
                },
                "a.anchor": {
                    display: "none",
                    margin: "0 0 0 8px",
                },
                "h2:hover > .anchor": {
                    display: "inline"
                },
                ".gatsby-resp-image-wrapper": {
                    breakInside: "avoid"
                },
                "table": {
                    textAlign: "center",
                    margin: "auto",
                    breakInside: "avoid",
                    borderCollapse: "separate",
                    "& thead": {
                        backgroundColor: COLORS.LIGHT_GRAY,
                    },
                    "& td, th": {
                        padding: "16px",
                    },
                    "& th:first-of-type": {
                        borderRadius: ".5rem 0 0 0",
                    },
                    "& th:last-child": {
                        borderRadius: "0 .5rem 0 0",
                    },
                    "& > tbody > tr:last-child > td:first-of-type": {
                        borderRadius: "0 0 0 .5rem",
                    },
                    "& > tbody > tr:last-child > td:last-child": {
                        borderRadius: "0 0 .5rem 0",
                    },
                    "& > tbody > tr:nth-of-type(odd)": {
                        backgroundColor: "#eee",
                    },
                    "& > tbody > tr:nth-of-type(even)": {
                        backgroundColor: "#f1f1f1",
                    },
                }
            }
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: COLORS.BLUE,
                    textDecorationColor: COLORS.BLUE,
                    "&:hover": {
                        opacity: "60%",
                    },
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    color: "inherit",
                }
            }
        },
    },
});

export default theme;
