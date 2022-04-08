import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import COLORS from '../colors';
import Matomo from './matomo';
import 'fontsource-quicksand';


export const theme = createMuiTheme({
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
		    "& thead": {
			backgroundColor: COLORS.LIGHT_GRAY,
			border: "solid 1px black",
			borderCollapse: "separate",
		    },
		    "& th": {
			padding: "16px",
		    },
		    "& td": {
			padding: "16px",
		    },
		    "& > tbody > tr:nth-child(odd)": {
			backgroundColor: "#eee",
		    },
		    "& > tbody > tr:nth-child(even)": {
			backgroundColor: "#f1f1f1",
		    }
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
});

interface HzhThemeProps {
    children: React.ReactElement;
}


export default function HzhTheme({ children }: HzhThemeProps) {
    return (
        <ThemeProvider theme={theme}>
            <Matomo />
            <CssBaseline />
            { children }
        </ThemeProvider>
    );
}
