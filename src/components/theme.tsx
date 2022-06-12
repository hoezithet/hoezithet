import React from 'react';
import { createTheme, ThemeProvider, Theme, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import COLORS from '../colors';
import Matomo from './matomo';
import 'fontsource-quicksand';



declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}



export const theme = createTheme(adaptV4Theme({
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
    overrides: {
        MuiCssBaseline: {
            '@global': {
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
            "& th:first-child": {
                 borderRadius: ".5rem 0 0 0",
            },
            "& th:last-child": {
                 borderRadius: "0 .5rem 0 0",
            },
            "& > tbody > tr:last-child > td:first-child": {
                borderRadius: "0 0 0 .5rem",
            },
            "& > tbody > tr:last-child > td:last-child": {
                borderRadius: "0 0 .5rem 0",
            },
            "& > tbody > tr:nth-child(odd)": {
                backgroundColor: "#eee",
            },
            "& > tbody > tr:nth-child(even)": {
                backgroundColor: "#f1f1f1",
            },
        }
        }
        },
        MuiLink: {
            root: {
                color: COLORS.BLUE,
                "&:hover": {
                    opacity: "60%",
                },
            }
        }
    }
}));

interface HzhThemeProps {
    children: React.ReactElement;
}


export default function HzhTheme({ children }: HzhThemeProps) {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <Matomo />
                <CssBaseline />
                { children }
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
