import React from 'react';
import { useTheme, Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import MuiPaper from '@mui/material/Paper';


type StylesPropType = {
    theme: Theme
}


const useStyles = makeStyles({
    paper: {
        padding: (props: StylesPropType) => `${props.theme.spacing(2)}px`,
        margin: (props: StylesPropType) => `${props.theme.spacing(1)}px`,
        breakInside: "avoid",
    }
});

const Paper = (props: React.PropsWithChildren<any>) => {
    const theme = useTheme();
    const classes = useStyles({ theme });

    return (
        <MuiPaper className={classes.paper}>
            { props.children }
        </MuiPaper>
    );
};

export default Paper;
